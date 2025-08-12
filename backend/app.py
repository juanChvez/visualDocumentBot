from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from IAs import Groq, EasyOCR

app = Flask(__name__)
CORS(app)

@app.route('/ping')
def ping():
    """Health check endpoint."""
    return jsonify({"message": "pong"})

@app.route('/chat', methods=['POST'])
def chat():
    """Process chat requests with AI."""
    try:
        data = request.get_json(silent=True)
        if not data or 'prompt' not in data:
            return jsonify({"error": "missing parameters"}), 400

        prompt = data['prompt']

        return jsonify({"response": Groq.ask(prompt)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/detect-text', methods=['POST'])
def detect_text():
    """Process image uploads and perform OCR with AI reconstruction."""
    try:
        if "image" not in request.files:
            return jsonify({"error": "You should send an image"}), 400

        archivo = request.files["image"]
        ruta_temp = "/tmp/temp_img.jpg"
        archivo.save(ruta_temp)

        text = EasyOCR.ocr_text(ruta_temp)
        result = Groq.ask(f"""Reconstruct and clean the following text, correcting OCR errors,
        and return only a JSON in this format:

        {{
            "content": "reconstructed and cleaned content",
            "valid": true
        }}

        If the text cannot be reconstructed coherently,
        leave "content" empty and set "valid" to false.

        Text:\"\"\"{text}\"\"\"""")

        content, valid = result["content"], result["valid"]

        if len(content) == 0 and not valid:
            return jsonify({
                "response": result, 
                "error": "Invalid OCR result: content is empty and not valid, try other image"
            }), 400

        return jsonify({"response": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
