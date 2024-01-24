import sys
import os

import flask as flask
from flask import app, request
from neo4j import Driver,GraphDatabase
import server.Infrastructure.entity.study.sampleIdInfo as Sample

class sampleDao:


    def __init__(self, driver):
        self.driver = driver


    def create_sample_node(self, sample):
        sample_name = sample.sample.get_sample_name()
        sample_id = sample.sample.get_sample_ID()
        sample_group = sample.sample.get_sample_group()
        sample_project = sample.sample.get_sample_project()

        create_sample_node_query = (
            "CREATE (s:Sample {description: $description, organism: $organism, tissue: $tissue, "
            "sex: $sex, cell_line: $cell_line, mouse_model: $mouse_model, biometric_provider: $biometric_provider, "
            "sample_name: $sample_name, sample_id: $sample_id, sample_group: $sample_group, sample_project: $sample_project, accession: $accession})"
        )

        parameters = {
            'description': sample.description,
            'organism': sample.organism,
            'tissue': sample.tissue,
            'sex': sample.sex,
            'cell_line': sample.cell_line,
            'mouse_model': sample.mouse_model,
            'biometric_provider': sample.biometric_provider,
            'sample_name': sample_name,
            'sample_id': sample_id,
            'sample_group': sample_group,
            'sample_project': sample_project,
            'accession': sample.accession
        }

        with self.driver.session() as session:
            result = session.run(create_sample_node_query, parameters=parameters)
            single_result = result.single()
            return single_result[0] if single_result is not None else None
        

    def get_sample_node(self, sample_id):
        get_sample_query = (
             "MATCH (s:Sample {sample_id: $sample_id}) RETURN s"
        )

        parameters = {
            'sample_id': sample_id
        }

        with self.driver.session() as session:
            result = session.run(get_sample_query, parameters=parameters)
            sample_node = result.single()
            return sample_node['s'] if sample_node else None


    def update_sample_node(self, sample_id, updated_data):
        update_sample_query = (
            "MATCH (s:Sample {sample_id: $sample_id}) "
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
            'sample_id': sample_id,
            'description': updated_data.get('description', None),
            'organism': updated_data.get('organism', None),
            'tissue': updated_data.get('tissue', None),
            'sex': updated_data.get('sex', None),
            'cell_line': updated_data.get('cell_line', None),
            'mouse_model': updated_data.get('mouse_model', None),
            'biometric_provider': updated_data.get('biometric_provider', None)
        }

        with self.driver.session() as session:
            result = session.run(update_sample_query, parameters=parameters)
            updated_node = result.single()
            return updated_node['s'] if updated_node else None


    def delete_sample_node(self, sample_id):
        delete_sample_query = (
            "MATCH (s:Sample {sample_id: $sample_id}) "
            "DETACH DELETE s"
        )

        parameters = {
            'sample_id': sample_id
        }

        with self.driver.session() as session:
            session.run(delete_sample_query, parameters=parameters)
            return True