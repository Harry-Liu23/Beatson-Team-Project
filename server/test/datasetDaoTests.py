import sys
import os
import unittest
from application import app

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


class TestDataset(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_create_dataset_node(self):
        data = {
            "dataset": {
                "dataset_id": "101223",
                "sample_id": "123",
                "location_url": "C:/Someguy/BigScience/FavDataset",
                "information_datatype": "MRI-PET",
                "dataset_type": "Genomics"
            }
        }
        response = self.app.post('/create_dataset', json=data)
        self.assertEqual(response.status_code, 200)

    def test_get_dataset(self):
        dataset_id = "101223"
        response = self.app.get(f'/get_dataset/{dataset_id}')
        self.assertEqual(response.status_code, 200)

    def test_update(self):
        dataset_id = "101223"
        update_data = {
            "location_url": "E:/Steam/Steamapps/Common/TeamFortress2/tf/custom",
            "dataset_type": "TeamFortress 2 Custom HUD"
        }
        response = self.app.put(f"/update_dataset/{dataset_id}", json=update_data)
        self.assertEqual(response.status_code, 200)

    def test_get_sample(self):
        dataset_id = "101223"
        response = self.app.get(f'/get_sample_from_dataset/{dataset_id}')
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
