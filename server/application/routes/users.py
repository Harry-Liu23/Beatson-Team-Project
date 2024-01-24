from . import app
from flask import request,jsonify

@app.route("/login", methods=['POST'])
def login():
    print("Post Recived")
    print(request.json)
    # [TODO]
    # Create session ID with data
    # Store sessiosn ID
    # Retrun session ID to client
    return jsonify({
        'message' : 'hello'
    })
