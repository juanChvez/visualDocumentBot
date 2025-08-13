from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config

from routes import chat_routes
from routes import file_routes

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

app.register_blueprint(chat_routes.chat_bp)
app.register_blueprint(file_routes.files_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
