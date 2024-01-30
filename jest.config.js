module.exports = {
    collectCoverageFrom: [
      '<rootDir>/src/**/*.ts'
    ],

    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    testEnvironment: 'node',
    transform: {
      '.+\.ts$': 'ts-jest'
    }
  }