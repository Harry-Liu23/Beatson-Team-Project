import unittest
from . import studyDaoTests, experimentDaoTests, sampleDaoTests, searchesTests,allDeleteTests, datasetDaoTests

def suite():
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    suite.addTest(loader.loadTestsFromTestCase(studyDaoTests.test_study))
    suite.addTest(loader.loadTestsFromTestCase(experimentDaoTests.test_experiment))
    suite.addTest(loader.loadTestsFromTestCase(sampleDaoTests.test_sample))
    suite.addTest(loader.loadTestsFromTestCase(datasetDaoTests.test_dataset))
    suite.addTest(loader.loadTestsFromTestCase(searchesTests.test_all_searches))
    suite.addTest(loader.loadTestsFromTestCase(allDeleteTests.tests_all_delete))
    return suite

if __name__ == "__main__":
    # Start test discovery in 'tests' directory
    runner = unittest.TextTestRunner()
    runner.run(suite())