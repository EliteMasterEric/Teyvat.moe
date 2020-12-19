/**
 * Use react-app-rewired to override the base configuration
 * of create-react-app.
 */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */

// Previous versions of react-app-rewired contained all the methods we needed.
// Version 2.0 moved these to their own package.
const { addBabelPlugin, override } = require('customize-cra');

module.exports = override(
  addBabelPlugin([
    'babel-plugin-root-import',
    {
      rootPathPrefix: '~',
      rootPathSuffix: 'src',
    },
  ])
);
