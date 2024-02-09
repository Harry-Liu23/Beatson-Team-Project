import flask as flask
from flask import app, request
from . import serialize_node


class experimentDao:

    def __init__(self, driver):
        self.driver = driver

    def count_num_samples(self, experiment_id):
        """Count the number of samples attached to an Experiment"""
        count_query = (
            "MATCH (experiment:Experiment {experiment_id: $experiment_id})-[*1]-(sample:Sample) "
            "RETURN COUNT(sample) AS num_samples"
        )
        parameters = {
            "experiment_id": experiment_id
        }
        with self.driver.session() as session:
            result = session.run(count_query, parameters=parameters)
            count_result = result.single()
            if count_result:
                return count_result['num_samples']
            else:
                return 0

    def get_all_samples(self, experiment_id):
        get_all_query = (
            "MATCH (experiment:Experiment {experiment_id: $experiment_id})-[*1]-(sample: Sample) "
            "RETURN sample"
        )
        parameters = {
            "experiment_id" : experiment_id
        }
        with self.driver.session() as session:
            result = session.run(get_all_query, parameters=parameters)
            records = [serialize_node(record["sample"]) for record in result]
            return records