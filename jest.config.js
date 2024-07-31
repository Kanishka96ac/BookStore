module.exports = {
    testEnvironment: 'node',
    setupFiles: ['./jest.setup.js'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    verbose: true,
    testTimeout: 10000, // Increase timeout to 10 seconds
  };
  