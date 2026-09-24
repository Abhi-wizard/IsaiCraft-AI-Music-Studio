# 🚀 IsaiCraft Complete Setup & Deployment Guide

This guide walks you through setting up the entire distributed three-tier IsaiCraft ecosystem locally and on Google Colab.

---

## 📋 System Prerequisites

| Component | Prerequisite | Recommended Version |
|---|---|---|
| Frontend | Node.js & npm | Node.js v18+ |
| Backend Orchestrator | Python | Python 3.10+ |
| Remote GPU Engine | Google Colab | Free T4 GPU Runtime |
| Authentication | Firebase Console | Firebase Web & Admin SDK |
| LLM Service | Google AI Studio | Gemini API Key |
| Reverse Proxy | ngrok Account | Free Auth Token |

---

## 1. Remote GPU Engine Setup (Google Colab)

1. Open [Google Colab](https://colab.research.google.com/).
2. Upload the notebook located at `colab/IsaiCraft_GPU_Engine.ipynb`.
3. Set the runtime accelerator:
   - **Runtime -> Change runtime type -> T4 GPU**.
4. In Google Colab Secrets (or via the interactive cell prompt), provide your `NGROK_AUTHTOKEN`.
5. Run all cells (`Ctrl + F9`).
6. Note the generated public ngrok URL (e.g. `https://xxxx-xx-xx.ngrok-free.dev`).

---

## 2. Local FastAPI Backend Orchestrator Setup

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   PORT=8000
   FIREBASE_CREDENTIALS_PATH=firebase-adminsdk.json
   ```
5. Place your `firebase-adminsdk.json` in the `backend/` directory.
6. Launch the orchestrator:
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
3. Configure frontend environment variables:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_GPU_ENGINE_URL` to your Colab ngrok URL from Step 1:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_GPU_ENGINE_URL=https://your-colab-url.ngrok-free.dev
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## 4. Verification Checklist

- [ ] Firebase Authentication logs in successfully on the frontend.
- [ ] Vocal Guide generation calls `http://localhost:8000/api/vocal-guide` and renders the teleprompter.
- [ ] Microphone records audio and allows preview in the vocal booth.
- [ ] Submission sends payload to Colab GPU engine, synthesizes MusicGen beat, corrects vocal pitch with PyWorld, and plays back the 3 stems on the Results Page.
