class experiment:
    def __init__(self,experiment_id, description, num_samples):
        self.experiemnt_id = experiment_id
        self.description = description
        self.num_samples = num_samples

    def get_experiment_id(self):
        return self.experiemnt_id;

    def get_description(self):
        return self.description

    def get_num_samples(self):
        return self.num_samples