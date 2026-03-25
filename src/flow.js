// FLOW-AI Timer JavaScript extracted from flow.html
class FlowTimer {
    constructor() {
        this.audioContext = null;
        this.currentSource = null;
        this.startTime = null;
        this.pausedTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.isSkipped = false; // Flag to track manual skips

        // Session configuration
        this.sessionType = '45_15'; // '45_15' or '50_10'
        this.workDuration = 45 * 60 + 36; // Will be updated based on current track
        this.breakDuration = 15 * 60; // Will be updated based on session type
        this.fireLoopDuration = 5 * 60; // 5:00 per loop

        // Work track playlists for both modes
        this.workTracks = {
            '45_15': [
                'Seq001_45_36.mp3',
                'Seq002_45_04.mp3',
                'Seq003_45_03.mp3',
                'Seq004_45_11.mp3',
                'Seq005_45_16.mp3',
                'Seq006_45.mp3'
            ],
            '50_10': [
                'Seq101_50_07.mp3',
                'Seq102_50_29.mp3',
                'Seq103_54_56.mp3',
                'Seq104_50_00.mp3'
            ]
        };
        this.currentTrackIndex = 0;

        // Current session state
        this.currentPhase = 'work'; // 'work' or 'break'
        this.totalDuration = this.workDuration;

        // Audio buffers
        this.workAudioBuffers = {}; // Store all work track buffers
        this.fireAudioBuffer = null;

        // Break phase tracking
        this.breakLoopsNeeded = Math.round(this.breakDuration / this.fireLoopDuration);
        this.currentBreakLoop = 0;

        this.timerText = document.getElementById('timerText');
        this.phaseIndicator = document.getElementById('phaseIndicator');
        this.status = document.getElementById('status');
        this.circleProgress = document.querySelector('.circle-progress');

        // Scrubbing state
        this.isDragging = false;
        this.canScrub = true;

        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.fastForwardBtn = document.getElementById('fastForwardBtn');

        this.setupEventListeners();
        this.setupSessionSelector();
        this.updateCurrentDate();
        this.loadAudioFiles();

        // Calculate circle circumference for progress animation
        this.circumference = 2 * Math.PI * 140; // radius = 140
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.fastForwardBtn.addEventListener('click', () => this.fastForward());
    }

    setupSessionSelector() {
        const sessionBtns = document.querySelectorAll('.session-btn');
        const sessionInfo = document.getElementById('sessionInfo');
        sessionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isRunning) return;
                sessionBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.sessionType = btn.dataset.type;
                this.currentTrackIndex = 0;
                if (this.sessionType === '45_15') {
                    this.breakDuration = 15 * 60;
                    sessionInfo.textContent = '45 minutes work + 15 minutes break';
                } else {
                    this.breakDuration = 10 * 60;
                    sessionInfo.textContent = '50 minutes work + 10 minutes break';
                }
                this.breakLoopsNeeded = Math.round(this.breakDuration / this.fireLoopDuration);
                this.updateCurrentTrack();
                this.updateDisplay(this.totalDuration);
                this.updatePhaseIndicator();
                this.status.textContent = `Switched to ${this.sessionType.replace('_', '/')} mode`;
            });
        });
    }

    async loadAudioFiles() {
        try {
            this.status.textContent = 'Loading audio files...';
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            for (const sessionType of ['45_15', '50_10']) {
                const tracks = this.workTracks[sessionType];
                for (let i = 0; i < tracks.length; i++) {
                    const trackName = tracks[i];
                    this.status.textContent = `Loading ${trackName}...`;
                    // Change from ../music/ to ../music/ (works both locally and on GitHub Pages)
                    const workResponse = await fetch(`../music/${sessionType}/${trackName}`);
                    if (!workResponse.ok) {
                        throw new Error(`Failed to fetch ${trackName}: ${workResponse.status}`);
                    }
                    const workArrayBuffer = await workResponse.arrayBuffer();
                    this.workAudioBuffers[`${sessionType}_${trackName}`] = await this.audioContext.decodeAudioData(workArrayBuffer);
                }
            }
            this.status.textContent = 'Loading fireplace audio...';
            const fireResponse = await fetch('../music/FireLoops/fire_5_00.mp3');
            if (!fireResponse.ok) {
                throw new Error(`Failed to fetch fire audio: ${fireResponse.status}`);
            }
            const fireArrayBuffer = await fireResponse.arrayBuffer();
            this.fireAudioBuffer = await this.audioContext.decodeAudioData(fireArrayBuffer);
            this.fireLoopDuration = Math.floor(this.fireAudioBuffer.duration);
            console.log(`Fire loop duration: ${this.fireLoopDuration} seconds`);
            console.log(`Break duration: ${this.breakDuration} seconds (${this.breakDuration / 60} minutes)`);
            this.breakLoopsNeeded = Math.round(this.breakDuration / this.fireLoopDuration);
            console.log(`Break loops needed: ${this.breakLoopsNeeded}`);
            this.updateCurrentTrack();
            this.updateDisplay(this.totalDuration);
            this.updatePhaseIndicator();
            this.status.textContent = 'Ready to start your focus session';
        } catch (error) {
            console.error('Error loading audio:', error);
            this.status.textContent = `Error loading audio: ${error.message}`;
        }
    }

    updateCurrentTrack() {
        const currentTracks = this.workTracks[this.sessionType];
        const currentTrack = currentTracks[this.currentTrackIndex];
        const bufferKey = `${this.sessionType}_${currentTrack}`;
        if (this.workAudioBuffers[bufferKey]) {
            this.workDuration = Math.floor(this.workAudioBuffers[bufferKey].duration);
            this.totalDuration = this.workDuration;
            console.log(`Updated track: ${currentTrack}, duration: ${this.workDuration}s (${Math.floor(this.workDuration / 60)}:${(this.workDuration % 60).toString().padStart(2, '0')})`);
        }
    }

    start() {
        if (Object.keys(this.workAudioBuffers).length === 0 || !this.fireAudioBuffer) {
            this.status.textContent = 'Audio files not loaded yet, please wait...';
            return;
        }
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            this.playCurrentPhase();
        } catch (error) {
            console.error('Error starting audio:', error);
            this.status.textContent = `Error: ${error.message}`;
        }
    }

    playCurrentPhase() {
        this.currentSource = this.audioContext.createBufferSource();
        if (this.currentPhase === 'work') {
            const currentTracks = this.workTracks[this.sessionType];
            const currentTrack = currentTracks[this.currentTrackIndex];
            const bufferKey = `${this.sessionType}_${currentTrack}`;
            this.currentSource.buffer = this.workAudioBuffers[bufferKey];
            this.totalDuration = this.workDuration;
        } else {
            this.currentSource.buffer = this.fireAudioBuffer;
            this.totalDuration = this.fireLoopDuration; // Use single loop duration for timer
            console.log(`Starting break loop ${this.currentBreakLoop + 1}/${this.breakLoopsNeeded}: ${this.fireLoopDuration} seconds`);
        }
        this.currentSource.connect(this.audioContext.destination);
        const offset = this.isPaused ? this.pausedTime : 0;
        this.currentSource.start(0, offset);
        this.startTime = this.audioContext.currentTime - offset;
        this.isRunning = true;
        this.isPaused = false;
        this.updateButtons();
        this.updatePhaseIndicator();

        if (this.currentPhase === 'work') {
            const currentTracks = this.workTracks[this.sessionType];
            const trackName = currentTracks[this.currentTrackIndex];
            const trackNumber = this.currentTrackIndex + 1;
            this.status.textContent = `Playing ${trackName} (${trackNumber}/${currentTracks.length}) - ${this.sessionType.replace('_', '/')} mode`;
        } else {
            this.status.textContent = `Break time - Loop ${this.currentBreakLoop + 1}/${this.breakLoopsNeeded} (${this.breakDuration / 60} min total)`;
        }

        this.currentSource.onended = () => {
            if (this.isRunning && !this.isSkipped) {
                this.handlePhaseEnd();
            }
            this.isSkipped = false;
        };
        this.updateTimer();
    }

    handlePhaseEnd() {
        if (this.currentPhase === 'work') {
            this.currentPhase = 'break';
            this.currentBreakLoop = 0;
            this.pausedTime = 0;
            this.playCurrentPhase();
        } else {
            // Break phase ended
            this.currentBreakLoop++;
            console.log(`Break loop ${this.currentBreakLoop} of ${this.breakLoopsNeeded} completed`);

            if (this.currentBreakLoop < this.breakLoopsNeeded) {
                // Continue break with next fireplace loop
                this.pausedTime = 0;
                this.playCurrentPhase();
            } else {
                // Break phase complete, move to next work track
                this.currentPhase = 'work';
                this.currentBreakLoop = 0;
                const currentTracks = this.workTracks[this.sessionType];
                this.currentTrackIndex = (this.currentTrackIndex + 1) % currentTracks.length;
                this.updateCurrentTrack();
                this.pausedTime = 0;

                if (this.currentTrackIndex === 0) {
                    this.status.textContent = `Full ${this.sessionType.replace('_', '/')} cycle complete! Starting again... 🔄`;
                    setTimeout(() => {
                        this.playCurrentPhase();
                    }, 2000);
                } else {
                    this.playCurrentPhase();
                }
            }
        }
    }

    pause() {
        if (this.currentSource && this.isRunning) {
            this.currentSource.stop();
            this.pausedTime = this.audioContext.currentTime - this.startTime;
            this.isRunning = false;
            this.isPaused = true;
            this.isSkipped = false;
            this.updateButtons();
            this.status.textContent = 'Session paused';
        }
    }

    stop() {
        if (this.currentSource) {
            this.currentSource.stop();
        }
        this.isRunning = false;
        this.isPaused = false;
        this.isSkipped = false;
        this.pausedTime = 0;
        this.startTime = null;
        this.currentPhase = 'work';
        this.currentBreakLoop = 0;
        this.currentTrackIndex = 0;
        this.updateCurrentTrack();
        this.updateDisplay(this.totalDuration);
        this.updateButtons();
        this.updatePhaseIndicator();
        this.status.textContent = 'Session stopped - Reset to beginning';
    }

    fastForward() {
        if (!this.isRunning || this.currentPhase !== 'work') {
            this.status.textContent = 'Fast forward is only available during work sessions';
            return;
        }

        const fastForwardAmount = 300; // 5 minutes (300 seconds)
        const elapsed = this.audioContext.currentTime - this.startTime;
        const newTime = elapsed + fastForwardAmount;

        // Set skip flag to prevent automatic phase transitions
        this.isSkipped = true;

        if (this.currentSource) {
            this.currentSource.onended = null; // Remove event handler before stopping
            this.currentSource.stop();
        }

        if (newTime >= this.totalDuration) {
            // Fast forward past end of current track - go to next work track
            const currentTracks = this.workTracks[this.sessionType];
            this.currentTrackIndex = (this.currentTrackIndex + 1) % currentTracks.length;
            this.updateCurrentTrack();
            this.startTime = this.audioContext.currentTime;

            // Start next work track from beginning
            this.currentSource = this.audioContext.createBufferSource();
            const currentTrack = currentTracks[this.currentTrackIndex];
            const bufferKey = `${this.sessionType}_${currentTrack}`;
            this.currentSource.buffer = this.workAudioBuffers[bufferKey];
            this.currentSource.connect(this.audioContext.destination);
            this.currentSource.start(0, 0);

            const trackNumber = this.currentTrackIndex + 1;
            this.status.textContent = `Fast forwarded to track ${trackNumber}/${currentTracks.length}`;

        } else {
            // Fast forward within current track
            this.startTime = this.audioContext.currentTime - newTime;
            this.currentSource = this.audioContext.createBufferSource();
            const currentTracks = this.workTracks[this.sessionType];
            const currentTrack = currentTracks[this.currentTrackIndex];
            const bufferKey = `${this.sessionType}_${currentTrack}`;
            this.currentSource.buffer = this.workAudioBuffers[bufferKey];
            this.currentSource.connect(this.audioContext.destination);
            this.currentSource.start(0, newTime);

            this.status.textContent = `Fast forwarded ${fastForwardAmount / 60} minutes`;
        }

        // Reset skip flag and set up proper event handler
        this.isSkipped = false;
        this.currentSource.onended = () => {
            if (this.isRunning && !this.isSkipped) {
                this.handlePhaseEnd();
            }
            this.isSkipped = false;
        };
    }

    complete() {
        this.isRunning = false;
        this.isPaused = false;
        this.pausedTime = 0;
        this.currentPhase = 'work';
        this.currentBreakLoop = 0;
        this.currentTrackIndex = 0;
        this.updateCurrentTrack();
        this.updateDisplay(this.totalDuration);
        this.updateButtons();
        this.updatePhaseIndicator();
        this.status.textContent = 'Session manually completed! 🎉';
    }

    updateCurrentTrack() {
        const currentTracks = this.workTracks[this.sessionType];
        const currentTrack = currentTracks[this.currentTrackIndex];
        const bufferKey = `${this.sessionType}_${currentTrack}`;
        if (this.workAudioBuffers[bufferKey]) {
            this.workDuration = Math.floor(this.workAudioBuffers[bufferKey].duration);
            this.totalDuration = this.workDuration;
            console.log(`Updated track: ${currentTrack}, duration: ${this.workDuration}s (${Math.floor(this.workDuration / 60)}:${(this.workDuration % 60).toString().padStart(2, '0')})`);
        }
    }

    updatePhaseIndicator() {
        const indicator = this.phaseIndicator.querySelector('span');
        if (this.currentPhase === 'work') {
            indicator.className = 'phase-work';
            indicator.textContent = 'Work Session';
        } else {
            indicator.className = 'phase-break';
            indicator.textContent = 'Break Time';
        }
    }

    updateTimer() {
        if (!this.isRunning) return;
        const elapsed = this.audioContext.currentTime - this.startTime;
        const remaining = Math.max(0, this.totalDuration - elapsed);
        const progress = ((this.totalDuration - remaining) / this.totalDuration) * 100;
        this.updateDisplay(remaining);
        this.updateProgress(progress);
        if (remaining > 0) {
            requestAnimationFrame(() => this.updateTimer());
        }
        // Remove the else clause that calls complete() - let onended handle transitions
    }

    updateDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        this.timerText.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updateProgress(percentage) {
        // For break phase, calculate overall break progress
        if (this.currentPhase === 'break') {
            const totalBreakProgress = ((this.currentBreakLoop * this.fireLoopDuration) +
                (this.fireLoopDuration - (this.totalDuration - (this.audioContext.currentTime - this.startTime)))) / this.breakDuration * 100;
            const offset = this.circumference - (totalBreakProgress / 100) * this.circumference;
            this.circleProgress.style.strokeDashoffset = offset;
        } else {
            const offset = this.circumference - (percentage / 100) * this.circumference;
            this.circleProgress.style.strokeDashoffset = offset;
        }
    }

    updateButtons() {
        const sessionBtns = document.querySelectorAll('.session-btn');
        if (this.isRunning) {
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.stopBtn.disabled = false;
            this.fastForwardBtn.disabled = this.currentPhase !== 'work';
            sessionBtns.forEach(btn => btn.disabled = true);
        } else if (this.isPaused) {
            this.startBtn.disabled = false;
            this.startBtn.textContent = 'Resume';
            this.pauseBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.fastForwardBtn.disabled = true;
            sessionBtns.forEach(btn => btn.disabled = true);
        } else {
            this.startBtn.disabled = false;
            this.startBtn.textContent = 'Start';
            this.pauseBtn.disabled = true;
            this.stopBtn.disabled = true;
            this.fastForwardBtn.disabled = true;
            sessionBtns.forEach(btn => btn.disabled = false);
        }
    }

    updateCurrentDate() {
        const currentDateElement = document.getElementById('currentDate');
        const now = new Date();
        const centralTime = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Chicago',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(now);
        currentDateElement.textContent = centralTime;
    }
}

// Initialize the timer when the page loads
window.addEventListener('load', () => {
    new FlowTimer();
});
