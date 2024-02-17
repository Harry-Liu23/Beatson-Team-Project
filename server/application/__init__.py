from flask import Flask, Response 
from neo4j import GraphDatabase 
from server.infrastructure.dao.study import sampleDao,studyDao,experimentDao,genericDao
import os


#from application.keys import DATABASE_PASSWORD

app=Flask(__name__)

# Same thing as CORS() from flask-cors
def _add_cors(t: Response):
    t.access_control_allow_headers = "*"
    t.access_control_allow_origin = "*"
    t.access_control_allow_methods = "*"
    return t

app.after_request(_add_cors)

# REMOVE THIS BEFORE DEPLOYMENT
DATABASE_USERNAME = "neo4j"
DATABASE_URI = os.getenv("NEO4J_URL", "bolt://localhost:7687")
DATABASE_PASSWORD = "12345678"

driver = GraphDatabase.driver(DATABASE_URI, auth=(DATABASE_USERNAME,DATABASE_PASSWORD))
session = driver.session()
sample_dao = sampleDao.sampleDao(driver)
experiment_dao = experimentDao.experimentDao(driver)
study_dao = studyDao.studyDao(driver)
print(DATABASE_URI)
generic_dao = genericDao.genericDao(driver)


# For adding data processing functions
from server.process.nodeProcess import serialize_node

# Needs to exist after app and everything else being imported to routes.__init__ is defined
from . import routes


