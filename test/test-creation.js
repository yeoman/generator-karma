'use strict';

var fs = require('fs');
var join = require('path').join;
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('karma:app Creation test', function () {
  it('creates the expected file', function (done) {
    helpers
      .run(join(__dirname, '../generators/app'))
      .on('end', function () {
        assert.file([
          'test/karma.conf.js',
          'package.json',
          '.yo-rc.json'
        ]);
        done()
      });
  });

  // This test is problematic because of
  // https://github.com/yeoman/yeoman-test/issues/6
  it('does not delete existing package.json', function (done) {
    helpers
    .run(join(__dirname, '../generators/app'))
    .withOptions({force: true})
    .inTmpDir(function (dir) {
      fs.writeFileSync(
        join(dir, 'package.json'),
        '{"dependencies":{"grunt":"1.0.1"}}'
      );
    })
    .on('end', function () {
      assert.fileContent('package.json', /"grunt": "1.0.1"/);
      done();
    });
  });
});
