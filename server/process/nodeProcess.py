def serialize_node(node):
    """Serialize a Neo4j Node object to a dictionary."""
    serialized_node = {}
    for key, value in node.items():
        # Convert Node properties to native Python types if needed
        serialized_node[key] = value
    return serialized_node

def get_node_type_and_data(data):
    if not data:
        return None, None

    # Assuming data contains a single key representing the node type
    node_type, node_data = next(iter(data.items()))
    return node_type, node_data