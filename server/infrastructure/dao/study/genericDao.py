import flask as flask
from flask import json
from process.nodeProcess import serialize_node


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

        data = json.loads(data)

        node_properties = {**data}

        query = (
            f"CREATE (n:{node_type} {{"
            + ", ".join([f"{key}: ${key}" for key in node_properties.keys()])
            + "})"
        )

        with self.driver.session() as session:
            result = session.run(query, node_properties)
            return result.single()

    def get_all_node_by_type(self, node_type):
        query  = f"MATCH (n:{node_type}) RETURN n"

        with self.driver.session() as session:
            result = session.run(query)
            records = [serialize_node(record["n"]) for record in result]
            return records

        
    def get_all_node_by_type(self, node_type):
        query  = f"MATCH (n:{node_type}) RETURN n"

        with self.driver.session() as session:
            result = session.run(query)
            records = [serialize_node(record["n"]) for record in result]
            return records

    def general_search_in_field(self, node_type, node_field, search_string):
        query = (
            f"MATCH (n:{node_type}) "
            f"WHERE toLower(n.{node_field}) CONTAINS toLower('{search_string}') "
            f"RETURN n"
        )

        with self.driver.session() as session:
            result = session.run(query)
            records = [serialize_node(record["n"]) for record in result]
            return records
        
    def general_search_all_fields(self, node_type, search_string):
        query = (
        f"MATCH (n:{node_type}) "
        f"WHERE ANY(key in keys(n) WHERE toLower(n[key]) CONTAINS toLower('{search_string}')) "
        "RETURN n"
        )

        with self.driver.session() as session:
            result = session.run(query)
            records = [serialize_node(record["n"]) for record in result]
            return records

    def general_search_all_nodes(self, search_string):
        query = (
        f"MATCH (n)"
        f"WHERE any(key in keys(n) WHERE toLower(n[key]) CONTAINS toLower('{search_string}'))"
        "RETURN n"

        )

        with self.driver.session() as session:
            result = session.run(query)
            records = [serialize_node(record["n"]) for record in result]
            return records

    def update_node(self, node_type, identifier_key, identifier_value, updated_data):
        """Dynamically update node information based on 'updated_data'."""
        # Initialize the dynamic parts of the query
        update_query = f"MATCH (s:{node_type} {{{identifier_key}: $identifier_value}}) "
        parameters = {'identifier_value': identifier_value}
        
        set_parts = []
        for key, value in updated_data.items():
            set_parts.append(f"s.{key} = ${key}")
            parameters[key] = value

        if not set_parts:
            return None

        update_query += "SET " + ", ".join(set_parts) + " RETURN s;"

        # Execute the query
        with self.driver.session() as session:
            result = session.run(update_query, parameters=parameters)
            updated_node = result.single()
            return updated_node['s'] if updated_node else None
        
    
    def relationship_builder(self, parent_node_type, child_node_type, parent_id_field, child_id_field, parent_identifier, child_identifier, relationship_type):
        relation_query = (
            f"MATCH (parent:{parent_node_type} {{{parent_id_field}: $parent_identifier}}) "
            f"MATCH (child:{child_node_type} {{{child_id_field}: $child_identifier}}) "
            f"CREATE (parent)-[:{relationship_type}]->(child)"
        )

        parameters = {
            'parent_identifier': parent_identifier,
            'child_identifier': child_identifier
        }

        with self.driver.session() as session:
            session.run(relation_query, parameters=parameters)
            return True

    def get_node(self, node_type, identifier_key, identifier_value):
        get_query = f"MATCH (s:{node_type} {{{identifier_key}: $identifier_value}}) RETURN s"
        parameters = {'identifier_value': identifier_value}

        with self.driver.session() as session:
            result = session.run(get_query, parameters=parameters)
            node = result.single()

            if node:
                return json.dumps(node.data())
            else:
                return None
            
    def delete_node(self, node_type, identifier_key, identifier_value):
        delete_query = f"MATCH (s:{node_type} {{{identifier_key}: $identifier_value}}) DETACH DELETE s"
        parameters = {'identifier_value': identifier_value}

        with self.driver.session() as session:
            session.run(delete_query, parameters=parameters)
            return True
