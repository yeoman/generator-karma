// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  <%= testFramework %>,
  <%= testFramework %>_ADAPTER,<% if(testFramework === 'QUNIT') {%>
  //Pavlov can be safely removed from here and the bower.json if just QUnit is used. 
  'app/bower_components/pavlov/pavlov.js',<% }else if(testFramework === 'MOCHA') { %>
  'app/bower_components/chai/chai.js',<% }%>
  <% if (mvcFramework === 'angular') {  %>
  'app/bower_components/angular/angular.js',
  'app/bower_components/angular-mocks/angular-mocks.js',
  'app/scripts/*.<%= format %>',
  'app/scripts/**/*.<%= format %>',
  'test/mock/**/*.<%= format %>',
  <% }else if(mvcFramework === 'ember'){ %>'app/bower_components/jquery/jquery.min.js',
  'app/bower_components/handlebars/handlebars.runtime.js',
  'app/bower_components/ember/ember.js',
  'app/bower_components/ember-data-shim/ember-data.js',
  //Don't forget to load any other external libraries your code might be dependent on
  '.tmp/scripts/combined-scripts.js',
  '.tmp/scripts/compiled-templates.js',
  'test/initializer.<%= format %>',
  'test/integration/**/*.<%= format %>',<% if(testFramework === 'MOCHA'){ %>
  'app/bower_components/ember-mocha-adapter/adapter.js', <% } } %>
  'test/spec/**/*.<%= format %>'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
