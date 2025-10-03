module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/background', '<rootDir>/content', '<rootDir>/popup', '<rootDir>/options', '<rootDir>/utils'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'background/**/*.ts',
    'content/**/*.ts',
    'popup/**/*.ts',
    'options/**/*.ts',
    'utils/**/*.ts',
    '!**/*.test.ts',
    '!**/test/**'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
