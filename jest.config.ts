require('dotenv').config()

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.config.ts'],
  testMatch: ['<rootDir>/tests/unit/**/*.test.ts']
}
