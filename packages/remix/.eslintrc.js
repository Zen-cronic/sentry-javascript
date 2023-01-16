module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    jsx: true,
  },
  ignorePatterns: ['playwright.config.ts', 'test/integration/**'],
  extends: ['../../.eslintrc.js'],
  rules: {
    '@sentry-internal/sdk/no-async-await': 'off',
    '@sentry-internal/sdk/no-optional-chaining': 'off',
  },
  overrides: [
    {
      files: ['scripts/**/*.ts'],
      parserOptions: {
        project: ['../../tsconfig.dev.json'],
      },
    },
  ],
};
