import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.insert(0, project_root)


from flask import Flask, request
from neo4j import GraphDatabase, basic_auth
import server.Infrastructure.entity.sample as sampleEntity
import Infrastructure.entity.constraint.sampleIdInfo as sampleIdInfo
import server.Infrastructure.dao.sampleDao as sampleDao
# from application.keys import DATABASE_PASSWORD 


app=Flask(__name__)


DATABASE_USERNAME = "neo4j"
DATABASE_URI = "bolt://localhost:7687"
DATABASE_PASSWORD = "12345678"

driver = GraphDatabase.driver(DATABASE_URI, auth=(DATABASE_USERNAME,DATABASE_PASSWORD))
session = driver.session()
dao = sampleDao.sampleDao(driver)


@app.route('/')
def main():
    return 'welcome to my webpage!'


@app.route('/create_sample', methods=['POST'])
def create_sample():
    data = request.json
    

    # Assuming data contains necessary attributes for sample
    sample_id_info_data = data.get('sample_id_info_data', {})
    sample_data = data.get('sample_data', {})


    # Create a SampleIdInfo object
    sample_id_info_obj = sampleIdInfo.sampleIdInfo(
        name=sample_id_info_data.get('name', ''),
        id=sample_id_info_data.get('id', ''),
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
        biometric_provider=sample_data.get('biometric_provider', '')
    )


    created_node_id = dao.create_sample_node(sample_obj)
    return f"Sample node created with ID: {created_node_id}"


# Calling objects that get data from databse, sample id used as primary key(or equivilent in graph database)
@app.route('/get_sample/<sample_id>', methods=['GET'])
def get_sample(sample_id):
    sample_node = dao.get_sample_node(sample_id)
    if sample_node:
        return f"Found sample node: {sample_node}"
    else:
        return "Sample node not found."
    

# Calling objects that update data from database
@app.route('/update_sample/<sample_id>', methods=['PUT'])
def update_sample(sample_id):
    data = request.json

    update_sample_node = dao.update_sample_node(sample_id, data)

    if update_sample_node:
        return f"Updated sample node: {update_sample_node}"
    else:
        return "Failed to update sample node."


# Calling objects that delete data from database
@app.route('/delete_sample/<sample_id>', methods=['DELETE'])
def delete_sample(sample_id):
    deletion_result = dao.delete_sample_node(sample_id)

    if deletion_result:
        return "Sample node deleted successfully."
    else:
        return "Failed to delete sample node."


if __name__=="__main__":
    app.run(port=2020,host="127.0.0.1",debug=True)