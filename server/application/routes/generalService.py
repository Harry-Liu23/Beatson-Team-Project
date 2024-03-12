"""Module docstring.

This script provides APIs for things like searches, 
or any generic node creation and manipulation.

There are a few args names defined, if it is the parameters of some function
refer to below, unless specifically defined in the method decoration
args:
    Args:
    node_type: the node type
    identifier_key: the attribute name of the unique id field
    identifier_value: the actual value of the unique id
    search_string(str): the string you wanna search for
    child_node_type: the type of child node
    child_identifier_value: the id of the child node
"""
from flask import json, request, jsonify
from . import app,generic_dao

@app.route('/search_in_field/<node_type>/<node_field>/<search_string>', methods=['GET'])
def search_in_field(node_type, node_field, search_string):
    """
    Search whether certain field of a node type contians a given string
    """
    response = generic_dao.general_search_in_field(node_field=node_field,
                                                   node_type=node_type,
                                                   search_string=search_string)
    return jsonify(response), 200

@app.route('/search_all_fields/<node_type>/<search_string>', methods=['GET'])
def search_all_fields(node_type,search_string):
    """
    Search any node of a node type that contains a given string
    """
    response = generic_dao.general_search_all_fields(node_type=node_type,
                                                     search_string=search_string)
    return jsonify(response),200

@app.route('/search_all_nodes/<search_string>',methods=['GET'])
def search_all_nodes(search_string):
    """
    Search for any node that contains a given string
    """
    response = generic_dao.general_search_all_nodes(search_string=search_string)
    return jsonify(response), 200

@app.route('/create_node/<node_type>',methods = ['POST'])
def create_node(node_type):
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    data_json = json.dumps(data) if not isinstance(data, str) else data

    try:
        create_result = generic_dao.create_node(node_type=node_type, data=data_json)
        if create_result:
            return jsonify({
                "message": f"Node of type '{node_type}' created successfully.", "id": create_result
                }), 201
        return jsonify({"error": "Failed to create node."}), 500
    except Exception:
        return jsonify({"error": "An error occurred while creating the node."}), 500

@app.route('/create_relation/<parent_node_type>/<child_node_type>/<parent_id_field>/<child_id_field>/<parent_identifier>/<child_identifier>/<relationship_type>', 
           methods=['POST'])
def create_relation(parent_node_type,
                    child_node_type,
                    parent_id_field,
                    child_id_field,
                    parent_identifier,
                    child_identifier,
                    relationship_type):
    """
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

    relationship_type = data.get('relationship_type', relationship_type)

    if not relationship_type:
        return jsonify({"error": "Missing required field: relationship_type"}), 400

    try:
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
        return jsonify({"error": f"An error occurred while creating the relationship: {str(e)}"}), 500


@app.route('/get_parent_node/<child_node_type>/<child_identifier_value>',methods=['GET'])
def get_parent_node(child_node_type, child_identifier_value):
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
    all_nodes_by_type = generic_dao.get_all_node_by_type(
        node_type
    )
    return jsonify({"{node_type}":all_nodes_by_type}),200

@app.route('/generic_get_node/<node_type>/<identifier_key>/<identifier_value>',methods=['GET'])
def get_node(node_type, identifier_key, identifier_value):
    res = generic_dao.get_node(node_type=node_type,
                                               identifier_key=identifier_key,
                                               identifier_value=identifier_value)
    if res:
        return jsonify({node_type: res}), 200
    return jsonify(res), 500

@app.route('/generic_delete_node/<node_type>/<identifier_key>/<identifier_value>',methods=['DELETE'])
def delete_node(node_type,identifier_key,identifier_value):
    res = generic_dao.delete_node(node_type=node_type,
                                               identifier_key=identifier_key,
                                               identifier_value=identifier_value)
    if res:
        return jsonify({'message':'successful'})
    return jsonify(res), 500

@app.route('/generic_update_node/<node_type>/<identifier_key>/<identifier_value>',methods=['PUT'])
def update_node(node_type,identifier_key,identifier_value):
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
        return jsonify({"error": "Failed to update experiment Node"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
