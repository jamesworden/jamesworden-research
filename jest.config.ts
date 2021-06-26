/**
 * Notice that the 'setupFiles' property is pointing to this file
 * itself. The require statement below loads the '.env' environment
 * variables into this file - the jest config file - so tests can
 * have access to them.
 *
 * In other words, this config file is also acting like a loader
 * for environment variables.
 */
require('dotenv').config()

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.config.ts'],
  testMatch: ['<rootDir>/src/**/*.test.ts']
}
