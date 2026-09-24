# 🏗️ IsaiCraft System Architecture

IsaiCraft is designed as a distributed, three-tier architecture that decouples client interaction from high-throughput GPU generative inference and programmatic DSP mastering.

```text
React Frontend (Vite / SPA)
        │
        │ 1. HTTP (Bearer JWT + Lyrics / Metadata)
        ▼
FastAPI Backend / Orchestrator (:8000)
        │
        ├── Firebase Admin SDK (JWT cryptographic token verification)
        └── Google Gemini 2.5 Flash (Phonetic vocal guide generation)
        │
        │ 2. HTTP / FormData (Vocals.wav + SuperPrompt) via PyNgrok
        ▼
Google Colab GPU Engine (NVIDIA T4 CUDA)
        │
        +--------------------------------+--------------------------------+
        │                                                                 │
        ▼                                                                 ▼
   Meta MusicGen                                                      Vocal DSP
(facebook/musicgen-small)                                                 │
        │                                                 +---------------+---------------+
        │ Instrumental EQ                                 │                               │
        │ (HPF 40Hz, Peak 2500Hz -6dB)                 noisereduce                     PyWorld
        │                                         (Acoustic Cleansing)          (DIO + StoneMask F0
        │                                                 │                      55% Soft Retune)
        │                                                 +---------------+---------------+
        │                                                                 │
        │                                                                 ▼
        │                                                        Spotify Pedalboard
        │                                                    (EQ, Comp, Reverb, +6dB Gain)
        │                                                                 │
        +--------------------------------+--------------------------------+
                                         │
                                         ▼
                                   Mixing Layer
                          • Beat Peak Normalization: 0.35
                          • Vocal Peak Normalization: 0.90
                          • Summation: mixed_raw = music_norm + vocal_norm
                                         │
                                         ▼
                             Master Audio Processing
                          • Mastering Compressor (-12dB, 2.5:1)
                          • Post Gain (+1.5dB)
                          • Soft Saturation: np.tanh(...)
                                         │
                                         ▼
                             Base64 Audio Response
                        { status, music, vocal, master }
                                         │
                                         ▼
                             React UI & Stems Player
```

---

## 🧩 Architectural Modules Breakdown

### Tier 1: Client Presentation Layer (React + Vite)
- **MOD-01 & MOD-05**: In-browser recording booth (Web Audio API & MediaRecorder), dynamic BPM-synced teleprompter, state management via React Context API (`AuthContext`, `IsaiContext`), and multi-track stems playback.

### Tier 2: Security & Orchestrator (FastAPI Local Backend)
- **MOD-01 & MOD-02**: Intercepts requests, validates Firebase ID tokens via Firebase Admin SDK, and interfaces with **Google Gemini 2.5 Flash** to provide multilingual vocal coaching and phonetic syllable breakdowns.
- *Note: Gemini operates exclusively on textual lyrics and prompt engineering within Tier 2; it does not perform raw audio synthesis.*

### Tier 3: Remote GPU Engine (Google Colab Node)
- **MOD-03, MOD-04, MOD-06**: Executes **Meta MusicGen-Small** on a CUDA GPU, applies **noisereduce** filtering, runs **PyWorld** humanized pitch correction (55% retune strength), applies **Spotify Pedalboard** FX chains, normalizes peaks (0.35 beat, 0.90 vocal), compresses and saturates mixbus with `np.tanh`, and returns Base64 WAV stems over a **pyngrok** tunnel.
