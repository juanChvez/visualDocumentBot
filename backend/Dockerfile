FROM python:3.11-slim

WORKDIR /app

# Instala dependencias
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Expone el puerto
EXPOSE 5000

CMD ["python", "app.py"]
