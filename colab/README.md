# ☁️ IsaiCraft GPU Processing Engine (Tier 3)

This directory contains the original **Google Colab GPU Processing Engine** notebook for **IsaiCraft**.

## 📖 Overview & Purpose

IsaiCraft is an interview-ready distributed AI audio-processing prototype designed as a three-tier ecosystem. While lightweight orchestration and lyric coaching are handled by the local FastAPI backend and React frontend, the computationally intensive **Generative AI (Meta MusicGen)** and **DSP (PyWorld, noisereduce, Pedalboard)** pipelines execute remotely on a cloud-hosted NVIDIA CUDA GPU via Google Colab.

```
[React Frontend]
       │
       │ HTTP POST (FormData with .wav vocal blob & metadata)
       ▼
[PyNgrok Secure Tunnel]
       │
       ▼
[Google Colab GPU Processing Node (T4)]
  ├── Meta MusicGen-Small (Transformer-based instrumental backing track)
  ├── Librosa (WAV loading & sample rate alignment)
  ├── noisereduce (Stationary/non-stationary spectral noise reduction)
  ├── PyWorld Vocoder (DIO + StoneMask F0 extraction & 55% fractional retuning)
  ├── Spotify Pedalboard (Vocal FX chain & instrumental EQ shaping)
  ├── Peak Normalization (Music: 0.35 / Vocal: 0.90)
  └── Dynamic Mixbus Mastering (Pedalboard compressor + 1.5dB gain + np.tanh soft saturation)
       │
       ▼ (Base64 JSON stems)
[React Stems Visualizer & Audio Player]
```

---

## 📋 Requirements
- **Google Colab Account** (with free or pro T4 GPU runtime)
- **ngrok Account & Auth Token** (free signup at [dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken))
- **Internet connectivity** for downloading model weights (`facebook/musicgen-small`)

---

## 🚀 Execution Guide

1. **Upload Notebook**:
   - Open [Google Colab](https://colab.research.google.com/).
   - Click **File -> Upload notebook** and select [`IsaiCraft_GPU_Engine.ipynb`](./IsaiCraft_GPU_Engine.ipynb).

2. **Select GPU Hardware Accelerator**:
   - Click **Runtime -> Change runtime type**.
   - Set **Hardware accelerator** to **T4 GPU**.
   - Click **Save**.

3. **Configure ngrok Auth Token (Security Best Practice)**:
   - In Google Colab, open the **Secrets** panel (key icon in the left sidebar).
   - Add a new secret named `NGROK_AUTHTOKEN` with your ngrok token value.
   - Alternatively, the notebook will prompt you securely via hidden console input if the secret is not set.
   - **Never hardcode your actual auth token in notebook cells.**

4. **Run All Cells**:
   - Click **Runtime -> Run all** (`Ctrl + F9`).
   - Cell 1 installs the exact dependencies.
   - Cell 4 downloads and caches `facebook/musicgen-small` in GPU VRAM.
   - Cell 7 sets up the FastAPI `/generate` microservice.
   - Cell 8 launches the ngrok public tunnel and starts Uvicorn.

5. **Connect Local Frontend**:
   - Copy the generated public URL (e.g. `https://xxxx-xx-xx.ngrok-free.dev`).
   - In your local `frontend/.env`, set:
     ```env
     VITE_GPU_ENGINE_URL=https://xxxx-xx-xx.ngrok-free.dev
     ```
   - Reload your local React development server.

---

## ⚙️ Audio DSP Pipeline Details

| Stage | Technology | Exact Configuration / Parameters |
|---|---|---|
| **Instrumental Synthesis** | Meta MusicGen Small | `max_new_tokens=1500`, sample rate from model audio encoder config |
| **Instrumental EQ** | Spotify Pedalboard | `PeakFilter(cutoff=2500Hz, gain=-6.0dB, q=1.0)`, `HighpassFilter(cutoff=40Hz)` |
| **Audio Ingestion** | Librosa | `librosa.load(..., sr=music_sample_rate, mono=True)` |
| **Noise Reduction** | `noisereduce` | `nr.reduce_noise(prop_decrease=0.85, stationary=False)` |
| **Soft-Pitch Correction** | PyWorld Vocoder | `dio` + `stonemask` + `medfilt(5)` + fractional retune formula with `retune_strength=0.55` |
| **Vocal FX Chain** | Spotify Pedalboard | `HighpassFilter(100Hz)`, `PeakFilter(300Hz, -3.0dB)`, `HighShelfFilter(7.5kHz, +4.5dB)`, `Compressor(-22dB, 4.0:1, 3ms attack, 100ms release)`, `Reverb(0.25 size, 0.5 damp, 0.1 wet)`, `Gain(+6.0dB)` |
| **Peak Normalization** | NumPy | Target peaks: Music = `0.35`, Vocal = `0.90` |
| **Mixbus Mastering** | Pedalboard + NumPy | Summation + `Compressor(-12dB, 2.5:1)` + `Gain(+1.5dB)` + `np.tanh` soft saturation |
| **Output Encoding** | SoundFile + Base64 | Base64-encoded WAV data URLs (`data:audio/wav;base64,...`) |

---

## ⚠️ Prototype Limitations

- **Transient Runtime**: Colab instances are ephemeral and may terminate when idle.
- **Cold Start**: Initial model download and VRAM allocation takes ~90–120 seconds.
- **Single Generation**: The prototype is optimized for short music generation sessions to respect free-tier GPU constraints.
