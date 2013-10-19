'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

var KarmaGenerator = module.exports = function KarmaGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../../', 'templates'));
  this.testFramework = options['test-framework'] || 'jasmine';

  // Provide the default components from prior releases for backwards compat.
  this.components = options.components || [
    'angular/angular.js',
    'angular/angular-mocks.js'
  ];

  if (options.coffee) {
    this.format = 'coffee';
  } else {
    this.format = 'js';
  }

  this.on('end', function () {
    if (!options['skip-install']) {
      this.npmInstall(['grunt-karma', 'karma-ng-html2js-preprocessor', 'karma-ng-scenario'], {
        saveDev: true
      });
    }
  });
};

util.inherits(KarmaGenerator, yeoman.generators.Base);

KarmaGenerator.prototype.setupEnv = function setupEnv() {
  this.template('karma.conf.js', 'karma.conf.js');
  this.copy('karma-e2e.conf.js', 'karma-e2e.conf.js');
};

KarmaGenerator.prototype.setupTravis = function setupTravis() {
  if (!this.options.travis) {
    return;
  }

  var done = this.async();
  var cwd = this.options.cwd || process.cwd();
  var packageJson = path.join(cwd, 'package.json');

  this.copy('travis.yml', '.travis.yml');

  // Rewrite the package.json to include a test script unless it's already
  // specified.
  fs.readFile(packageJson, { encoding: 'utf-8' }, function (err, content) {
    var data;
    if (err) {
      this.log.error('Could not open package.json for reading.', err);
      done();
      return;
    }

    try {
      data = JSON.parse(content);
    } catch (err) {
      this.log.error('Could not parse package.json.', err);
      done();
      return;
    }

    if (data.scripts && data.scripts.test) {
      this.log.writeln('Test script already present in package.json. ' +
                       'Skipping rewriting.');
      done();
      return;
    }

    data.scripts = data.scripts || {};
    data.scripts.test = 'grunt test';


    fs.writeFile(packageJson, JSON.stringify(data, null, 2), done);
  }.bind(this));
};
