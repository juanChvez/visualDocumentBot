FROM python:3.11-slim

WORKDIR /app

# Install system dependencies necessary for vision and PyTorch (without tesseract)
RUN apt-get update && apt-get install -y \
    #OCR
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (includes easyocr and torch in requirements.txt)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose the port
EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0", "--reload"]