# TODO Does this file need to exist? if so why are we using it?
from neo4j import GraphDatabase, basic_auth

DATABASE_USERNAME = "neo4j"
DATABASE_PASSWORD = "12345678"
DATABASE_URI = "bolt://localhost:7687"

driver = GraphDatabase.driver(DATABASE_URI, auth=(DATABASE_USERNAME,DATABASE_PASSWORD))

session = driver.session()

