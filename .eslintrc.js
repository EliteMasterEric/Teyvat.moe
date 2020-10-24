module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['warn'], // Utilize Prettier to maintain code style.

    // Style overrides.
    'react/jsx-filename-extension': ['off'], // Allow JSX in .js files.
    'no-unused-vars': ['warn'], // This is a hassle when testing
  },
};
