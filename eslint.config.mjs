import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import reactHooks from 'eslint-plugin-react-hooks';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsEslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname
});

// Principles on how we use linting rules
// --------------------------------------
//
// Rules force us to evaluate a case with possible pitfalls. Rules also help
// avoid unnecessary (and repeated) decisions and discussions. Consistency
// compounds in a team environment and in the long run.
//
// Rules should always error (not warn). Exceptions to the rule may be silenced
// one at a time with a eslint-disable-next-line comment and with a comment
// explaining the decision (after reading up on the rule's reasoning).

const config = tsEslint.config(
  {
    ignores: [
      '**/.react-router',
      '**/dist',
      '**/build',
      '**/package-lock.json',
      '**/node_modules',
      '**/.git',
      '**/vitest.setup.ts',
      '**/vite.config.ts',
      '**/vitest.config.ts'
    ]
  },
  {
    files: ['**/*.mts', '**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsEslint.parser,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        project: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true
      }
    },
    extends: [
      ...tsEslint.configs.strictTypeChecked,
      ...fixupConfigRules(compat.extends('plugin:import/recommended', 'plugin:import/typescript')),
      ...fixupConfigRules(compat.extends('prettier'))
    ],
    rules: {
      'prefer-const': 'error',
      'no-console': [
        'error',
        {
          allow: ['error', 'log']
        }
      ],
      'no-duplicate-imports': 'error',
      'default-case': 'off',
      'max-len': 'off',

      // Import rules - disabled due to TypeScript handling these
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],

      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/no-restricted-types': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true
        }
      ],

      '@typescript-eslint/no-confusing-void-expression': 'off',

      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false
          }
        }
      ],

      '@typescript-eslint/require-await': 'off',

      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: true,
          allowBoolean: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
          allowNever: true
        }
      ],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'enumMember',
          format: ['PascalCase']
        },
        {
          selector: 'typeLike',
          format: ['PascalCase']
        }
      ],

      '@typescript-eslint/method-signature-style': ['error', 'property'],

      // Unsafe rules - disabled for flexibility with Effect-TS
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off'
    }
  },

  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      'react-hooks': fixupPluginRules(reactHooks)
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error'
    }
  }
);

export default config;
