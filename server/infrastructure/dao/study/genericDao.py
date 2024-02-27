import flask as flask
from flask import json
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
        
    def relationship_builder(self, parent_node_type, child_node_type, parent_identifier, child_identifier, relationship_type):
        # Mapping of node types to their identifier field and relationship creation query
        node_mappings = {
            'Study': {'id_field': 'accession'},
            'Experiment': {'id_field': 'experiment_id'},
            'Sample': {'id_field': 'sample_id'},
            'Dataset': {'id_field': 'dataset_id'}
        }

        # Check if the provided node types are valid
        if parent_node_type in node_mappings and child_node_type in node_mappings:
            parent_id_field = node_mappings[parent_node_type]['id_field']
            child_id_field = node_mappings[child_node_type]['id_field']

            # Construct the relationship creation query
            relation_query = (
                f"MATCH (parent:{parent_node_type} {{{parent_id_field}: '{parent_identifier}'}}) "
                f"MATCH (child:{child_node_type} {{{child_id_field}: '{child_identifier}'}}) "
                f"CREATE (parent)-[:{relationship_type}]->(child)"
            )

            parameters = {
                parent_identifier: parent_identifier,
                child_identifier: child_identifier
            }

            # Execute the relationship creation query
            with self.driver.session() as session:
                session.run(relation_query, parameters=parameters)
                return True
        else:
            # Handle invalid node types
            print(f"Invalid node type: {parent_node_type} or {child_node_type}")
            return False

        
    def update_node(self,node_type, identifier, updated_data):
        """Dynamically alter the Study information with any updated information passed under `updated_data`."""
        # Dynamically build the SET part of the query
        set_parts = []
        if node_type == 'Study':
            update_query = "MATCH (s:Study {accession: $accession}) "
            parameters = {'accession': identifier}
        elif node_type == 'Experiment':
            update_query = "MATCH (s:Experiment {experiment_id: $experiment_id}) "
            parameters = {'experiment_id': identifier}
        elif node_type == 'Sample':
            update_query = "MATCH (s:Sample {sample_id: $sample_id}) "
            parameters = {'sample_id': identifier}
        elif node_type == 'Dataset':
            update_query = "MATCH (s:Dataset {dataset_id: $dataset_id}) "
            parameters = {'dataset_id': identifier}

        for key, value in updated_data.items():
            # For each item in updated_data, add a line to set the property
            set_parts.append(f"s.{key} = ${key}")
            parameters[key] = value
        # If there are no properties to update, return None or handle as desired
        if not set_parts:
            return None

        # Complete the query by joining all SET parts and adding a RETURN statement
        update_query += "SET " + ", ".join(set_parts) + " RETURN s;"
        with self.driver.session() as session:
            result = session.run(update_query, parameters=parameters)
            updated_node = result.single()
            if updated_node:
                return updated_node['s']
            else:
                return None

    def get_node(self,node_type,identifier):
        node_mappings = {
            'Study': {'id_field': 'accession', 'match_clause': 'MATCH (s:Study {accession:$identifier}) RETURN s'},
            'Experiment': {'id_field': 'experiment_id', 'match_clause': 'MATCH (s:Experiment {experiment_id:$identifier}) RETURN s'},
            'Sample': {'id_field': 'sample_id', 'match_clause': 'MATCH (s:Sample {sample_id:$identifier}) RETURN s'},
            'Dataset': {'id_field': 'dataset_id', 'match_clause': 'MATCH (s:Dataset {dataset_id:$identifier}) RETURN s'}
        }
        if node_type in node_mappings:
            get_query = node_mappings[node_type]['match_clause']
            id_field = node_mappings[node_type]['id_field']

            parameters = {'identifier':identifier}

            with self.driver.session() as session:
                result = session.run(get_query, parameters=parameters)
                node = result.single()

                if node:
                    return json.dumps(node.data())
                else:
                    return None
        else:
            print(f"Invalid node type: {node_type}")
            return False
        
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

    def delete_node(self, node_type, identifier):
        # Mapping of node types to their identifier field and Cypher MATCH clause for deletion
        node_mappings = {
            'Study': {'id_field': 'accession', 'match_clause': 'MATCH (s:Study {accession: $identifier}) DETACH DELETE s'},
            'Experiment': {'id_field': 'experiment_id', 'match_clause': 'MATCH (s:Experiment {experiment_id: $identifier}) DETACH DELETE s'},
            'Sample': {'id_field': 'sample_id', 'match_clause': 'MATCH (s:Sample {sample_id: $identifier}) DETACH DELETE s'},
            'Dataset': {'id_field': 'dataset_id', 'match_clause' : 'MATCH (s:Dataset {dataset_id:$identifier}) DETACH DELETE s'}
        }

        # Check if the node_type is valid and get the mapping
        if node_type in node_mappings:
            delete_query = node_mappings[node_type]['match_clause']
            id_field = node_mappings[node_type]['id_field']

            parameters = {'identifier': identifier}

            # Execute the deletion query
            with self.driver.session() as session:
                session.run(delete_query, parameters=parameters)
                return True
        else:
            # Handle invalid node_type case
            print(f"Invalid node type: {node_type}")
            return False

        
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