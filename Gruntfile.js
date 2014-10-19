/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      src: ['Gruntfile.js', 'server.js', 'src/**/*.js', 'test/**/*.js', 'samples/**/*.js']
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapName: 'dst/angular-modal-service.min.js.map',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> github.com/dwmkerr/angular-modal-service */'
      },
      src: {
        files: {
          'dst/angular-modal-service.min.js': ['src/angular-modal-service.js']
        }
      }
    },

    copy: {
      src: {
        expand: true,
        cwd: 'src/',
        src: '*',
        dest: 'dst/',
      }
    },

    karma: {
      options: {
        configFile: 'test/karma.config.js',
        background: false
      },
      silent: {
        browsers: ['PhantomJS']
      },
      debug: {
        browsers: ['Chrome'],
        preprocessors: { }, // no preprocessors, they mangle source
        reporters: [], // no reporters needed when debugging
        singleRun: false
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.js', 'test/**/*.js'],
        tasks: ['jshint', 'karma:silent', 'release']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['jshint', 'karma:silent', 'watch']);
  grunt.registerTask('dev', ['jshint', 'karma:silent', 'watch']);
  grunt.registerTask('release', ['uglify', 'copy']);
};