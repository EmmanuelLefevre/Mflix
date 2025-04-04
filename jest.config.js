require('dotenv').config({ path: '.env.test' });

/** @type {import('jest').Config} */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ["**/tests/**/*.spec.ts"],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  },
  setupFiles: ["<rootDir>/jest.setup.js"]
};
