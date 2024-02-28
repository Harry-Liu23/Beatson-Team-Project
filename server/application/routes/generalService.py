from . import app,generic_dao
from flask import json, request, jsonify

@app.route('/search_in_field/<node_type>/<node_field>/<search_string>', methods=['GET'])
def search_in_field(node_type, node_field, search_string):
    response = generic_dao.general_search_in_field(node_field=node_field,node_type=node_type,search_string=search_string)
    return jsonify(response), 200

@app.route('/search_all_fields/<node_type>/<search_string>', methods=['GET'])
def search_all_fields(node_type,search_string):
    response = generic_dao.general_search_all_fields(node_type=node_type,search_string=search_string)
    return jsonify(response),200

@app.route('/search_all_nodes/<search_string>',methods=['GET'])
def search_all_nodes(search_string):
    response = generic_dao.general_search_all_nodes(search_string=search_string)
    return jsonify(response), 200

@app.route('/create_node/<node_type>',methods = ['POST'])
def create_node(node_type):
    # Ensure the request is JSON
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    # Convert the incoming JSON data to a string, if necessary
    data_json = json.dumps(data) if not isinstance(data, str) else data

    # Call the DAO method to create a node with the given type and data
    try:
        create_result = generic_dao.create_node(node_type=node_type, data=data_json)
        if create_result:
            # Assuming create_result contains the ID or some identifier of the created node
            return jsonify({"message": f"Node of type '{node_type}' created successfully.", "id": create_result}), 201
        else:
            return jsonify({"error": "Failed to create node."}), 500
    except Exception as e:
        # Log the exception, if logging is set up
        return jsonify({"error": "An error occurred while creating the node."}), 500
    
@app.route('/create_relation/<parent_node_type>/<child_node_type>/<parent_identifier>/<child_identifier>/<relationship_type>', methods = ['POST'])
def create_relation(parent_node_type, child_node_type, parent_identifier, child_identifier, relationship_type):
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    # Extract relationship type and properties from the request
    relationship_type = data.get('relationship_type')
    properties = data.get('properties', {})

    # Validate required fields
    if not relationship_type:
        return jsonify({"error": "Missing required field: relationship_type"}), 400

    # Convert properties to a JSON string if necessary
    properties_json = json.dumps(properties) if not isinstance(properties, str) else properties

    try:
        # Call the method to create a relationship
        create_result = generic_dao.relationship_builder(parent_node_type=parent_node_type,
                                                         child_node_type=child_node_type,
                                                         parent_identifier=parent_identifier,
                                                         child_identifier=child_identifier,
                                                         relationship_type=relationship_type)
        if create_result:
            return jsonify({"message": "Relationship created successfully."}), 201
        else:
            return jsonify({"error": "Failed to create relationship."}), 500
    except Exception as e:
        # Log the exception if logging is setup
        return jsonify({"error": "An error occurred while creating the relationship."}), 500
    
@app.route('/get_parent_node/<child_node_type>/<child_identifier_value>',methods=['GET'])
def get_parent_node(child_node_type, child_identifier_value):
    parent_node_type = "";
    parent_identifier_key = "";
    match child_node_type:
        case "Sample":
            parent_node_type = "Experiment"
            parent_identifier_key = "experiment_id"
        case "Dataset":
            parent_node_type = "Sample"
            parent_identifier_key = "sample_id"
        case "Experiment":
            parent_node_type = "Study"
            parent_identifier_key = "accession"
    res_get_dataset = generic_dao.get_node(node_type=child_node_type, identifier=child_identifier_value)
    result_id = json.loads(res_get_dataset)["s"][parent_identifier_key]
    result = generic_dao.get_node(node_type=parent_node_type,identifier=result_id)
    if result:    
        return jsonify(result), 200
    return jsonify(result), 500