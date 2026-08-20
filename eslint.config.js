import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import noSingleUseSpecConst from './eslint-rules/no-single-use-spec-const.js';

// `useStable` is the default for stabilizing a function; `useCallback` is the exception.
// Sites where the identity genuinely must change with the closure keep `useCallback` behind
// a suppression naming this rule and stating why.
const restrictReactUseCallback = [{
  selector: "MemberExpression[object.name='React'][property.name='useCallback']",
  message: 'Use useStable (src/hooks/useStable.ts) instead of React.useCallback. Keep useCallback only when the identity must change as the closure changes, and suppress this rule with a reason.',
}];

// Layout belongs to `Container.build(spec)` (src/components/Container.ts) and interactive
// controls to `Controls` (src/components/Controls.ts). A raw `styled.div` anywhere else
// re-implements the build system by hand. The two build-system files are exempt via the
// scoped override at the bottom of this config. Semantic elements (`styled.span`,
// `styled.p`, `styled.input`, `styled.img`, `styled.header`, `styled.button`) are not
// covered: they carry meaning a `div` does not.
const STYLED_DIV_MESSAGE = 'Do not write a raw styled.div. Layout goes through Container.build(spec) (src/components/Container.ts) and interactive controls through Controls (src/components/Controls.ts). If neither supports what you need, stop and ask the user how to best support it — extending ContainerSpec/ControlSpec is the fix, not a bespoke div. See AGENTS.md rule `build-system-owns-layout`.';
const restrictStyledDiv = [
  {
    selector: "MemberExpression[object.name='styled'][property.name='div']",
    message: STYLED_DIV_MESSAGE,
  },
  {
    selector: "CallExpression[callee.name='styled'][arguments.0.value='div']",
    message: STYLED_DIV_MESSAGE,
  },
];

export default [
  { ignores: ['dist', 'src-tauri'] },
  {
    files: ['vite.config.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parser: tsParser,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.2' } },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      'ember': { rules: { 'no-single-use-spec-const': noSingleUseSpecConst } },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',

      'no-restricted-imports': ['error', {
        paths: [{
          name: 'react',
          importNames: ['useCallback'],
          message: 'Use useStable (src/hooks/useStable.ts) instead: it gives a fresh closure AND a permanently stable identity. Keep useCallback only when the identity must change as the closure changes (e.g. it is a dependency of an effect that must re-run), and suppress this rule with a reason.',
        }],
      }],
      'no-restricted-syntax': ['error', ...restrictReactUseCallback, ...restrictStyledDiv],

      // The mechanical half of AGENTS.md rule `labels-earn-their-keep`. Scope analysis
      // ("read exactly once") is beyond `no-restricted-syntax`, so this is a local rule:
      // eslint-rules/no-single-use-spec-const.js. It is deliberately narrowed to the build
      // entry points — a single-use literal handed to `Container.build`/`Controls.build` is
      // always just the component's own name said twice. Broader "is this name worth it?"
      // judgment stays in prose.
      'ember/no-single-use-spec-const': ['error', { calleeNames: ['Container.build', 'Controls.build'] }],

      'indent': ['error', 2, { SwitchCase: 1 }],
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': ['error', { before: false, after: true }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'space-infix-ops': 'error',
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-trailing-spaces': 'error',
      'max-len': ['warn', { code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
      'arrow-spacing': ['error', { before: true, after: true }],
      'block-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],

      'react/jsx-tag-spacing': ['error', {
        closingSlash: 'never',
        beforeSelfClosing: 'never',
        afterOpening: 'never',
        beforeClosing: 'never',
      }],
      "react/jsx-no-bind": [
        "warn",
        {
          "allowArrowFunctions": false,
          "allowFunctions": false,
          "ignoreRefs": true
        }
      ],
      'react/self-closing-comp': ['error', { component: true, html: true }],
    },
  },
  {
    // `Container.ts` and `Controls.ts` *are* the build system the styled.div ban exists to
    // protect. They are the one sanctioned home for a raw styled primitive, so the
    // styled.div restriction is lifted here — and only here. Every other restricted-syntax
    // rule still applies, which is why the useCallback selector is re-listed rather than
    // the whole rule being switched off.
    files: ['src/components/Container.ts', 'src/components/Controls.ts'],
    rules: {
      'no-restricted-syntax': ['error', ...restrictReactUseCallback],
    },
  },
];
