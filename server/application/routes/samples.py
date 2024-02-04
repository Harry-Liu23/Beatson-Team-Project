from . import app, sample_dao, experiment_dao
from server.infrastructure.entity.study import sampleIdInfo
from server.infrastructure.entity.study import sample as sampleEntity
from flask import request, jsonify, json
from . import app,generic_dao


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

    # Extract sample and sample_id_info data from the request
    sample_data = data.get('sample', {})
    experiment_id = sample_data.get('experiment_id', '')
    sample_id = sample_data.get('sample_id', '')
    # Check if 'experiment_id' is provided
    if not experiment_id:
        return jsonify({"error": "Missing experiment_id in sample_data"}), 400
    # Convert the sample data to JSON string for create_node method
    sample_data_json = json.dumps(sample_data)
    created_sample_result = generic_dao.create_node(node_type="Sample", data=sample_data_json)

    # Assuming create_node method returns the newly created node's id or some identifier, which is then used for linking
    # Create a relationship between the newly created Sample node and the specified Experiment node
    rel_result = experiment_dao.create_experiment_sample_relationship(experiment_id=experiment_id, sample_id=sample_id)
    if created_sample_result and rel_result:
        response_data = {
            "message": f"Created sample with ID: {sample_id}, attached to experiment with ID: {experiment_id}"
        }
        return jsonify(response_data), 200
    else:
        return jsonify({"error": "Failed to create sample or link it to the experiment"}), 200

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