import uuid
import json
from flask import Blueprint, request, jsonify, current_app as app
from IAs import Groq
from services import chat_service
import time
import os

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    """
    Process chat requests with AI.

    Expects:
        POST request with JSON body:
            {
                "prompt": "Your message here"
            }

    Returns:
        JSON response:
            {
                "response": "AI-generated reply"
            }
        or error message with appropriate status code.
    """
    try:
        data = request.get_json(silent=True)
        if not data or 'message' not in data or 'chat_id' not in data:
            return jsonify({"error": "missing parameters"}), 400

        message = data['message']
        required_fields = ['role', 'text', 'timestamp']
        for field in required_fields:
            if field not in message:
                return jsonify({"error": "bad format message"}), 400

        #save the new message
        history_file = f"{app.config['UPLOAD_FOLDER']}/chats/{data['chat_id']}.json"
        chat_service.save_chat(history_file, [message])

        #get new history
        exists, messages = chat_service.load_chat_history(history_file)
        if not exists:
            return jsonify({"error": "Could not recover the history"}), 400

        #new response
        llm_input = [
            {
                "role": m["role"],
                "content": m.get("text") or m.get("content")
            }
            for m in messages
        ]
        llm_response = Groq.ask_chat(llm_input)

        assistant_message = {
            "role": "assistant",
            "text": llm_response,
            "timestamp": time.time()
        }

        chat_service.save_chat(history_file, [assistant_message])

        return jsonify({"response": assistant_message}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/create-chat', methods=['POST'])
def create_chat():
    """Create a new chat session and return a unique chat ID.

    Expects a POST request with a JSON body containing a list of files and their extracted context.
    Example request body:
        {
            "files": [
                {"id": "file1", "name": "image1.png", "context": "Extracted text..."},
                ...
            ]
        }
    Returns:
        JSON response with a unique chat_id.
    """
    try:
        files_json = json.dumps(request.json.get('files', []), ensure_ascii=False)
        initial_history = [
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant that acts as a file reader. "
                    "The user has uploaded the following files with extracted context: "
                    f"{files_json}. "
                    "Use this information to answer questions or provide assistance "
                    "related to the content of these files."
                ),
                "timestamp": f"{time.time()}"
            }
        ]

        # save using save_chat
        new_uuid = str(uuid.uuid4())
        chat_dir = app.config['UPLOAD_FOLDER'] + '/chats/'
        os.makedirs(chat_dir, exist_ok=True)
        history_file = os.path.join(chat_dir, f"{new_uuid}.json")
        chat_service.save_chat(history_file, initial_history)

        return jsonify({"chat_id": new_uuid}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route("/chat/<chat_id>", methods=['GET'])
def get_chat(chat_id):
    """
    Retrieve the chat history for a given chat ID.

    Args:
        chat_id (str): The unique identifier for the chat session.

    Returns:
        JSON response containing:
            - exists (bool): Whether the chat history file exists.
            - history (list): The list of chat messages (excluding the system context).
    """
    
    #get history
    history_file = f"{app.config['UPLOAD_FOLDER']}/chats/{chat_id}.json"
    exists, messages = chat_service.load_chat_history(history_file, False)

    return jsonify({"exists": exists, "history": messages})
