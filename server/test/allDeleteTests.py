import sys
import os
import unittest
from application import app

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


class TestAllDelete(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_delete_dataset_node(self):
        dataset_id = "101223"
        response = self.app.delete(f"/delete_dataset/{dataset_id}")
        self.assertEqual(response.status_code, 200)

    def test_delete_sample(self):
        sample_id = "123"
        response = self.app.delete(f'/delete_sample/{sample_id}')
        self.assertEqual(response.status_code, 200)

    def test_delete_study_node(self):
        study_accession = "access"
        response = self.app.delete(f'/delete_study/{study_accession}')
        self.assertEqual(response.status_code, 200)

    def test_delete_experiment_node(self):
        experiment_id = "101"
        response = self.app.delete(f'/delete_experiment/{experiment_id}')
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
