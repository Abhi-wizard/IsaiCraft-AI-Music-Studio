# 🚀 IsaiCraft Setup & Deployment Guide

This guide details the step-by-step instructions for running the distributed three-tier IsaiCraft ecosystem locally and on Google Colab.

---

## 📋 System Prerequisites

| Component | Prerequisite | Version |
|---|---|---|
| **Tier 1: Frontend** | Node.js & npm | Node.js v18+ |
| **Tier 2: Backend Orchestrator** | Python | Python 3.10+ |
| **Tier 3: Remote GPU Engine** | Google Colab | Free or Pro T4 GPU |
| **Authentication** | Firebase Console | Web App & Admin SDK |
| **LLM Vocal Coaching** | Google AI Studio | Gemini API Key |
| **Tunneling** | ngrok Account | Free Auth Token |

---

## 1. Remote GPU Engine Setup (Google Colab)

1. Open [Google Colab](https://colab.research.google.com/).
2. Upload the notebook located at `colab/IsaiCraft_GPU_Engine.ipynb`.
3. Set the hardware accelerator:
   - Click **Runtime -> Change runtime type -> T4 GPU**.
4. Configure your ngrok Auth Token:
   - In Colab, click the **Secrets** icon (key symbol on the left toolbar).
   - Add a secret with Name: `NGROK_AUTHTOKEN` and Value: your ngrok token (from [dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken)).
5. Run all cells (`Ctrl + F9`):
   - Cell 1: Installs required dependencies.
   - Cell 4: Loads and caches `facebook/musicgen-small` in GPU VRAM.
   - Cell 7: Starts the FastAPI microservice and exposes the public ngrok tunnel.
6. Copy the generated public ngrok URL (e.g. `https://xxxx-xx-xx.ngrok-free.dev`).

---

## 2. Local FastAPI Backend Orchestrator Setup

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Set your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=8000
   FIREBASE_CREDENTIALS_PATH=firebase-adminsdk.json
   ```
5. Place your `firebase-adminsdk.json` in the `backend/` directory.
6. Start the orchestrator:
   ```bash
   python main.py
   ```
   The backend will run on `http://localhost:8000`.

---

## 3. Frontend Web Studio Setup

1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_GPU_ENGINE_URL` to your Colab ngrok URL from Step 1:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_GPU_ENGINE_URL=https://xxxx-xx-xx.ngrok-free.dev
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## ⚠️ Prototype Usage Notes

- **Transient Sessions**: If Google Colab disconnects or times out, re-run the notebook and update `VITE_GPU_ENGINE_URL` in `frontend/.env`.
- **Inference Time**: Generating a new instrumental backing track and processing vocal DSP typically takes 60–90 seconds on a T4 GPU.
