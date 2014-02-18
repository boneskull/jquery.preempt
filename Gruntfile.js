'use strict';

module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: __filename
      },
      all: {
        src: ['<%= pkg.main %>', 'spec/jquery.preempt.spec.js']
      }
    },

    jsdoc: {
      main: {
        jsdoc: './node_modules/.bin/jsdoc',
        src: ['<%= pkg.main %>', 'README.md']
      },
      options: {
        configure: 'jsdoc.conf.json'
      }

    },

    uglify: {
      main: {
        files: {
          'jquery.preempt.min.js': ['<%= pkg.main %>']
        }
      }
    },

    coveralls: {
      options: {
        coverage_dir: 'coverage/'
      }
    },

    bower: {
      install: {},
      options: {
        targetDir: 'spec/components',
        bowerOptions: {
          production: false
        }
      }
    },

    clean: ['doc'],

    jquerymanifest: {
      options: {
        source: grunt.file.readJSON('package.json')
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json', 'jquery.preempt.jquery.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'], // '-a' for all files
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin'
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      main: {
         singleRun: true
      }
    }

  });

  require('matchdep').filterDev(
    ['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['jshint', 'bower', 'karma', 'coveralls']);
  grunt.registerTask('docs', ['clean', 'jsdoc']);
  grunt.registerTask('build', ['uglify', 'jquerymanifest']);
  grunt.registerTask('default', ['test', 'build', 'docs']);
};
