class sample:
 
 
    def __init__(self,sample,description,organism,tissue,sex,cell_line,mouse_model,biometric_provider,experiments_id):
        self.sample = sample
        self.description = description
        self.organism = organism
        self.tissue = tissue
        self.sex = sex
        self.cell_line = cell_line
        self.mouse_model = mouse_model
        self.biometric_provider = biometric_provider
        self.experiments_id = experiments_id


    def get_sample(self):
        return self.sample


    def get_description(self):
        return self.description


    def get_organism(self):
        return self.organism


    def get_tissue(self):
        return self.tissue


    def get_sex(self):
        return self.sex


    def get_cell_line(self):
        return self.cell_line


    def get_mouse_model(self):
        return self.mouse_model


    def get_biometric_provider(self):
        return self.biometric_provider

    
    def get_study_experiments_id(self):
        return self.experiments_id