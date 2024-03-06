"""Module docstring.

This script provides APIs for things like searches, 
or any generic node creation and manipulation.
"""
from flask import json, request, jsonify
from . import app,generic_dao

@app.route('/search_in_field/<node_type>/<node_field>/<search_string>', methods=['GET'])
def search_in_field(node_type, node_field, search_string):
    """
    Search node that contains a given string,
    needs to specify the field and node type

    Args:
        node_type(str): type of node
        node_field(str): field/attribute of the node you wanna search
        search_string(str): the string you wanna search for

    Returns:
        JSON response of the node
    """
    response = generic_dao.general_search_in_field(node_field=node_field,
                                                   node_type=node_type,
                                                   search_string=search_string)
    return jsonify(response), 200

@app.route('/search_all_fields/<node_type>/<search_string>', methods=['GET'])
def search_all_fields(node_type,search_string):
    """
    Search node that contains a given string,
    needs to specify the node type

    Args:
        node_type(str): type of node
        search_string(str): the string you wanna search for

    Returns:
        JSON response of the node
    """
    response = generic_dao.general_search_all_fields(node_type=node_type,
                                                     search_string=search_string)
    return jsonify(response),200

@app.route('/search_all_nodes/<search_string>',methods=['GET'])
def search_all_nodes(search_string):
    """
    Search node that contains a given string

    Args:
        search_string(str): the string you wanna search for

    Returns:
        JSON response of the node
    """
    response = generic_dao.general_search_all_nodes(search_string=search_string)
    return jsonify(response), 200

@app.route('/create_node/<node_type>',methods = ['POST'])
def create_node(node_type):
    """
    Create node you wanna create

    Args:
        node_type(str): type of node
        search_string(str): the string you wanna search for

    Returns:
        JSON response of the node
    """
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
            return jsonify({
                "message": f"Node of type '{node_type}' created successfully.", "id": create_result
                }), 201
        return jsonify({"error": "Failed to create node."}), 500
    except Exception:
        # Log the exception, if logging is set up
        return jsonify({"error": "An error occurred while creating the node."}), 500

@app.route('/general_create_relation/<parent_node_type>/<child_node_type>/<parent_id_field>/<child_id_field>/<parent_identifier>/<child_identifier>/<relationship_type>', 
           methods=['POST'])
def create_relation(parent_node_type,
                    child_node_type,
                    parent_id_field,
                    child_id_field,
                    parent_identifier,
                    child_identifier,
                    relationship_type):
    """
    Give two nodes and relate them

    Args:
        parent_node_type: The node type of the parent node
        child_node_type: The node type of the child node
        parent_id_field: The field name of the identifier for the parent node
        child_id_field: The field name of the identifier for the child node
        parent_identifier: The value of the id of the parent node. 
            E.g., If the parent node is Study, then this is the value of its accession (e.g., '291access')
        child_identifier: The value of the id of the child node
        relationship_type: The string that identifies the relationship name

    Returns:
        JSON response of whether the action was successful
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    # Extract relationship type from the request if not provided in URL
    relationship_type = data.get('relationship_type', relationship_type)

    # Validate required fields
    if not relationship_type:
        return jsonify({"error": "Missing required field: relationship_type"}), 400

    try:
        # Call the method to create a relationship
        create_result = generic_dao.relationship_builder(parent_node_type=parent_node_type,
                                                         child_node_type=child_node_type,
                                                         parent_id_field=parent_id_field,
                                                         child_id_field=child_id_field,
                                                         parent_identifier=parent_identifier,
                                                         child_identifier=child_identifier,
                                                         relationship_type=relationship_type)
        if create_result:
            return jsonify({"message": "Relationship created successfully."}), 201
        return jsonify({"error": "Failed to create relationship."}), 500
    except Exception as e:
        # Log the exception if logging is set up
        return jsonify({"error": f"An error occurred while creating the relationship: {str(e)}"}), 500


@app.route('/get_parent_node/<child_node_type>/<child_identifier_value>',methods=['GET'])
def get_parent_node(child_node_type, child_identifier_value):
    """
    Get the parent node given a child node

    Args:
        child_node_type: the type of child node
        child_identifier_value: the id of the child node

    Returns:
        The parent node in json format
    """
    parent_node_type = ""
    parent_identifier_key = ""
    child_identifier_key = ""
    match child_node_type:
        case "Sample":
            child_identifier_key = 'sample_id'
            parent_node_type = "Experiment"
            parent_identifier_key = "experiment_id"
        case "Dataset":
            child_identifier_key = 'dataset_id'
            parent_node_type = "Sample"
            parent_identifier_key = "sample_id"
        case "Experiment":
            child_identifier_key = 'experiment_id'
            parent_node_type = "Study"
            parent_identifier_key = "accession"
    res_get_dataset = generic_dao.get_node(node_type=child_node_type,
                                           identifier_value=child_identifier_value,
                                           identifier_key=child_identifier_key)
    result_id = json.loads(res_get_dataset)["s"][parent_identifier_key]
    result = generic_dao.get_node(node_type=parent_node_type,
                                          identifier_key=parent_identifier_key,
                                          identifier_value=result_id)
    if result:
        return json.loads(result), 200
    return json.loads(result), 500

@app.route('/get_all_node_by_type/<node_type>',methods=['GET'])
def get_all_node_by_type(node_type):
    """
    Get all nodes with given type

    Returns:
        JSON response indicating the success or failure of the operation.
    """
    all_nodes_by_type = generic_dao.get_all_node_by_type(
        node_type
    )
    return jsonify({"{node_type}":all_nodes_by_type}),200

@app.route('/generic_get_node/<node_type>/<identifier_key>/<identifier_value>',methods=['GET'])
def get_node(node_type, identifier_key, identifier_value):
    """
    Retrieve a node by its ID.

    Args:
        node_type: the node type
        identifier_key: the attribute name of the unique id field
        identifier_value: the actual value of the unique id

    Returns:
        JSON response containing the node details or 
        an error message if the experiment is not found.
    """
    res = generic_dao.get_node(node_type=node_type,
                                               identifier_key=identifier_key,
                                               identifier_value=identifier_value)
    if res:
        return jsonify({node_type: res}), 200
    return jsonify(res), 500

@app.route('/generic_delete_node/<node_type>/<identifier_key>/<identifier_value>',methods=['DELETE'])
def delete_node(node_type,identifier_key,identifier_value):
    """
    Delete a node by its ID.

    Args:
        node_type: the node type
        identifier_key: the attribute name of the unique id field
        identifier_value: the actual value of the unique id

    Returns:
        JSON response containing delete success or 
        an error message if the experiment is not found.
    """
    res = generic_dao.delete_node(node_type=node_type,
                                               identifier_key=identifier_key,
                                               identifier_value=identifier_value)
    if res:
        return jsonify({'message':'successful'})
    return jsonify(res), 500

@app.route('/generic_update_node/<node_type>/<identifier_key>/<identifier_value>',methods=['PUT'])
def update_node(node_type,identifier_key,identifier_value):
    """
    Update a node by its ID.

    Args:
        node_type: the node type
        identifier_key: the attribute name of the unique id field
        identifier_value: the actual value of the unique id

    Returns:
        JSON response containing delete success or 
        an error message if the experiment is not found.
    """
    data = request.json
    try:
        update_result = generic_dao.update_node(node_type=node_type,
                                                        identifier_key=identifier_key,
                                                        identifier_value=identifier_value,
                                                        updated_data=data)
        if update_result:
            response_data = {
                "message": "Node updated successfully."
            }
            return jsonify(response_data), 200
        return jsonify({"error": "Failed to update experiment Node"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500