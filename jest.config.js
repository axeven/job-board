const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Test environment
  testEnvironment: 'jest-environment-jsdom',
  
  // Module name mapping for absolute imports  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
  },
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'middleware.ts',
    '!src/**/*.d.ts',
    '!src/app/**', // Exclude Next.js app directory for now
    '!**/*.config.*',
    '!**/node_modules/**'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Transform configuration
  preset: 'ts-jest',
  
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)