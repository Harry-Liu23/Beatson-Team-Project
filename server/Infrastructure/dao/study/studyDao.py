import flask as flask
from flask import app, request
import server.Infrastructure.entity.study.sampleIdInfo as Sample

class studyDao:


    def __init__(self, driver):
        self.driver = driver


    def create_study_node(self,study):
        """Create a sinlge Study instance in the DB"""
        create_study_node_query = (
        "CREATE (s:Study {description: $description, accession:$accession, study_type:$study_type, "
        "publication:$publication, organism:$organism, num_experiments:$num_experiments})"
    )

        parameters = {
            'description':study.description,
            'accession':study.accession,
            'study_type':study.study_type,
            'publication':study.publication,
            'organism':study.organism,
            'num_experiments':study.num_experiments
        }

        with self.driver.session() as session:
            result = session.run(create_study_node_query, parameters=parameters)
            return result.single()


    def get_study_node(self, accession):
        """Returns a single study instance by `accession`"""
        get_study_query = (
             "MATCH (s:Study {accession: $accession}) RETURN s"
        )

        parameters = {
            'accession': accession
        }

        with self.driver.session() as session:
            result = session.run(get_study_query, parameters=parameters)
            study_node = result.single()
            if study_node:
                return study_node['s']
            else:
                return None


    def update_study_node(self, accession, updated_data):
        """Alter the Study information with any updated information passed un under `updated_data`"""
        update_study_query = (
            "MATCH (s:Study {accession: $accession}) "
            "SET s.description = $description, "
            "s.organism = $organism, "
            "s.study_type = $study_type, "
            "s.publication = $publication, "
            "s.num_experiments = $num_experiments "
            "RETURN s"
        )

        parameters = {
            'accession' : accession,
            'description': updated_data.get('description', None),
            'organism': updated_data.get('organism', None),
            'study_type': updated_data.get('study_type',None),
            'publication':updated_data.get('publication',None),
            'num_experiments':updated_data.get('num_experiments',None)
        }

        with self.driver.session() as session:
            result = session.run(update_study_query, parameters=parameters)
            updated_node = result.single()
            if updated_node:
                session.close()
                return updated_node['s']
            else:
                session.close()
                return None


    def create_experiment_study_relationship(self, experiment_id, accession):
        """Attaches an Experiment to a Study"""

        relation_query = (
            "MATCH (study: Study {accession:$accession})"
            "MATCH (experiment: Experiment {experiment_id:$experiment_id})"
            "CREATE (study)-[:CONTAINS]->(experiment)"
            )
        parameters = {
            "accession" :accession,
            "experiment_id" : experiment_id
        }
        with self.driver.session() as session:
            result = session.run(relation_query, parameters=parameters)
            single_result = result.single()
            if single_result is not None:
                return single_result[0]  # Returns a single ID as a result
            return None


    def serialize_node(self, node):
        """Serialize a Neo4j Node object to a dictionary."""
        serialized_node = {}
        for key in node.keys():
            serialized_node[key] = node[key]
        return serialized_node


    def get_all_experiements(self, accession):
        """Returns all Experiments attached to a Study"""
        get_all_query = (
            "MATCH (study:Study {accession: $accession})-[*1]-(experiment: Experiment) "
            "RETURN sample"
        )
        parameters = {
            "accession": accession
        }
        with self.driver.session() as session:
            result = session.run(get_all_query, parameters=parameters)
            records = [self.serialize_node(record["experiment"]) for record in result]
            return records


    def delete_study_node(self, accession):
        """Removes/Deletes a Study from the DB"""
        delete_study_query = (
            "MATCH (s:Study {accession: $accession}) "
            "DETACH DELETE s"
        )

        parameters = {
            'accession': accession
        }

        with self.driver.session() as session:
            session.run(delete_study_query, parameters=parameters)
            return True  