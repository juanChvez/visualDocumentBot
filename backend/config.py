import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configuration class for Flask application.

    Loads environment variables for:
    - File upload folder
    - Server port and debug mode
    - OCR.space API credentials
    - Groq LLM API credentials and model
    """
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "/tmp/uploads")
    PORT = int(os.environ.get('PORT', 5000))
    DEBUG_MODE = os.environ.get('DEBUG', 'False').lower() in ['true', '1', 'yes']

    #OCR
    OCR_SPACE_API_URL = os.getenv("OCR_SPACE_API_URL")
    OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY")

    #LLM
    GROQ_API_URL = os.getenv("GROQ_API_URL")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL")
