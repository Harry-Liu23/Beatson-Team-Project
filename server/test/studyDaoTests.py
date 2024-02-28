import sys
import os
 
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)

from unittest import mock
import unittest
import json
from application import app
import application.routes as routes
from server.infrastructure.dao.study import genericDao


class testStudy(unittest.TestCase):

    def setUp(self):
        self.mock_neo4j_service = mock.MagicMock(spec=genericDao)
        self.app = app
        self.app.config['NEO4J_SERVICE'] = self.mock_neo4j_service

    def tearDown(self):
        pass

    def test_create_study_node(self):
        # Define a sample payload to simulate front-end sending JSON to backend
        data = {
            "study": {
                "accession" : "access",
                "description": "Study Description",
                "organism": "Organism X",
                "study_type":"sofwj",
                "publication":"UoG"
        
            }
        }
        self.mock_neo4j_service.create_study = data

        with app.test_client() as client:
            response = client.post('/create_study', json=data)
            print(response)

        self.assertEqual(response, 200)
        self.mock_neo4j_service.create_node.assert_called_once_with(data)


    def test_get_study_node(self):
        study_accession = "access"
        response = self.app.get(f'/get_study/{study_accession}')
        print(response.get_json())
        self.assertEqual(response.status_code, 200) 
    
    def test_update_study_node(self):
        study_accession = "access"
        update_data = {
            "study_type" : "updated study",
            "description": "Updated Description",
            "organism": "Updated Organism",
            "publication": "public"
            # Add other attributes to update if required
        }
        response = self.app.put(f'/update_study/{study_accession}', json=update_data)
        self.assertEqual(response.status_code, 200) 

    def test_get_all_study(self):
        response = self.app.get(f'/get_all_study')
        self.assertEqual(response.status_code,200)

    def test_get_all_nodes(self):
        experiment = "Experiment"
        study = "Study"
        sample = "Sample"
        response = self.app.get(f'/get_all_node_by_type/{sample}')
        self.assertEqual(response.status_code,200)

if __name__ == '__main__':
    unittest.main()