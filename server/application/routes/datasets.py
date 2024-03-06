"""Module docstring.

This script provides all dataset APIs.
"""
from flask import request, jsonify, json
from . import app, generic_dao, general_service_dao

#This is the attribute name for the unique id of dataset
class_identifier_key = "dataset_id"

@app.route('/create_dataset', methods=['POST'])
def create_datasets():
    """
    Create a new dataset and link it to a sample.

    Returns:
        JSON response indicating the success or failure of the operation.
    """
    dataset_data = request.json
    dataset = dataset_data.get('dataset')
    data_dataset_experiment = json.dumps(dataset)
    dataset_id = dataset["dataset_id"]
    accession = dataset["sample_id"]
    try:
        temp_dataset_node = generic_dao.get_node(
            data_dataset_experiment.dataset_id
            )
        if temp_dataset_node is not None:
            response_data = {"error" : "A dataset with this ID already exists in the database"}
            return jsonify(response_data), 500
    except Exception:
        pass
    generic_dao.create_node(node_type='Dataset',data=data_dataset_experiment)
    general_service_dao.relationship_builder(relationship_type= "contains",
                                                  parent_node_type='Sample',
                                                  child_node_type='Dataset', 
                                                  parent_identifier=accession,
                                                  child_identifier= dataset_id)
    response_data = {
        "message" : f"Dataset node {dataset_id} for sample {accession}"
    }
    return jsonify(response_data),200

@app.route("/update_dataset/<dataset_id>", methods=['PUT'])
def update_datasets(dataset_id):
    """
    Update an dataset by its ID.

    Args:
        dataset_id (str): The ID of the dataset to update.

    Returns:
        JSON response indicating the success or failure of the update operation.
    """
    dataset_data = request.json
    try:
        update_result = generic_dao.update_node(
            node_type='Dataset',
            identifier=dataset_id,
            updated_data=dataset_data)
        if update_result:
            response_data = {
                "message" : "Dataset node updated successfully"
            }
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify(response_data), 200

@app.route("/get_dataset/<dataset_id>", methods=['GET'])
def get_dataset(dataset_id):
    """
    Retrieve an dataset by its ID.

    Args:
        dataset_id (str): The ID of the dataset to retrieve.

    Returns:
        JSON response containing the experiment details or 
        an error message if the experiment is not found.
    """
    res_get_dataset = generic_dao.get_node(node_type='Dataset',
                                           identifier=dataset_id)
    if res_get_dataset:
        return jsonify(res_get_dataset), 200
    return jsonify(res_get_dataset), 500

@app.route("/delete_dataset/<dataset_id>", methods=['DELETE'])
def delete_dataset(dataset_id):
    """
    Delete an dataset by its ID.

    Args:
        dataset_id (str): The ID of the dataset to be deleted.

    Returns:
        JSON response indicating the success 
        or failure of the delete operation.
    """
    deletion_success = generic_dao.delete_node(node_type="Dataset",
                                               identifier=dataset_id)
    if deletion_success:
        return jsonify({"message": f"Dataset id: {dataset_id} deleted successfully"}), 200
    return jsonify({"error": f"Unable to delete Dataset id: {dataset_id}"}), 500

@app.route("/get_sample_from_dataset/<dataset_id>", methods = ['GET'])
def get_sample_from_dataset(dataset_id):
    """
    Retrive the sample a dataset is linked to,
    given a dataset.

    Args:
        dataset_id (str): The ID of the dataset.

    Returns:
        JSON response indicating the success 
        or failure of the delete operation.
    """
    res_get_dataset = generic_dao.get_node(node_type='Dataset', identifier=dataset_id)
    sample_id = json.loads(res_get_dataset)["s"]["sample_id"]
    result = generic_dao.get_node(node_type="Sample",identifier=sample_id)
    if result:
        return jsonify(result), 200
    return jsonify(result), 500