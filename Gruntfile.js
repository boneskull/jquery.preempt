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
        src: __filename
      },
      main: {
        jshintrc: true,
        src: '<%=pkg.main%>'
      },
      test: {
        jshintrc: true,
        src: 'test/jquery.preempt.spec.js'
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      all: {
        files: [
          '<%= jshint.gruntfile.src %>', '<%= jshint.main.src %>',
          '<%= jshint.test.src %>', 'test/runner.html.ejs'
        ],
        tasks: ['test']
      }
    },
    mocha: {
      test: {
        src: ['test/runner.html'],
        run: true
      }
    },
    jsdoc: {
      main: {
        src: ['<%= pkg.main %>', 'test/*.spec.js', 'README.md'],
        options: {
          configure: 'jsdoc.conf.json'
        }
      }
    },
    mocha_html: {
      runner: {
        src: ['<%= pkg.main %>'],
        test: ['test/*.spec.js'],
        assert: 'chai',
        template: 'test/runner.html.ejs'
      }
    },
    uglify: {
      main: {
        files: {
          'jquery.preempt.min.js': ['<%= pkg.main %>']
        }
      }
    },
    bower: {
      install: {},
      options: {
        targetDir: 'test/components',
        bowerOptions: {
          production: false
        }
      }
    },
    clean: ['doc'],
    jquerymanifest: {
      options: {
        source: grunt.file.readJSON('bower.json'),
        overrides: {
          name: "jquery.preempt",
          author: {
            name: "Christopher Hiller",
            email: "chiller@badwing.com",
            url: "http://boneskull.github.io"
          },
          homepage: "http://github.com/boneskull/jquery.preempt"
        }
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
        push: false,
        pushTo: 'origin'
      }
    }

  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['jshint', 'mocha_html', 'bower', 'mocha']);
  grunt.registerTask('docs', ['clean', 'jsdoc']);
  grunt.registerTask('build', ['uglify', 'jquerymanifest']);
  grunt.registerTask('default', ['test', 'docs', 'build']);
};
