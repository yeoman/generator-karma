/*global describe, beforeEach, it */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Karma generator test', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('karma:app', [
        '../../lib/generators/app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files for angular', function (done) {
    var expected = [
      'karma.conf.js',
      'karma-e2e.conf.js',
      '.bowerrc',
      'bower.json',
      'package.json'
    ];

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

    it('creates expected files for ember', function (done) {
      var expected = [
        'karma.conf.js',
        '.bowerrc',
        'bower.json',
        'package.json'
      ];

      this.app.options['skip-install'] = true;
      this.app.options['mvcFramework'] = 'ember';

      this.app.run({}, function () {
        helpers.assertFiles(expected);
        done();
      });
    });

  it('creates expected files without bower.json and package.json', function (done) {
    var expected = [
      'karma.conf.js',
      'karma-e2e.conf.js',
    ];

    var notExpected = [
      '.bowerrc',
      'bower.json',
      'package.json'
    ];

    this.app.options['skip-save'] = true;
    this.app.options['skip-install'] = true;

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
