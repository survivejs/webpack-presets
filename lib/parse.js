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
  return item.split(',').map(function (v) {
    if (v.indexOf('[') === 0) {
      return v.split('[')[1].split[']'][0].split(',').map(function (s) {
        return s.trim();
      });
    }

    return v;
  });
}

exports.parse = parse;
exports.parseParameters = parseParameters;