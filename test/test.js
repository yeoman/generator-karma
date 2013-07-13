/*global describe, beforeEach, it */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('assert');
var fs = require('fs');

describe('Karma generator test', function () {
  beforeEach(function (done) {
    this.testDir = path.join(__dirname, 'temp');
    helpers.testDirectory(this.testDir, function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('karma:app', [
        '../../lib/generators/app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'karma.conf.js',
      'karma-e2e.conf.js'
    ];

    this.app.options.travis = false;
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('creates a .travis.yml if requested', function (done) {
    var expected = [
      '.travis.yml'
    ];

    this.app.options.travis = true;
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  describe('travis support', function () {
    beforeEach(function () {
      this.packageJson = path.join(this.testDir, 'package.json');
    });

    it('rewrites the test script in package.json if requested', function (done) {
      console.log("JSON: ", this.packageJson);
      fs.writeFileSync(this.packageJson, JSON.stringify({
        name: 'test-package',
        version: '0.0.0'
      }));

      this.app.options.travis = true;
      this.app.options['skip-install'] = true;
      this.app.run({}, function () {
        fs.readFile(this.packageJson, function (err, content) {
          if (err) {
            throw err;
          }

          var data = JSON.parse(content);
          assert(data && data.scripts && !!data.scripts.test);
          done();
        });
      }.bind(this));
    });

    it('does not rewrite the test script if already present', function (done) {
      fs.writeFileSync(this.packageJson, JSON.stringify({
        name: 'test-package',
        version: '0.0.0',
        scripts: {
          test: 'mocha'
        }
      }));

      this.app.options.travis = true;
      this.app.options['skip-install'] = true;
      this.app.run({}, function () {
        fs.readFile(this.packageJson, function (err, content) {
          if (err) {
            throw err;
          }

          var data = JSON.parse(content);
          assert(data.scripts.test === 'mocha');
          done();
        });
      }.bind(this));
    });
  });
});
