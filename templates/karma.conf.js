// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '<%= options["base-path"] %>',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['<%= options["test-framework"] %>'],

    // list of files / patterns to load in the browser
    files: [<%= templateArray(configFiles) %>],

    // list of files / patterns to exclude
    exclude: [<%= templateArray(options["exclude-files"]) %>],

    // web server port
    port: <%= options['web-port'] %>,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [<%= templateArray(options.browsers) %>],

    // Which plugins to enable
    plugins: [<%= templateArray(options.plugins) %>],

    // Which reporters to enable
    reporters: [<%= templateArray(options.reporters) %>],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
