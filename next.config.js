const withBundleAnalyzer = require('@next/bundle-analyzer')({
  // enabled: process.env.ANALYZE === 'true',
  enabled: false,
});

/**
 * Outdated, use built-in CSS support instead.
 */
// const withCSS = require('@zeit/next-css');

// Allows use of multiple plugins.
const withPlugins = require('next-compose-plugins');

/**
 * Specifies a list of modules to be transpiled when building.
 */
const withTM = require('next-transpile-modules')([
  'react-adaptive-hooks', // Provided as ESM module.
  'react-leaflet-cluster', // Contains global CSS.
]);

const baseConfig = {
  // Target must be serverless to run on Netlify.
  target: 'serverless',

  // Provides source maps in production.
  // These are used to improve stack traces in error reports.
  productionBrowserSourceMaps: true,

  future: {
    webpack5: true,
  },
  webpack(config) {
    // url loader
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg)$/,
      use: {
        loader: 'url-loader',
      },
    });

    /**
     * This option determines the name of initial bundle files.
     * @param {*} pathData
     * @returns {string} The filename to use.
     */
    // config.output.filename = '[name].[contenthash].bundle.js';

    /**
     * This option determines the name of non-initial chunk files.
     * @param {*} pathData
     * @returns {string} The filename to use.
     */
    // config.output.chunkFilename = '[name].[contenthash].chunk.js';

    // IDK why but this fixes a bug.
    config.optimization.minimize = false;

    return config;
  },
  images: {
    loader: 'default',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 24, 32, 48, 64, 80, 96, 128, 256, 384],
    // domains: ['assets.vercel.com'],
  },
};

module.exports = withPlugins([withTM, withBundleAnalyzer], baseConfig);
