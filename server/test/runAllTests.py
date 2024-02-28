import unittest
from . import studyDaoTests, experimentDaoTests, sampleDaoTests, searchesTests,allDeleteTests

def suite():
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(studyDaoTests.testStudy))
    suite.addTest(unittest.makeSuite(experimentDaoTests.testExperimentCreation))
    suite.addTest(unittest.makeSuite(sampleDaoTests.testStudyCreation))
    suite.addTest(unittest.makeSuite(searchesTests.testSearches))
    suite.addTest(unittest.makeSuite(allDeleteTests.allDeleteTests))
    return suite

if __name__ == "__main__":
    # Start test discovery in 'tests' directory
    runner = unittest.TextTestRunner()
    runner.run(suite())