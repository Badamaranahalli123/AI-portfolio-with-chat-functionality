from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

class ChatRequest(BaseModel):
    message: str

RESUME_CONTEXT = """
Name: Your Name
Skills: React, Python, AI, Machine Learning
Experience: Built AI-powered applications.
Education: BSc Computer Science
"""

@app.post("/chat")
def chat(request: ChatRequest):
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "openrouter/auto",
            "messages": [
                {"role": "system", "content": f"You are a portfolio assistant. Use this resume:\n{RESUME_CONTEXT}"},
                {"role": "user", "content": request.message}
            ]
        }
    )

    data = response.json()

    return {
        "reply": data["choices"][0]["message"]["content"]
    }