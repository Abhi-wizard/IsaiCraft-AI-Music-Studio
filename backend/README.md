# 🚀 IsaiCraft Local FastAPI Orchestrator (Tier 2)

The **FastAPI Orchestrator** functions as the security gateway and cognitive mediation layer for IsaiCraft. It handles user authentication, cryptographic session verification, and AI-driven vocal coaching prompt engineering via Google Gemini.

---

## 🏗️ Responsibilities

1. **Authentication & Security (MOD-01)**:
   - Intercepts incoming Bearer JWT tokens from the React frontend.
   - Cryptographically validates user sessions using the **Firebase Admin SDK**.
   - Rejects unauthenticated requests before any LLM inference or GPU processing occurs.

2. **Vocal Coaching & NLP (MOD-02)**:
   - Integrates with Google's **Gemini 2.5 Flash** model.
   - Analyzes raw lyrics (Tamil, Tanglish, or English) alongside user vibe/mood and reference song metadata.
   - Generates a structured JSON **Non-Singer's Guide** with phonetic breakdowns (`-`), breath marks (`[Breathe]`), pitch extensions (`~~~`), and word emphasis (`ALL CAPS`).

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- Python 3.10+ (Python 3.10 recommended)
- Firebase project service account JSON credentials
- Google Gemini API key

### 2. Virtual Environment Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (cmd):
.\venv\Scripts\activate.bat
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=8000
FIREBASE_CREDENTIALS_PATH=firebase-adminsdk.json
```

### 4. Configure Firebase Admin Credentials
1. Download your service account private key from the [Firebase Console](https://console.firebase.google.com/) -> **Project Settings** -> **Service accounts**.
2. Save the file as `backend/firebase-adminsdk.json` (do not commit this file to git).

### 5. Start the Server
```bash
python main.py
```
The server will start at `http://localhost:8000`. You can test the health endpoint at:
```
GET http://localhost:8000/
```

---

## 📡 API Endpoints

### `GET /`
- Health check route.
- Returns `{ "status": "online", "service": "IsaiCraft Local Orchestrator", "version": "1.0.0" }`.

### `POST /api/vocal-guide`
- **Headers**: `Authorization: Bearer <Firebase_ID_Token>`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "lyrics": "Uyiril irunthu pirinthavan",
    "reference_song": "Anbil Avan",
    "vibe": "Melancholic acoustic indie"
  }
  ```
- **Response**:
  ```json
  {
    "key": [
      {"symbol": "[Breathe]", "meaning": "Take a small, audible breath"},
      {"symbol": "~~~", "meaning": "Stretch this sound out slightly"},
      {"symbol": "ALL CAPS", "meaning": "Put more weight/pressure on this word"}
    ],
    "guide": [
      {
        "lyric": "Uyiril irunthu pirinthavan",
        "emotion": "Start like you are talking to yourself, very low volume",
        "breakdown": "Uyi-ril i-run-thu... [Breathe] pi-rin-tha-van~~~"
      }
    ]
  }
  ```
