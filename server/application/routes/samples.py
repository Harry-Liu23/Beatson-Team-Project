"""Module docstring.

This script provides all the samples apis
"""
from flask import request, jsonify, json
from . import app, experiment_dao, generic_dao

#This is the attribute name for the unique id of sample
class_identifier_key = "sample_id"

@app.route('/get_all_samples/<experiment_id>', methods=['GET'])
def get_all_samples(experiment_id):
    """
    Retrieve all samples associated with a given experiment ID.

    Args:
        experiment_id (str): The ID of the experiment.

    Returns:
        JSON response containing the list of samples or an error message if no samples are found.
    """
    samples = experiment_dao.get_all_samples(experiment_id)
    if samples:
        return jsonify(samples)  # Return samples as JSON response

    return jsonify({"error": "No samples found for the given experiment_id"}), 404

@app.route('/create_sample', methods=['POST'])
def create_sample():
    """
    Create a new sample and link it to an experiment.

    Returns:
        JSON response indicating the success or failure of the operation.
    """
    data = request.json

    # Extract sample and sample_id_info data from the request
    sample_data = data.get('sample', {})
    experiment_id = sample_data.get('experiment_id', '')
    sample_id = str(sample_data.get('sample_id', ''))

    # Check if 'experiment_id' is provided
    if not experiment_id:
        return jsonify({"error": "Missing experiment_id in sample_data"}), 400

    # Convert the sample data to JSON string for create_node method
    sample_data_json = json.dumps(sample_data)
    created_sample_result = generic_dao.create_node(
        node_type="Sample",
        data=sample_data_json)

    # Assuming create_node method returns
    # the newly created node's id or some identifier,
    # which is then used for linking
    # Create a relationship between the newly created
    # Sample node and the specified Experiment node
    rel_result = generic_dao.relationship_builder(
        parent_node_type="Experiment",
        child_node_type="Sample",
        parent_id_field="experiment_id",
        child_id_field=class_identifier_key,
        parent_identifier=experiment_id,
        child_identifier=sample_id,
        relationship_type="contains")
    if created_sample_result and rel_result:
        response_data = {
        "message": f"Created sample with ID: {sample_id}, attached to experiment with ID: {experiment_id}"
        }
        return jsonify(response_data), 200
    return jsonify({"error": "Failed to create sample or link it to the experiment"}), 200

@app.route('/get_sample/<sample_id>', methods=['GET'])
def get_sample(sample_id):
    """
    Retrieve a sample by its ID.

    Args:
        sample_id (str): The ID of the sample.

    Returns:
        JSON response containing the sample details or an error message if the sample is not found.
    """
    sample_node = generic_dao.get_node(
        identifier_value=sample_id,
        node_type="Sample",
        identifier_key=class_identifier_key)
    if sample_node:
        return jsonify(sample_node), 200
    return jsonify({"error": f"No sample with ID {sample_id} found"}), 404

@app.route('/update_sample/<sample_id>', methods=['PUT'])
def update_sample(sample_id):
    """
    Update a sample by its ID.

    Args:
        sample_id (str): The ID of the sample.
    
    Returns:
        JSON response indicating the success or failure of the update operation.
    """
    data = request.json

    # Assuming update_node returns a success indicator or result object
    update_result = generic_dao.update_node(
        node_type='Sample',
        identifier_value=sample_id,
        identifier_key=class_identifier_key,
        updated_data=data)
    if update_result:
        # Adjust the response message as needed, based on how update_result is structured
        response_data = {
            "message": "Sample node updated successfully."
        }
        return jsonify(response_data), 200
    return jsonify({"error": "Failed to update Sample Node"}), 500

@app.route('/delete_sample/<sample_id>', methods=['DELETE'])
def delete_sample(sample_id):
    """
    Delete a sample by its ID.

    Args:
        sample_id (str): The ID of the sample.

    Returns:
        JSON response indicating the success or failure of the delete operation.
    """
    deletion_result = generic_dao.delete_node(
        node_type="Sample",
        identifier_value=sample_id,
        identifier_key=class_identifier_key)
    if deletion_result:
        response_data = {"message": "Sample node deleted successfully."}
        return jsonify(response_data), 200
    return jsonify({"error": "Failed to delete sample node."}), 500
