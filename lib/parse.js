'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function parse(definition, items) {
  if (!items) {
    return [];
  }

  return items.map(function (item) {
    if (item.indexOf('(') >= 0) {
      var parts = item.split('(');
      var name = parts[0];
      var parameters = parseParameters(parts[1].split(')')[0]);

      return definition[name].apply(null, parameters);
    }

    return definition[item]();
  });
}

function parseParameters(item) {
  return item.split('[').map(function (v) {
    var value = v.trim();

    if (value.indexOf(']') >= 0) {
      return [value.split(']')[0].split(',').map(function (s) {
        return s.trim();
      })];
    }

    return value.split(',').map(function (s) {
      return s.trim();
    });
  }).reduce(function (a, b) {
    return a.concat(b);
  }, []).filter(function (a) {
    return a;
  });
}

exports.parse = parse;
exports.parseParameters = parseParameters;