'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= pkg.license %> */\n',
    // Task configuration.
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: __filename
      },
      main: {
        src: '<%=pkg.main%>'
      },
      spec: {
        src: 'spec/jquery.preempt.spec.js'
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      all: {
        files: [
          '<%= jshint.gruntfile.src %>', '<%= jshint.main.src %>',
          '<%= jshint.test.src %>', 'spec/runner.html.ejs'
        ],
        tasks: ['test']
      }
    },
    mocha: {
      spec: {
        src: ['spec/runner.html'],
        run: true
      },
      options: {
        reporter: 'node_modules/mocha/lib/reporters/spec'
      }
    },
    jsdoc: {
      main: {
        jsdoc: './node_modules/.bin/jsdoc',
        src: ['<%= pkg.main %>', 'spec/*.spec.js', 'README.md']
      },
      options: {
        configure: 'jsdoc.conf.json'
      }

    },
    mocha_html: {
      runner: {
        src: ['<%= pkg.main %>'],
        test: ['spec/*.spec.js'],
        html: 'spec/runner.html',
        assert: 'chai',
        template: 'spec/runner.html.ejs'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      main: {
        files: {
          'jquery.preempt.min.js': ['<%= pkg.main %>']
        }
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
    }

  });

  require('matchdep').filterDev(
    ['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['jshint', 'mocha_html', 'bower', 'mocha']);
  grunt.registerTask('docs', ['clean', 'jsdoc']);
  grunt.registerTask('build', ['uglify', 'jquerymanifest']);
  grunt.registerTask('default', ['test', 'build', 'docs']);
};
