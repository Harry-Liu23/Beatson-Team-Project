import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


import unittest
import json
from server.server.main import app

class TestStudyCreation(unittest.TestCase):
    def setUp(self):
        # self.app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_create_study_node(self):
        # Define a sample payload to simulate front-end sending JSON to backend
        data = {
            "sample_data": {
                "name": "Sample Name",
                "id": "123",
                "group": "Group A",
                "project": "Project X"
            },
            "study_data": {
                "description": "Study Description",
                "organism": "Organism X",
                "tissue": "Tissue Y",
                "sex": "Male",
                "cell_line": "Cell Line Z",
                "mouse_model": "Model ABC",
                "biometric_provider": "Provider XYZ"
            }
        }
        response = self.app.post('/create_study', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Study node created", response.data)



    def test_get_study(self):
        study_id = "123" 
        response = self.app.get(f'/get_study/{study_id}')
        self.assertEqual(response.status_code, 200) 



    def test_update_study(self):
        study_id = "123"
        update_data = {
            'description': 'Updated Description',
            'organism': 'Updated Organism'
            # Add other attributes to update if required
        }
        response = self.app.put(f'/update_study/{study_id}', json=update_data)
        self.assertEqual(response.status_code, 200) 


    def test_delete_study(self):
        study_id = "123"
        response = self.app.delete(f'/delete_study/{study_id}')
        self.assertEqual(response.status_code, 200) 

    
if __name__ == '__main__':
    unittest.main()
