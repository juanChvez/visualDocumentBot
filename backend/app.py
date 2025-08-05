from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/ping')
def ping():
    return jsonify({"message": "pong"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
