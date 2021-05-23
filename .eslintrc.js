module.exports = {
  // Ignore eslintrc.js files in parent directories.
  root: true,
  // Use a parser compatible with TypeScript.
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'prettier', // Ensures compatibility with Prettier.
    'mui-unused-classes', // Prevents unused classes in makeStyles.
    'import', // Special rules to clean up and standardize imports.
    // 'unicorn', // Various awesome rules.
    'react-redux', // Various rules to enforce best practices for react-redux.
    'lodash', // Various rules to enforce best practices for lodash.
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'airbnb',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
    'prettier/@typescript-eslint',
    // 'plugin:unicorn/recommended',
    'plugin:react-redux/recommended',
    'plugin:lodash/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: '.',
      },
    },
  },
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
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
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '_.*', // Prefix variables you know will be unused with an underscore.
        argsIgnorePattern: '_.*', // Prefix arguments you know will be unused with an underscore.
      },
    ],

    /**
     * Adds a warning when a module export is not used within the project.
     */
    // TODO: Turn this on.
    'import/no-unused-modules': ['off', { unusedExports: true }],

    /**
     * NextJS defaults.
     */
    'react/react-in-jsx-scope': ['off'],
    'react/display-name': ['off'],
    'react/prop-types': ['off'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/explicit-member-accessibility': ['off'],
    '@typescript-eslint/indent': ['off'],
    '@typescript-eslint/member-delimiter-style': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-var-requires': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],

    /**
     * Enable TypeScript checking.
     */
    '@typescript-eslint/explicit-module-boundary-types': ['warn'],

    /**
     * Allow use of console commands at specific log levels.
     * Instances of console.log and console.info should be stripped.
     */
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],

    /**
     * Configure custom import sorting.
     * 1. node "builtin" modules
     * 2. "external" modules
     * 3. "internal" modules
     * 4. modules from a "parent" directory
     * 5. "sibling" modules from the same or a sibling's directory
     * 6. "index" of the current directory
     * 7. "object"-imports (only available in TypeScript)
     */
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
      },
    ],
    // 'sort-imports': [ 'error', { ignoreDeclarationSort: true, }, ],

    /**
     * Prohibit imports via relative paths.
     */
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          '../**/*', // No relative imports.
          './**/*', // No relative imports.
          '**/index', // Don't import the index explicitly.
          'src/components/util/*', // Import only the index Util module.
          '!./*',
        ],
      },
    ],

    /**
     * Enforce Rules of Hooks.
     *
     * @see: https://github.com/facebook/react/blob/c11015ff4f610ac2924d1fc6d569a17657a404fd/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js
     */
    'react-hooks/rules-of-hooks': 'error',

    /**
     * Use Pascal file name casing where applicable.
     * Ignores index.js because that can't be renamed.
     *
     * @see: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
     */
    /*
    'unicorn/filename-case': [
      'warn',
      {
        case: 'pascalCase',
        ignore: [
          /^next\.config\.js$/,
          /^next-i18next\.config\.js$/,
          /^\.eslintrc\.js$/, // Ignore config files.
          /\.md$/, // Ignore markdown files.
        ],
      },
    ],
    */
    /**'
     * Using complete words results in more readable code.
     * Not everyone knows all your abbreviations. Code is written only once, but read many times.
     *
     * @see: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prevent-abbreviations.md
     */
    /*
    'unicorn/prevent-abbreviations': [
      'warn',
      {
        replacements: {
          props: false,
        },
        ignore: ['i18n'],
      },
    ],
    */
    /**
     * There are reasons to eliminate nulls from your code completely,
     * but this has issues with React (for example, a functional component can't return undefined).
     *
     * @see: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
     */
    //'unicorn/no-null': ['off'],

    /**
     * There are reasons to use the for...of block, but I prefer Lodash's method.
     */
    //'unicorn/no-array-for-each': ['off'],

    /**
     * Use the lodash equivalent method wherever possible.
     * Compared to native methods, lodash methods are always available, have better performance,
     * and always have the same output.
     */
    'lodash/prefer-lodash-method': ['error'],

    /**
     * Enforce usage of 'import _ from lodash' rather than importing members.
     * A Babel plugin is installed to transpile this and enable tree shaking.
     */
    'lodash/import-scope': ['warn', 'full'],

    /**
     * Make less severe/important issues throw warnings instead of breaking the program.
     * Don't add stuff here if it can be autofixed.
     */
    'mui-unused-classes/unused-classes': ['warn'],
    'react/self-closing-comp': ['warn'],
    'object-shorthand': ['warn'],
    'react/jsx-boolean-value': ['warn'],

    /**
     * Turn off annoying rules I don't like.
     */
    'react/jsx-filename-extension': ['off'], // Tried to turn this on but babel-plugin-root-import complains.
    'no-underscore-dangle': ['off'], // Allow dangling underscores in identifier names.
    'no-case-declarations': ['off'], // Allow variables to be declared in case blocks.
    'import/prefer-default-export': ['off'], // Allow single exports in files. They may get more later.
    'import/no-dynamic-require': ['off'], // Dynamic requires are used to reference images.
    'global-require': ['off'], // Local requires are used to reference images.
    'react/jsx-props-no-spreading': ['off'], // I don't mind passing spread properties using {...other} in JSX.
    'max-classes-per-file': ['off'], // I don't mind having multiple classes in one file, to keep them organized.
    'react-hooks/exhaustive-deps': ['off'],
  },
  /**
   * Allow overriding the above rules for specific file path globs.
   */
  overrides: [
    {
      files: ['*.test.js'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    {
      files: ['pages/*.js', 'pages/*.ts', 'pages/*.tsx'],
      rules: {
        //'unicorn/filename-case': 'off',
      },
    },
    {
      files: ['packages/*.js', 'packages/*.ts', 'packages/**/*.js', 'packages/**/*.ts'],
      rules: {
        //'unicorn/filename-case': 'off',
        'lodash/prefer-lodash-method': 'off',
        'lodash/prefer-lodash-typecheck': 'off',
      },
    },
  ],
};
