require('dotenv').config({ path: '.env.test' });

/** @type {import('jest').Config} */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    "**/tests/**/*.spec.ts",
    "**/lib/jwt-secrets-config.spec.ts"
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/lib/!(jwt-secrets-config.spec.ts)',
    '<rootDir>/lib/(mongodb.ts)',
    '<rootDir>/lib/(check-collection-exists.ts)',
  ],
  setupFiles: ["<rootDir>/jest.setup.js"]
};
