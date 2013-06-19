'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

var KarmaGenerator = module.exports = function KarmaGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../../', 'templates'));
  this.testFramework = options['test-framework'] || 'JASMINE';
  this.testFramework = this.testFramework.toUpperCase();

  if (options.coffee) {
    this.format = 'coffee';
  } else {
    this.format = 'js';
  }

  this.mvcFramework = options['mvc-framework'] || 'angular';
  this.mvcFramework = this.mvcFramework.toLowerCase();

  this.save = true;
  if (options['skip-save']) {
    this.save = false;
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

KarmaGenerator.prototype.welcome = function welcome() {
  // welcome message
  var welcomeMsg =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

  console.log(welcomeMsg);
};


KarmaGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var extension = '';

  if(this.testFramework === 'QUNIT') {
    extension = 'Pavlov';
  }else if(this.testFramework === 'MOCHA'){
    extension = 'Chai';
  }

  if(extension !== ''){
    var prompts = [{
      type: 'confirm',
      name: extension.toLowerCase(),
      message: 'Would you like to include ' + extension + '?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.pavlov = props.pavlov;
      this.chai = props.chai;

      cb();
    }.bind(this));
  }else{
    this.pavlov = null;
    this.chai = null;
    cb();
  }

};

KarmaGenerator.prototype.setupEnv = function setupEnv() {
  this.copy('karma.conf.js', 'karma.conf.js');
  if(this.mvcFramework !== 'ember'){
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
