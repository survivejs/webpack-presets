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
  return item.split(',').map((v) => {
    if (v.indexOf('[') === 0) {
      return v.split('[')[1].split[']'][0].split(',').map((s) => s.trim());
    }

    return v;
  });
}

export {parse, parseParameters};
