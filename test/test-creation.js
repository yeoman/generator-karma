/*global describe, beforeEach, afterEach, it */
'use strict';

var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var join = require('path').join;

describe('Karma generator creation test', function () {
  describe('creates expected files', function () {
    var gen;
    beforeEach(function(done) {
      gen = helpers.run(join(__dirname, '../app'))
        .inDir(join(__dirname, 'temp'));
      done();
    });

    it('creates expected JS file in default folder', function(done) {
      gen.on('end', function () {
        assert.file(['test/karma.conf.js']);
        done();
      });
    });

    it('creates expected JS file in specified folder', function(done) {
      gen.withOptions({'config-path': 'testingFolder'}).on('end', function () {
        assert.file(['testingFolder/karma.conf.js']);
        done();
      });
    });

    it('creates expected CS file in default folder', function(done) {
      gen.withOptions({coffee: true}).on('end', function () {
        assert.file(['test/karma.conf.coffee']);
        done();
      });
    });

    it('creates expected CS file in specified folder', function(done) {
      gen.withOptions({'config-path': 'csFolder', coffee: true}).on('end', function () {
        assert.file(['csFolder/karma.conf.coffee']);
        done();
      });
    });

    it('creates a Gruntfile', function(done) {
      gen.withOptions({'gruntfile-path': '.'}).on('end', function () {
        assert.file(['test/karma.conf.js', 'Gruntfile.js']);
        done();
      });
    });

    describe('stdout ward', function () {
      var logMessage;
      var stderrWriteBackup = process.stderr.write;

      beforeEach(function () {
        logMessage = '';
        process.stderr.write = (function () {
          return function (str) {
            logMessage += str;
          };
        }(process.stderr.write));
      });

      afterEach(function () {
        process.stderr.write = stderrWriteBackup;
      });

      it('creates a travis file but warns about missing package.json', function(done) {
        gen.withOptions({travis: true}).on('end', function () {
          assert.file(['.travis.yml']);
          assert(
            logMessage.indexOf('Could not open package.json for reading.') > -1
          );
          done();
        });
      });

    });
  });


  it('creates a travis file and updates package.json', function(done) {
    helpers.testDirectory(join('test', 'temp'), function () {
      var gen = helpers.run(join(__dirname, '../app'));
      require('fs').writeFileSync('package.json', '{}');
      gen.withOptions({travis: true}).on('end', function () {
        assert.file(['.travis.yml']);
        assert.fileContent('package.json', /grunt test/);
        done();
      });
    });
  });
});
