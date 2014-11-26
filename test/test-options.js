/*global describe, beforeEach, it */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('Karma generator options test', function () {
  it('creates expected options', function (done) {
    var config = {
      'base-path': 'new base-path',
      'web-port': 80,
      'test-framework': 'mocha',
      'browsers': 'Chrome,PhantomJS,Firefox',
      'app-files': 'public/**/*.js,apps/*.js',
      'bower-components': 'jQuery',
      'bower-components-path': 'app',
      'test-files': 'tests/spec/*.js',
      'exclude-files': 'exclude/files.js',
      'plugins': 'qunit,jazzy',
      'reporters': 'progress,coverage',

      'template-path': '../test',
      'config-path': 'testing',
      'config-file': 'config.mock.json'
    };

    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, 'temp'))
      .withOptions(config)
      .on('end', function () {
        var test = require(path.resolve(
          config['config-path'],
          config['config-file']
        ));
        assert.equal(config['base-path'], test['base-path']);
        assert.equal(config['test-framework'], test.frameworks);
        assert.equal(config['web-port'], test.port);
        assert.deepEqual(config.browsers.split(','), test.browsers);
        assert.deepEqual(config['exclude-files'].split(','), test.exclude);
        assert.deepEqual(
          [].concat(
            config.plugins.split(','),
            config.browsers.split(',').map(function(browser) {
              return 'karma-' + browser.toLowerCase() + '-launcher';
            }),
            'karma-' + config['test-framework']
          ),
          test.plugins
        );
        assert.deepEqual(config.reporters.split(','), test.reporters);
        assert.deepEqual(
          [].concat(
            config['bower-components'].split(',').map(function(component) {
              return [
                config['bower-components-path'],
                '/',
                component
              ].join('');
            }),
            config['app-files'].split(','),
            config['test-files'].split(',')
          ),
          test.files
        );
        done();
      });
  });
});
