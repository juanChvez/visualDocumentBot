from flask import Blueprint, request, jsonify, current_app as app
from IAs import Groq, EasyOCR
from utils.file_ops import save_uploaded_file, delete_uploaded_file

files_bp = Blueprint('files', __name__)

@files_bp.route('/detect-text', methods=['POST'])
def detect_text():
    """
    Process image uploads and perform OCR with AI reconstruction.

    Expects:
        - POST request with multipart/form-data containing:
            - 'image': the image file to process
            - 'id': a unique identifier for the file
            - 'name': the original filename

    Returns:
        - 200 OK with JSON:
            {
                "response": {
                    "content": "reconstructed and cleaned content",
                    "valid": true
                }
            }
        - 400 Bad Request with JSON error if input is invalid or OCR fails
        - 500 Internal Server Error with JSON error on exception
    """
    try:
        if "image" not in request.files:
            return jsonify({"error": "You should send an image"}), 400

        file = request.files["image"]
        photo_id = request.form["id"]
        name = request.form["name"]
        new_filename = f"temp__{photo_id}__{name}"
        path_temp = app.config['UPLOAD_FOLDER'] + '/temp'
        temp_file_path = save_uploaded_file(file, path_temp, new_filename)

        text = EasyOCR.ocr_text(temp_file_path)
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

        if len(content) == 0 or not valid:
            delete_uploaded_file(temp_file_path)
            return jsonify({
                "response": result, 
                "error": "Invalid OCR result: content is empty or and not valid, try other image"
            }), 400

        return jsonify({"response": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
