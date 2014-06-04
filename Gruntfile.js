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
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      files: {
        'dst/angular-modal-service.min.js': ['src/angular-modal-service.js']
      }
    },

    karma: {
      unit: {
        configFile: 'test/karma.config.js',
        background: false,
        browsers: ['PhantomJS']
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.js', 'test/**/*.js'],
        tasks: ['jshint', 'karma']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('dev', ['jshint', 'karma', 'watch']);
  grunt.registerTask('release', ['uglify']);
};