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
    'react/prop-types': ['off'], // IDGAF about validating prop types.

    'no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '_.*', // Prefix variables you know will be unused with an underscore.
        argsIgnorePattern: '_.*', // Prefix arguments you know will be unused with an underscore.
      },
    ],

    'no-console': ['warn', { allow: ['warn', 'error'] }],

    'import/no-dynamic-require': ['off'], // Dynamic requires are used to reference images.
    'global-require': ['off'], // Local requires are used to reference images.
    'react/jsx-props-no-spreading': ['off'], // I don't mind passing properties.
  },
};
