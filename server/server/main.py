from flask import Flask, request
from neo4j import GraphDatabase, basic_auth
import server.Infrastructure.entity.study as study_entity
import server.Infrastructure.entity.constraint.sample as Sample
import server.Infrastructure.dao.study_dao as study_dao

app=Flask(__name__)


DATABASE_USERNAME = "neo4j"
DATABASE_PASSWORD = "12345678"
DATABASE_URI = "bolt://localhost:7687"

driver = GraphDatabase.driver(DATABASE_URI, auth=(DATABASE_USERNAME,DATABASE_PASSWORD))

session = driver.session()


@app.route('/')
def index():
    return 'welcome to my webpage!'
#return render_template("something.html")
#Above defaults to a html file in a folder called Templates, need to replace it with real file paths

@app.route('/create_study', methods=['POST'])
def create_study():
    data = request.json
    
    # Assuming data contains necessary attributes for Study and Sample objects
    sample_data = data.get('sample_data', {})
    study_data = data.get('study_data', {})

    # Create a Sample object
    sample_obj = Sample(
        name=sample_data.get('name', ''),
        id=sample_data.get('id', ''),
        group=sample_data.get('group', ''),
        project=sample_data.get('project', '')
    )

    # Create a Study object
    study_obj = study_entity(
        sample=sample_obj,
        description=study_data.get('description', ''),
        organism=study_data.get('organism', ''),
        tissue=study_data.get('tissue', ''),
        sex=study_data.get('sex', ''),
        cell_line=study_data.get('cell_line', ''),
        mouse_model=study_data.get('mouse_model', ''),
        biometric_provider=study_data.get('biometric_provider', '')
    )

    created_node_id = study_dao.create_study_node(study_obj)
    return f"Study node created with ID: {created_node_id}"

if __name__ == '__main__':
    app.run(debug=True)


if __name__=="__main__":
    app.run(port=2020,host="127.0.0.1",debug=True)