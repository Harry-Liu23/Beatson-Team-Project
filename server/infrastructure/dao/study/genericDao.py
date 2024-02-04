import flask as flask
from flask import app, request
from flask import json
import server.infrastructure.entity.study.experiment as Experiment
from server.process.nodeProcess import serialize_node


class genericDao:


    def __init__(self, driver):
        self.driver = driver


    def create_node(self, node_type, data):
        """
        Create a node in the database.

        :param node_type: Type of the node (e.g., 'Study' or 'Sample').
        :param data: A json stream includes the mandatory fields.
        :param extra: A json stream includes any additional arbitary fields types/columns user wants to add.
        :return: The result of the database operation.
        """

        # Extract properties from the data object
        data = json.loads(data)

        # Merge data and extra dictionaries
        node_properties = {**data}

        # Construct the Cypher query dynamically
        query = (
            f"CREATE (n:{node_type} {{"
            + ", ".join([f"{key}: ${key}" for key in node_properties.keys()])
            + "})"
        )

        # Execute the query
        with self.driver.session() as session:
            result = session.run(query, node_properties)
            return result.single()
        
    

    
    