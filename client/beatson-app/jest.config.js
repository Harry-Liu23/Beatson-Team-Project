module.exports = {

    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
      },

    moduleNameMapper: {
        '\\.module\\.css$': '<rootDir>/__mocks__/styleMock.js',
      },

    testEnvironment: 'jsdom',
  };