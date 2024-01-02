class sample:
    def __init__(self,name,id,group,project):
        self.sample_name = name
        self.sample_ID = id
        self.sample_group = group
        self.sample_project = project

    def set_sample_name(self,name):
        self.sample = name

    def get_sample_name(self):
        return self.sample
    
    def set_sample_ID(self,id):
        self.sample = id

    def get_sample_ID(self):
        return self.id
    
    def set_sample_group(self,group):
        self.group = group

    def get_sample_group(self):
        return self.group
    
    def set_sample_project(self,project):
        self.project = project

    def get_sample_project(self):
        return self.project
    

    
