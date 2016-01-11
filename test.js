/* eslint-env mocha */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const lib = require('./lib');

const webpackrc = JSON.parse(fs.readFileSync('./.webpackrc', {
  encoding: 'utf-8'
}));

describe('Evaluate', function () {
  const result = lib.evaluate({
    rootPath: __dirname,
    actions: lib.actions,
    formats: lib.formats,
    presets: lib.presets,
    webpackrc,
    target: 'dist'
  },
    {
      foo: 'bar'
    },
    {
      bar: 'baz'
    }
  );

  it('should allow passing custom structure', function () {
    assert.equal(result.foo, 'bar');
  });

  it('should allow passing multiple custom structures', function () {
    assert.equal(result.bar, 'baz');
  });

  it('should select correct target', function () {
    assert.equal(result.output.filename, 'boilerplate.js');
  });
});

describe('Resolve paths', function () {
  const resolve = lib._resolvePaths;

  it('should resolve a simple path', function () {
    assert.deepEqual(resolve(__dirname, {
      foo: 'foo'
    }), {
      foo: path.join(__dirname, './foo')
    });
  });

  it('should resolve an array of paths', function () {
    assert.deepEqual(resolve(__dirname, {
      foo: ['foo', 'bar']
    }), {
      foo: [
        path.join(__dirname, './foo'),
        path.join(__dirname, './bar')
      ]
    });
  });

  it('should resolve multiple paths', function () {
    assert.deepEqual(resolve(__dirname, {
      foo: 'foo',
      bar: 'bar'
    }), {
      foo: path.join(__dirname, './foo'),
      bar: path.join(__dirname, './bar')
    });
  });
});

describe('Parse', function () {
  const parse = lib._parse;

  it('should parse empty', function () {
    assert.deepEqual(parse.parseParameters(''), []);
  });

  it('should parse single', function () {
    assert.deepEqual(parse.parseParameters('foo'), ['foo']);
  });

  it('should parse multiple', function () {
    assert.deepEqual(parse.parseParameters('foo, bar'), ['foo', 'bar']);
  });

  it('should parse arrays', function () {
    assert.deepEqual(parse.parseParameters('baz, [foo, bar]'), ['baz', ['foo', 'bar']]);
  });

  // TODO: allow passing empty values?
});
