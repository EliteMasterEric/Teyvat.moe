module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: '@babel/eslint-parser',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['@babel', 'prettier'],
  rules: {
    'prettier/prettier': ['warn'], // Utilize Prettier to maintain code style.

    // Style overrides.
    'react/jsx-filename-extension': ['off'], // Allow JSX in .js files.
    'no-unused-vars': ['warn'], // This is a hassle when testing
    'react/prop-types': ['off'], // IDGAF about validating prop types.

    'import/no-dynamic-require': ['off'], // Dynamic requires are used to reference images.
    'global-require': ['off'], // Local requires are used to reference images.
    'react/jsx-props-no-spreading': ['off'], // I don't mind passing properties.
  },
};
