const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve = config.resolve || {};

  // Alias: redirect 'process/browser' → 'process/browser.js'
  // motion-utils (.mjs) explicitly imports 'process/browser' without extension.
  // Webpack 5 strict ESM mode requires fully-specified paths, so we alias it.
  config.resolve.alias = {
    ...config.resolve.alias,
    "process/browser": require.resolve("process/browser.js"),
  };

  // Also inject process as a global so simple-peer / readable-stream
  // bare `process` references are resolved without explicit imports.
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: require.resolve("process/browser.js"),
    })
  );

  return config;
};