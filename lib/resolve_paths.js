'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolvePaths;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolvePaths(rootPath, paths) {
  var ret = {};

  Object.keys(paths).forEach(function (k) {
    var v = paths[k];

    if (Array.isArray(v)) {
      ret[k] = v.map(function (p) {
        return _path2.default.join(rootPath, p);
      });
    } else {
      ret[k] = _path2.default.join(rootPath, v);
    }
  });

  return ret;
}