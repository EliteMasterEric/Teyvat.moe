module.exports = {
  env: {
    browser: true,
    node: true,
  },
  settings: {
    // Import should respect ~ as './src'
    'import/resolver': {
      'babel-plugin-root-import': {},
    },
  },
  parser: '@babel/eslint-parser',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['@babel', 'prettier', 'mui-unused-classes', 'json-files'],
  rules: {
    /**
     * Set up basic formatting rules with the Prettier plugin.
     * This helps maintain a consistent code style.
     */
    'prettier/prettier': ['warn'],

    /**
     * Add a warning for unused variables, except if they start with '_'.
     * This flags the variable as 'unused, but potentially used in future'.
     */
    'no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '_.*', // Prefix variables you know will be unused with an underscore.
        argsIgnorePattern: '_.*', // Prefix arguments you know will be unused with an underscore.
      },
    ],

    /**
     * Allow use of console commands at specific log levels.
     * Instances of console.log and console.info should be stripped.
     */
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],

    /**
     * Make less severe/important issues throw warnings instead of breaking the program.
     * Don't add stuff here if it can be autofixed.
     */
    'mui-unused-classes/unused-classes': ['warn'],
    'react/self-closing-comp': ['warn'],
    'object-shorthand': ['warn'],
    'react/jsx-boolean-value': ['warn'],

    /**
     * Validate Node JSON files.
     */
    'json-files/no-branch-in-dependencies': ['error'],
    'json-files/require-engines': ['error'],
    'json-files/require-license': ['error'],
    'json-files/restrict-ranges': ['error'],
    'json-files/sort-package-json': ['error'],

    /**
     * Turn off rules I don't like, or that annoy me.
     */
    'react/jsx-filename-extension': ['off'], // Tried to turn this on but babel-plugin-root-import complains.
    'react/prop-types': ['off'], // I don't use TypeScript.
    'no-underscore-dangle': ['off'], // Allow dangling underscores in identifier names.
    'no-case-declarations': ['off'], // Allow variables to be declared in case blocks.
    'import/prefer-default-export': ['off'], // Allow single exports in files. They may get more later.
    'import/no-dynamic-require': ['off'], // Dynamic requires are used to reference images.
    'global-require': ['off'], // Local requires are used to reference images.
    'react/jsx-props-no-spreading': ['off'], // I don't mind passing spread properties using {...other} in JSX.
    'max-classes-per-file': ['off'], // I don't mind having multiple classes in one file, to keep them organized.
  },
};
