from . import app,generic_dao,study_dao
from flask import json, request, jsonify


@app.route('/create_study', methods=['POST'])
def create_study():
    data = request.json
    # Assuming data contains necessary attributes for study
    data_study = data.get('study', {})

    # Convert the study data to JSON string
    data_study_json = json.dumps(data_study)
    # Create a study node
    created_study_accession = generic_dao.create_node(node_type="Study", data = data_study_json)
    response_data = {
        "message": f"Study Node created with accession: {created_study_accession}"
    }
    return jsonify(response_data), 200

@app.route('/get_study/<accession>', methods=['GET'])
def get_study(accession):
    study_node = study_dao.get_study_node(accession)
    if study_node:
        return jsonify(study_node),200  # Return the study node as JSON response
    else:
        return jsonify({"error": "Study Node not found"}), 404

@app.route('/update_study/<accession>', methods=['PUT'])
def update_study(accession):
    data = request.json
    updated_data = {
        'description': data.get('description'),
        'organism': data.get('organism'),
        'study_type': data.get('study_type'),
        'publication': data.get('publication')
    }
    updated_node = study_dao.update_study_node(accession, updated_data)
    if updated_node:
        response_data = {
            "message": f"Updated study node: {updated_node}"
        }
        return jsonify(response_data), 200
    else:
        return jsonify({"error": "Failed to update Study Node"}), 404

@app.route('/get_all_experiments/<accession>')
def get_all_experiments(accession):
    all_experiments = study_dao.get_all_experiments(accession)
    return jsonify({"experiments" : all_experiments}), 200

@app.route('/count_experiments/<accession>', methods=['GET'])
def count_experiments(accession):
    try:
        num_experiments = study_dao.count_num_experiments(accession)
        return jsonify({"num_experiments": num_experiments}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
@app.route('/delete_study/<accession>', methods=['DELETE'])
def delete_study(accession):
    deletion_success = study_dao.delete_study_node(accession)
    if deletion_success:
        response_data = {
            "message": f"Study Node with accession {accession} deleted"
        }
        return jsonify(response_data), 200
    else:
        return jsonify({"error": "Failed to delete Study Node"}), 500