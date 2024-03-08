import sys
import os
import unittest
from application import app

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


class TestSample(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_create_sample_node(self):
        data = {
            "sample": {
                "name": "Sample Name",
                "sample_id": "123",
                "group": "Group A",
                "project": "Project X",
                "description": "Sample Description",
                "organism": "Organism X",
                "tissue": "Tissue Y",
                "sex": "Male",
                "cell_line": "Cell Line Z",
                "mouse_model": "Model ABC",
                "biometric_provider": "Provider XYZ",
                "experiment_id": "101"
            }
        }
        response = self.app.post('/create_sample', json=data)
        self.assertEqual(response.status_code, 200)

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
        experiment_id = "101"
        response = self.app.get(f'/get_all_samples/{experiment_id}')
        self.assertEqual(response.status_code, 200)

    def test_count_samples(self):
        experiment_id = '101'
        response = self.app.get(f'/count_samples/{experiment_id}')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
