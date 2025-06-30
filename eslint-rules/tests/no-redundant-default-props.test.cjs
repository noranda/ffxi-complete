const {RuleTester} = require('eslint');

const rule = require('../rules/no-redundant-default-props.cjs');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    sourceType: 'module',
  },
});

ruleTester.run('no-redundant-default-props', rule, {
  invalid: [
    // Redundant default props that should be removed
    {
      code: '<Button variant="default" />',
      errors: [{messageId: 'redundantDefault'}],
      output: '<Button />',
    },
    {
      code: '<Card asChild={false} />',
      errors: [{messageId: 'redundantDefault'}],
      output: '<Card />',
    },
    {
      code: '<Button variant="default" size="lg" />',
      errors: [{messageId: 'redundantDefault'}],
      output: '<Button size="lg" />',
    },
  ],

  valid: [
    // Non-redundant prop values
    '<Button size="sm" />',
    '<Button variant="secondary" />',
    '<Card asChild />',
    '<Input size="lg" />',

    // Props with non-default values
    '<Button variant="primary" size="lg" />',
    '<Card asChild size="md" />',

    // No props at all
    '<Button />',
    '<Card />',

    // Self-closing tags without redundant props
    '<Input type="text" placeholder="Enter text" />',
  ],
});
