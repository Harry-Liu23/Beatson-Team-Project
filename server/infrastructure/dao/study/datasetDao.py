import flask as flask
from flask import app, request
from . import serialize_node

class datasetDao:

  def __init__(self,driver):
    self.driver = driver

  def get_sample(dataset_id):
    get_sample_query = (
      "MATCH (dataset:Dataset {dataset_id:$dataset_id})-[1*]-(sample:Sample)"
      "RETURN sample"
    )

    parameters = {
      "dataset_id" : dataset_id
    }

    with self.driver.session() as session:
      result = session.run(get_sample_query, parameters=parameters)
      records = [serialize_node(record["dataset"]) for record in result]
      return records

  
