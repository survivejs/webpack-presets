import merge from 'webpack-merge';

import resolvePaths from './resolve_paths';
import { parse } from './parse';

export default function evaluate({
    rootPath, actions, formats, presets, webpackrc, target
  }, ...config) {
  actions = actions || noop;
  formats = formats || noop;
  presets = presets || noop;

  const rcConfiguration = merge.apply(null, [webpackrc].concat(
    parse(apply(presets, paths), webpackrc.presets))
  );
  const parsedEnv = rcConfiguration.env[target] || {};
  const commonConfig = rcConfiguration.common ?
    rcConfiguration.common[target.split(':')[0]] || {} :
    {};
  const paths = resolvePaths(
    rootPath,
    Object.assign({}, rcConfiguration.paths, commonConfig.paths, parsedEnv.paths)
  );
  const evaluatedActions = apply(actions, paths);
  const evaluatedFormats = apply(formats, paths);
  const rootConfig = {
    resolve: {
      extensions: ['']
    }
  };
  const parsedRootActions = parse(evaluatedActions, rcConfiguration.actions);
  const parsedActions = parse(evaluatedActions, parsedEnv.actions);
  const parsedRootFormats = parse(evaluatedFormats, rcConfiguration.formats);
  const parsedFormats = parse(evaluatedFormats, parsedEnv.formats);

  return merge.apply(null, [rootConfig, commonConfig].
    concat(parsedRootActions).concat(parsedRootFormats).concat([
      parsedEnv
    ]).concat(config).concat(parsedActions).concat(parsedFormats));
}

function apply(configuration, paths) {
  if(Array.isArray(configuration)) {
    return merge.apply(null, configuration.map((conf) => conf(paths)));
  }

  return configuration(paths);
}

function noop() {}
