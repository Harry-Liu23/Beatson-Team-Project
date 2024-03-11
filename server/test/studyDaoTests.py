import sys
import os
import unittest
from application import app

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


class TestStudy(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_create_study_node(self):
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
        study_accession = "access"
        response = self.app.get(f'/get_study/{study_accession}')
        self.assertEqual(response.status_code, 200)

    def test_update_study_node(self):
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
        response = self.app.get(f'/get_all_study')
        self.assertEqual(response.status_code, 200)

    def test_get_all_nodes(self):
        sample = "Sample"
        response = self.app.get(f'/get_all_node_by_type/{sample}')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
