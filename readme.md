# Testacular generator [![Build Status](https://secure.travis-ci.org/yeoman/generator-testacular.png?branch=master)](http://travis-ci.org/yeoman/generator-testacular)

Maintainer: [Brian Ford](https://github.com/btford)

See the [Testacular documentation](http://vojtajina.github.com/testacular/) for more info.

## Why Testacular?
Testacular runs the tests in the browser, but reports them in the CLI. This greatly improves your workflow by giving you constant, accurate feedback on the status of your tests.

PhantomJS is a great option too, but it has the one drawback that it won't expose browser inconsistencies.

## Usage

Running `yo testacular` will generate a `testacular.conf.js` file for your project.

Note that you'll need to install the `gruntacular` plugin for grunt and update your `Gruntfile.js`. If you're using testacular through the [AngularJS](https://github.com/yeoman/generator-angular) generator, all of the configuration is done for you.

## Configuration
Testacular can be configured by editing `testacular.conf.js`. See the documentation page on the [config file](https://github.com/testacular/testacular/wiki/Configuration-File-Overview) for an exhaustive list of options.

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
