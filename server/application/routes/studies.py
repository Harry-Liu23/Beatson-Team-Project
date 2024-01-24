from . import app,study_dao
from server.Infrastructure.entity.study.study import study
from flask import request


@app.route('/create_study', methods=['POST'])
def create_study():
    data = request.json
    # Assuming data contains necessary attributes for study
    data_study = data.get('study', {})

    #Create a study object
    study_obj = study(
        accession = data_study.get('accession',''),
        study_type = data_study.get('study_type',''),
        publication = data_study.get('publication',''),
        organism = data_study.get('organism',''),
        description = data_study.get('description',''),
        num_samples = data_study.get('num_samples','')
    )
    created_study_accession = study_dao.create_study_node(study_obj)
    return f"Study Node created with accession: {created_study_accession}"


@app.route('/get_study/<accession>', methods=['GET'])
def get_study(accession):
    study_node = study_dao.get_study_node(accession)
    if study_node:
        return f"Found study node :{study_node}"  # Return the study node as JSON response
    else:
        return "Study Node not found", 404


@app.route('/update_study/<accession>', methods=['PUT'])
def update_study(accession):
    data = request.json
    updated_data = {
        'description': data.get('description'),
        'organism': data.get('organism'),
        'study_type': data.get('study_type'),
        'publication': data.get('publication'),
        'num_samples': data.get('num_samples')
    }
    updated_node = study_dao.update_study_node(accession, updated_data)
    if updated_node:
        return f"Updated study node: {updated_node}"  # Return updated study node as JSON
    else:
        return "Failed to update Study Node", 404
 