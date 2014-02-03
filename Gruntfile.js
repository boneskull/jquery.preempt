/*global module:false*/
module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jshint: {
      gruntfile: {
        jshintrc: true,
        src: 'Gruntfile.js'
      },
      main: {
        jshintrc: true,
        src: ['<%=pkg.main%>', 'test/*-spec.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      main: {
        files: '<%= jshint.main.src %>',
        tasks: ['jshint:main', 'mocha']
      }
    },
    mocha: {
      test: {
        src: ['test/runner.html']
      }
    },
    jsdoc: {
      main: {
        src: ['<%= pkg.main %>', 'test/*-spec.js', 'README.md'],
        options: {
          configure: 'jsdoc.conf.json'
        }
      }
    },
    mocha_html: {
      runner: {
        src: ['<%= pkg.main %>'],
        test: ['test/*-spec.js'],
        assert: 'chai',
        checkLeaks: false,
        template: 'test/runner.html.ejs'
      }
    },
    'bower-install': {

      main: {
        src: ['test/runner.html'],
        devMode: true
      }
    },
    uglify: {
      main: {
        files: {
          'jquery.preempt.min.js': ['<%= pkg.main %>']
        }
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.loadNpmTasks('grunt-mocha-html');

  // Default task.
  grunt.registerTask('default',
    ['jshint', 'mocha_html', 'bower-install', 'mocha', 'jsdoc', 'uglify']);

};
