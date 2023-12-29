from flask import Flask, request, jsonify
from flask_cors import CORS
from neo4j import GraphDatabase, basic_auth

app=Flask(__name__)

CORS(app)

DATABASE_USERNAME = "neo4j"
DATABASE_PASSWORD = "12345678"
DATABASE_URI = "bolt://localhost:7687"

driver = GraphDatabase.driver(DATABASE_URI, auth=(DATABASE_USERNAME,DATABASE_PASSWORD))

session = driver.session()


@app.route('/')
def index():
    return jsonify(
        {
            'message' : 'Welcome to my webapp!'
        }
    )

#return render_template("something.html")
#Above defaults to a html file in a folder called Templates, need to replace it with real file paths


if __name__=="__main__":
    app.run(port=2020,host="127.0.0.1",debug=True)