function parse(definition, items) {
  if (!items) {
    return [];
  }

  return items.map((item) => {
    if (item.indexOf('(') >= 0) {
      const parts = item.split('(');
      const name = parts[0];
      const parameters = parseParameters(parts[1].split(')')[0]);

      return definition[name].apply(null, parameters);
    }

    return definition[item]();
  });
}

function parseParameters(item) {
  return item.split('[').map((v) => {
    const value = v.trim();

    if (value.indexOf(']') >= 0) {
      return [value.split(']')[0].split(',').map((s) => s.trim())];
    }

    return value.split(',').map((s) => s.trim());
  }).reduce((a, b) => a.concat(b), []).filter((a) => a);
}

export {
  parse,
  parseParameters
};
