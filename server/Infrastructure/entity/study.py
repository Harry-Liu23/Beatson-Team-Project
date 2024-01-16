# TODO should be in application.models
import flask
import neo4j
import os

class study:
    def __init__(self,accession,study_type,publication,organism,description,num_samples):
        self.accession = accession
        self.study_type = study_type
        self.publication = publication
        self.organism = organism
        self.description = description
        self.num_samples = num_samples

    def get_accession(self):
        return self.accession

    def get_description(self):
        return self.description

    def get_study_type(self):
        return self.study_type

    def get_publication(self):
        return self.publication

    def get_organism(self):
        return self.organism

    def get_num_samples(self):
        return self.num_samples