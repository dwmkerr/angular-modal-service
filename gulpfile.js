var gulp = require('gulp');
var path = require('path');
var open = require('gulp-open');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var express = require('express');
var connectLivereload = require('connect-livereload');
var opn = require('opn');
var karma = require('karma').server;
var header = require('gulp-header');

//  Copies bower dependencies into the samples/vendor folder.
gulp.task('vendor', function() {

  gulp.src('bower_components/bootstrap/dist/**/*.*')
    .pipe(gulp.dest('samples/vendor/bootstrap'));

  gulp.src(
    [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js'
    ])
    .pipe(gulp.dest('samples/vendor/angular'));

  gulp.src('bower_components/jquery/dist/*.*')
    .pipe(gulp.dest('samples/vendor/jquery'));

});

//  Builds the js code.
gulp.task('js', function() {

  return gulp.src('src/angular-modal-service.js')
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('./dst'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(header('/*<%= pkg.name %> v<%= pkg.version %> - <%= pkg.homepage %> */\n', {pkg: require('./package.json') } ))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dst'));

});

//  Lints the code.
gulp.task('jshint', function() {
  return gulp.src(['*.js', 'src/*.js', 'test/**.js', 'samples/**/*.js', '!samples/vendor/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

//  Serves the sample app and kicks off livereload.
gulp.task('serve', function() {

  //  Create the app. Serve the samples and the dist.
  var app = express();
  app.use(connectLivereload());
  app.use(express.static(path.join(__dirname, 'samples')));
  app.use(express.static(path.join(__dirname, 'src')));
  app.listen(3000);
  console.log('Kick off some modals on port 3000!');

});

//  Starts the livereload server.
var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
});

//  Notifies livereload of changes detected
function notifyLivereload(event) {
  tinylr.changed({
    body: {
      files: [path.relative(__dirname, event.path)]
    }
  });
}

//  Test the code.
gulp.task('test', function (done) {
  karma.start({
    configFile: path.join(__dirname, './test/karma.config.js'),
    singleRun: true
  }, done);
});

//  Sets up watchers.
gulp.task('watch', function() {

  //  When the source file changes, build it and test it. Whenever any JS changes hint it.
  gulp.watch(['src/*.js'], ['js']);
  gulp.watch(['*.js', 'src/*.js', 'test/**.js', 'samples/**/*.js', '!samples/vendor/**/*.js'], ['jshint']);

  //  When our source or tests change, build, retest and livereload.
  gulp.watch(['src/*.js', 'test/**/*.spec.js'], ['test'], notifyLivereload);
  
  //  When our samples change, livereload.
  gulp.watch(['samples/**/*.*'], notifyLivereload);

});

//  The default task sets up the vendor files, builds, serves and watches.
gulp.task('default', ['vendor', 'js', 'serve', 'livereload', 'watch'], function() {
  opn('http://localhost:3000');
});