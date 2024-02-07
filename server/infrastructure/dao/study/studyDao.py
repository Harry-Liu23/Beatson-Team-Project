import flask as flask
from server.process.nodeProcess import serialize_node


class studyDao:

    def __init__(self, driver):
        self.driver = driver

    def get_all_experiments(self, accession):
        """Returns all Experiments attached to a Study"""
        get_all_query = (
            "MATCH (study:Study {accession: $accession})-[*1]-(experiment: Experiment) "
            "RETURN experiment"
        )
        parameters = {
            "accession": accession
        }
        with self.driver.session() as session:
            result = session.run(get_all_query, parameters=parameters)
            records = [serialize_node(record["experiment"]) for record in result]
            return records

    def count_num_experiments(self, accession):
        """Count the number of experiments attached to a Study"""
        count_query = (
            "MATCH (study:Study {accession: $accession})-[:CONTAINS]->(experiment:Experiment) "
            "RETURN COUNT(experiment) AS num_experiments"
        )

        parameters = {
            "accession": accession
        }

        with self.driver.session() as session:
            result = session.run(count_query, parameters=parameters)
            count_result = result.single()
            if count_result:
                return count_result['num_experiments']
            else:
                return 0