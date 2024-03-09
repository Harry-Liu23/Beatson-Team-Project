"""Module docstring.

This script provides all the samples apis
"""
from flask import request, jsonify, json
from . import app, experiment_dao, generic_dao

#This is the attribute name for the unique id of sample
class_identifier_key = "sample_id"

@app.route('/get_all_samples/<experiment_id>', methods=['GET'])
def get_all_samples(experiment_id):
    samples = experiment_dao.get_all_samples(experiment_id)
    if samples:
        return jsonify(samples)

    return jsonify({"error": "No samples found for the given experiment_id"}), 404

@app.route('/create_sample', methods=['POST'])
def create_sample():
    data = request.json

    sample_data = data.get('sample', {})
    experiment_id = sample_data.get('experiment_id', '')
    sample_id = str(sample_data.get('sample_id', ''))

    if not experiment_id:
        return jsonify({"error": "Missing experiment_id in sample_data"}), 400

    sample_data_json = json.dumps(sample_data)
    created_sample_result = generic_dao.create_node(
        node_type="Sample",
        data=sample_data_json)

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
    sample_node = generic_dao.get_node(
        identifier_value=sample_id,
        node_type="Sample",
        identifier_key=class_identifier_key)
    if sample_node:
        return jsonify(sample_node), 200
    return jsonify({"error": f"No sample with ID {sample_id} found"}), 404

@app.route('/update_sample/<sample_id>', methods=['PUT'])
def update_sample(sample_id):
    data = request.json

    update_result = generic_dao.update_node(
        node_type='Sample',
        identifier_value=sample_id,
        identifier_key=class_identifier_key,
        updated_data=data)
    if update_result:
        response_data = {
            "message": "Sample node updated successfully."
        }
        return jsonify(response_data), 200
    return jsonify({"error": "Failed to update Sample Node"}), 500

@app.route('/delete_sample/<sample_id>', methods=['DELETE'])
def delete_sample(sample_id):
    deletion_result = generic_dao.delete_node(
        node_type="Sample",
        identifier_value=sample_id,
        identifier_key=class_identifier_key)
    if deletion_result:
        response_data = {"message": "Sample node deleted successfully."}
        return jsonify(response_data), 200
    return jsonify({"error": "Failed to delete sample node."}), 500
