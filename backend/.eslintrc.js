module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: [
        'eslint-plugin-import-helpers',
        'security',
        '@typescript-eslint/eslint-plugin',
    ],
    extends: [
        // 'plugin:jest/all',
        // 'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
        'prettier',
        'prettier/@typescript-eslint',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {
        'no-var': 'error',
        'no-plusplus': 'warn',
        complexity: ['warn', 3],
        'jest/expect-expect': 'off',
        'consistent-return': 'warn',
        'no-underscore-dangle': 'off',
        'max-classes-per-file': 'warn',
        'no-use-before-define': 'warn',
        'class-methods-use-this': 'off',
        'import/prefer-default-export': 'off',
        'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
        'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'default',
                format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                leadingUnderscore: 'allowSingleOrDouble',
            },
        ],
        // 'function-paren-newline': ['error', { minItems: 2 }],
        // 'sort-imports': [
        //     'warn',
        //     {
        //         ignoreCase: true,
        //         ignoreDeclarationSort: true,
        //     },
        // ],
        'import-helpers/order-imports': [
            'warn',
            {
                alphabetize: {
                    ignoreCase: true,
                    order: 'asc',
                },
                groups: [
                    'absolute', // any absolute path modules are first (ex: `/path/to/code.ts`)
                    '/^@nest/', // any import paths starting with 'nest'
                    '/^nest/', // any import paths starting with 'nest'
                    '/^src/',
                    'module',
                    ['parent', 'sibling', 'index'],
                ],
                newlinesBetween: 'always',
            },
        ],
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/require-await': 'warn',
        '@typescript-eslint/unbound-method': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-types': [
            'warn',
            {
                types: {
                    String: {
                        message: 'Use string instead',
                        fixWith: 'string',
                    },
                    '{}': {
                        message: 'Use Record<K, V> instead',
                        fixWith: 'Record<string, any>',
                    },
                    object: {
                        message: 'Use Record<K, V> instead',
                        fixWith: 'Record<string, any>',
                    },
                },
            },
        ],
    },
}
