#https://console.groq.com/home
from flask import jsonify
import json
import requests
import re

GROQ_API_KEY = "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"  # reemplaza con tu key
GROQ_MODEL = "llama-3.3-70b-versatile"

def ask(prompt):
    """Send a prompt to Groq AI API and return the response."""
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post("https://api.groq.com/openai/v1/chat/completions",
                             headers=headers, json=payload)
    
    if response.status_code != 200:
        return jsonify({"error": "Groq API error", "detail": json.loads(response.text)}), 500
    
    data = response.json()
    answer = data['choices'][0]['message']['content']
    answer = re.sub(r"^```(?:json)?\s*", "", answer.strip())
    answer = re.sub(r"\s*```$", "", answer.strip())
    return json.loads(answer)
