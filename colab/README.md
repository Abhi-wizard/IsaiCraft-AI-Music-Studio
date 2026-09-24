# ☁️ IsaiCraft Remote GPU Engine (Tier 3)

This directory contains the **Google Colab GPU Processing Engine** notebook for **IsaiCraft**.

## 📖 Overview

IsaiCraft uses a distributed 3-tier architecture. While lightweight orchestration and prompt engineering occur on the local FastAPI backend, the computationally intensive **Generative AI (Meta MusicGen)** and **DSP (PyWorld, Pedalboard)** pipelines execute on cloud-hosted NVIDIA CUDA GPUs via Google Colab.

```
[Local React Client] 
        │
        │ HTTP (FormData with .wav audio blob)
        ▼
[PyNgrok Secure Tunnel]
        │
        ▼
[Google Colab T4 GPU Engine]
  ├── Meta MusicGen-Small (Transformer-based instrumental synthesis)
  ├── noisereduce (Spectral acoustic cleansing)
  ├── PyWorld Vocoder (DIO/Stonemask F0 extraction + fractional 0.55 retuning)
  ├── Spotify Pedalboard (Vocal & instrumental FX chains)
  └── Dynamic Mixbus (Peak normalization + np.tanh soft-limiting)
        │
        ▼ (Base64 JSON stems)
[React Stems Visualizer & Player]
```

---

## 🚀 How to Run in Google Colab

1. **Upload Notebook**:
   - Open [Google Colab](https://colab.research.google.com/).
   - Click **File -> Upload notebook** and select [`IsaiCraft_GPU_Engine.ipynb`](./IsaiCraft_GPU_Engine.ipynb).

2. **Select GPU Hardware Accelerator**:
   - Click **Runtime -> Change runtime type**.
   - Set **Hardware accelerator** to **T4 GPU**.
   - Click **Save**.

3. **Configure ngrok Auth Token**:
   - Get a free ngrok token at [dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken).
   - In Colab, you can store it under **Secrets** (key icon on left sidebar) with the name `NGROK_AUTHTOKEN`, or type it into the interactive prompt when prompted in Cell 6.

4. **Run All Cells**:
   - Click **Runtime -> Run all** (`Ctrl + F9`).
   - Cell 2 installs required libraries (`transformers`, `pyworld`, `pedalboard`, etc.).
   - Cell 3 downloads and caches `facebook/musicgen-small` in GPU VRAM.
   - Cell 6 starts the FastAPI server and opens the ngrok tunnel.

5. **Connect Frontend**:
   - Copy the generated public ngrok URL (e.g. `https://xxxx-xx-xx.ngrok-free.dev`).
   - In your local `frontend/.env`, set:
     ```env
     VITE_GPU_ENGINE_URL=https://xxxx-xx-xx.ngrok-free.dev
     ```
   - Restart or refresh your local React development server.

---

## 📦 Installed Packages in Colab
- `transformers` & `accelerate` (Hugging Face model inference)
- `torch` & `torchaudio` (PyTorch with CUDA acceleration)
- `pyworld` (High-accuracy vocoder for pitch extraction & manipulation)
- `pedalboard` (Spotify's professional audio effects engine)
- `noisereduce` (Stationary and non-stationary spectral noise reduction)
- `librosa` & `soundfile` (Audio resampling and encoding)
- `fastapi`, `uvicorn`, `nest-asyncio` (REST API microservice)
- `pyngrok` (Secure public tunneling)
