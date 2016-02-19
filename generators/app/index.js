'use strict';
var path = require('path');
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

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
      desc: 'Specifies which testing frameworks to use (array or csv)',
      defaults: 'jasmine'
    });

    this.option('browsers', {
      desc: 'What browsers to test in (array or csv)',
      defaults: 'PhantomJS'
    });

    this.option('app-files', {
      desc: 'List of application files (array or csv)',
      defaults: ''
    });

    this.option('files-comments', {
      desc: 'List of comments for files property (array or csv)',
      defaults: ''
    });

    this.option('bower-components', {
      desc: 'Optional components to use for testing (array or csv)',
      defaults: ''
    });

    this.option('bower-components-path', {
      type: String,
      desc: 'Directory where Bower components are installed',
      defaults: 'bower_components'
    });

    this.option('test-files', {
      desc: 'List of test files (array or csv)',
      defaults: ''
    });

    this.option('exclude-files', {
      desc: 'List of files to exclude (array or csv)',
      defaults: ''
    });

    this.option('plugins', {
      desc: 'Specify Karma plugins npm module name (array or csv)',
      defaults: ''
    });

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

    this.option('config-file', {
      type: String,
      desc: 'The config file to populate',
      hide: true,
      defaults: 'karma.conf.js'
    });

  },

  configuring: function () {
    var inputToArray = function (str) {
      str = Array.isArray(str) ? str : str.split(',');
      return str.filter(function (check, index, arr) {
        return check && check !== '' && arr.indexOf(check) === index;
      });
    };

    var frameworks = inputToArray(this.options.frameworks);
    var browsers = inputToArray(this.options.browsers);

    // Convert the options to template usable strings
    this.templateSettings = {
      basePath: this.options['base-path'],
      port: this.options['web-port'],
      frameworks: frameworks,
      sourceFiles: [].concat(
        inputToArray(this.options['bower-components']).map(function (bc) {
          return path.join(this.options['bower-components-path'], bc);
        }, this),
        inputToArray(this.options['app-files']),
        inputToArray(this.options['test-files'])
      ),
      sourceFileComments: inputToArray(this.options['files-comments']),
      excludeFiles: inputToArray(this.options['exclude-files']),
      browsers: browsers,
      plugins: [].concat(
        inputToArray(this.options.plugins),
        browsers.map(function (browser) {
          return 'karma-' + browser.toLowerCase() + '-launcher';
        }),
        frameworks.map(function (framework) {
          return 'karma-' + framework;
        })
      ),
      templateArray: function (files, comments) {
        var str = (comments || []).map(function (comment) {
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
    };

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

    if (this.options['template-path'] !== 'templates') {
      this.config.set('template-path', this.options['template-path']);
    }
  },

  writing: function () {
    var configName = this.options['config-file'];
    var configFile = path.join(this.options['config-path'], configName);

    if (this.options['template-path'] === 'templates') {
      this.options['template-path'] = path.join(__dirname, 'templates');
    }

    this.sourceRoot(this.options['template-path']);

    // Copy the Karma.config template
    this.fs.copyTpl(
      this.templatePath(configName),
      this.destinationPath(configFile),
      this.templateSettings
    );

    // Write a `npm test` line in the package.json
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {
      scripts: {},
      dependencies: {},
      devDependencies: {}
    });
    pkg.scripts = pkg.scripts || {};
    var command = 'karma start ' + configFile;
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
    var plugins = this.templateSettings.plugins;

    // Install Karma to run the tests
    plugins.unshift('karma');

    // Install some peerDeps since they don't get automatically installed
    if (plugins.indexOf('karma-jasmine')) {
      plugins.push('jasmine-core');
    }
    if (plugins.indexOf('karma-phantomjs-launcher')) {
      plugins.push('phantomjs-prebuilt');
    }
    this.npmInstall(plugins, {saveDev: true});
  }
});
