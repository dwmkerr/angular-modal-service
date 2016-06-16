var path = require('path');

module.exports = {

  //  Defines the entrypoint of our application.
  entry: path.resolve(__dirname, 'src/angular-modal-service.js'),

  //  Bundle to ./dst.
  output: {
    path: path.resolve(__dirname, 'dst'),
    filename: 'angular-modal-service.js'
  },
  
  //  Make sure we include sourcemaps. This is for the bundled
  //  code, not the uglfied code (we uglify with npm run build,
  //  see package.json for details).
  devtool: 'source-map',

  //  Define externals (things we don't pack).
  externals: {
    angular: 'angular',
  },

  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: [
        path.resolve('node_modules/')
      ],
      loader: 'babel'
    },{
      test: /\.js$/,
      include: path.resolve('src/'),
      loader: 'isparta'
    }]
  },

  babel: {
    presets: ['es2015']
  },
};
