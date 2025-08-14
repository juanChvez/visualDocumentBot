import requests
import base64
import os
import re
from flask import jsonify, current_app as app

def ocr_text(file_path):
    """
    Extract text from an image using the OCR.space API.

    :param file_path: Path to the image file to be processed.
    :return: JSON response from the OCR.space API.
    """
    #encode file
    with open(file_path, "rb") as file:
        file_base64 = base64.b64encode(file.read()).decode('utf-8')

    #detect extension
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.pdf':
        content_type = 'application/pdf'
    elif ext in ['.jpg', '.jpeg']:
        content_type = 'image/jpeg'
    elif ext == '.png':
        content_type = 'image/png'
    else:
        content_type = 'image/png'

    payload = {
        'apikey': app.config['OCR_SPACE_API_KEY'],
        'base64Image': f'data:{content_type};base64,{file_base64}',
    }

    #made request
    response = requests.post(app.config['OCR_SPACE_API_URL'], data=payload)
    data = response.json()

    answer = data['ParsedResults'][0]['ParsedText']

    return clean_text(answer)

def clean_text(text):
    """Clean and format extracted OCR text."""
    text = text.replace('\n', ' ')  # Remove line breaks
    text = re.sub(r'[^A-Za-z0-9 ,.:=-]', '', text)  # Only letters, numbers and basic signs
    text = re.sub(r'\s+', ' ', text)  # Remove multiple spaces

    return text.strip()
