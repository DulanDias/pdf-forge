module.exports = {
    preset: 'ts-jest', // Use ts-jest to transpile TypeScript
    testEnvironment: 'node', // Use Node.js as the test environment
    transform: {
      '^.+\\.ts?$': 'ts-jest', // Use ts-jest to transform TypeScript files
    },
    moduleFileExtensions: ['ts', 'js'], // Support both .ts and .js file extensions
    testMatch: ['**/tests/**/*.test.ts'], // Set the test file pattern (adapt if needed)
    transformIgnorePatterns: ['node_modules/'], // Ignore node_modules
  };
  