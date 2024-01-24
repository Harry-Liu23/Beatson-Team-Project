class experiment:
    def __init__(self,experiment_id, description, num_samples, accession):
        self.experiemnt_id = experiment_id
        self.description = description
        self.accession = accession

    def get_experiment_id(self):
        return self.experiemnt_id;

    def get_description(self):
        return self.description

    
    def get_accession(self):
        return self.accession
    
