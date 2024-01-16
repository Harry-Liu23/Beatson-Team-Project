import unittest
import json
from application import app

class TestStudyCreation(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_create_sample_node(self):
        # Define a sample payload to simulate front-end sending JSON to backend
        data = {
            "sample_id_info_data": {
                "name": "Sample Name",
                "sample_id": "123",
                "group": "Group A",
                "project": "Project X"
            },
            "sample_data": {
                "description": "Sample Description",
                "organism": "Organism X",
                "tissue": "Tissue Y",
                "sex": "Male",
                "cell_line": "Cell Line Z",
                "mouse_model": "Model ABC",
                "biometric_provider": "Provider XYZ",
                "accession":"access"
            }
        }
        response = self.app.post('/create_sample', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Sample node created", response.data)



    def test_get_sample(self):
        sample_id = "123" 
        response = self.app.get(f'/get_sample/{sample_id}')
        self.assertEqual(response.status_code, 200) 



    def test_update_sample(self):
        sample_id = "123"
        update_data = {
            'description': 'Updated Description',
            'organism': 'Updated Organism'
            # Add other attributes to update if required
        }
        response = self.app.put(f'/update_sample/{sample_id}', json=update_data)
        self.assertEqual(response.status_code, 200) 

    def test_get_all_sample(self):
        study_accession = "access"
        response = self.app.get(f'/get_all_samples/{study_accession}')
        self.assertEqual(response.status_code,200)




    

    
if __name__ == '__main__':
    unittest.main()
