require('angular');
require('angular-mocks');
require('../src/angular-modal-service');

// require all modules ending in ".spec" from the
// current directory and all subdirectories
let testsContext = require.context(".", true, /.spec.js$/);
testsContext.keys().forEach(testsContext);
