"""Module docstring.

This is the study unit test class.
"""

import sys
import os
import unittest
from application import app

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


class TestStudy(unittest.TestCase):
    """Test case class for study-related operations."""

    def setUp(self):
        """Set up test environment."""
        self.app = app.test_client()

    def tearDown(self):
        """Tear down test environment."""
        pass

    def test_create_study_node(self):
        """Test creating a study node."""
        data = {
            "study": {
                "accession": "access",
                "description": "Study Description",
                "organism": "Organism X",
                "study_type": "sofwj",
                "publication": "UoG"
            }
        }
        response = self.app.post('/create_study', json=data)
        self.assertEqual(response.status_code, 200)

    def test_get_study_node(self):
        """Test retrieving a study node."""
        study_accession = "access"
        response = self.app.get(f'/get_study/{study_accession}')
        self.assertEqual(response.status_code, 200)

    def test_update_study_node(self):
        """Test updating a study node."""
        study_accession = "access"
        update_data = {
            "study_type": "updated study",
            "description": "Updated Description",
            "organism": "Updated Organism",
            "publication": "public"
            # Add other attributes to update if required
        }
        response = self.app.put(f'/update_study/{study_accession}', json=update_data)
        self.assertEqual(response.status_code, 200)

    def test_get_all_study(self):
        """Test retrieving all study nodes."""
        response = self.app.get(f'/get_all_study')
        self.assertEqual(response.status_code, 200)

    def test_get_all_nodes(self):
        """Test retrieving all nodes of a specific type."""
        sample = "Sample"
        response = self.app.get(f'/get_all_node_by_type/{sample}')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
