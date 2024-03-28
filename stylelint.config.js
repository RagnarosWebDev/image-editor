import sortOrderSmacss from 'stylelint-config-property-sort-order-smacss/generate.js';

// eslint-disable-next-line no-undef
export default {
  plugins: ['stylelint-order', 'stylelint-scss'],
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-property-sort-order-smacss',
    'stylelint-config-html/vue',
  ],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'function-no-unknown': null,
    'declaration-empty-line-before': [
      'always',
      {
        ignore: ['after-declaration', 'first-nested'],
      },
    ],
    'order/properties-order': [sortOrderSmacss({ emptyLineBefore: 'never' })],
  },
};
