import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


from flask import Flask, jsonify, request
from neo4j import GraphDatabase, basic_auth
import server.Infrastructure.entity.sample as sampleEntity
import Infrastructure.entity.constraint.sampleIdInfo as sampleIdInfo
import server.Infrastructure.dao.sampleDao as sampleDao
import server.Infrastructure.entity.study as study
import server.Infrastructure.dao.studyDao as studyDao
# from application.keys import DATABASE_PASSWORD 


app=Flask(__name__)


DATABASE_USERNAME = "neo4j"
DATABASE_URI = "bolt://localhost:7687"
DATABASE_PASSWORD = "12345678"

driver = GraphDatabase.driver(DATABASE_URI, auth=(DATABASE_USERNAME,DATABASE_PASSWORD))
session = driver.session()
sample_dao = sampleDao.sampleDao(driver)
study_dao = studyDao.studyDao(driver)


@app.route('/')
def main():
    return 'welcome to my webpage!'


@app.route('/create_study', methods=['POST'])
def create_study():
    data = request.json


    # Assuming data contains necessary attributes for study
    data_study = data.get('study', {})
    

    #Create a study object
    study_obj = study.study(
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
    accession = data.get('accession')
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
    

@app.route('/get_all_samples/<accession>', methods=['GET'])
def get_all_samples():
    data = request.json
    accession = data.get('accession')
    samples = study_dao.get_all_sample(accession)
    if samples:
        return f"Got all samples {samples}"  # Return samples as JSON response
    else:
        return "No samples found for the given accession", 404
    

@app.route('/delete_study/<accession>', methods=['DELETE'])
def delete_study(accession):
    deletion_success = study_dao.delete_study_node(accession)

    if deletion_success:
        return f"Study Node with accession {accession} deleted"
    else:
        return "Failed to delete Study Node", 500
    




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
        study_accession = sample_data.get('accession', '')
    )


    created_node_id = sample_dao.create_sample_node(sample_obj)
    relating_nodes = study_dao.create_sample_study_relationship(accession=sample_obj.get_study_accession(),sample_id=sample_obj.sample.sample_ID)
    return f"Sample node created with ID: {created_node_id}, belongs to study:{relating_nodes}"


# Calling objects that get data from databse, sample id used as primary key(or equivilent in graph database)
@app.route('/get_sample/<sample_id>', methods=['GET'])
def get_sample(sample_id):
    sample_node = sample_dao.get_sample_node(sample_id)
    if sample_node:
        return f"Found sample node: {sample_node}"
    else:
        return "Sample node not found."
    

# Calling objects that update data from database
@app.route('/update_sample/<sample_id>', methods=['PUT'])
def update_sample(sample_id):
    data = request.json

    update_sample_node = sample_dao.update_sample_node(sample_id, data)

    if update_sample_node:
        return f"Updated sample node: {update_sample_node}"
    else:
        return "Failed to update sample node."


# Calling objects that delete data from database
@app.route('/delete_sample/<sample_id>', methods=['DELETE'])
def delete_sample(sample_id):
    deletion_result = sample_dao.delete_sample_node(sample_id)

    if deletion_result:
        return "Sample node deleted successfully."
    else:
        return "Failed to delete sample node."


if __name__=="__main__":
    app.run(port=2020,host="127.0.0.1",debug=True)
    driver.close()
    session.close()