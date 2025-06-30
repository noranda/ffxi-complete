/**
 * @file Tests for prefer-ui-components rule
 */

'use strict';

const {RuleTester} = require('eslint');

const rule = require('../rules/prefer-ui-components.cjs');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    sourceType: 'module',
  },
});

ruleTester.run('prefer-ui-components', rule, {
  invalid: [
    // Typography elements
    {
      code: '<h1>Title</h1>',
      errors: [
        {
          data: {
            element: 'h1',
            suggestion: 'Use Typography component with variant="h1"',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },
    {
      code: '<h2>Subtitle</h2>',
      errors: [
        {
          data: {
            element: 'h2',
            suggestion: 'Use Typography component with variant="h2"',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },
    {
      code: '<p>Paragraph text</p>',
      errors: [
        {
          data: {
            element: 'p',
            suggestion: 'Use Typography component with variant="p" or Text component',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },

    // Interactive elements
    {
      code: '<button onClick={handleClick}>Click me</button>',
      errors: [
        {
          data: {
            element: 'button',
            suggestion: 'Use Button component from @/components/ui/button',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },

    // Form elements
    {
      code: '<input type="text" placeholder="Enter text" />',
      errors: [
        {
          data: {
            element: 'input',
            suggestion: 'Use Input component from @/components/ui/input',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },
    {
      code: '<textarea placeholder="Enter description"></textarea>',
      errors: [
        {
          data: {
            element: 'textarea',
            suggestion: 'Use Textarea component from @/components/ui/textarea',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },
    {
      code: '<select><option>Choose</option></select>',
      errors: [
        {
          data: {
            element: 'select',
            suggestion: 'Use Select component from @/components/ui/select',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },

    // Content elements
    {
      code: '<blockquote>Quote text</blockquote>',
      errors: [
        {
          data: {
            element: 'blockquote',
            suggestion: 'Use Quote or Card component for quoted content',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },
    {
      code: '<code>inline code</code>',
      errors: [
        {
          data: {
            element: 'code',
            suggestion: 'Use Code component or Badge component for inline code',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },
    {
      code: '<pre>Code block</pre>',
      errors: [
        {
          data: {
            element: 'pre',
            suggestion: 'Use CodeBlock component for code blocks',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },

    // UI lists (without semantic list items)
    {
      code: '<ul><div>Item 1</div><div>Item 2</div></ul>',
      errors: [
        {
          data: {
            element: 'ul',
            suggestion: 'Use Card or custom component for UI lists (semantic lists are OK)',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },

    // Multiple violations in one code
    {
      code: '<div><h1>Title</h1><p>Description</p><button>Action</button></div>',
      errors: [
        {
          data: {
            element: 'h1',
            suggestion: 'Use Typography component with variant="h1"',
          },
          messageId: 'preferUIComponent',
        },
        {
          data: {
            element: 'p',
            suggestion: 'Use Typography component with variant="p" or Text component',
          },
          messageId: 'preferUIComponent',
        },
        {
          data: {
            element: 'button',
            suggestion: 'Use Button component from @/components/ui/button',
          },
          messageId: 'preferUIComponent',
        },
      ],
    },
  ],

  valid: [
    // Semantic elements that are allowed
    {
      code: '<main><div>Content</div></main>',
    },
    {
      code: '<nav><a href="/home">Home</a></nav>',
    },
    {
      code: '<section><div>Section content</div></section>',
    },

    // Lists with semantic list items
    {
      code: '<ul><li>Item 1</li><li>Item 2</li></ul>',
    },
    {
      code: '<ol><li>Step 1</li><li>Step 2</li></ol>',
    },

    // Elements with semantic attributes
    {
      code: '<div role="button">Custom button</div>',
    },
    {
      code: '<span aria-label="Close">×</span>',
    },

    // UI components (the preferred way)
    {
      code: '<Button variant="primary">Click me</Button>',
    },
    {
      code: '<Typography variant="h1">Title</Typography>',
    },
    {
      code: '<Input type="email" placeholder="Email" />',
    },

    // Regular div/span elements (no styling implications)
    {
      code: '<div className="container"><span>Text</span></div>',
    },
  ],
});

console.log('All prefer-ui-components tests passed!');
