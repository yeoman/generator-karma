'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var colors = require('colors');
var semver = require('semver');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('interactive', {
    type: Boolean,
    defaults: true,
    banner: '[interactive mode]',
    required: false
  });
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
  // Copies the contents of the generator `templates`
  // directory into your users new application path
  this.directory('.', '.', true);

  // TODO: not sure if this is the most pragmatic way to do this
  if (this.interactive) {
    console.log([
      'If you have not already, install the "gruntacular" plugin for grunt:',
      '  npm install --save gruntacular'
    ].join('\n'));
  }
};
