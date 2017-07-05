import {
  context,
  entry as defaultEntry,
  isDebug,
  isDevelopment,
  isProduction,
  modules,
  output as defaultOutput,
  stats
} from '../prepare.build-tools.config';
import { analyze, defineEnv } from './plugins/js';

export default ({
                  entry = defaultEntry,
                  output = {},
                  target = 'web',
                  rules = [],
                  plugins = [],
                  externals = [],
                  node = {
                    fs: 'empty',
                    net: 'empty',
                    tls: 'empty',
                  },
                  devtool = isDevelopment ? 'cheap-module-source-map' : false,
                }) => {

  let devTool = devtool;

  if (isDebug) {
    devTool = isDevelopment ? 'inline-source-map' : false;
  }

  return {
    context,
    entry,
    output: Object.assign({}, defaultOutput, output),
    target,
    resolve: {
      modules,
      extensions: ['.js', '.css', '.json', '.jsx'],
    },
    module: {rules},
    stats,
    externals,
    devtool: devTool,
    plugins: [
      defineEnv(),
      ...plugins,
      ...analyze()
    ],
    node,
    bail: isProduction,
    cache: isDevelopment,
    performance: {
      hints: isProduction ? 'warning' : false, // enum
      maxAssetSize: 1000000, // int (in bytes),
      maxEntrypointSize: 1000000, // int (in bytes)
    },
  };
}
