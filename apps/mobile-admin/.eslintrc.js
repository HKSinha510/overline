module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
    'react-native/no-inline-styles': 'off',
    'react/no-unstable-nested-components': 'off',
    'radix': 'off',
  },
};
