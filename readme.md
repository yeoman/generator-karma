# Karma generator [![Build Status](https://secure.travis-ci.org/yeoman/generator-karma.svg?branch=master)](http://travis-ci.org/yeoman/generator-karma)

See the [Karma documentation](http://karma-runner.github.com/) for more info.


## Why Karma?

Karma runs the tests in the browser, but reports them in the CLI. This greatly improves your workflow by giving you constant, accurate feedback on the status of your tests.


## Usage

Install it globally `npm install -g generator-karma`.

Running `yo karma` will generate a config file for your project: `karma.conf.js`. It will then install the npm dependencies.

By default, running `yo karma` will generate a pretty boring (and almost useless) config file. The real power is using the options to specify almost every part of the config file.

Note that you'll need to update your `Gruntfile.js` if you don't specify the `--gruntfile-path` option.


## Options

There are a lot of options going on here. None of them are required and most are probably only useful when used with other generators calling this one.

Options are specified after `yo karma`. Example:

`yo karma --skip-install --frameworks=jasmine --app-files='app/**/*.js,public/**/*.js'`

The full list:

 * `--skip-install` Type: Boolean, Default: false

  Skips the automatic execution of `npm` after scaffolding has finished.

 * `--coffee` Type: Boolean, Default: false

  Use CoffeeScript instead of JavaScript.

 * `--frameworks` Type: String, Default: 'jasmine'

  Specifies which testing frameworks to use (CSV list). Example `--frameworks=mocha,chai,requirejs,sinon`

 * `--browsers` Type: String, Default: 'PhantomJS'

  What browsers to test in (CSV list).

 * `--app-files` Type: String, Default: ''

  List of application files (CSV list). There are purely the files you edit that make up your test.

 * `--test-files` Type: String, Default: ''

  List of test files (CSV list), including spec and mock files.

 * `--files-comments` Type: String, Default: ''

  List of comments to add to files properties. It can be used to support bower dependencies wiring using [wiredep](https://github.com/taptapship/wiredep).

 * `--exclude-files` Type: String, Default: ''

  List of files to exclude (CSV list). Files you don't want tested.

 * `--plugins` Type: String, Default: ''

  Specify Karma plugins (npm modules). Use the full name like `karma-junit-reporter`.

 * `--bower-components` Type: String, Default: ''

  Optional components to use for testing (CSV list of components).

 * `--bower-components-path` Type: String, Default: 'bower_components'

  Directory where Bower components are installed, if not in the default location.

 * `--travis` Type: Boolean, Default: false

  Enable [Travis CI](https://travis-ci.org/) config generation by adding a .travis.yaml file.

 * `--gruntfile-path` Type: String, Default: ''

  Path to a Gruntfile to edit. This is relative to your generators root directory. In other words, relative to `this.destinationRoot()` path.

 * `--base-path` Type: String, Default: ''

  Will be used to resolve files and exclude in the `karma.conf.js` file.

 * `--web-port` Type: Number, Default: 8080

  Web server port to run Karma from.

 * `--template-path` Type: String, Default: '../templates'

  If you would like to specify a different template to use, give the path to that folder.

 * `--config-file` Type: String, Default: ''

  The config file name to write to. Useful if you want a different name like `karma-e2e.conf.js`.

 * `--config-path` Type: String, Default: './test'

  Path where the config files should be written to. This is where the `karma.conf.js` file will be placed.


## Configuration

Karma can be configured by editing `karma.conf.js`. See the documentation page on the [config file](http://karma-runner.github.com/0.12/config/configuration-file.html) for an exhaustive list of options.


## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
