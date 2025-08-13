import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "/tmp/uploads")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL")