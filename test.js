/* eslint-env mocha */
const assert = require('assert');
const fs = require('fs');

const lib = require('./lib');

const webpackrc = JSON.parse(fs.readFileSync('./.webpackrc', {
  encoding: 'utf-8'
}));

describe('Presets', function () {
  it('should be able to evaluate', function () {
    // TODO

    console.log(lib);
  });
});
