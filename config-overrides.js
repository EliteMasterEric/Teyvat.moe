/**
 * Use react-app-rewired to override the base configuration
 * of create-react-app without ejecting.
 *
 * @see: https://github.com/timarney/react-app-rewired
 * @see: https://github.com/arackaf/customize-cra
 * As of Create React App 2.0 this repo is "lightly" maintained mostly by the community at this point.
 */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */

// Previous versions of react-app-rewired contained all the methods we needed.
// Version 2.0 moved these to their own package.
const {
  addBabelPlugin,
  addWebpackModuleRule,
  override,
  addWebpackResolve,
  addWebpackPlugin,
} = require('customize-cra');
const Visualize = require('webpack-visualizer-plugin');

module.exports = override(
  /**
   * Add the root-import plugin. This plugin rewrites paths,
   * allowing the use of a symbol to represent the root directory of the project.
   *
   * This allows for absolute imports of components, avoiding the annoying `../../../../../../Util` stuff.
   */
  addBabelPlugin([
    'babel-plugin-root-import',
    {
      rootPathPrefix: '~',
      rootPathSuffix: 'src',
    },
  ]),
  /**
   * Visualize bundle size.
   */
  addWebpackPlugin(
    new Visualize({
      filename: './bundleStatistics.html',
    })
  ),
  /**
   * Allow any of the JS file extensions.
   */
  addWebpackResolve({
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  })
);
