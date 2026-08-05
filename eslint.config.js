// @ts-check
// ─────────────────────────────────────────────────────────────────────────────
// ESLint is the enforcement arm of the Frontend Engineering Charter.
// Architecture rules (layer boundaries), size limits and naming rules live
// HERE, not in code review. If a rule can be expressed in this file, it must
// be — reviewers check design, the linter checks law. See docs/Standards.md.
// ─────────────────────────────────────────────────────────────────────────────
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const boundaries = require('eslint-plugin-boundaries');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      // Prettier last: disables any stylistic rule that would fight the formatter.
      prettier,
    ],
    processor: angular.processInlineTemplates,
    plugins: { boundaries },
    settings: {
      // ── Layer map (Charter AD-03 / AD-21) ──────────────────────────────────
      // Order matters: first matching pattern wins, so specific layers are
      // listed before the app root.
      'boundaries/elements': [
        { type: 'core', pattern: 'src/app/core/**', mode: 'full' },
        { type: 'shared', pattern: 'src/app/shared/**', mode: 'full' },
        { type: 'layout', pattern: 'src/app/layout/**', mode: 'full' },
        {
          type: 'feature',
          pattern: 'src/app/features/*/**',
          mode: 'full',
          capture: ['featureName'],
        },
        { type: 'root', pattern: 'src/app/*', mode: 'full' },
        { type: 'env', pattern: 'src/environments/**', mode: 'full' },
        { type: 'main', pattern: 'src/*', mode: 'full' },
      ],
      'boundaries/include': ['src/**/*.ts'],
      // Resolve the tsconfig path aliases (@core, @features, …) so boundaries
      // can classify aliased imports. Without this, aliased imports are
      // "unknown" and silently escape the rules — verified during Phase 2.
      'import/resolver': {
        typescript: { project: './tsconfig.json', alwaysTryTypes: true },
      },
    },
    rules: {
      // ── Architecture: the dependency law of the platform ──────────────────
      // core    → core, env
      // shared  → shared, core
      // layout  → layout, shared, core
      // feature → ITSELF ONLY among features, plus shared, core
      // root    → wires everything together (routes/config/bootstrap)
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          message:
            '${file.type} may not import from ${dependency.type} (Charter AD-03: layer boundaries)',
          rules: [
            { from: 'core', allow: ['core', 'env'] },
            { from: 'shared', allow: ['shared', 'core'] },
            { from: 'layout', allow: ['layout', 'shared', 'core'] },
            {
              from: 'feature',
              allow: [['feature', { featureName: '${from.featureName}' }], 'shared', 'core'],
            },
            { from: 'root', allow: ['root', 'core', 'shared', 'layout', 'feature', 'env'] },
            { from: 'main', allow: ['root', 'core', 'env'] },
            { from: 'env', allow: ['env'] },
          ],
        },
      ],

      // ── Selector prefixes: `app-` = product/feature code, `ui-` = platform
      //    primitives in shared/ (Charter AD-21). Readable in any template.
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: ['app', 'ui'], style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: ['app', 'ui'], style: 'kebab-case' },
      ],

      // ── Size & complexity limits (Charter standards §2) ────────────────────
      'max-lines': ['error', { max: 400, skipBlankLines: true, skipComments: true }],
      complexity: ['error', 10],

      // ── Discipline rules ───────────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'error', // all output goes through the Logger (Phase 3)
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
  {
    // Specs may exceed complexity/size limits; keep them honest but unblocked.
    files: ['**/*.spec.ts'],
    rules: {
      'max-lines': 'off',
    },
  },
]);
