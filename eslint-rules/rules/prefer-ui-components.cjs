/**
 * @file Prefer internal UI components over raw HTML elements with styling
 * @author FFXI Tracker Team
 * @description Enforces use of standardized UI components instead of raw HTML elements
 * that have inherent styling, promoting consistency and maintainability.
 */

'use strict';

/**
 * HTML elements that have inherent styling and should use UI components instead
 */
const RESTRICTED_ELEMENTS = {
  // Content elements with styling
  blockquote: 'Use Quote or Card component for quoted content',
  // Interactive elements
  button: 'Use Button component from @/components/ui/button',
  code: 'Use Code component or Badge component for inline code',
  // Typography elements
  h1: 'Use Typography component with variant="h1"',
  h2: 'Use Typography component with variant="h2"',
  h3: 'Use Typography component with variant="h3"',
  h4: 'Use Typography component with variant="h4"',

  h5: 'Use Typography component with variant="h5"',

  h6: 'Use Typography component with variant="h6"',
  // Form elements
  input: 'Use Input component from @/components/ui/input',
  ol: 'Use Card or custom component for UI lists (semantic lists are OK)',

  p: 'Use Typography component with variant="p" or Text component',
  pre: 'Use CodeBlock component for code blocks',
  select: 'Use Select component from @/components/ui/select',

  textarea: 'Use Textarea component from @/components/ui/textarea',
  // List elements (when used for UI, not semantic content)
  ul: 'Use Card or custom component for UI lists (semantic lists are OK)',
};

/**
 * Elements that are acceptable for semantic purposes
 */
const SEMANTIC_ELEMENTS = new Set([
  'a',
  'abbr',
  'address',
  'article',
  'aside',
  'caption',
  'details',
  'dfn',
  'dialog',
  'div',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'header',
  'img',
  'label',
  'legend',
  'main',
  'mark',
  'nav',
  'section',
  'small',
  'span',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'time',
  'tr',
]);

/**
 * Check if element has accessibility attributes that suggest semantic usage
 * @param node
 */
function hasSemanticAttributes(node) {
  if (!node.openingElement.attributes) return false;

  const semanticAttributes = ['role', 'aria-label', 'aria-labelledby', 'aria-describedby'];

  return node.openingElement.attributes.some(attr => {
    if (attr.type !== 'JSXAttribute') return false;
    return semanticAttributes.includes(attr.name.name);
  });
}

/**
 * Check if element is being used in a semantic context
 * @param node
 * @param elementName
 */
function isSemanticUsage(node, elementName) {
  // Allow lists when they contain semantic list items
  if ((elementName === 'ul' || elementName === 'ol') && node.children) {
    const hasListItems = node.children.some(
      child => child.type === 'JSXElement' && child.openingElement.name.name === 'li'
    );
    if (hasListItems) return true;
  }

  // Allow elements when they're in test files
  if (node.loc && node.loc.filename && node.loc.filename.includes('test')) {
    return true;
  }

  return false;
}

module.exports = {
  create(context) {
    const options = context.options[0] || {};
    const allowInTests = options.allowInTests !== false;
    const additionalRestricted = options.additionalRestricted || {};

    const allRestricted = {...RESTRICTED_ELEMENTS, ...additionalRestricted};

    const filename = context.getFilename();
    const isTestFile =
      allowInTests && (filename.includes('.test.') || filename.includes('.spec.') || filename.includes('__tests__'));

    return {
      JSXElement(node) {
        if (isTestFile) return;

        const elementName = node.openingElement.name.name;

        // Skip if not a restricted element
        if (!allRestricted[elementName]) return;

        // Skip if it's a semantic element with semantic usage
        if (SEMANTIC_ELEMENTS.has(elementName)) return;

        // Skip if element is used semantically
        if (isSemanticUsage(node, elementName)) return;

        // Skip if element has semantic attributes
        if (hasSemanticAttributes(node)) return;

        const suggestion = allRestricted[elementName];

        context.report({
          data: {
            element: elementName,
            suggestion,
          },
          messageId: 'preferUIComponent',
          node: node.openingElement.name,
        });
      },
    };
  },

  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prefer internal UI components over raw HTML elements with styling',
      recommended: true,
    },
    fixable: null, // Manual fix required due to import and prop mapping complexity
    messages: {
      preferUIComponent:
        'Avoid raw "{{element}}" element. {{suggestion}} This promotes consistency and maintainability.',
      preferUIComponentWithContext:
        'Raw "{{element}}" element detected. {{suggestion}} Consider if this element needs styling or interactivity.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          additionalRestricted: {
            additionalProperties: {
              type: 'string',
            },
            type: 'object',
          },
          allowInTests: {
            default: true,
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
};
