"""Module docstring.

This is the unit test class for all deletion tests.
"""
import sys
import os
import unittest
from application import app

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


class TestAllDelete(unittest.TestCase):
    """Test case class for deletion tests."""

    def setUp(self):
        """Set up test environment."""
        self.app = app.test_client()

    def tearDown(self):
        """Tear down test environment."""
        pass

    def test_delete_dataset_node(self):
        """Test deletion of dataset node."""
        dataset_id = "101223"
        response = self.app.delete(f"/delete_dataset/{dataset_id}")
        self.assertEqual(response.status_code, 200)

    def test_delete_sample(self):
        """Test deletion of sample."""
        sample_id = "123"
        response = self.app.delete(f'/delete_sample/{sample_id}')
        self.assertEqual(response.status_code, 200)

    def test_delete_study_node(self):
        """Test deletion of study node."""
        study_accession = "access"
        response = self.app.delete(f'/delete_study/{study_accession}')
        self.assertEqual(response.status_code, 200)

    def test_delete_experiment_node(self):
        """Test deletion of experiment node."""
        experiment_id = "101"
        response = self.app.delete(f'/delete_experiment/{experiment_id}')
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
