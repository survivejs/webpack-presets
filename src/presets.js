export default {
  setupReact: () => ({
    formats: [
      'babel(js)',
      'babel(jsx)'
    ],
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
        actions: [
          'lint(js)',
          'lint(jsx)'
        ]
      }
    },
    env: {
      start: {
        actions: [
          'setEnvironment(development)',
          'lint(js)',
          'lint(jsx)',
          'enableHMR'
        ]
      }
    }
  }),
  separateCSS: (distEnv, outputFile) => {
    const ret = {
      env: {
        start: {
          formats: [
            'css'
          ]
        }
      }
    };

    ret.env[distEnv] = {
      actions: [
        `extractCSS($(outputFile))`
      ]
    };

    return ret;
  },
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
};
