def serialize_node(node):
    """Serialize a Neo4j Node object to a dictionary."""
    serialized_node = {}
    for key, value in node.items():
        # Convert Node properties to native Python types if needed
        serialized_node[key] = value
    return serialized_node


# This currently only works for search_all_nodes for genericDao
def serialize_node_with_label(record):
    node_data = record["n"]
    labels = record["labels"]
    label = labels[0] if labels else "UnknownLabel"  # Use the first label if available, or use "UnknownLabel"
    
    serialized_node = {label: {}}
    for key, value in node_data.items():
        # Convert Node properties to native Python types if needed
        serialized_node[label][key] = value
    return serialized_node

def get_node_type_and_data(data):
    """get you the node_type and the node itself"""
    if not data:
        return None, None

    # Assuming data contains a single key representing the node type
    node_type, node_data = next(iter(data.items()))
    return node_type, node_data

def group_by_key(data):
    grouped_data = {}
    for entry in data:
        node_type, node_data = entry.popitem()
        grouped_data.setdefault(node_type, []).append(node_data)
    return grouped_data