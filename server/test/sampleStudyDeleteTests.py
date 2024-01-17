import unittest
import json
from application import app

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