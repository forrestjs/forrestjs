const path = require('path');
const getGlobals = require('./jest.globals');

module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  globals: getGlobals(),
  globalSetup: path.join(__dirname, 'jest.setup.js'),
};
