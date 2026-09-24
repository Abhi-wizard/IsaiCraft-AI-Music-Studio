# 🎨 IsaiCraft Web Studio (Tier 1: Frontend)

The **IsaiCraft Studio Frontend** is a modern Single Page Application (SPA) designed to provide an interactive digital audio workstation (DAW) experience for amateur singers and music creators.

---

## 🏗️ Architecture & Features

1. **Authentication & Session Management (MOD-01 & MOD-05)**:
   - Firebase Authentication with Google Sign-In and Email/Password.
   - JWT token injection for authenticated backend communication.
   - Centralized state engine via React Context API (`AuthContext`, `IsaiContext`).

2. **Smart Studio & Teleprompter**:
   - Mood, genre, and instrumental arrangement configuration.
   - AI Vocal Guide with phonetic breakdown notation (`-`, `[Breathe]`, `~~~`, `ALL CAPS`).
   - Integrated BPM-synced teleprompter display.

3. **In-Browser Audio Recording**:
   - Hardware microphone capture using the **Web Audio API** and **MediaRecorder**.
   - Waveform visualization, countdown timer, and playback review.
   - Automatic WAV blob packaging and FormData transmission.

4. **Multi-Track Stems Player & Visualizer**:
   - Multi-step neural progress overlay powered by Framer Motion.
   - Master mix, instrumental beat stem, and vocal stem playback.
   - Waveform bars visualizer with seek and volume controls.

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your endpoints and Firebase configuration:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GPU_ENGINE_URL=https://your-colab-ngrok-subdomain.ngrok-free.dev
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Tech Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS, CSS Glassmorphism
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Audio Capture**: Web Audio API / MediaRecorder
- **Auth & Database**: Firebase Auth & Firestore
