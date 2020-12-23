module.exports = {
  env: {
    browser: true,
    node: true,
  },
  settings: {
    // Import should respect ~ as './src'
    'import/resolver': 'babel-plugin-root-import',
  },
  parser: '@babel/eslint-parser',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['@babel', 'prettier', 'mui-unused-classes'],
  rules: {
    'prettier/prettier': ['warn'], // Utilize Prettier to maintain code style.

    // Style overrides.
    'react/jsx-filename-extension': ['off'], // Allow JSX in .js files.
    'react/prop-types': ['off'], // IDGAF about validating prop types.

    // Add a warning for unused variables, except if they start with '_'.
    'no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '_.*', // Prefix variables you know will be unused with an underscore.
        argsIgnorePattern: '_.*', // Prefix arguments you know will be unused with an underscore.
      },
    ],

    'no-underscore-dangle': ['off'], // Allow dangling underscores in identifier names.
    /*
     * Allow variable declarations in case blocks.
     */
    'no-case-declarations': ['off'],

    'mui-unused-classes/unused-classes': ['warn'],

    /*
     * Allow use of console commands at specific log levels.
     * Instances of console.log and console.info should be stripped.
     */
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],

    'react/self-closing-comp': ['warn'], // Stop crashing my app because of this!
    'import/prefer-default-export': ['off'], // Allow single exports in file that will have multipl efiles later.
    'import/no-dynamic-require': ['off'], // Dynamic requires are used to reference images.
    'global-require': ['off'], // Local requires are used to reference images.
    'react/jsx-props-no-spreading': ['off'], // I don't mind passing properties.
    'max-classes-per-file': ['off'], // I don't mind having multiple classes in one file.
  },
};
