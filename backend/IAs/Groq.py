#https://console.groq.com/home
from flask import jsonify
import json
import requests
import re
from flask import current_app as app


def ask(prompt):
    """Send a prompt to Groq AI API and return the response."""
    headers = {
        "Authorization": f"Bearer {app.config['GROQ_API_KEY']}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": app.config['GROQ_MODEL'],
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

def ask_chat(messages):
    """
    Envía un historial de chat a Groq y devuelve solo el texto de respuesta.
    
    messages: lista de dicts con formato:
        [
            {"role": "system", "content": "instrucción inicial"},
            {"role": "user", "content": "pregunta..."},
            ...
        ]
    """
    headers = {
        "Authorization": f"Bearer {app.config['GROQ_API_KEY']}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": app.config['GROQ_MODEL'],
        "messages": messages
    }

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=payload
    )

    if response.status_code != 200:
        raise Exception(f"Groq API error: {response.text}")

    data = response.json()
    answer = data['choices'][0]['message']['content']

    # Limpieza opcional si el modelo devuelve bloques de código
    answer = re.sub(r"^```(?:json)?\s*", "", answer.strip())
    answer = re.sub(r"\s*```$", "", answer.strip())

    return answer
