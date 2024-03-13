from flask import json, request, jsonify
from . import app,generic_dao,study_dao

#This is the attribute name for the unique id of study
class_identifier_key = "accession"

@app.route('/create_study', methods=['POST'])
def create_study():
    """
    Creates a new study node based on the JSON data provided in the request.
    The function checks if the study already exists before creating a new one.
    If the study exists, it returns an error; otherwise, 
    it creates the study and returns the study's accession.
    """
    data = request.json
    data_study = data.get('study')
    data_study_json = json.dumps(data_study)
    # The try/except was built to pass, receiving empty node may return error which may break code
    # Try to get the node with its unique id, if passes then create node
    try:
        temp_study_node = generic_dao.get_node(node_type="Study",identifier=data_study.__getitem__(class_identifier_key))
        if temp_study_node is not None:
            response_data = {"error": "Study already exist!"}
            return jsonify(response_data),500
    except Exception:
        pass
    created_study_accession = generic_dao.create_node(node_type="Study", data = data_study_json)
    response_data = {
        "message": f"Study Node created with accession: {created_study_accession}"
    }
    return jsonify(response_data), 200

@app.route('/get_study/<accession>', methods=['GET'])
def get_study(accession):
    study_node = generic_dao.get_node(node_type="Study",
                                              identifier_key=class_identifier_key,
                                              identifier_value=accession)
    return jsonify(study_node),200

@app.route('/get_all_study', methods=['GET'])
def get_all_study():
    all_study_nodes = study_dao.get_all_study_nodes()
    return jsonify({"study":all_study_nodes}),200

@app.route('/update_study/<accession>', methods=['PUT'])
def update_study(accession):
    data = request.json
    try:
        generic_dao.update_node(node_type = 'Study',
                                identifier_key = class_identifier_key,
                                identifier_value = accession,
                                updated_data = data)
        response_data = {
            "message": "Study node updated successfully."
        }
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_all_experiments/<accession>')
def get_all_experiments(accession):
    """
    Retrieves all experiment nodes associated with a given study based on the study's accession.
    """
    all_experiments = study_dao.get_all_experiments(accession)
    return jsonify({"experiments" : all_experiments}), 200

@app.route('/count_experiments/<accession>', methods=['GET'])
def count_experiments(accession):
    """
    Counts the number of experiment nodes associated 
    with a given study based on the study's accession.
    """
    try:
        num_experiments = study_dao.count_num_experiments(accession)
        return jsonify({"num_experiments": num_experiments}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete_study/<accession>', methods=['DELETE'])
def delete_study(accession):
    deletion_success = generic_dao.delete_node(node_type="Study",
                                                identifier_value=accession,
                                                identifier_key=class_identifier_key)
    if deletion_success:
        response_data = {
            "message": f"Study Node with accession {accession} deleted"
        }
        return jsonify(response_data), 200
    return jsonify({"error": "Failed to delete Study Node"}), 500
