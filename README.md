# 🎵 IsaiCraft

## AI-Powered Music Production Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28.svg)](https://firebase.google.com/)
[![Google Colab](https://img.shields.io/badge/Colab-NVIDIA%20T4%20GPU-F9AB00.svg)](https://colab.research.google.com/)

**IsaiCraft** is a distributed, three-tier neuro-acoustic music production studio designed to democratize studio-grade music creation for independent lyricists, creators, and non-professional singers. 

Unlike pure text-to-audio generators that output flattened, non-interactive songs, IsaiCraft functions as an interactive virtual producer. It merges **raw human vocal performances** with **AI-synthesized instrumental arrangements**, guides amateur vocalists with **multilingual LLM coaching**, applies **humanized soft-pitch correction**, and programmatically executes **studio DSP mixing and mastering**.

---

## 🎯 Problem

Independent content creators and amateur singers face major technical bottlenecks when creating original music:
1. **Pitch Inaccuracy & Intonation**: Non-singers often sing off-key. Traditional auto-tuning algorithms aggressively snap vocals to 100% rigid MIDI semitones, producing robotic artifacts that destroy vocal timbre and natural vibrato.
2. **Arrangement & Instrumentation**: Producing professional backing tracks requires deep music theory, expensive instruments, and DAW workflow mastery.
3. **Complex Audio Engineering**: Programmatic equalization, multi-band compression, de-essing, reverb blending, and mixbus dynamic mastering are inaccessible to casual creators.
4. **Hardware Bottlenecks**: High-parameter generative audio transformers cannot run on standard consumer hardware without dedicated, high-VRAM GPUs.

---

## 💡 Solution

IsaiCraft solves these challenges through a distributed, three-tier architecture:
- **Client Web Studio (React + Vite)**: Provides an in-browser recording booth with real-time waveform visualization, BPM-synced teleprompter, and stems playback.
- **Security & Orchestrator (FastAPI + Gemini)**: Enforces Firebase JWT verification and translates multilingual lyrics (Tamil, Tanglish, English) into an empathetic phonetic singing guide.
- **Remote GPU Engine (Google Colab + MusicGen + PyWorld + Pedalboard)**: Generates instrumental backing tracks, cleans vocal audio, applies fractional pitch correction, and performs analog soft-limiting mastering.

---

## 🏗️ Architecture

```
                                 [ USER / SINGER ]
                                         │
                                         ▼
                               ┌───────────────────┐
                               │  REACT FRONTEND   │ (Vite, Web Audio API, Framer Motion)
                               └─────────┬─────────┘
                                         │
                                         │ Firebase JWT Auth
                                         ▼
                               ┌───────────────────┐
                               │     FASTAPI       │ (Port 8000 Orchestrator)
                               │   ORCHESTRATOR    │
                               └─────────┬─────────┘
                                         │
                                         │ Lyrical Coaching Prompt
                                         ▼
                               ┌───────────────────┐
                               │    GEMINI AI      │ (gemini-2.5-flash)
                               │  VOCAL DIRECTOR   │
                               └───────────────────┘
                                         │
                                         │ FormData: .wav Vocals + Mood Prompt
                                         ▼ (via PyNgrok Tunnel)
                               ┌───────────────────┐
                               │ GOOGLE COLAB GPU  │ (NVIDIA T4 CUDA Compute)
                               │      ENGINE       │
                               └─────────┬─────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
     ┌───────────────────────┐                       ┌───────────────────────┐
     │   Meta MusicGen       │                       │ Acoustic Cleansing    │
     │  (musicgen-small)     │                       │ (noisereduce)         │
     └───────────┬───────────┘                       └───────────┬───────────┘
                 │                                               ▼
                 │ Instrumental EQ                   ┌───────────────────────┐
                 │ (HPF 40Hz, Peak 2.5kHz)           │ PyWorld Vocoder       │
                 │                                   │ (DIO + StoneMask F0)  │
                 │                                   └───────────┬───────────┘
                 │                                               ▼
                 │                                   ┌───────────────────────┐
                 │                                   │ Humanized Soft-Pitch  │
                 │                                   │ (retune_strength=0.55)│
                 │                                   └───────────┬───────────┘
                 │                                               ▼
                 │                                   ┌───────────────────────┐
                 │                                   │ Pedalboard FX Chain   │
                 │                                   │ (EQ, Comp, Reverb)    │
                 │                                   └───────────┬───────────┘
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                             ┌───────────────────────┐
                             │ Dynamic Mixbus Engine │
                             │ • Vocal Peak: 0.90    │
                             │ • Beat Peak: 0.35     │
                             │ • Soft-Limit: np.tanh │
                             └───────────┬───────────┘
                                         │
                                         │ Base64 Stems JSON
                                         ▼
                             ┌───────────────────────┐
                             │  REACT STEMS PLAYER   │ (Master, Beat, Vocal Tracks)
                             └───────────────────────┘
```

---

## 🧠 AI Components

| Component | Technology | Role & Functionality |
|---|---|---|
| **Vocal Director & Coaching** | Google Gemini 2.5 Flash | Parses raw lyrical inputs (Tamil/Tanglish/English) and generates structured JSON phonetic syllable breakdowns (`-`), breath pauses (`[Breathe]`), pitch holds (`~~~`), and emotional cues. |
| **Neural Music Synthesis** | Meta MusicGen (`musicgen-small`) | Autoregressive transformer generating 32kHz stereo instrumental backing tracks conditioned on mood, genre, and lyrical themes. |
| **Acoustic Decomposition** | PyWorld Vocoder | High-accuracy speech analysis extracting Fundamental Frequency ($F_0$), Spectral Envelope (CheapTrick), and Aperiodicity (D4C). |

---

## 🎙️ Audio Processing Pipeline

```
Raw Vocal Recording (.wav)
       │
       ▼
1. Acoustic Cleansing ──────► noisereduce (Non-Stationary Spectral Profile)
       │
       ▼
2. Pitch Analysis ──────────► PyWorld DIO + StoneMask Refinement
       │
       ▼
3. Glitch Smoothing ────────► SciPy Signal Median Filter
       │
       ▼
4. Soft-Pitch Correction ───► Fractional Retuning (retune_strength = 0.55)
       │
       ▼
5. Studio Vocal FX Chain ───► Spotify Pedalboard (HPF 100Hz, Peak 300Hz, High Shelf 7.5kHz, 4:1 Comp, Reverb)
       │
       ▼
6. Mixbus Alignment ────────► Summation + Peak Balancing (0.90 Vocal / 0.35 Beat) + np.tanh Soft-Limiting
       │
       ▼
Final Mastered Stems ───────► Base64 JSON Payload Export
```

---

## 🎚️ Humanized Soft-Pitch Correction

Standard auto-tuning applies rigid mathematical quantization to the nearest 12-TET semitone:

$$F_{\text{target}} = 440 \times 2^{\frac{\text{round}(\text{MIDI}) - 69}{12}}$$

When vocalists exhibit natural intonation variations, hard quantization creates robotic "stair-stepping" artifacts.

IsaiCraft introduces **Fractional Harmonic Retuning**:

$$F_{\text{corrected}} = F_{\text{current}} + \alpha \times \left(F_{\text{target}} - F_{\text{current}}\right)$$

Where $\alpha = 0.55$ (`retune_strength`).

This formula gently draws off-key frequencies 55% toward harmonic resonance, eliminating glaring off-pitch errors while preserving the natural vibrato and emotional timbre of the singer.

---

## 🔐 Authentication & Security

- **Client Token Issuance**: Firebase Authentication issues cryptographically signed JWTs on login.
- **Zero-Trust Backend Validation**: FastAPI uses `firebase-admin` to decode and verify bearer tokens on all protected routes (`/api/vocal-guide`).
- **Secrets Isolation**: API keys, Firebase service account keys, and ngrok tokens are stored strictly in environment variables (`.env`) and excluded from version control via `.gitignore`.
- **CORS Protection**: FastAPI enforces strict origin whitelisting (`http://localhost:5173`) and processes custom `ngrok-skip-browser-warning` headers.

---

## 🧩 Key Modules

| Module ID | Module Name | Code Location | Responsibility |
|---|---|---|---|
| **MOD-01** | Identity & Access Management | `frontend/src/context/AuthContext.jsx`, `backend/main.py` | Firebase user auth, token verification, route guards. |
| **MOD-02** | Project Orchestrator | `backend/main.py` | Request routing, Gemini 2.5 Flash vocal coaching. |
| **MOD-03** | Neural Synthesis Engine | `colab/IsaiCraft_GPU_Engine.ipynb` | Meta MusicGen-Small model inference on CUDA GPU. |
| **MOD-04** | DSP Mastery Node | `colab/IsaiCraft_GPU_Engine.ipynb` | PyWorld soft-pitch correction, noisereduce, Pedalboard mastering. |
| **MOD-05** | UX State Engine | `frontend/src/context/IsaiContext.jsx`, `frontend/src/pages/` | Asynchronous state management, recording, stems visualizer. |
| **MOD-06** | Network Bridge | `colab/IsaiCraft_GPU_Engine.ipynb`, `frontend/src/lib/api.js` | PyNgrok tunneling, CORS preflight handling. |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18, Vite | Component-based Single Page Application |
| **Styling & Motion** | Tailwind CSS, Framer Motion | Modern dark studio UI with glassmorphism |
| **Audio Capture** | Web Audio API, MediaRecorder | In-browser microphone streaming & WAV generation |
| **Backend API** | Python, FastAPI, Uvicorn | Asynchronous orchestration microservice |
| **Authentication** | Firebase Auth, Firebase Admin SDK | JWT authentication and session management |
| **Large Language Model** | Google Gemini 2.5 Flash | Multilingual lyrics analysis & vocal coaching |
| **Generative Music AI** | Meta MusicGen Small (Transformers) | Text-conditioned instrumental music generation |
| **Audio Processing & DSP** | PyWorld, SciPy, librosa, noisereduce, pedalboard | Noise reduction, vocoding, pitch retune, EQ, mixbus mastering |
| **Cloud GPU Compute** | Google Colab (NVIDIA T4 GPU) | High-VRAM hardware execution node |
| **Reverse Proxy** | pyngrok | Secure HTTPS tunnel to Colab microservice |

---

## 📁 Project Structure

```
IsaiCraft-AI-Music-Studio/
├── frontend/                      # Tier 1: React + Vite Single Page Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/            # RootLayout and navigation
│   │   │   ├── studio/            # VocalBooth, CustomAudioPlayer, MultiStepLoading
│   │   │   └── ui/                # GlassCard and reusable UI components
│   │   ├── context/               # AuthContext, IsaiContext
│   │   ├── hooks/                 # useAudioRecorder, useProduceMusic
│   │   ├── lib/                   # api.js, audioUtils.js, firebase.js
│   │   ├── pages/                 # LoginPage, DashboardPage, StudioPage, ResultsPage
│   │   ├── router/                # AppRouter (Protected routes)
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── README.md
│
├── backend/                       # Tier 2: FastAPI Orchestrator & Gemini Gateway
│   ├── main.py                    # Orchestrator entry point & Firebase token auth
│   ├── requirements.txt           # Backend Python dependencies
│   ├── firebase-adminsdk.example.json # Safe service account template
│   ├── .env.example
│   └── README.md
│
├── colab/                         # Tier 3: Remote Google Colab GPU Engine
│   ├── IsaiCraft_GPU_Engine.ipynb # Complete MusicGen + PyWorld DSP pipeline notebook
│   └── README.md
│
├── docs/                          # Project Documentation & Architecture
│   ├── ARCHITECTURE.md            # Detailed architectural documentation
│   ├── AUDIO_PIPELINE.md          # Technical DSP & pitch correction breakdown
│   ├── SETUP.md                   # Full step-by-step installation guide
│   ├── architecture.png           # High-level architecture diagram
│   ├── audio-pipeline.png         # Audio processing pipeline diagram
│   ├── sequence-diagram.png       # End-to-end sequence diagram
│   ├── auth-workflow.png          # Authentication workflow diagram
│   └── project-report.pdf         # Official Major Project Academic Report
│
├── screenshots/                   # Application UI Walkthrough
│   ├── 01_login.png               # Login Gateway
│   ├── 02_dashboard.png           # Studio Dashboard & Analytics
│   ├── 03_vocal_studio.png        # Vocal Booth & AI Teleprompter
│   ├── 04_neural_processing.png   # Neural Synthesis Loading Overlay
│   └── 05_mastering_results.png   # Final Mastered Stems Player
│
├── .gitignore                     # Git exclusion rules (Secrets, audio, node_modules)
├── .env.example                   # Master environment variables template
├── LICENSE                        # MIT License
└── README.md                      # Project Portfolio Overview
```

---

## 🚀 Setup & Execution

### 1. Google Colab GPU Engine (Tier 3)
1. Open [Google Colab](https://colab.research.google.com/) and upload [`colab/IsaiCraft_GPU_Engine.ipynb`](./colab/IsaiCraft_GPU_Engine.ipynb).
2. Go to **Runtime -> Change runtime type** and select **T4 GPU**.
3. Add your `NGROK_AUTHTOKEN` in Colab Secrets or enter it when prompted.
4. Run all cells (`Ctrl + F9`).
5. Copy the generated ngrok URL (e.g. `https://xxxx-xx-xx.ngrok-free.dev`).

### 2. Local FastAPI Backend (Tier 2)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your GEMINI_API_KEY
python main.py
```

### 3. React Web Frontend (Tier 1)
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_GPU_ENGINE_URL to your Colab ngrok URL
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📸 Screenshots

| 1. User Login Gateway | 2. Dashboard Overview |
|:---:|:---:|
| ![Login](./screenshots/01_login.png) | ![Dashboard](./screenshots/02_dashboard.png) |

| 3. Vocal Studio & Guided Teleprompter | 4. Neural Processing Pipeline |
|:---:|:---:|
| ![Vocal Studio](./screenshots/03_vocal_studio.png) | ![Processing](./screenshots/04_neural_processing.png) |

| 5. Final Mastered Stems & Visualizer | Architecture Diagram |
|:---:|:---:|
| ![Results](./screenshots/05_mastering_results.png) | ![Architecture](./docs/architecture.png) |

---

## 🎥 Demo Video

[![IsaiCraft Demo Video](https://img.shields.io/badge/YouTube-Watch%20Demo-red?style=for-the-badge&logo=youtube)](YOUR_DEMO_LINK)

---

## 📄 Academic Project Documentation

The complete academic project report is included:
- **Major Project Report**: [`docs/project-report.pdf`](./docs/project-report.pdf)
- **Architecture Specification**: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- **Audio DSP Pipeline Specification**: [`docs/AUDIO_PIPELINE.md`](./docs/AUDIO_PIPELINE.md)
- **Deployment & Setup Guide**: [`docs/SETUP.md`](./docs/SETUP.md)

---

## ⚠️ Limitations

- **Transient Colab Sessions**: Google Colab free-tier instances timeout after inactivity, requiring re-running the notebook and updating the ngrok URL.
- **Cold Start Latency**: Downloading and caching the MusicGen model in Colab VRAM takes ~100 seconds on initial notebook launch.
- **Single-Segment Length**: The current prototype generates 10-second musical ideas to fit within free-tier GPU inference constraints.

---

## 🚀 Future Improvements

- **Persistent Cloud Hosting**: Deploy the GPU engine on dedicated inference platforms (RunPod, Modal, or AWS EC2 G4dn).
- **Collaborative Multi-User DAW**: Implement WebSockets for real-time multiplayer studio sessions.
- **Regional Model Fine-Tuning**: Fine-tune MusicGen on South Asian and Tamil folk/Carnatic instrumentation (Parai, Thavil, Nadaswaram).
- **Real-Time WebAudio Pitch Correction**: Implement WebAssembly (Wasm) PyWorld compilation for zero-latency client-side pitch feedback.

---

## 👨💻 Author

**Abhimanyu T**  
Master of Computer Applications (MCA) Graduate  
Project: Major Project MCA (2026)
