from . import app,experiment_dao,generic_dao, study_dao
from server.infrastructure.entity.study import experiment
from flask import request,jsonify,json


@app.route('/delete_experiment/<experiment_id>', methods=['DELETE'])
def delete_experiment(experiment_id):
    deletion_success = experiment_dao.delete_experiment_node(experiment_id)
    if deletion_success:
        return jsonify({"message": f"Experiment id: {experiment_id} deleted successfully"}), 200
    return jsonify({"error": f"Unable to delete experiment id: {experiment_id}"}), 500

@app.route('/create_experiment', methods=['POST'])
def create_experiment():
    data = request.json
    # Extract experiment data from the request
    experiment_data = data.get('experiment', {})
    accession = experiment_data.get('accession', '')
    experiment_id = experiment_data.get('experiment_id', '')
    
    try:
        # Convert the experiment data to a JSON string for the create_node method
        data_experiment_json = json.dumps(experiment_data)
        # Create an Experiment node
        created_experiment_result = generic_dao.create_node(node_type="Experiment", data=data_experiment_json)
        # Create a relationship between the newly created Experiment node and the specified Study node
        rel_result = study_dao.create_experiment_study_relationship(experiment_id=experiment_id, accession=accession)
        response_data = {
            "message": f"Created experiment with ID: {experiment_id}, attached to study with accession: {accession}"
        }
        return jsonify(response_data), 200
    except Warning as warning:
        print(f"UserWarning: {warning}")
        response_data = {
            "message": f"Error: Duplicated experiments or some other problem occured"
        }
        return jsonify(response_data), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        # Handle the error appropriately
        return jsonify({"error": "Failed to create experiment or link it to the study"}), 500


@app.route('/get_experiment/<experiment_id>', methods=['GET'])
def get_experiment(experiment_id):
    exp_get_res = experiment_dao.get_experiment_node(experiment_id)
    if exp_get_res:
        return jsonify({'experiment': exp_get_res}), 200
    return jsonify({'error': f"No experiment with id {experiment_id} found"}), 404

@app.route('/update_experiment/<experiment_id>', methods=['PUT'])
def update_experiment(experiment_id):
    data = request.json
    updated_experiment = {
        'description': data.get('description', ''),
        'accession': data.get('accession', '')
    }
    exp_updt_res = experiment_dao.update_experiment_node(
        experiment_id=experiment_id,
        updated_data=updated_experiment)
    if exp_updt_res:
        return jsonify({"message": f"Updated data for experiment {experiment_id}"}), 200
    return jsonify({"error": f"Unable to update data for experiment {experiment_id}"}), 500

@app.route('/count_samples/<experiment_id>', methods=['GET'])
def count_samples(experiment_id):
    try:
        num_samples = experiment_dao.count_num_samples(experiment_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"num_samples": num_samples})