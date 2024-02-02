def serialize_node(node):
    """Serialize a Neo4j Node object to a dictionary."""
    serialized_node = {}
    for key, value in node.items():
        # Convert Node properties to native Python types if needed
        serialized_node[key] = value
    return serialized_node
