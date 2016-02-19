var path = require('path');

module.exports = function(config) {  
  config.set({

    //  Frameworks to use.
    frameworks: ['jasmine'],

    //  Browsers to use.
    browsers: ['PhantomJS'],

    //  Input files.
    files: [
      //  Dependencies, including polyfill for 'bind'.
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'node_modules/babel-polyfill/dist/polyfill.js',

      //  Source
      'src/angular-modal-service.js',

      //  Our specs
      'test/**/*.spec.js'
    ],

    //  Preprocessors.
    preprocessors: {
      'src/angular-modal-service.js': ['webpack'],
      'test/**/*.spec.js': ['webpack'],
    },

    reporters: ['progress', 'coverage', 'junit'],

    //  Coverage reporter configuration.
    coverageReporter: {
      reporters: [{
          type: 'lcov',
          dir: 'build/coverage/'
        },{
          type: 'html', 
          dir:'build/coverage/'
        }
      ]
    },

    //  jUnit reporter configuration, used by Travis.
    junitReporter: {
      outputFile: 'build/test-results.xml'
    },

    singleRun: true,

    webpack: {
      //  Use babel for anything that is *.js or *.jsx.
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
              presets: ['es2015']
            }
          }
        ]
      }
    },

    webpackServer: {
      noInfo: true
    }
  });
};