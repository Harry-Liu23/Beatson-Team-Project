from . import app,experiment_dao,study_dao
from server.Infrastructure.entity.study import experiment
from flask import request,jsonify


@app.route('/get_all_experiments/<accession>', methods=['GET'])
def get_all_experiments(accession):
    experiments = study_dao.get_all_experiements(accession)
    if experiments:
        return jsonify(experiments), 200
    return jsonify({"error": "No experiments found for given study"}), 404

@app.route('/delete_experiment/<experiment_id>', methods=['DELETE'])
def delete_experiment(experiment_id):
    deletion_success = experiment_dao.delete_experiment_node(experiment_id)
    if deletion_success:
        return f"Experiment id: {experiment_id} deleted sucessfully", 200
    return f"Unable to delete experiment id: {experiment_id}", 500
    