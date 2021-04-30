const withBundleAnalyzer = require('@next/bundle-analyzer')({
  // enabled: process.env.ANALYZE === 'true',
  enabled: false,
});

// Allows use of multiple plugins.
const withPlugins = require('next-compose-plugins');

/**
 * Specifies a list of modules to be transpiled when building.
 */
const withTM = require('next-transpile-modules')([
  'react-adaptive-hooks', // Provided as ESM module.
  'react-leaflet-cluster', // Contains global CSS.
]);

/**
 * Include internationalization configuration.
 */
const { i18n } = require('./next-i18next.config');

const baseConfig = {
  // Target must be serverless to run on Netlify.
  //target: 'serverless',
  // Target must be experimental-serverless-trace to work with next-i18next.
  target: 'experimental-serverless-trace',

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

    // IDK why but this fixes a bug.
    config.optimization.minimize = false;

    return config;
  },
  i18n,
  images: {
    loader: 'default',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 24, 32, 48, 64, 80, 96, 128, 256, 384],
    // domains: ['assets.vercel.com'],
  },
};

module.exports = withPlugins([withTM, withBundleAnalyzer], baseConfig);
