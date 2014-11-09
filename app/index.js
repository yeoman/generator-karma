'use strict';

var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

module.exports = yeoman.generators.Base.extend({
  init: function () {
    var notEmpty = function (str) {
      return str.split(',').filter(function (check) {
        return check && check !== '';
      });
    };

    this.pkg = require('../package.json');

    this.option('coffee', {
      type: Boolean,
      desc: 'Use CoffeeScript instead of JavaScript',
      defaults: false
    });
    this.options.format = this.options.coffee ? 'coffee' : 'js';

    this.option('base-path', {
      type: String,
      desc: 'Will be used to resolve files and exclude',
      defaults: ''
    });

    this.option('web-port', {
      type: Number,
      desc: 'Web server port to run Karma from',
      defaults: 8080
    });

    this.option('test-framework', {
      type: String,
      desc: 'Specifies which testing framework to use',
      defaults: 'jasmine'
    });
    this.options['test-framework'] = this.options['test-framework'].toLowerCase();

    this.option('browsers', {
      type: String,
      desc: 'What browsers to test in (comma separated)',
      defaults: 'PhantomJS'
    });
    this.options.browsers = notEmpty(this.options.browsers);

    this.option('app-files', {
      type: String,
      desc: 'List of application files (comma separated)',
      defaults: ''
    });
    this.options['app-files'] = notEmpty(this.options['app-files']);

    this.option('files-comments', {
      type: String,
      desc: 'List of comments for files property (comma separated)',
      defaults: ''
    });
    this.options['files-comments'] = notEmpty(this.options['files-comments']);

    this.option('bower-components', {
      type: String,
      desc: 'Optional components to use for testing (comma separated of components)',
      defaults: ''
    });
    this.options['bower-components'] = notEmpty(this.options['bower-components']);

    this.option('bower-components-path', {
      type: String,
      desc: 'Directory where Bower components are installed',
      defaults: 'bower_components'
    });

    this.option('test-files', {
      type: String,
      desc: 'List of test files (comma separated)',
      defaults: ''
    });
    this.options['test-files'] = notEmpty(this.options['test-files']);

    this.option('exclude-files', {
      type: String,
      desc: 'List of files to exclude (comma separated)',
      defaults: ''
    });
    this.options['exclude-files'] = notEmpty(this.options['exclude-files']);

    var files = this.options['bower-components'].map(function (component) {
      return this.options['bower-components-path'] + (
        this.options['bower-components-path'].slice(-1) === '/' ? '' : '/'
      ) + component;
    }.bind(this));

    this.configFiles = [].concat(
      files,
      this.options['app-files'],
      this.options['test-files']
    );

    this.option('plugins', {
      type: String,
      desc: 'Specify Karma plugins (npm modules)',
      defaults: ''
    });
    this.options.plugins = this.options.plugins ? this.options.plugins.split(',') : [];

    // Add browsers to the plugins list
    if (this.options.browsers.length) {
      this.options.browsers.forEach(function (browser) {
        this.options.plugins.push('karma-' + browser.toLowerCase() + '-launcher');
      }.bind(this));
    }

    // Add test-framework to the plugins list
    if (this.options['test-framework']) {
      this.options.plugins.push('karma-' + this.options['test-framework']);
    }

    if (this.options.coffee) {
      this.options.plugins.push('karma-coffee-preprocessor');
    }

    this.option('travis', {
      type: Boolean,
      desc: 'Adds a .travis.yaml file',
      defaults: false
    });

    this.option('template-path', {
      type: String,
      desc: 'Path where the config files should be read from',
      hide: true,
      defaults: '../templates'
    });
    this.option('config-path', {
      type: String,
      desc: 'Path where the config files should be written to',
      hide: true,
      defaults: './test'
    });

    this.option('config-file', {
      type: String,
      desc: 'The config file to populate',
      hide: true,
      defaults: ''
    });

    this.option('gruntfile-path', {
      type: String,
      desc: 'Path to a Gruntfile to edit',
      defaults: ''
    });

    if (!this.options['config-file']) {
      this.options['config-file'] = 'karma.conf.' + this.options.format;
    }
  },

  makeConfig: function () {
    this.sourceRoot(path.join(__dirname, this.options['template-path']));

    this.templateArray = function (files, comments, coffee) {
      var str = [];
      _.each(comments, function (comment) {
        str.push('\n      ' + (coffee ? '# ' : '// ') + comment);
      });
      _.uniq(files).forEach(function (item, index) {
        str.push('\n      \'' + item + '\'');
        if (index + 1 !== files.length) {
          if (!coffee) {
            str.push(',');
          }
        }
      });
      str.push('\n    ');
      return str.join('');
    };

    this.template(
      this.options['config-file'],
      path.join(this.options['config-path'], this.options['config-file'])
    );
  },

  writeGruntFile: function () {
    if (!this.options['gruntfile-path']) {
      return;
    }

    this.gruntfile.loadNpmTasks('grunt-karma');
    this.gruntfile.insertConfig(
      'karma',
      JSON.stringify({
        unit: {
          options: {
            'autoWatch': false,
            'browsers': this.options.browsers,
            'configFile': [
              this.options['config-path'],
              '/',
              this.options['config-file']
            ].join(''),
            'singleRun': true
          }
        }
      })
    );
    this.gruntfile.registerTask('test', ['karma']);
  },

  setupTravis: function () {
    if (!this.options.travis) {
      return;
    }

    this.copy('travis.yml', '.travis.yml');

    var done = this.async();
    var packageJson = path.join(
      this.options.cwd || process.cwd(),
      'package.json'
    );

    fs.readFile(packageJson, { encoding: 'utf-8' }, function (err, content) {
      var data;
      if (err) {
        this.log.error('Could not open package.json for reading.', err);
        done();
        return;
      }

      try {
        data = JSON.parse(content);
      } catch (err) {
        this.log.error('Could not parse package.json.', err);
        done();
        return;
      }

      if (data.scripts && data.scripts.test) {
        this.log.writeln(
          'Test script already present in package.json. Skipping rewriting.'
        );
        done();
        return;
      }

      data.scripts = data.scripts || {};
      data.scripts.test = 'grunt test';

      fs.writeFile(packageJson, JSON.stringify(data, null, 2), done);
    }.bind(this));
  },

  installDeps: function () {
    if (!this.options['skip-install']) {
      this.on('end', function () {
        this.options.plugins.push('grunt-karma');
        if (this.options.coffee) {
          this.options.plugins.push('coffee-script');
        }
        this.npmInstall(this.options.plugins, {
          saveDev: true
        });
      });
    }
  }
});
