// Allows use of multiple plugins.
const withPlugins = require('next-compose-plugins');

// TODO: react-leaflet-cluster can't be imported without this.
// Maybe a fix to next-transpile-modules will help?
// Try to remove this eventually to take advantage of built-in CSS support.
// https://github.com/martpie/next-transpile-modules/issues/146
// const withCSS = require('@zeit/next-css');

/**
 * Specifies a list of modules to be transpiled when building.
 */
const withTM = require('next-transpile-modules')([
  'react-adaptive-hooks', // Provided as ESM module.
  'react-leaflet-cluster', // Contains global CSS.
]);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  // enabled: process.env.ANALYZE === 'true',
  enabled: true,
});

const baseConfig = {
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

    return config;
  },
  images: {
    loader: 'default',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    // domains: ['assets.vercel.com'],
  },
};

module.exports = withPlugins(
  [
    withTM,
    // withBundleAnalyzer
  ],
  baseConfig
);
