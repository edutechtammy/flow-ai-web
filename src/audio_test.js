// Audio playback test using the Web Audio API

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

async function playAudio() {
    try {
        const response = await fetch('../music/45 15/Sequence 1.aif');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);

        console.log('Playing: Sequence 1 (45:36)');
    } catch (error) {
        console.error('Error playing audio:', error);
    }
}

playAudio();