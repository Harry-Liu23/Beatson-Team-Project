import sys
import os
import unittest
from application import app

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


class TestExperiment(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_create_experiment_node(self):
        data = {
            "experiment": {
                "experiment_id": "101",
                "description": "experiment_description",
                "accession": "access"
            }
        }
        response = self.app.post('/create_experiment', json=data)
        self.assertEqual(response.status_code, 200)

    def test_update_experiment(self):
        experiment_id = "101"
        update_data = {
            'description': 'Not Updated Description'
            # Add other attributes to update if required
        }
        response = self.app.put(f'/update_experiment/{experiment_id}', json=update_data)
        self.assertEqual(response.status_code, 200)

    def test_get_experiment(self):
        experiment_id = "101"
        response = self.app.get(f'/get_experiment/{experiment_id}')
        self.assertEqual(response.status_code, 200)

    def test_get_all_experiment(self):
        accession = "access"
        response = self.app.get(f'/get_all_experiments/{accession}')
        self.assertEqual(response.status_code, 200)

    def test_count_experiments(self):
        accession = 'access'
        response = self.app.get(f'/count_experiments/{accession}')
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
