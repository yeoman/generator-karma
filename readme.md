# Karma generator [![Build Status](https://secure.travis-ci.org/yeoman/generator-karma.png?branch=master)](http://travis-ci.org/yeoman/generator-karma)

Maintainer: [Brian Ford](https://github.com/btford)

See the [Karma documentation](http://karma-runner.github.com/) for more info.


## Why Karma?

Karma runs the tests in the browser, but reports them in the CLI. This greatly improves your workflow by giving you constant, accurate feedback on the status of your tests.

PhantomJS is a great option too, but it has the one drawback that it won't expose browser inconsistencies.


## Usage

Install it globally `npm install -g generator-karma`.

Running `yo karma` will generate two files for your project: `karma.conf.js` and `karma-e2e.conf.js`. It will then install the npm dependencies.

Note that you'll need to update your `Gruntfile.js`. If you're using Karma through the [AngularJS generator](https://github.com/yeoman/generator-angular), all of the configuration is done for you.


## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

* `--test-framework=[framework]`

  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine` or `qunit`.

* `--coffee`

  Enable support for tests written in CoffeeScript.

* `--travis`

  Enable [Travis CI](https://travis-ci.org/) config generation.
  
  
## Configuration

Karma can be configured by editing `karma.conf.js`. See the documentation page on the [config file](http://karma-runner.github.com/0.10/config/configuration-file.html) for an exhaustive list of options.


## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
