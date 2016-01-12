'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (paths) {
  return {
    setupReact: function setupReact() {
      return {
        formats: ['babel(js)', 'babel(jsx)'],
        common: {
          dist: {
            externals: {
              react: {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'React',
                root: 'React'
              }
            }
          },
          test: {
            actions: ['lint(js)', 'lint(jsx)']
          }
        },
        env: {
          start: {
            actions: ['setEnvironment(development)', 'lint(js)', 'lint(jsx)', 'enableHMR']
          }
        }
      };
    },
    separateCSS: function separateCSS(distEnv, outputFile) {
      var ret = {
        env: {
          start: {
            formats: ['css']
          }
        }
      };

      ret.env[distEnv] = {
        actions: ['extractCSS(' + outputFile + ')']
      };

      return ret;
    },
    extractEntry: function extractEntry(distEnv, vendorsName, vendorsValue) {
      var ret = {
        env: {
          actions: ['generateCommonsChunk($(vendorsName))']
        }
      };

      ret[distEnv] = {
        entry: _defineProperty({}, vendorsName, vendorsValue)
      };

      return ret;
    }
  };
};