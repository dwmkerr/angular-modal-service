var path = require('path');
var webpackConfig = require('./webpack.config.js');

//  We'll use the webpack config already defined, but take
//  away the entrypoint.
webpackConfig.entry = {};
webpackConfig.externals = {};
//  Add isparta in when running karma tests only
webpackConfig.module.preLoaders.push({
  test: /\.js$/,
  include: path.resolve('src/'),
  loader: 'isparta'
});

module.exports = function(config) {
  config.set({

    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      //  Dependencies
      // './node_modules/angular/angular.js',
      // './node_modules/angular-mocks/angular-mocks.js',

      //'src/angular-modal-service.js',

      //  Our specs
      './test/index.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      //'../test/*.spec.js': ['webpack'],
      './test/index.js': ['webpack'],
      'src/angular-modal-service.js': ['webpack', 'coverage']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true // no spam!
    },  

    // test results reporter to use
    reporters: ['progress', 'coverage', 'junit'],

    // tell karma how you want the coverage results
    coverageReporter: {
      reporters: [{
          type: 'lcov',
          dir: 'build/coverage/'
        },{
          type: 'html', 
          dir: 'build/coverage/'
        }
      ]
    },

    // junit output is used by jenkins  
    junitReporter: {
      outputDir: 'build',
      outputFile: 'test-results.xml',
      useBrowserName: false
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    background: false

  });
};
