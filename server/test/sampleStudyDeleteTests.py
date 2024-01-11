import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


import unittest
import json
from server.application.main import app
class sampleStudyDeleteTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()


    def tearDown(self):
        pass


    
    def test_delete_sample(self):
        sample_id = "123"
        response = self.app.delete(f'/delete_sample/{sample_id}')
        self.assertEqual(response.status_code, 200) 



    def test_delete_study_node(self):
        study_accession = "access"
        response = self.app.delete(f'/delete_study/{study_accession}')
        self.assertEqual(response.status_code, 200) 




if __name__ == '__main__':
    unittest.main()