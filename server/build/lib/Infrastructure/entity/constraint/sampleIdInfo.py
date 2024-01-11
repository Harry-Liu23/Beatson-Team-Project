class sampleIdInfo:
    def __init__(self, name, id, group, project):
        self.sample_name = name
        self.sample_ID = id
        self.sample_group = group
        self.sample_project = project

    def set_sample_name(self, name):
        self.sample_name = name

    def get_sample_name(self):
        return self.sample_name
    
    def set_sample_ID(self, id):
        self.sample_ID = id

    def get_sample_ID(self):
        return self.sample_ID
    
    def set_sample_group(self, group):
        self.sample_group = group

    def get_sample_group(self):
        return self.sample_group
    
    def set_sample_project(self, project):
        self.sample_project = project

    def get_sample_project(self):
        return self.sample_project
