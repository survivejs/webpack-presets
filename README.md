[![build status](https://secure.travis-ci.org/survivejs/webpack-presets.png)](http://travis-ci.org/survivejs/webpack-presets)
# webpack-presets - Shareable configuration presets for Webpack

*webpack-presets* provides an abstraction over top of regular Webpack configuration. Even though this adds some complexity, it also allows you to implement shareable presets. Each preset may consist of regular Webpack configuration, *actions*, and *formats*. Actions provide abstraction over smaller tasks while formats give simple means to define loader mappings. They rely on optional *paths* configuration for enhanced performance.

> Check out [SurviveJS - Webpack and React](http://survivejs.com/) to dig deeper into the topic.

## API

```javascript
import * as fs from 'fs';

import {
  evaluate,
  actions,
  formats,
  presets
} = require('./lib');

// load higher level configuration. *.webpackrc* is just one alternative
const webpackrc = JSON.parse(fs.readFileSync('./.webpackrc', {
  encoding: 'utf-8'
}));

export.default = evaluate({
  rootPath: __dirname, // root path of the project
  actions, // actions to map against
  formats, // loader mappings
  presets, // presets (consists of actions and formats)
  webpackrc, // configuration binding actions/formats/presets
  target: 'dist' // pick from process.ENV for instance
},
  // optional custom configuration. as many fragments as you like
  //
  // this is handy if you want to set up custom plugins per target
  // for example
  {
    foo: 'bar'
  },
  {
    bar: 'baz'
  }
);
```

## Example

**.webpackrc**

```js
{
  // which formats to use in the project
  "formats": [
    "jpg",
    "json",
    "png"
  ],
  // where to find them (optional, helps with performance)
  // this maps directly to loader `include`
  "paths": {
    "babel": ["./demo", "./src"],
    "jpg": "./demo",
    "json": "./package.json",
    "png": "./demo",
    "css": [
      "./demo",
      "./style.css",
      "./node_modules/purecss",
      "./node_modules/highlight.js/styles/github.css",
      "./node_modules/react-ghfork/gh-fork-ribbon.ie.css",
      "./node_modules/react-ghfork/gh-fork-ribbon.css"
    ]
  },
  // which presets to use. presets use the same format
  // and allow abstraction
  "presets": [
    "setupReact",
    "separateCSS(gh-pages, styles)",
    "extractEntry(gh-pages, vendors, [react])"
  ],
  // common configuration for each namespace
  "common": {
    // dist configuration (dist, dist:min, ...)
    "dist": {
      "devtool": "source-map",
      "entry": "./src",
      "output": {
        "path": "./dist",
        "libraryTarget": "umd",
        "library": "Boilerplate"
      }
    },
    // test configuration (test, test:tdd, ...)
    "test": {
      // override paths so tests are found by babel
      "paths": {
        "babel": ["./src", "./tests"]
      }
    }
  },
  // build targets. `target` parameter selects this
  "env": {
    "start": {
      "devtool": "eval-source-map",
      "entry": "./demo"
    },
    "gh-pages": {
      "entry": {
        "app": "./demo"
      },
      "output": {
        "path": "./gh-pages",
        "filename": "[name].[chunkhash].js",
        "chunkFilename": "[chunkhash].js"
      },
      // custom actions to trigger per target
      "actions": [
        "setEnvironment(production)",
        "minify"
      ]
    },
    // note namespacing. `common` configuration applies to both
    "dist": {
      "output": {
        "filename": "boilerplate.js"
      }
    },
    "dist:min": {
      "output": {
        "filename": "boilerplate.min.js"
      },
      "actions": [
        "minify"
      ]
    }
  }
}
```

**webpack.config.babel.js**

```javascript
import * as fs from 'fs';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SystemBellPlugin from 'system-bell-webpack-plugin';
import Clean from 'clean-webpack-plugin';
import React from 'react';
import ReactDOM from 'react-dom/server';

import App from './demo/App.jsx';
import pkg from './package.json';

import webpackActions from './lib/actions';
import webpackFormats from './lib/formats';
import webpackPresets from './lib/presets';
import evaluate from './lib/evaluate';
import renderJSX from './lib/render_jsx.jsx';

// read *.webpackrc*. This could be in *package.json* etc. or code even
const webpackrc = JSON.parse(fs.readFileSync('./.webpackrc', {
  encoding: 'utf-8'
}));

const RENDER_UNIVERSAL = true;

// set target based on env
const TARGET = process.env.npm_lifecycle_event || 'test';

process.env.BABEL_ENV = TARGET;

// set up some custom plugins
const commonConfig = {
  plugins: [
    new SystemBellPlugin()
  ]
};
const extraConfig = {
  start: {
    plugins: [
      new HtmlWebpackPlugin({
        title: pkg.name + ' - ' + pkg.description,
        templateContent: renderJSX
      })
    ]
  },
  'gh-pages': {
    plugins: [
      new Clean(['gh-pages']),
      new HtmlWebpackPlugin({
        title: pkg.name + ' - ' + pkg.description,
        templateContent: renderJSX.bind(
          null,
          RENDER_UNIVERSAL ? ReactDOM.renderToString(<App />) : ''
        )
      })
    ]
  }
}[TARGET] || {};

// compose configuration
module.exports = evaluate({
    actions: webpackActions,
    formats: webpackFormats,
    presets: webpackPresets,
    webpackrc: webpackrc,
    target: TARGET
  },
  commonConfig, extraConfig
);
```

## Paths

`paths` configuration maps to `loader` `include` fields. It's an optional, but setting it is advisable given it leads to a better understanding of how the assets are mapped. It also improves performance. The paths should be given in a relative format. Adjust `rootPath` to set up the lookup. `__dirname` is a good default.

## Actions

`actions` capture some cross-cutting concern, such as setting up **HMR*. For instance, that action would return a configuration fragment that sets up `plugins` and `devServer`. Here's an example:

```javascript
export default (paths) => ({
  enableHMR: () => ({
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      host: process.env.HOST,
      port: process.env.PORT,
      stats: 'errors-only'
    }
  })
});
```

The system provides a couple of sample actions like this. The interface accepts `paths` for optimization.

In order to make it easier to compose, `evaluate` accepts an array of definitions like this. As long as you stick with the interface (`(Object of paths) => {string => function => Object}`) for each, it should work.

## Formats

`formats` encapsulate common loader configurations. Example:

```javascript
export default (paths) => ({
  png: (format='png') => ({
    resolve: {
      extensions: ['.' + format]
    },
    module: {
      loaders: [
        {
          test: new RegExp('\.' + format + '$'),
          loader: 'url?limit=100000&mimetype=image/png',
          include: paths.png
        }
      ]
    }
  })
});
```

The interface is similar again. Each format accepts an optional `format`. That can be used to perform more exotic mappings. I.e., `babel(jsx)`. Again, the same idea as above.

## Presets

Presets are a higher level concept that allow composition. They are higher level fragments that are composited to the output before evaluating any other configuration. This means they can contain other concepts. Consider the example below:

```javascript
export default (paths) => ({
  extractEntry: (distEnv, vendorsName, vendorsValue) => {
    const ret = {
      env: {
        actions: [
          `generateCommonsChunk($(vendorsName))`
        ]
      }
    };

    ret[distEnv] = {
      entry: {
        [vendorsName]: vendorsValue
      }
    };

    return ret;
  }
})
```

The interface is similar as earlier. This time, though, function signatures are flexible and can be customized based on the exact need. Presets allow you to extract common workflows into a format you may compose later.

## Contributors

* [Tim Dorr](https://github.com/timdorr) - Improved README formatting.

## License

*webpack-presets* is available under MIT. See LICENSE for more details.
