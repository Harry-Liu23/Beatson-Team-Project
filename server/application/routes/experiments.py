from . import app,experiment_dao,sample_dao, study_dao
from server.infrastructure.entity.study import experiment
from flask import request,jsonify


@app.route('/delete_experiment/<experiment_id>', methods=['DELETE'])
def delete_experiment(experiment_id):
    deletion_success = experiment_dao.delete_experiment_node(experiment_id)
    if deletion_success:
        return jsonify({"message": f"Experiment id: {experiment_id} deleted successfully"}), 200
    return jsonify({"error": f"Unable to delete experiment id: {experiment_id}"}), 500


@app.route('/create_experiment', methods=['POST'])
def create_experiment():
    data = request.json

    data_experiment = data.get('experiment', {})
    experiment_obj = experiment.experiment(
        experiment_id= data_experiment.get('experiment_id',''),
        description= data_experiment.get('description',''),
        accession= data_experiment.get('accession','')
    )
    exp_create_res = experiment_dao.create_experiment_node(experiment_obj)
    rel_result = study_dao.create_experiment_study_relationship(
    experiment_obj.experiment_id, experiment_obj.accession)
    if exp_create_res and rel_result:
        response_data = {
            "message": f"Created experiment id: {experiment_obj.experiment_id}, attached to study: {experiment_obj.accession}"
        }
        return jsonify(response_data), 200
    else:
        return jsonify({"Error": 500})


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