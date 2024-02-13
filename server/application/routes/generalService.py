from . import app,generic_dao
from flask import json, request, jsonify

@app.route('/search_in_field/<node_type>/<node_field>/<search_string>')
def search_in_field(node_type, node_field, search_string):
    response = generic_dao.general_search_in_field(node_field=node_field,node_type=node_type,search_string=search_string)
    return jsonify(response), 200