# Karma generator [![Build Status](https://secure.travis-ci.org/yeoman/generator-karma.png?branch=master)](http://travis-ci.org/yeoman/generator-karma)

Maintainer: [Brian Ford](https://github.com/btford)

See the [Karma documentation](http://karma-runner.github.com/) for more info.

## Why Karma?
Karma runs the tests in the browser, but reports them in the CLI. This greatly improves your workflow by giving you constant, accurate feedback on the status of your tests.

PhantomJS is a great option too, but it has the one drawback that it won't expose browser inconsistencies.

## Usage

Running `yo karma` will generate a `karma.conf.js` file for your project.

Note that you'll need to install the `grunt-karma` plugin for Grunt and update your `Gruntfile.js`. If you're using Karma through the [AngularJS](https://github.com/yeoman/generator-angular) generator, all of the configuration is done for you.

## Configuration
Karma can be configured by editing `karma.conf.js`. See the documentation page on the [config file](http://karma-runner.github.com/0.8/config/configuration-file.html) for an exhaustive list of options.

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
