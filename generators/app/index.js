'use strict';
var path = require('path');
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    var arrayFromString = function (str) {
      return str.split(',').filter(function (check) {
        return check && check !== '';
      });
    };

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

    this.option('frameworks', {
      type: String,
      desc: 'Specifies which testing frameworks to use (comma separated)',
      defaults: 'jasmine'
    });

    this.options.frameworks = arrayFromString(this.options.frameworks);
    this.frameworks = this.options.frameworks.map(function (framework) {
      return framework.toLowerCase();
    });

    this.option('browsers', {
      type: String,
      desc: 'What browsers to test in (comma separated)',
      defaults: 'PhantomJS'
    });

    this.options.browsers = arrayFromString(this.options.browsers);

    this.option('app-files', {
      type: String,
      desc: 'List of application files (comma separated)',
      defaults: ''
    });

    this.options['app-files'] = arrayFromString(this.options['app-files']);

    this.option('files-comments', {
      type: String,
      desc: 'List of comments for files property (comma separated)',
      defaults: ''
    });

    this.options['files-comments'] = arrayFromString(this.options['files-comments']);

    this.option('bower-components', {
      type: String,
      desc: 'Optional components to use for testing (comma separated of components)',
      defaults: ''
    });

    this.options['bower-components'] = arrayFromString(this.options['bower-components']);

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

    this.options['test-files'] = arrayFromString(this.options['test-files']);

    this.option('exclude-files', {
      type: String,
      desc: 'List of files to exclude (comma separated)',
      defaults: ''
    });

    this.options['exclude-files'] = arrayFromString(this.options['exclude-files']);

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

    this.options.plugins = arrayFromString(this.options.plugins)

    // Add browsers to the plugins list
    if (this.options.browsers.length) {
      this.options.browsers.forEach(function (browser) {
        this.options.plugins.push('karma-' + browser.toLowerCase() + '-launcher');
      }.bind(this));
    }

    // Add frameworks to the plugins list
    this.options.plugins = this.options.plugins.concat(this.frameworks.map(function (framework) {
      return 'karma-' + framework;
    }));

    this.option('template-path', {
      type: String,
      desc: 'Path where the config files should be read from',
      hide: true,
      defaults: 'templates'
    });

    this.option('config-path', {
      type: String,
      desc: 'Path where the config files should be written to',
      hide: true,
      defaults: './test'
    });

    this.option('gruntfile-path', {
      type: String,
      desc: 'Path to a Gruntfile to edit',
      defaults: ''
    });

    this.option('config-file', {
      type: String,
      desc: 'The config file to populate',
      hide: true,
      defaults: 'karma.conf.js'
    });

    this.options.configFile = path.join(
      this.options['config-path'], this.options['config-file']
    );
  },

  configuring: function () {
    // Store the options if they were set
    [
      'base-path',
      'web-port',
      'frameworks',
      'browsers',
      'app-files',
      'files-comments',
      'bower-components',
      'bower-components-path',
      'test-files',
      'exclude-files',
      'plugins'
    ].forEach(function (option) {
      var opt = this.options[option];
      if (opt.length) {
        this.config.set(option, opt);
      }
    }, this);

    this.config.set('configFile', this.options.configFile);
    if (this.options['template-path'] !== 'templates') {
      this.config.set('template-path', this.options['template-path']);
    }
  },

  writing: function () {
    this.sourceRoot(path.join(__dirname, this.options['template-path']));


    // Copy the Karma.config template
    this.fs.copyTpl(
      this.templatePath(this.options['config-file']),
      this.destinationPath(this.options.configFile),
      {
        basePath: this.options['base-path'],
        frameworks: this.frameworks,
        fileComments: this.options['files-comments'],
        configFiles: this.configFiles,
        exclude: this.options['exclude-files'],
        port: this.options['web-port'],
        browsers: this.options.browsers,
        plugins: this.options.plugins,
        templateArray: function (files, comments) {
          comments = comments || [];
          var str = comments.map(function (comment) {
            return '\n      // ' + comment;
          });
          files.forEach(function (item, index) {
            str.push('\n      \'' + item + '\'');
            if (index + 1 !== files.length) {
              str.push(',');
            }
          });
          str.push('\n    ');
          return str.join('');
        }
      }
    );

    // If there is a Gruntfile in the root, add a config block for it
    if (
      this.options['gruntfile-path'] ||
      this.fs.exists(this.destinationPath('GruntFile.js'))
    ) {
      this.gruntfile.loadNpmTasks('grunt-karma');
      this.gruntfile.insertConfig(
        'karma',
        JSON.stringify({
          unit: {
            options: {
              autoWatch: false,
              browsers: this.options.browsers,
              configFile: this.options.configFile,
              singleRun: true
            }
          }
        })
      );

      this.gruntfile.registerTask('test', ['karma']);
    }

    // Write a `npm test` line in the package.json
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {
      scripts: {},
      dependencies: {},
      devDependencies: {}
    });
    pkg.scripts = pkg.scripts || {};
    var command = 'karma start ' + this.options.configFile;
    if (!pkg.scripts.test) {
      pkg.scripts.test = command;
      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    } else {
      this.log.writeln(
        'Consider using `"test": "' + command + '"` in your ' +
        'package.json file\'s script section'
      );
    }
  },

  install: function () {
    // Install Karma to run the tests
    this.options.plugins.unshift('karma');

    // Install some peerDeps since they don't get automatically installed
    if (this.options.plugins.indexOf('karma-jasmine')) {
      this.options.plugins.push('jasmine-core');
    }
    if (this.options.plugins.indexOf('karma-phantomjs-launcher')) {
      this.options.plugins.push('phantomjs-prebuilt');
    }
    this.npmInstall(this.options.plugins, {saveDev: true});
  }
});
