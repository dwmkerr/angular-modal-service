//  Require the polyfill for PhantomJS, angular, mocks and the main library.
require('babel-polyfill');
require('angular');
require('angular-mocks');
require('../src/angular-modal-service');

//  Require all our specs, execute them.
var testsContext = require.context('./', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);