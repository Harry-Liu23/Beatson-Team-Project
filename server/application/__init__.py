"""Module decoration.

This set up the packging for imports within application package
"""
import os
from flask import Flask, Response
from neo4j import GraphDatabase
from infrastructure.dao.study import sampleDao,studyDao,experimentDao,genericDao

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
DATABASE_USERNAME = "beatson-sh01"
DATABASE_URI = "bolt://localhost:7687"
DATABASE_PASSWORD = "12345678"
# DATABASE_PASSWORD = os.environ.get('DB_PASSWORD')

driver = GraphDatabase.driver(DATABASE_URI, auth=(DATABASE_USERNAME,DATABASE_PASSWORD))
session = driver.session()
sample_dao = sampleDao.sampleDao(driver)
experiment_dao = experimentDao.experimentDao(driver)
study_dao = studyDao.studyDao(driver)
generic_dao = genericDao.genericDao(driver)


# For adding data processing functions
from process.nodeProcess import serialize_node

# Needs to exist after app and everything else being imported to routes.__init__ is defined
from . import routes
