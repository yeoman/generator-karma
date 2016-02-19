'use strict';

var join = require('path').join;
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('karma:app Options test', function () {
  it('uses all options with csv', function (done) {
    var config = {
      'base-path': 'new base-path',
      'web-port': '80',
      'frameworks': 'mocha,chai,sinon',
      'browsers': 'Chrome,PhantomJS,Firefox',
      'app-files': 'public/**/*.js,apps/*.js',
      'files-comments': 'bower:js,endbower',
      'bower-components': 'jQuery',
      'bower-components-path': 'app',
      'test-files': 'tests/spec/*.js',
      'exclude-files': 'exclude/files.js',
      'plugins': 'qunit,jazzy',
      'template-path': join(__dirname, '.'),
      'config-path': 'testing',
      'config-file': 'config.mock.json'
    };

    var inputToArray = function (str) {
      str = Array.isArray(str) ? str : str.split(',');
      return str.filter(function (check, index, arr) {
        return check && check !== '' && arr.indexOf(check) === index;
      });
    };

    helpers
    .run(join(__dirname, '../generators/app'))
    .withOptions(config)
    .on('end', function () {
      assert.file([
        'testing/config.mock.json',
        'package.json',
        '.yo-rc.json'
      ]);
      assert.jsonFileContent('.yo-rc.json', {
        'generator-karma': {
          'base-path': config['base-path'],
          'web-port': config['web-port'],
          'frameworks': config['frameworks'],
          'browsers': config['browsers'],
          'app-files': config['app-files'],
          'files-comments': config['files-comments'],
          'bower-components': config['bower-components'],
          'bower-components-path': config['bower-components-path'],
          'test-files': config['test-files'],
          'exclude-files': config['exclude-files'],
          'plugins': config['plugins'],
          'template-path': config['template-path']
        }
      });
      assert.jsonFileContent('testing/config.mock.json', {
        'base-path': config['base-path'],
        frameworks: inputToArray(config.frameworks),
        files: [
          config['bower-components-path'] + '/' + config['bower-components'],
          config['app-files'],
          config['test-files']
        ].join(','),
        exclude: inputToArray(config['exclude-files']),
        port: config['web-port'],
        browsers: inputToArray(config.browsers),
        plugins: inputToArray(config.plugins)
      });

      done()
    });
  });

  it('uses all options with array', function (done) {
    var config = {
      'base-path': 'new base-path',
      'web-port': '80',
      'frameworks': ['mocha', 'chai', 'sinon'],
      'browsers': ['Chrome', 'PhantomJS', 'Firefox'],
      'app-files': ['public/**/*.js', 'apps/*.js'],
      'files-comments': ['bower:js', 'endbower'],
      'bower-components': ['jQuery'],
      'bower-components-path': 'app',
      'test-files': 'tests/spec/*.js',
      'exclude-files': 'exclude/files.js',
      'plugins': 'qunit,jazzy',
      'template-path': join(__dirname, '.'),
      'config-path': 'testb',
      'config-file': 'config.mock.json'
    };

    helpers
    .run(join(__dirname, '../generators/app'))
    .withOptions(config)
    .on('end', function () {
      assert.file([
        'testb/config.mock.json',
        'package.json',
        '.yo-rc.json'
      ]);
      assert.jsonFileContent('.yo-rc.json', {
        'generator-karma': {
          'base-path': config['base-path'],
          'web-port': config['web-port'],
          'frameworks': config['frameworks'],
          'browsers': config['browsers'],
          'app-files': config['app-files'],
          'files-comments': config['files-comments'],
          'bower-components': config['bower-components'],
          'bower-components-path': config['bower-components-path'],
          'test-files': config['test-files'],
          'exclude-files': config['exclude-files'],
          'plugins': config['plugins'],
          'template-path': config['template-path']
        }
      });
      assert.jsonFileContent('testb/config.mock.json', {
        'base-path': config['base-path'],
        frameworks: config.frameworks,
        files: [
          config['bower-components-path'] + '/' + config['bower-components'],
          config['app-files'],
          config['test-files']
        ].join(','),
        exclude: config['exclude-files'],
        port: config['web-port'],
        browsers: config.browsers,
        plugins: ['qunit', 'jazzy']
      });

      done()
    });
  });

  it('creates the config in a specified folder', function (done) {
    helpers
      .run(join(__dirname, '../generators/app'))
      .withOptions({'config-path': 'testingFolder'})
      .on('end', function () {
        assert.file([
          'testingFolder/karma.conf.js',
          'package.json',
          '.yo-rc.json'
        ]);
        done()
      });
  });
});
