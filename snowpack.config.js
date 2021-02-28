/**
 * Configuration file for Snowpack.
 */
module.exports = {
  extends: '@snowpack/app-scripts-react',

  devOptions: {
    port: 3000,
    src: 'src',
    bundle: false,
    fallback: 'index.html',
  },

  installOptions: {
    polyfillNode: true,
  },

  // Alias for baseURL.
  alias: {
    src: '~/',
  },
};
