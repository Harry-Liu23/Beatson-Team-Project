"""Module docstring.

This is the search unit test class.
"""

import sys
import os
import unittest
from application import app

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


class TestAllSearches(unittest.TestCase):
    """Test case class for all search operations."""

    def setUp(self):
        """Set up test environment."""
        self.app = app.test_client()

    def tearDown(self):
        """Tear down test environment."""
        pass

    def test_search_in_field(self):
        """Test searching in a specific field."""
        search_string = "Tissue Y"
        node_type = "Sample"
        search_field = "tissue"
        response = self.app.get(f'/search_in_field/{node_type}/{search_field}/{search_string}')
        self.assertEqual(response.status_code, 200)

    def test_search_all_fields(self):
        """Test searching in all fields."""
        search_string = "Tissue Y"
        node_type = "Sample"
        response = self.app.get(f'/search_all_fields/{node_type}/{search_string}')
        self.assertEqual(response.status_code, 200)

    def test_search_all_nodes(self):
        """Test searching in all nodes."""
        search_string = "Tissue Y"
        response = self.app.get(f'/search_all_nodes/{search_string}')
        self.assertEqual(response.status_code, 200)

    def test_get_parent_node(self):
        """Test retrieval of parent node."""
        child_node_type = "Dataset"
        child_identifier_value = "101223"
        response = self.app.get(f'/get_parent_node/{child_node_type}/{child_identifier_value}')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
