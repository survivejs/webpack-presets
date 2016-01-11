import path from 'path';

export default function resolvePaths(rootPath, paths) {
  const ret = {};

  Object.keys(paths).forEach((k) => {
    const v = paths[k];

    if(Array.isArray(v)) {
      ret[k] = v.map((p) => path.join(rootPath, p));
    }
    else {
      ret[k] = path.join(rootPath, v);
    }
  });

  return ret;
}
