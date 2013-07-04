'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

var KarmaGenerator = module.exports = function KarmaGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../../', 'templates'));

  this.framework = options['framework'] || 'angular';
  this.framework = this.framework.toLowerCase();

  this.testFramework = options['test-framework'] || 'JASMINE';
  if (this.framework === 'ember') this.testFramework =  options['test-framework'] || 'QUNIT';
  this.testFramework = this.testFramework.toUpperCase();

  if (options.coffee) {
    this.format = 'coffee';
  } else {
    this.format = 'js';
  }

  this.save = false
  if (options['save']) {
    this.save = true;
    this.bowerDirectory = options['bower-directory'] || 'app/bower_components';
  }

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
  if(this.framework === 'angular'){
    this.copy('karma-e2e.conf.js', 'karma-e2e.conf.js');
  }
};

KarmaGenerator.prototype.bower = function bower() {
    if (this.save) {
      this.copy('bowerrc', '.bowerrc');
      this.copy('_bower.json', 'bower.json');
    }
};

KarmaGenerator.prototype.packageFile = function packageFile() {
    if (this.save) {
      this.copy('_package.json', 'package.json');
    }
};
