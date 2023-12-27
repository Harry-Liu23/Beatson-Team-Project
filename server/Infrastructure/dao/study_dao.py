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

