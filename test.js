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

  const actionDefinition = {
    module: {
      preLoaders: [
        {
          test: new RegExp('\.foo$'),
          loader: 'eslint'
        }
      ]
    }
  };

  function actions() {
    return {
      lint: () => actionDefinition
    };
  }

  it('should evaluate actions', function () {
    const res = lib.evaluate({
      rootPath: __dirname,
      actions,
      webpackrc: {
        env: {
          dist: {
            actions: [
              'lint'
            ]
          }
        }
      },
      target: 'dist'
    });

    assert.deepEqual(res.module, actionDefinition.module);
  });

  // it's the same logic for formats and presets too
  // XXX: there needs to be a better way to test through each
  it('should evaluate composed actions', function () {
    const actionDefinition2 = {
      module: {
        loaders: [
          {
            test: new RegExp('\.js$'),
            loader: 'babel'
          }
        ]
      }
    };

    function moreActions() {
      return {
        lintMore: () => actionDefinition2
      };
    }

    const res = lib.evaluate({
      rootPath: __dirname,
      actions: [actions, moreActions],
      webpackrc: {
        env: {
          dist: {
            actions: [
              'lint',
              'lintMore'
            ]
          }
        }
      },
      target: 'dist'
    });

    assert.deepEqual(res.module.preLoaders, actionDefinition.module.preLoaders);
    assert.deepEqual(res.module.loaders, actionDefinition2.module.loaders);
  });

  const formatDefinition = {
    resolve: {
      extensions: ['.png']
    },
    module: {
      loaders: [
        {
          test: new RegExp('\.png$'),
          loader: 'url?limit=100000&mimetype=image/png'
        }
      ]
    }
  };

  function formats() {
    return {
      png: () => formatDefinition
    };
  }

  it('should evaluate formats', function () {
    const res = lib.evaluate({
      rootPath: __dirname,
      formats,
      webpackrc: {
        env: {
          dist: {
            formats: [
              'png'
            ]
          }
        }
      },
      target: 'dist'
    });

    assert.deepEqual(res.resolve, {
      extensions: ['.png', '']
    });
    assert.deepEqual(res.module, formatDefinition.module);
  });

  it('should evaluate presets', function () {
    const presetDefinition = {
      formats: ['png'],
      env: {
        start: {
          actions: [
            'lint'
          ]
        }
      }
    };

    function presets() {
      return {
        demo: () => presetDefinition
      };
    }

    const res = lib.evaluate({
      rootPath: __dirname,
      actions,
      formats,
      presets,
      webpackrc: {
        presets: ['demo']
      },
      target: 'start'
    });

    assert.deepEqual(res.resolve, {
      extensions: ['.png', '']
    });
    assert.deepEqual(res.module.preLoaders, actionDefinition.module.preLoaders);
    assert.deepEqual(res.module.loaders, formatDefinition.module.loaders);
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
