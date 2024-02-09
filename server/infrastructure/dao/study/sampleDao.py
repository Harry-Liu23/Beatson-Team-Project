import flask as flask
from . import serialize_node


class sampleDao:


    def __init__(self, driver):
        self.driver = driver