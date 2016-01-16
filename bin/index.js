#!/usr/bin/env node
const program = require('commander');
const webpack = require('webpack');

const webpackPresets = require('../');
const VERSION = require('../package.json').version;

main();

function main() {
  const presets = webpackPresets.presets();

  program.version(VERSION);

  // TODO: support multiple presets
  program
    .command('preset [preset]')
    .description('Use preset')
    .option('-t, --target [target]', 'Build target')
    .action(function (preset, options) {
      const target = options.target;

      if (preset in presets) {
        const configuration = webpackPresets.evaluate({
          rootPath: __dirname,
          actions: webpackPresets.actions,
          formats: webpackPresets.formats,
          presets: webpackPresets.presets,
          webpackrc: {
            presets: [preset]
          },
          target: target
        });

        webpack(configuration, function (err) {
          if (err) {
            return console.error(err);
          }

          console.log('Finished!');
        });

        // TODO: if target is `start`, run through webpack-dev-server
        // instead. note that this will need some special setup for
        // hmr to work as discussed at
        // https://webpack.github.io/docs/webpack-dev-server.html#inline-mode-with-node-js-api
      } else {
        console.error('Failed to find "' + preset + '" in "' +
          Object.keys(presets).join('", "') + '"');
      }
    });

  program.parse(process.argv);
}
