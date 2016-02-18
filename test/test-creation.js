/*global describe, beforeEach, it */
'use strict';
var join = require('path').join;
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('Karma generator creation test', function () {
  describe('creates expected files', function () {
    var gen;
    beforeEach(function (done) {
      gen = helpers.run(join(__dirname, '../generators/app'));
      gen.inTmpDir(function () {
        done();
      });
    });

    it('creates expected JS file in default folder', function (done) {
      gen.on('end', function () {
        assert.file(['test/karma.conf.js']);
        done();
      });
    });

    it('creates expected JS file in specified folder', function (done) {
      gen.withOptions({'config-path': 'testingFolder'}).on('end', function () {
        assert.file(['testingFolder/karma.conf.js']);
        done();
      });
    });

    it('creates expected CS file in default folder', function (done) {
      gen.withOptions({coffee: true}).on('end', function () {
        assert.file(['test/karma.conf.coffee']);
        done();
      });
    });

    it('creates expected CS file in specified folder', function (done) {
      gen.withOptions({'config-path': 'csFolder', coffee: true}).on('end', function () {
        assert.file(['csFolder/karma.conf.coffee']);
        done();
      });
    });

    it('creates a Gruntfile', function (done) {
      gen.withOptions({'gruntfile-path': '.'}).on('end', function () {
        assert.file(['test/karma.conf.js', 'Gruntfile.js']);
        done();
      });
    });
  });

  describe('stdout ward', function () {
    var gen;
    var logMessage = '';

    beforeEach(function (done) {
      logMessage = '';
      gen = helpers.run(join(__dirname, '../generators/app'))
        .on('ready', function () {
          gen.generator.log.__olderror = gen.generator.log.error;
          gen.generator.log.error = function () {
            logMessage += arguments[0];
            gen.generator.log.__olderror.apply(gen.generator.log, arguments);
          };
        })
        .inTmpDir(function () {
          done();
        });
    });

    it('creates a travis file but warns about missing package.json', function (done) {
      gen.withOptions({travis: true})
        .on('end', function () {
          gen.generator.log.error = gen.generator.log.__olderror;
          assert.file(['.travis.yml']);
          assert(
            logMessage.indexOf('Could not open package.json for reading.') > -1
          );
          done();
        });
    });
  });

  it('creates a travis file and updates package.json', function (done) {
    helpers
      .run(join(__dirname, '../generators/app'))
      .withOptions({travis: true, force: true})
      .inTmpDir(function (dir) {
        require('fs').writeFileSync(join(dir,'package.json'), '{}');
      })
      .on('end', function () {
        assert.file(['.travis.yml']);
        assert.fileContent('package.json', /grunt test/);
        done();
      });
  });

  it('updates package.json with karma dependencies', function (done) {
    helpers
      .run(join(__dirname, '../generators/app'))
      .withOptions({travis: true, force: true})
      .inTmpDir(function (dir) {
        require('fs').writeFileSync(join(dir,'package.json'), '{"dependencies":{"grunt":"1.0.0"}}');
      })
      .on('end', function () {
        assert.fileContent('package.json', /karma/);
        assert.fileContent('package.json', /grunt/);
        done();
      });
  });
});
