# FLOW-AI: Productivity and Emotional Support Tool

## Overview
FLOW-AI is a holistic productivity tool that integrates:
- **Pomodoro Timing**: Customizable work/break intervals (45/15 and 50/10 modes) to enhance focus and productivity.
- **Curated Audio Experience**: Pre-selected work session tracks and peaceful break sounds for optimal focus flow.
- **🚀 Future AI-Powered Emotional Support**: Daily check-ins, reflective journaling, and stress management insights tailored to the user's needs *(planned for future sprints)*.

This tool is designed to address the gap where stress and emotional challenges disrupt productivity routines, offering proactive support and a seamless user experience.

---

## Core Features

### ✅ Completed - Pomodoro Timer with Dual Mode Support
- **45/15 Mode**: 45-minute work sessions + 15-minute breaks
- **50/10 Mode**: 50-minute work sessions + 10-minute breaks  
- Visual circular progress indicator and digital countdown display
- Start, pause, stop, resume functionality
- **Fast Forward**: Skip ahead 5 minutes within work sessions or jump to next track
- **Dynamic Date Display**: Shows current date in Central Time
- Automatic session transitions with visual and auditory cues

### ✅ Completed - Curated Audio Experience  
- **Work Session Music**: Carefully selected ambient/piano tracks optimized for focus
  - 45/15 mode: 6 tracks (~45 minutes each)
  - 50/10 mode: 4 tracks (~50 minutes each)
- **Break Audio**: Peaceful fireplace crackling sounds (5-minute loops)
- **Smart Audio Management**: Automatic playlist progression and break loop calculations
- **Fast Forward Feature**: Jump ahead 5 minutes or to next track while maintaining focus session

### 🚀 Future Sprint - AI-Powered Daily Check-Ins
- Reflect on emotional state and set intentions for the day
- Provide tailored suggestions for managing stress or staying focused
- Track emotional trends over time and offer insights

### 🚀 Future Sprint - Break Suggestions
- Suggest activities for breaks (e.g., mindfulness exercises, stretching, or journaling).
### 🚀 Future Sprint - Break Suggestions
- Suggest activities for breaks (e.g., mindfulness exercises, stretching, or journaling)
- Include guided meditations or breathing exercises

### 🚀 Future Sprint - Progress Tracking
- Track completed Pomodoro sessions and provide insights into productivity patterns
- Celebrate milestones to keep motivation high
- Generate weekly/monthly productivity reports

### 🚀 Future Sprint - Emotional Support Strategies
- **Empathy and Understanding**: Approach interactions with empathy, recognizing that everyone brings their own challenges and perspectives
- **Reframing Misunderstandings**: If conflicts arise, try to reframe them as opportunities for growth and collaboration
- **Practicing Self-Compassion**: Be kind to yourself if things don't go as planned. Focus on what you can learn and improve

---

## Why FLOW-AI?
1. **Addresses a Real Pain Point**: Helps users stay consistent with routines, even during high-stress periods
2. **Combines Practicality and Emotional Support**: Goes beyond a simple timer by integrating emotional check-ins and support *(future feature)*
3. **Scalable and Customizable**: Starts as a personal tool but can be expanded for broader use
4. **Leverages AI for Personalization**: Makes the app feel like a supportive companion, adapting to user needs *(future feature)*

---

## Current Progress

### Folder Structure
- `music/`: Directory containing audio files organized by session type
  - `45_15/`: Six work tracks (~45 minutes each) for 45/15 mode
  - `50_10/`: Four work tracks (~50 minutes each) for 50/10 mode
  - `FireLoops/`: Break audio (5-minute fireplace track for looping)
- `src/`: Directory containing the source code of the application
  - `flow.html`: Main FLOW-AI timer application
  - `index.html`: Initial audio test file
- `assets/`: Directory for additional assets like images or icons

### ✅ Current Working Features
- **Dual Session Mode Support**: Users can select between 45/15 and 50/10 Pomodoro modes
- **Visual Countdown Timer**: Circular progress indicator and digital countdown display
- **Dynamic Date Display**: Current date shown in Central Time zone
- **Audio Integration**: MP3 music tracks with programmatic fireplace break loops
- **Automatic Playlist Progression**: Cycles through all tracks automatically with seamless transitions
- **Phase Indicators**: Clear visual distinction between work and break sessions
- **Session Controls**: Start, pause, stop, resume, and fast forward functionality
- **Fast Forward Feature**: 
  - Skip ahead 5 minutes within current work track
  - Jump to next work track if fast forwarding past track end
  - Disabled during break sessions (break-only)
- **Smart Break Loop Logic**: 
  - 45/15 mode: 15 minutes = 3 x 5-minute fireplace loops
  - 50/10 mode: 10 minutes = 2 x 5-minute fireplace loops
- **Audio File Management**: All tracks properly converted and duration-validated
- **Responsive Design**: Timer and progress indicators scale smoothly on different screen sizes

### Audio File Status
- **All AIFF files converted to MP3** for web compatibility
- **45/15 tracks**: 6 files (Seq001-Seq006) - ~45 minutes each
- **50/10 tracks**: 4 files (Seq101-Seq104) - ~50 minutes each  
- **Fireplace audio**: 1 file (~5 minutes) for break loops
- **Total file size**: Reduced from ~900MB to ~70MB per track (93% compression)

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Audio**: Web Audio API for playback and timing synchronization
- **Development**: Local HTTP server for testing
- **Audio Conversion**: FFmpeg for AIFF to MP3 conversion

### 🚀 Future Development Roadmap
- **Sprint 2**: Add AI-powered daily check-ins and emotional support features
- **Sprint 3**: Implement progress tracking and productivity insights  
- **Sprint 4**: Add customizable session durations and break activities
- **Sprint 5**: Enhance mobile responsiveness and add touch gestures
- **Sprint 6**: Add user preferences and settings persistence
- **Sprint 7**: Implement audio scrubbing on circular progress bar

---

## Development Status

### ✅ MVP Complete (v1.1)
The Minimum Viable Product has been successfully implemented with:
- ✅ **Pomodoro Timer**: Dual-mode support (45/15 and 50/10)
- ✅ **Audio Integration**: Curated work tracks and break sounds  
- ✅ **Core Functionality**: All essential timer controls working perfectly
- ✅ **Fast Forward**: 5-minute skip functionality for work sessions
- ✅ **Dynamic Date**: Real-time date display in Central Time

### 🚀 Next Development Phase - AI Integration
1. **Plan AI Integration**
   - Research lightweight AI models or APIs (e.g., OpenAI) for emotional check-ins
   - Design user interface for daily emotional state tracking
   - Prototype mood-based productivity insights
2. **Expand User Experience**
   - Add customizable session lengths
   - Implement user preferences and settings persistence
   - Design responsive mobile interface
3. **Enhanced Features**
   - Progress tracking and analytics dashboard
   - Break activity suggestions and guided exercises
   - Productivity pattern recognition and recommendations

---

*This README reflects the current state of the FLOW-AI project. The core timer functionality is complete and working perfectly. Future updates will focus on AI-powered emotional support features.*# flow-ai-web
