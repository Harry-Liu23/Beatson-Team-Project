import sys
import os
 
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)

import unittest
import json
from application import app

class PopulateStudies(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_populate_studies(self):
        data_dir = os.path.join(current_dir, 'data')
        data_dir_files = os.listdir(data_dir)
        # keep fiiles that are studies
        studies = [f for f  in data_dir_files if "study" in f.lower()]
        for study in studies:
            file_path = os.path.join(data_dir, study)
            with open(file_path, 'r') as f:
                data = json.load(f)
                response = self.app.post('/create_study', json=data)
                self.assertEqual(response.status_code, 200)
        
if __name__ == '__main__':
    print('Starting to populate database...')
    unittest.main()
    print('Database population complete.')