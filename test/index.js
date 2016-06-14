// require all modules ending in ".spec" from the
// current directory and all subdirectories
var testsContext = require.context(".", true, /.spec.js$/);
testsContext.keys().forEach(testsContext);