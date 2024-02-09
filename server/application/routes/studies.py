from . import app,generic_dao,study_dao
from flask import json, request, jsonify


@app.route('/create_study', methods=['POST'])
def create_study():
    print("gets called")
    print(request.form['javascript_data'])
    data = request.json
    print(data + " this is the data")
    # Assuming data contains necessary attributes for study
    data_study = data.get('study', {})
    print(data_study)
    # Convert the study data to JSON string
    data_study_json = json.dumps(data_study)
    # Create a study node
    created_study_accession = generic_dao.create_node(node_type="Study", data = data_study_json)
    print("created study")
    response_data = {
        "message": f"Study Node created with accession: {created_study_accession}"
    }
    return jsonify(response_data), 200

@app.route('/get_study/<accession>', methods=['GET'])
def get_study(accession):
    study_node = generic_dao.get_node(identifier=accession,node_type="Study")
    if study_node:
        return jsonify(study_node),200  # Return the study node as JSON response
    else:
        return jsonify({"error": "Study Node not found"}), 404

@app.route('/update_study/<accession>', methods=['PUT'])
def update_study(accession):
    data = request.json
    try:
        # Assuming update_node returns a success indicator or result object
        update_result = generic_dao.update_node(node_type = 'Study',identifier = accession, updated_data = data)
        if update_result:
            # Adjust the response message as needed, based on how update_result is structured
            response_data = {
                "message": "Study node updated successfully."
            }
            return jsonify(response_data), 200
        else:
            # This path might need adjustment based on how your DAO handles no-op updates or failures
            return jsonify({"error": "Failed to update Study Node"}), 404
    except Exception as e:
        # Handle any exceptions raised during the update process
        return jsonify({"error": str(e)}), 500

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
    deletion_success = generic_dao.delete_node(node_type="Study",identifier=accession)
    if deletion_success:
        response_data = {
            "message": f"Study Node with accession {accession} deleted"
        }
        return jsonify(response_data), 200
    else:
        return jsonify({"error": "Failed to delete Study Node"}), 500