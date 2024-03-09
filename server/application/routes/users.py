"""Module docstring.

This script provides all the user apis
"""
from flask import request,jsonify
from . import app

@app.route("/login", methods=['POST'])
def login():
    """
    login api
    """
    print("Post Recived")
    print(request.json)
    # [TODO]
    # Create session ID with data
    # Store sessiosn ID
    # Retrun session ID to client
    return jsonify({
        'message' : 'hello'
    })
