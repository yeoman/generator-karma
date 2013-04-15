'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

var KarmaGenerator = module.exports = function KarmaGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../../', 'templates'));
  this.testFramework = options['test-framework'] || 'jasmine';

  this.on('end', function () {
    if (!options['skip-install']) {
      this.npmInstall(['grunt-karma'], {
        save: true
      });
    }
  });
};

util.inherits(KarmaGenerator, yeoman.generators.Base);

KarmaGenerator.prototype.setupEnv = function setupEnv() {
  this.copy('karma.conf.js', 'karma.conf.js');
  this.copy('karma-e2e.conf.js', 'karma-e2e.conf.js');
};
