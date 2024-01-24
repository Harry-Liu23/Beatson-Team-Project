import flask as flask
from flask import app, request
from server.Infrastructure.entity.study.experiment import experiment

class experimentDao:


    def __init__(self, driver):
        self.driver = driver


    def create_experiment_node(self,experiment):
        
        create_experiment_node_query = (
            "CREATE (s:Experiment{experiment_id: $experiment_id,"
            "description:$description, num_samples:$num_samples})"
        )

        parameters = {
            'experiment_id':experiment.experiment_id,
            'description':experiment.description,
            'num_experiments':experiment.num_experiments
        }

        with self.driver.session() as session:
            result = session.run(create_experiment_node_query, parameters=parameters)
            return result.single()


    def get_experiment_node(self, experiment_id):
        get_experiment_query = (
             "MATCH (s:Experiment {experiment_id: $experiment}) RETURN s"
        )

        parameters = {
            'experiment_id': experiment_id
        }

        with self.driver.session() as session:
            result = session.run(get_experiment_query, parameters=parameters)
            experiment_node = result.single()
            if experiment_node:
                return experiment_node['s']
            else:
                return None


    def update_experiment_node(self, accession, updated_data):
        update_experiment_query = (
            "MATCH (s:Experiment {experiment_id: $experiment_id}) "
            "s.description = $description, "
            "s.num_experiments = $num_experiments "
            "RETURN s"
        )

        parameters = {
            'description': updated_data.get('description', None),
            'num_experiments':updated_data.get('num_experiments',None)
        }

        with self.driver.session() as session:
            result = session.run(update_experiment_query, parameters=parameters)
            updated_node = result.single()
            if updated_node:
                session.close()
                return updated_node['s']
            else:
                session.close()
                return None


    def create_experiment_study_relationship(self, experiment_id, accession):
        relation_query = (
            "MATCH (experiment:Experiment {experiment_id:$experiment_id})"
            "MATCH (study:Study {accession:$accession})"
            "CREATE (study)-[:CONTAINS]->(experiment)"
            )
        parameters = {
            "accession" :accession,
            "experiment_id" :experiment_id
        }
        with self.driver.session() as session:
            result = session.run(relation_query, parameters=parameters)
            single_result = result.single()
            if single_result is not None:
                return single_result[0]  # Returns a single ID as a result
            else:
                return None


    def serialize_node(self, node):
        """Serialize a Neo4j Node object to a dictionary."""
        serialized_node = {}
        for key in node.keys():
            serialized_node[key] = node[key]
        return serialized_node


    def get_all_experiment(self, accession):
        get_all_query = (
            "MATCH (study:Study {accession: $accession})-[*1]-(experiment:Experiment) "
            "RETURN experiment"
        )
        parameters = {
            "accession": accession
        }
        with self.driver.session() as session:
            result = session.run(get_all_query, parameters=parameters)
            records = [self.serialize_node(record["experiment"]) for record in result]
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