var path = require('path');
var webpackConfig = require('./webpack.config.js');

//  We'll use the webpack config already defined, but take
//  away the entrypoint.
webpackConfig.mode = 'development';

//  Normally we exlcude angular from the packed bundle for consumers. But when
//  testing, we need it. So make sure to remove any excludes.
webpackConfig.externals = {};

webpackConfig.module.rules.push({
  test: /\.js$/,
  use: { loader: 'istanbul-instrumenter-loader' },
  include: path.resolve('src')
});

//  Add isparta in when running karma tests only
// webpackConfig.module.preLoaders.push({
  // test: /\.js$/,
  // include: path.resolve('src/'),
  // loader: 'isparta'
// });

module.exports = function(config) {
  config.set({

    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      //  Our specs
      'test/index.js',
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    // test results reporter to use
    reporters: ['progress', 'coverage-istanbul', 'junit'],

    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: path.join(__dirname, './artifacts/coverage'),
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
    },

    junitReporter: {
      outputDir: './artifacts/tests',
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
    browsers: ['ChromeHeadless'],

    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    background: false
  });
};
