import json
from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token,get_jwt_identity, JWTManager
from flask_cors import CORS
from neo4j import GraphDatabase, basic_auth

app=Flask(__name__)

# Change this on deployment
app.config['JWT_SECRET_KEY'] = "please change this on deployment"

CORS(app)
jwt = JWTManager(app)

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

@app.route("/login", methods=['POST','GET'])
def login():

    if request.method == 'GET':
        print("Login GET")
        return jsonify(msg = "get OK")
    
    if request.method == 'POST':
        print("Login POST")
        print(request.json)
        return jsonify(
            msg = "post OK",
            data = request.json)
    
    print("Unknown request recived: " + request.method)
    return jsonify(msg = 'Unknow request :(')



#return render_template("something.html")
#Above defaults to a html file in a folder called Templates, need to replace it with real file paths


if __name__=="__main__":
    app.run(port=2020,host="localhost",debug=True)