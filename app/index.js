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
      '  npm install --save gruntacular',
    ].join('\n'));
  }
};

Generator.prototype.checkTestacular = function () {
  try {
    var testacular = require('testacular');

    if (semver.lt(testacular.VERSION, '0.4.0')) {
      console.log('\n✖ Testacular out of date\n'.yellow +
      '  To update it, run '.grey + 'npm update -g testacular'.yellow);
    }
  } catch (err) {
    console.log('\n✖ Testacular not installed\n'.red +
    '  You\'re ready to start using Angular, but you need Testacular to run unit tests.\n'.grey +
    '  Get it by running '.grey + 'npm install -g testacular'.yellow);
  }
};
