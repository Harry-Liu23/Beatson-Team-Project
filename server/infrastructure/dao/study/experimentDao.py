import flask as flask
from flask import app, request
from server.infrastructure.entity.study.experiment import experiment
from . import serialize_node


class experimentDao:

    def __init__(self, driver):
        self.driver = driver

    def create_experiment_node(self,experiment):
        create_experiment_node_query = (
            "CREATE (s:Experiment {experiment_id: $experiment_id, accession: $accession,"
            "description:$description})"
        )
        parameters = {
            'experiment_id':experiment.experiment_id,
            'description':experiment.description,
            'accession':experiment.accession
        }
        with self.driver.session() as session:
            result = session.run(create_experiment_node_query, parameters=parameters)
            return result.single()

    def get_experiment_node(self, experiment_id):
        get_experiment_query = (
            "MATCH (s:Experiment {experiment_id: $experiment_id}) RETURN s"
        )
        parameters = {
            'experiment_id': experiment_id
        }
        with self.driver.session() as session:
            result = session.run(get_experiment_query, parameters=parameters)
            experiment_node = result.single()
            if experiment_node:
                return serialize_node(node = experiment_node['s'])
            else:
                return None

    def update_experiment_node(self, experiment_id, updated_data):
        update_experiment_query = (
        "MATCH (s:Experiment {experiment_id: $experiment_id}) "
        "SET s.description = $description "
        "RETURN s;"
        )
        parameters = {
            'experiment_id': experiment_id,
            'description': updated_data.get('description', None),
        }
        with self.driver.session() as session:
            result = session.run(update_experiment_query, parameters=parameters)
            updated_node = result.single()
            if updated_node:
                return updated_node['s']
            else:
                return None

    def create_experiment_sample_relationship(self, experiment_id, sample_id):
        relation_query = (
        "MATCH (experiment:Experiment {experiment_id: $experiment_id})"
        "MATCH (sample:Sample {sample_id: $sample_id})"
        "CREATE (experiment)-[:CONTAINS]->(sample)"
        )
        parameters = {
            "experiment_id": experiment_id,
            "sample_id": sample_id
        }
        with self.driver.session() as session:
            result = session.run(relation_query, parameters=parameters)
            single_result = result.single()
            if single_result is not None:
                return single_result[0]  # Returns a single ID as a result
            else:
                return None

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

    def delete_experiment_node(self, experiment_id):
        delete_experiment_query = (
            "MATCH (s:Experiment {experiment_id: $experiment_id}) "
            "DETACH DELETE s"
        )
        parameters = {
            "experiment_id" : experiment_id
        }
        with self.driver.session() as session:
            session.run(delete_experiment_query, parameters=parameters)
            return True  