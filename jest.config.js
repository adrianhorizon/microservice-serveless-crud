module.exports = {

  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover',
  ],
  moduleDirectories: [
    'node_modules',
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'ts',
    'tsx',
    'node',
  ],
  testEnvironment: 'node',
};
