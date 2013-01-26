
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generators');

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

  this.directory('.','.', true);

  // TODO: not sure if this is the most pragmatic way to do this
  if (this.interactive) {
    this.log.writeln("You may want to add the following to your Gruntfile.js:\n");
    [
      "    grunt.registerTask('test', 'run the testacular test driver', function () {",
      "      var done = this.async();",
      "      require('child_process').exec('testacular start --single-run', function (err, stdout) {",
      "        grunt.log.write(stdout);",
      "        done(err);",
      "      });",
      "    });",
      ""
    ].forEach(function (ln) {
      console.log(ln);
    });
  }

};

Generator.prototype.checkTestacular = function() {
  try {
    var testacular = require('testacular'),
        colors = require('colors');

    // TODO: check a global dependency instead of hardcoding it.
    function isLowerVersion(current, minimum) {
      var i, min, cur;

      current = current.split('.');
      minimum = minimum.split('.');

      for (i in minimum) {
        cur = parseInt(current[i], 10);
        min = parseInt(minimum[i], 10);

        if (cur < min) {
          return true;
        } else if (cur > min) {
          return false;
        }
      }
      return false;
    }

    if (isLowerVersion(testacular.VERSION, '0.4.0')) {
      console.log('\n✖ Testacular out of date\n'.yellow +
      '  To update it, run '.grey + 'sudo npm update -g testacular');
    }
  } catch (err) {
    //only bother if it's not installed
    console.log('\n✖ Testacular not installed\n'.red +
    '  You\'re ready to start using Angular, but you need Testacular to run unit tests.\n'.grey +
    '  Get it by running '.grey + 'sudo npm install -g testacular');
  }
};
