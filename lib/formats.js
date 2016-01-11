'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (paths) {
  return {
    png: function png() {
      var format = arguments.length <= 0 || arguments[0] === undefined ? 'png' : arguments[0];
      return {
        resolve: {
          extensions: ['.' + format]
        },
        module: {
          loaders: [{
            test: new RegExp('\.' + format + '$'),
            loader: 'url?limit=100000&mimetype=image/png',
            include: paths.png
          }]
        }
      };
    },
    jpg: function jpg() {
      var format = arguments.length <= 0 || arguments[0] === undefined ? 'jpg' : arguments[0];
      return {
        resolve: {
          extensions: ['.' + format]
        },
        module: {
          loaders: [{
            test: new RegExp('\.' + format + '$'),
            loader: 'file',
            include: paths.jpg
          }]
        }
      };
    },
    json: function json() {
      var format = arguments.length <= 0 || arguments[0] === undefined ? 'json' : arguments[0];
      return {
        resolve: {
          extensions: ['.' + format]
        },
        module: {
          loaders: [{
            test: new RegExp('\.' + format + '$'),
            loader: 'json',
            include: paths.json
          }]
        }
      };
    },
    babel: function babel() {
      var format = arguments.length <= 0 || arguments[0] === undefined ? 'js' : arguments[0];
      return {
        resolve: {
          extensions: ['.' + format]
        },
        module: {
          loaders: [{
            test: new RegExp('\.' + format + '$'),
            loader: 'babel?cacheDirectory',
            include: paths.babel
          }]
        }
      };
    },
    css: function css() {
      var format = arguments.length <= 0 || arguments[0] === undefined ? 'css' : arguments[0];
      return {
        resolve: {
          extensions: ['' + format]
        },
        module: {
          loaders: [{
            test: new RegExp('\.' + format + '$'),
            loaders: ['style', 'css'],
            include: paths.css
          }]
        }
      };
    }
  };
};