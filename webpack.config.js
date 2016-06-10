var path = require('path');

module.exports = {

  //  Defines the entrypoint of our application.
  entry: path.resolve(__dirname, 'src/angular-modal-service.js'),

  //  Bundle to ./dst.
  output: {
    path: path.resolve(__dirname, 'dst'),
    filename: 'angular-modal-service.js'
  },
  
  //  Make sure we include sourcemaps.
  devtool: 'source-map',

  //  Define externals (things we don't pack).
  externals: {
    angular: 'angular',
  },

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
};
