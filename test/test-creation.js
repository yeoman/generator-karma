/*global describe, beforeEach, it */
'use strict';

var fs = require('fs');
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('Karma generator creation test', function () {
  describe('creates expected files', function () {
    var gen;
    beforeEach(function(done) {
      gen = helpers.run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, 'temp'));
      done();
    });

    it('creates expected JS file in default folder', function(done) {
      gen.onEnd(function () {
        assert.file(['test/karma.conf.js']);
        done();
      });
    });

    it('creates expected JS file in specified folder', function(done) {
      gen.withOptions({'config-path': 'testingFolder'}).onEnd(function () {
        assert.file(['testingFolder/karma.conf.js']);
        done();
      });
    });

    it('creates expected CS file in default folder', function(done) {
      gen.withOptions({coffee: true}).onEnd(function () {
        assert.file(['test/karma.conf.coffee']);
        done();
      });
    });

    it('creates expected CS file in specified folder', function(done) {
      gen.withOptions({'config-path': 'csFolder', coffee: true}).onEnd(function () {
        assert.file(['csFolder/karma.conf.coffee']);
        done();
      });
    });

    it('creates a Gruntfile', function(done) {
      gen.withOptions({'gruntfile-path': '.'}).onEnd(function () {
        assert.file(['test/karma.conf.js', 'Gruntfile.js']);
        done();
      });
    });

    it('creates a travis file but warns about missing package.json', function(done) {
      var logger = gen.generator.log.error;
      var errCount = [];
      gen.generator.log.error = function(msg, err) {
        if (err) {
          errCount.push({msg: msg, err: err});
        }
      };
      gen.withOptions({travis: true}).onEnd(function () {
        assert.file(['.travis.yml']);
        assert.equal(1, errCount.length);
        assert.equal(
          errCount[0].msg.slice(0,40),
          'Could not open package.json for reading.'
        );
        assert.equal(errCount[0].err.errno, 34);
        gen.generator.log.error = logger;
        done();
      });
    });
  });


  it('creates a travis file and updates package.json', function(done) {
    helpers.testDirectory(path.join('test', 'temp'), function () {
      var gen = helpers.run(path.join(__dirname, '../app'));
      fs.writeFileSync('package.json', '{}');
      gen.withOptions({travis: true}).onEnd(function () {
        assert.file(['.travis.yml']);
        assert.fileContent('package.json', /grunt test/);
        done();
      });
    });
  });
});
