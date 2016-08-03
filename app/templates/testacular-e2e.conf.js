// Testacular configuration

var fs = require('fs');

// Load from basic testacular configuration
eval(fs.readFileSync('testacular.conf.js')+'');

// list of files / patterns to load in the browser
files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/**/*.js'
];

// Proxy the root path to the location of app server
proxies = {
  '/': 'http://localhost:9000/'
};
