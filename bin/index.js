#!/usr/bin/env node
const program = require('commander');
const webpack = require('webpack');

const webpackPresets = require('../');
const VERSION = require('../package.json').version;

main();

function main() {
  const presets = webpackPresets.presets();

  program.version(VERSION);

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
      } else {
        console.error('Failed to find "' + preset + '" in "' +
          Object.keys(presets).join('", "') + '"');
      }
    });

  program.parse(process.argv);
}
