import sys
import os
 
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)

import unittest
import json
from application import app

class TestExperimentCreation(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_create_experiment_node(self):
        # Define a sample payload to simulate front-end sending JSON to backend
        data = {
            "experiment_data": {
                "experiment_id": "101",
                "experiment_name": "experiment Name",
                "experiment_description": "experiment_description",
                "accession":"accession"
            }
        }
        response = self.app.post('/create_experiment', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Experiment node created", response.data)



    def test_get_experiment(self):
        experiment_id = "101" 
        response = self.app.get(f'/get_experiment/{experiment_id}')
        self.assertEqual(response.status_code, 200) 



    def test_update_experiment(self):
        experiment_id = "101"
        update_data = {
            'description': 'Updated Description'
            # Add other attributes to update if required
        }
        response = self.app.put(f'/update_experiment/{experiment_id}', json=update_data)
        self.assertEqual(response.status_code, 200) 

    def test_get_all_experiment(self):
        accession = "access"
        response = self.app.get(f'/get_all_experiment/{accession}')
        self.assertEqual(response.status_code,200)




    

    
if __name__ == '__main__':
    unittest.main()
