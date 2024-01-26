from . import app,experiment_dao
from server.Infrastructure.entity.study import experiment
from flask import request,jsonify



@app.route('/delete_experiment/<experiment_id>', methods=['DELETE'])
def delete_experiment(experiment_id):
    deletion_success = experiment_dao.delete_experiment_node(experiment_id)
    if deletion_success:
        return f"Experiment id: {experiment_id} deleted sucessfully", 200
    return f"Unable to delete experiment id: {experiment_id}", 500



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

    if exp_create_res is None:
        return jsonify({"error" : "Unable to instanciate experiment in DB"}),500
    rel_result = experiment_dao.create_experiment_study_relationship(
        experiment_obj.experiment_id, experiment_obj.accession)
    if rel_result:
        return f"Created experiment id: {experiment_obj.experiemnt_id}, attached to study: {experiment_obj.accession}", 200
    


@app.route('/get_experiment/<experiment_id>', methods=['GET'])
def get_experiment(experiment_id):
    exp_get_res = experiment_dao.get_experiment_node(experiment_id)
    if exp_get_res:
        return f"Experiment' : {exp_get_res}"
    return f"No experiment with id {experiment_id} found",404



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
        return f"Updated data for experiment {experiment_id}", 200
    return f"Unable to update data for experiment {experiment_id}", 500



@app.route('/get_all_experiments/<accession>', methods=['GET'])
def get_all_experiments(accession):
    all_experiments = experiment_dao.get_all_experiment(accession)
    return jsonify({'experiments' : all_experiments[0]}), all_experiments[1]



@app.route('/count_samples/<experiment_id>', methods=['GET'])
def count_samples(experiment_id):
    try:
        num_samples = experiment_dao.count_num_samples(experiment_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"num_samples": num_samples})