import flask as flask
from flask import app, request
from neo4j import Driver,GraphDatabase
import server.Infrastructure.entity.study as study_entity
import server.Infrastructure.entity.constraint.sample as Sample

class study_dao:
    def create_study_node(self, study):
        sample_name = study.sample.get_sample_name()
        sample_id = study.sample.get_sample_ID()
        sample_group = study.sample.get_sample_group()
        sample_project = study.sample.get_sample_project()

        cypher_query = (
            "CREATE (s:Study {description: $description, organism: $organism, tissue: $tissue, "
            "sex: $sex, cell_line: $cell_line, mouse_model: $mouse_model, biometric_provider: $biometric_provider, "
            "sample_name: $sample_name, sample_id: $sample_id, sample_group: $sample_group, sample_project: $sample_project})"
        )

        parameters = {
            'description': study.description,
            'organism': study.organism,
            'tissue': study.tissue,
            'sex': study.sex,
            'cell_line': study.cell_line,
            'mouse_model': study.mouse_model,
            'biometric_provider': study.biometric_provider,
            'sample_name': sample_name,
            'sample_id': sample_id,
            'sample_group': sample_group,
            'sample_project': sample_project
        }

        with self.driver.session() as session:
            result = session.run(cypher_query, parameters=parameters)
            return result.single()[0]  # Returns a single ID as a result
        
    def get_study_node(self, study_id):
        cypher_query = (
             "MATCH (s:Study {study_id: $study_id}) RETURN s"
        )

        parameters = {
            'study_id': study_id
        }

        with self.driver.session() as session:
            result = session.run(cypher_query, parameters=parameters)
            study_node = result.single()
            if study_node:
                return study_node['s']
            else:
                return None
            
    def update_study_node(self, study_id, updated_data):
        cypher_query = (
            "MATCH (s:Study {study_id: $study_id}) "
            "SET s.description = $description, "
            "s.organism = $organism, "
            "s.tissue = $tissue, "
            "s.sex = $sex, "
            "s.cell_line = $cell_line, "
            "s.mouse_model = $mouse_model, "
            "s.biometric_provider = $biometric_provider "
            "RETURN s"
        )

        parameters = {
            'study_id': study_id,
            'description': updated_data.get('description', None),
            'organism': updated_data.get('organism', None),
            'tissue': updated_data.get('tissue', None),
            'sex': updated_data.get('sex', None),
            'cell_line': updated_data.get('cell_line', None),
            'mouse_model': updated_data.get('mouse_model', None),
            'biometric_provider': updated_data.get('biometric_provider', None)
        }

        with self.driver.session() as session:
            result = session.run(cypher_query, parameters=parameters)
            updated_node = result.single()
            if updated_node:
                return updated_node['s']
            else:
                return None
            

    def delete_study_node(self, study_id):
        cypher_query = (
            "MATCH (s:Study {study_id: $study_id}) "
            "DELETE s"
        )

        parameters = {
            'study_id': study_id
        }

        with self.driver.session() as session:
            session.run(cypher_query, parameters=parameters)
            return True  