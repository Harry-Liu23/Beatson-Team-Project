import unittest
from . import studyDaoTests, experimentDaoTests, sampleDaoTests, searchesTests,allDeleteTests, datasetDaoTests

def suite():
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    suite.addTest(loader.loadTestsFromTestCase(studyDaoTests.testStudy))
    suite.addTest(loader.loadTestsFromTestCase(experimentDaoTests.testExperimentCreation))
    suite.addTest(loader.loadTestsFromTestCase(sampleDaoTests.testStudyCreation))
    suite.addTest(loader.loadTestsFromTestCase(datasetDaoTests.testDatasetCreation))
    suite.addTest(loader.loadTestsFromTestCase(searchesTests.testSearches))
    suite.addTest(loader.loadTestsFromTestCase(allDeleteTests.allDeleteTests))
    return suite

if __name__ == "__main__":
    # Start test discovery in 'tests' directory
    runner = unittest.TextTestRunner()
    runner.run(suite())