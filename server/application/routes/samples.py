from . import app, study_dao, sample_dao, experiment_dao
from server.infrastructure.entity.study import sampleIdInfo
from server.infrastructure.entity.study import sample as sampleEntity
from flask import request, jsonify


@app.route('/get_all_samples/<experiment_id>', methods=['GET'])
def get_all_samples(experiment_id):
    samples = experiment_dao.get_all_samples(experiment_id)
    if samples:
        return jsonify(samples)  # Return samples as JSON response
    else:
        return jsonify({"error": "No samples found for the given experiment_id"}), 404


@app.route('/create_sample', methods=['POST'])
def create_sample():
    data = request.json
    # Assuming data contains necessary attributes for sample
    sample_id_info_data = data.get('sample_id_info_data', {})
    sample_data = data.get('sample_data', {})
    # Create a SampleIdInfo object
    sample_id_info_obj = sampleIdInfo.sampleIdInfo(
        name=sample_id_info_data.get('name', ''),
        id=sample_id_info_data.get('sample_id', ''),
        group=sample_id_info_data.get('group', ''),
        project=sample_id_info_data.get('project', '')
    )
    # Create a sample object
    sample_obj = sampleEntity.sample(
        sample=sample_id_info_obj,
        description=sample_data.get('description', ''),
        organism=sample_data.get('organism', ''),
        tissue=sample_data.get('tissue', ''),
        sex=sample_data.get('sex', ''),
        cell_line=sample_data.get('cell_line', ''),
        mouse_model=sample_data.get('mouse_model', ''),
        biometric_provider=sample_data.get('biometric_provider', ''),
        experiment_id = sample_data.get('experiment_id', '')
    )
    created_node_id = sample_dao.create_sample_node(sample_obj)
    relating_nodes = experiment_dao.create_experiment_sample_relationship(experiment_id=sample_obj.experiment_id,sample_id=sample_obj.sample.sample_ID)
    response_data = {
            "message": f"Sample node created with ID: {created_node_id}, belongs to study: {relating_nodes}"
        }
    return jsonify(response_data), 200


# Calling objects that get data from databse, sample id used as primary key(or equivilent in graph database)
@app.route('/get_sample/<sample_id>', methods=['GET'])
def get_sample(sample_id):
    sample_node = sample_dao.get_sample_node(sample_id)
    if sample_node:
        response_data = {"sample": sample_node}
        return jsonify(response_data), 200
    else:
        return jsonify({"error": f"No sample with ID {sample_id} found"}), 404


# Calling objects that update data from database
@app.route('/update_sample/<sample_id>', methods=['PUT'])
def update_sample(sample_id):
    data = request.json
    update_sample_node = sample_dao.update_sample_node(sample_id, data)
    if update_sample_node:
        response_data = {"message": f"Updated sample node with ID {sample_id}"}
        return jsonify(response_data), 200
    else:
        return jsonify({"error": "Failed to update sample node"}), 404


# Calling objects that delete data from database
@app.route('/delete_sample/<sample_id>', methods=['DELETE'])
def delete_sample(sample_id):
    deletion_result = sample_dao.delete_sample_node(sample_id)
    if deletion_result:
        response_data = {"message": "Sample node deleted successfully."}
        return jsonify(response_data), 200
    else:
        return jsonify({"error": "Failed to delete sample node."}), 500