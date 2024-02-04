import flask as flask
import server.infrastructure.entity.study.sampleIdInfo as Sample
from . import serialize_node


class sampleDao:


    def __init__(self, driver):
        self.driver = driver

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
            return serialize_node(sample_node['s']) if sample_node else None

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