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
        experiment_id= data_experiment('experiment_id',''),
        description= data_experiment.get('description',''),
        num_samples= data_experiment.get('num_samples',''),
        accession= data_experiment.get('accession')
    )
    exp_create_res = experiment_dao.create_experiment_node(experiment_obj)

    if exp_create_res is None:
        return jsonify({"error" : "Unable to instanciate experiment in DB"}),500
    rel_result = experiment_dao.create_experiment_study_relationship(
        experiment_obj.experiemnt_id, experiment_obj.accession)
    if rel_result:
        return f"Created experiment id: {experiment_obj.experiemnt_id}, attached to study: {experiment_obj.accession}", 200
    
@app.route('/get_experiment/<experiment_id>', methods=['GET'])
def get_experiment(experiment_id):
    exp_get_res = experiment_dao.get_experiment_node(experiment_id)
    if exp_get_res:
        return jsonify({'experiment' : experiment}),200
    return f"No experiment with id {experiment_id} found",404

@app.route('/update_experiment/<experiment_id>', methods=['PUT'])
def update_experiment(experiment_id):
    data = request.json
    updated_experiment = {
        'description' : data.get('description',''),
        'accession' : data.get('accession',''),
        'num_samples' : data.get('num_samples','')
    }
    exp_updt_res = experiment_dao.update_experiment_node(
        experiemnt_id=experiment_id,
        updated_data=updated_experiment)
    if exp_updt_res:
        return f"Updated data for experiment {experiment_id}",200
    return f"Unable to update data for exeperiment {experiment_id}",500