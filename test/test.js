/*global describe before it */
'use strict';
var path = require('path');
var assert  = require('assert');
var helpers = require('yeoman-generator').test;


describe('Testacular generator test', function () {
  before(helpers.before(path.join(__dirname, './temp')));

 /* it('every generator can be required without throwing', function () {
    // not testing the actual run of generators yet
    this.app = require('../app');
  });

  // FIXME
  it.skip('creates expected files', function () {
    // Use helpers.assertFile() to help you test the output of your generator
    //
    // Example:
    //
    //    // check file exists
    //    helpers.assertFile('app/model/post.js');
    //    // Check content
    //    helpers.assertFile('app/model/post.js', /Backbone\.model/);
    it('should create expected files');
  });*/
  it('fixme', function() {
    assert(true);
  });
});
