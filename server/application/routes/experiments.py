"""Module docstring.

This script provides all experiment APIs.
"""
from flask import request, jsonify, json
from . import app, experiment_dao, generic_dao

class_identifier_key = 'experiment_id'

@app.route('/delete_experiment/<experiment_id>', methods=['DELETE'])
def delete_experiment(experiment_id):
    deletion_success = generic_dao.delete_node(
        node_type="Experiment", identifier_key="experiment_id",identifier_value=experiment_id)
    if deletion_success:
        return jsonify({"message": 
                        f"Experiment id: {experiment_id} deleted successfully"}), 200
    return jsonify({"error": 
                    f"Unable to delete experiment id: {experiment_id}"}), 500

@app.route('/create_experiment', methods=['POST'])
def create_experiment():
    data = request.json
    experiment_data = data.get('experiment', {})
    accession = experiment_data.get('accession', '')
    experiment_id = experiment_data.get('experiment_id', '')

    try:
        temp_experiment = generic_dao.get_node(node_type="Experiment",
                                               identifier=experiment_id)
        if temp_experiment is not None:
            return jsonify({"message": "Error: Duplicated experiments"})
    except Exception:
        pass
    data_experiment_json = json.dumps(experiment_data)
    generic_dao.create_node(
        node_type="Experiment", data=data_experiment_json)
    generic_dao.relationship_builder(
        parent_node_type="Study",
        child_node_type="Experiment",
        parent_identifier=accession,
        child_identifier=experiment_id,
        parent_id_field="accession",
        child_id_field=class_identifier_key,
        relationship_type="contains")
    response_data = {
        "message": f"Created experiment with ID: {experiment_id}, attached to study with accession: {accession}"
    }
    return jsonify(response_data), 200

@app.route('/get_experiment/<experiment_id>', methods=['GET'])
def get_experiment(experiment_id):
    exp_get_res = generic_dao.get_node(
        identifier_key=class_identifier_key,
        identifier_value=experiment_id, node_type="Experiment")
    if exp_get_res:
        return jsonify({'experiment': exp_get_res}), 200
    return jsonify(exp_get_res), 404

@app.route('/update_experiment/<experiment_id>', methods=['PUT'])
def update_experiment(experiment_id):
    data = request.json
    try:
        update_result = generic_dao.update_node(
            node_type='Experiment',
            identifier_key=class_identifier_key,
            identifier_value=experiment_id,
            updated_data=data)

        if update_result:
            response_data = {
                "message": "Experiment node updated successfully."
            }
            return jsonify(response_data), 200
        return jsonify({"error": "Failed to update experiment Node"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/count_samples/<experiment_id>', methods=['GET'])
def count_samples(experiment_id):
    """
    Count the number of samples associated with an experiment.
    """
    try:
        num_samples = experiment_dao.count_num_samples(experiment_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"num_samples": num_samples})
