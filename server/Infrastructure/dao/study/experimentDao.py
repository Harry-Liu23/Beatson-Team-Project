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
            "MATCH (s:experiment {accession: $accession}) "
            "SET s.description = $description, "
            "s.organism = $organism, "
            "s.experiment_type = $experiment_type, "
            "s.publication = $publication, "
            "s.num_experiments = $num_experiments "
            "RETURN s"
        )

        parameters = {
            'accession' : accession,
            'description': updated_data.get('description', None),
            'organism': updated_data.get('organism', None),
            'experiment_type': updated_data.get('experiment_type',None),
            'publication':updated_data.get('publication',None),
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


    def create_sample_experiment_relationship(self, sample_id, accession):
        relation_query = (
            "MATCH (experiment:experiment {accession:$accession})"
            "MATCH (sample:Sample {sample_id:$sample_id})"
            "CREATE (experiment)-[:CONTAINS]->(sample)"
            )
        parameters = {
            "accession" :accession,
            "sample_id" :sample_id
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


    def get_all_sample(self, accession):
        get_all_query = (
            "MATCH (experiment:experiment {accession: $accession})-[*1]-(sample:Sample) "
            "RETURN sample"
        )
        parameters = {
            "accession": accession
        }
        with self.driver.session() as session:
            result = session.run(get_all_query, parameters=parameters)
            records = [self.serialize_node(record["sample"]) for record in result]
            return records


    def delete_experiment_node(self, accession):
        delete_experiment_query = (
            "MATCH (s:experiment {accession: $accession}) "
            "DETACH DELETE s"
        )

        parameters = {
            'accession': accession
        }

        with self.driver.session() as session:
            session.run(delete_experiment_query, parameters=parameters)
            return True  