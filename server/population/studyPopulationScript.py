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
    
    def populate(self, data_dir, node_files, method):
        for f in node_files:
            file_path = os.path.join(data_dir, f)
            with open(file_path, 'r') as f:
                data = json.load(f)
                response = self.app.post(method, json=data)
                self.assertEqual(response.status_code, 200)

    def test_populate_studies(self):
        node_types = ["study", "experiment", "sample", "dataset"]
        for node_type in node_types:
            data_dir = os.path.join(current_dir, f'data/{node_type}')
            node_files = os.listdir(data_dir)
            self.populate(data_dir, node_files, f'/create_{node_type}')
        
        
if __name__ == '__main__':
    print('Starting to populate database...')
    unittest.main()
    print('Database population complete.')