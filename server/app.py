from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/api/home")
def hello_world():

  return jsonify({
    'messgae' : "Hello World!"
  })

if __name__ == "__main__":
  app.run(debug=True, port=8080)