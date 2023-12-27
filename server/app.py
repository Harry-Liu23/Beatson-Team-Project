from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/api/home", methods=["GET"])
def inital_hello_world():
  if request.method == "GET":
    return jsonify({
      'message' : "Hello World!"
    })

@app.route("/api/home", methods=["POST"])
def post_new_message():

  if request.method == "POST":
    print("post confirmed")
    print("Post recived: " + str(request.json))
    newMsg = request.json["message"]
  return jsonify({
      'message' : newMsg + " (hello from server!)"
    })
if __name__ == "__main__":
  app.run(debug=True, port=8080)