import easyocr
from PIL import Image
import numpy as np
import cv2
import re

reader = easyocr.Reader(['es', 'en'])  # Initialize reader only once

def ocr_text(imagen_path):
    """Extract text from image using OCR with preprocessing."""
    img = preprocces_imagen_cv(imagen_path)
    result = reader.readtext(img,
        contrast_ths=0.5,
        adjust_contrast=0.7,
        text_threshold=0.4,
        detail=0  # Text only, no boxes
    )
    text = "\n".join(result)

    return clean_text(text)

def reduce_resolution(imagen_path, max_width=1024, max_height=1024):
    """Reduce image resolution to specified dimensions."""
    img = Image.open(imagen_path).convert('RGB')
    img.thumbnail((max_width, max_height))
    return img

def preprocces_imagen_cv(imagen_path):
    """Preprocess image for OCR using OpenCV."""
    img_pil = reduce_resolution(imagen_path)
    # Convert PIL to OpenCV (numpy array BGR)
    img_cv = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)

    # Convert to grayscale
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)

    # Filter to reduce noise
    gray = cv2.medianBlur(gray, 3)

    # Adaptive threshold for binarization
    thresh = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31, 2
    )
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(thresh)
    return enhanced

def clean_text(text):
    """Clean and format extracted OCR text."""
    text = text.replace('\n', ' ')  # Remove line breaks
    text = re.sub(r'[^A-Za-z0-9 ,.:=-]', '', text)  # Only letters, numbers and basic signs
    text = re.sub(r'\s+', ' ', text)  # Remove multiple spaces

    # Replace 5 at the beginning of a long numeric word with $
    text = re.sub(r'\b5(\d{2,5})(?=[.,]?\d{0,2}\b)', r'$\1', text)

    # Replace 5 that comes after space before numbers (your previous regex)
    text = re.sub(r'(?<=\s)5(?=\d{1,5}\b)', '$', text)

    return text.strip()
