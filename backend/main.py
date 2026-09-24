import os
import json
import re
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import uvicorn

import firebase_admin
from firebase_admin import credentials, auth

load_dotenv()

# Initialize Firebase Admin SDK
FIREBASE_CRED_PATH = os.environ.get("FIREBASE_CREDENTIALS_PATH", "firebase-adminsdk.json")
try:
    if os.path.exists(FIREBASE_CRED_PATH):
        cred = credentials.Certificate(FIREBASE_CRED_PATH)
        firebase_admin.initialize_app(cred)
        print(f"Firebase Admin SDK initialized successfully from '{FIREBASE_CRED_PATH}'.")
    else:
        print(f"Warning: Firebase Admin credentials not found at '{FIREBASE_CRED_PATH}'.")
        print("Please place 'firebase-adminsdk.json' in backend directory or set FIREBASE_CREDENTIALS_PATH.")
except Exception as e:
    print(f"Warning: Firebase Admin SDK initialization error: {e}")

app = FastAPI(title="IsaiCraft Orchestration Layer", version="1.0.0")

# Include CORS middleware so the React frontend on localhost:5173 can communicate with it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini SDK with updated gemini-2.5-flash model and strict JSON output
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY environment variable not set. Set it in backend/.env")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

@app.get("/")
async def health_check():
    return {
        "status": "online",
        "service": "IsaiCraft Local Orchestrator",
        "version": "1.0.0"
    }

class VocalGuideRequest(BaseModel):
    lyrics: str
    reference_song: str = "None"
    vibe: str = "None"

async def verify_firebase_token(authorization: str = Header(None)):
    """
    Firebase Authentication handler.
    Checks for a Bearer token and verifies it using the Firebase Admin SDK.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: No bearer token provided")
    
    token = authorization.split("Bearer ")[1]
    try:
        # Verify the ID token sent from the client
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.post("/api/vocal-guide")
async def vocal_guide(request: VocalGuideRequest, user_token: dict = Depends(verify_firebase_token)):
    if not request.lyrics:
        raise HTTPException(status_code=400, detail="Lyrics are required")

    prompt = f"""Act as an empathetic, expert vocal director coaching a complete beginner who has zero singing knowledge. 

Analyze these lyrics: "{request.lyrics}"
Reference track: "{request.reference_song}"
Vibe/Mood: "{request.vibe}"

CRITICAL: These lyrics may be in Tamil, Tanglish, or English. You must provide a "Non-Singer's Guide" that breaks down exactly how to speak-sing these lines phonetically.

Use this strict notation for the vocal breakdown:
- Hyphens (-) to separate syllables for easy reading.
- [Breathe] to indicate where to take a small, audible breath.
- Tildes (~~~) to indicate stretching a sound out slightly.
- ALL CAPS to indicate putting weight/pressure on a word.

You MUST respond STRICTLY in JSON format using this exact schema:
{{
  "key": [
    {{"symbol": "[Breathe]", "meaning": "Take a small, audible breath (adds emotion)"}},
    {{"symbol": "~~~", "meaning": "Stretch this sound out slightly"}},
    {{"symbol": "ALL CAPS", "meaning": "Put more weight/pressure on this word"}}
  ],
  "guide": [
    {{
      "lyric": "The original line of lyric",
      "emotion": "Director cue (e.g., Start like you are talking to yourself, very low volume)",
      "breakdown": "Phonetic spelling using the symbols (e.g., Uyi-ril i-run-thu... [Breathe] pi-rin-tha-van~~~)"
    }}
  ]
}}"""

    try:
        result = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        text = result.text
        
        # Clean and parse the response
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Fallback for cases where the model might still return markdown blocks
            json_match = re.search(r'\{[\s\S]*\}', text)
            if json_match:
                return json.loads(json_match.group(0))
            else:
                raise ValueError("Invalid output format from AI")
                
    except Exception as e:
        print(f"Gemini Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
