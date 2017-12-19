import * as webpack from "webpack";
import {definePlugin/*, TS*/} from "./plugins/js";
import {externalCSS, globalCSS, internalCSS} from "./rules/css";
import {file} from "./rules/files";
import {context, entry as defaultEntry, isDevelopment, isSourceMap, modules, output as defaultOutput, stats} from "./target.config";

export default (
  {
    entry = defaultEntry,
    output = {},
    target = "web",
    rules = [],
    plugins = [],
    externals = [],
    node = {
      fs: "empty",
      net: "empty",
      tls: "empty",
    },
    devtool = isDevelopment && isSourceMap ? "source-map" : false,
  }: {
    entry?: string[] | string | { [key: string]: string };
    output?: { [key: string]: string };
    target?: string;
    rules?: any[];
    plugins?: any[];
    externals?: any[];
    node?: { [key: string]: string | boolean } | boolean;
    devtool?: string | boolean;
  },
) => ({
  bail: !isDevelopment,
  cache: isDevelopment,
  context,
  devtool,
  entry,
  externals,
  module: {
    rules: [
      ...rules,
      internalCSS(),
      globalCSS(),
      externalCSS(),
      file(),
    ],
  },
  node,
  output: {...defaultOutput, ...output},
  performance: false,
  plugins: [
    definePlugin(),
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
    ...plugins,
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".css", ".json"],
    modules,
  },
  resolveLoader: {
    extensions: [".js", ".json"],
    mainFields: ["loader", "main"],
    modules,
  },
  stats,
  target,
});
