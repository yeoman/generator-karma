/*global describe, beforeEach, it*/
'use strict';

describe('Karma generator load test', function () {
  it('can be imported without blowing up', function () {
    require('assert')(require('../app') !== undefined);
  });
});
