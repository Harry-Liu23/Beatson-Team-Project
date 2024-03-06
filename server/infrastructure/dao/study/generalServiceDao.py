import flask as flask
from flask import json
from process.nodeProcess import serialize_node


class generalServiceDao:

    def __init__(self, driver):
        self.driver = driver

    def update_node(self, node_type, identifier_key, identifier_value, updated_data):
        """Dynamically update node information based on 'updated_data'."""
        # Initialize the dynamic parts of the query
        update_query = f"MATCH (s:{node_type} {{{identifier_key}: $identifier_value}}) "
        parameters = {'identifier_value': identifier_value}
        
        # Dynamically build the SET part of the query
        set_parts = []
        for key, value in updated_data.items():
            # For each item in updated_data, add a line to set the property
            set_parts.append(f"s.{key} = ${key}")
            parameters[key] = value

        # If there are no properties to update, return None or handle as desired
        if not set_parts:
            return None

        # Complete the query by joining all SET parts and adding a RETURN statement
        update_query += "SET " + ", ".join(set_parts) + " RETURN s;"

        # Execute the query
        with self.driver.session() as session:
            result = session.run(update_query, parameters=parameters)
            updated_node = result.single()
            return updated_node['s'] if updated_node else None
        
    
    def relationship_builder(self, parent_node_type, child_node_type, parent_id_field, child_id_field, parent_identifier, child_identifier, relationship_type):
        # Construct the relationship creation query
        relation_query = (
            f"MATCH (parent:{parent_node_type} {{{parent_id_field}: $parent_identifier}}) "
            f"MATCH (child:{child_node_type} {{{child_id_field}: $child_identifier}}) "
            f"CREATE (parent)-[:{relationship_type}]->(child)"
        )

        parameters = {
            'parent_identifier': parent_identifier,
            'child_identifier': child_identifier
        }

        # Execute the relationship creation query
        with self.driver.session() as session:
            session.run(relation_query, parameters=parameters)
            return True

    def get_node(self, node_type, identifier_key, identifier_value):
        # Construct the MATCH clause dynamically based on input parameters
        get_query = f"MATCH (s:{node_type} {{{identifier_key}: $identifier_value}}) RETURN s"
        parameters = {'identifier_value': identifier_value}

        # Execute the query
        with self.driver.session() as session:
            result = session.run(get_query, parameters=parameters)
            node = result.single()

            if node:
                return json.dumps(node.data())  # or simply return node.data() depending on your needs
            else:
                return None
            
    def delete_node(self, node_type, identifier_key, identifier_value):
        # Dynamically construct the MATCH clause for deletion based on input parameters
        delete_query = f"MATCH (s:{node_type} {{{identifier_key}: $identifier_value}}) DETACH DELETE s"
        parameters = {'identifier_value': identifier_value}

        # Execute the deletion query
        with self.driver.session() as session:
            session.run(delete_query, parameters=parameters)
            return True


