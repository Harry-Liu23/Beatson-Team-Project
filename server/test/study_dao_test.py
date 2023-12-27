import unittest
import json
import server.server as app

class TestStudyCreation(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_create_study_node(self):
        # Define a sample payload to simulate front-end sending JSON to backend
        data = {
            "sample_data": {
                "name": "Sample Name",
                "id": "123",
                "group": "Group A",
                "project": "Project X"
            },
            "study_data": {
                "description": "Study Description",
                "organism": "Organism X",
                "tissue": "Tissue Y",
                "sex": "Male",
                "cell_line": "Cell Line Z",
                "mouse_model": "Model ABC",
                "biometric_provider": "Provider XYZ"
            }
        }

        # Simulate a POST request to the Flask endpoint
        response = self.app.post('/create_study', json=data)

        # Check if the response status code is 200 (successful)
        self.assertEqual(response.status_code, 200)

        # You can perform further assertions on the response if needed
        # For instance, checking if the response contains a specific message or data
        self.assertIn(b"Study node created", response.data)

if __name__ == '__main__':
    unittest.main()
