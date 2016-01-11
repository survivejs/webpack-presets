'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (paths) {
  return {
    setEnvironment: function setEnvironment(target) {
      return {
        plugins: [new _webpack2.default.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(target)
        })]
      };
    },
    lint: function lint(format) {
      return {
        preLoaders: [{
          test: new RegExp('\.' + format + '$'),
          loader: 'eslint',
          include: paths.babel
        }]
      };
    },
    enableHMR: function enableHMR() {
      return {
        plugins: [new _webpack2.default.HotModuleReplacementPlugin()],
        devServer: {
          historyApiFallback: true,
          hot: true,
          inline: true,
          progress: true,
          host: process.env.HOST,
          port: process.env.PORT,
          stats: 'errors-only'
        }
      };
    },
    extractCSS: function extractCSS(name) {
      return {
        plugins: [new _extractTextWebpackPlugin2.default(name + '.[chunkhash].css')],
        module: {
          loaders: [{
            test: /\.css$/,
            loader: _extractTextWebpackPlugin2.default.extract('style', 'css'),
            include: paths.css
          }]
        }
      };
    },
    generateCommonsChunk: function generateCommonsChunk(name) {
      return {
        plugins: [new _webpack2.default.optimize.CommonsChunkPlugin({
          names: [name, 'manifest']
        }), new _webpack2.default.optimize.DedupePlugin()]
      };
    },
    minify: function minify() {
      return {
        plugins: [new _webpack2.default.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })]
      };
    }
  };
};