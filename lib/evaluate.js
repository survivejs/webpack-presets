'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = evaluate;

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

var _resolve_paths = require('./resolve_paths');

var _resolve_paths2 = _interopRequireDefault(_resolve_paths);

var _parse = require('./parse');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function evaluate(_ref) {
  var rootPath = _ref.rootPath;
  var actions = _ref.actions;
  var formats = _ref.formats;
  var presets = _ref.presets;
  var webpackrc = _ref.webpackrc;
  var target = _ref.target;

  actions = actions || noop;
  formats = formats || noop;

  var rcConfiguration = _webpackMerge2.default.apply(null, [webpackrc].concat((0, _parse.parse)(presets, webpackrc.presets)));
  var parsedEnv = rcConfiguration.env[target] || {};
  var commonConfig = rcConfiguration.common ? rcConfiguration.common[target.split(':')[0]] || {} : {};
  var paths = (0, _resolve_paths2.default)(rootPath, Object.assign({}, rcConfiguration.paths, commonConfig.paths, parsedEnv.paths));
  var evaluatedActions = actions(paths);
  var evaluatedFormats = formats(paths);
  var rootConfig = {
    resolve: {
      extensions: ['']
    }
  };
  var parsedRootActions = (0, _parse.parse)(evaluatedActions, rcConfiguration.actions);
  var parsedActions = (0, _parse.parse)(evaluatedActions, parsedEnv.actions);
  var parsedRootFormats = (0, _parse.parse)(evaluatedFormats, rcConfiguration.formats);
  var parsedFormats = (0, _parse.parse)(evaluatedFormats, parsedEnv.formats);

  for (var _len = arguments.length, config = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    config[_key - 1] = arguments[_key];
  }

  return _webpackMerge2.default.apply(null, [rootConfig, commonConfig].concat(parsedRootActions).concat(parsedRootFormats).concat([parsedEnv]).concat(config).concat(parsedActions).concat(parsedFormats));
}

function noop() {}