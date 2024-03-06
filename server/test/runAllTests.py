import unittest
from . import studyDaoTests, experimentDaoTests, sampleDaoTests, searchesTests,allDeleteTests, datasetDaoTests

def suite():
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    suite.addTest(loader.loadTestsFromTestCase(studyDaoTests.TestStudy))
    suite.addTest(loader.loadTestsFromTestCase(experimentDaoTests.TestExperiment))
    suite.addTest(loader.loadTestsFromTestCase(sampleDaoTests.TestSample))
    suite.addTest(loader.loadTestsFromTestCase(datasetDaoTests.TestDataset))
    suite.addTest(loader.loadTestsFromTestCase(searchesTests.TestAllSearches))
    suite.addTest(loader.loadTestsFromTestCase(allDeleteTests.TestAllDelete))
    return suite

if __name__ == "__main__":
    # Start test discovery in 'tests' directory
    runner = unittest.TextTestRunner()
    runner.run(suite())