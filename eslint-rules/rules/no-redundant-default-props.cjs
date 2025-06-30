/**
 * Default redundant prop values that should be omitted
 */
const DEFAULT_REDUNDANT_PROPS = {
  asChild: false,
  size: 'default',
  variant: 'default',
};

/**
 * ESLint rule to detect and remove redundant default prop values in JSX
 */
module.exports = {
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();
    const options = context.options[0] || {};
    const redundantDefaults = {
      ...DEFAULT_REDUNDANT_PROPS,
      ...(options.redundantDefaults || {}),
    };

    /**
     * Extracts the actual value from a JSX attribute value
     * @param {import('estree').JSXExpressionContainer|import('estree').Literal} valueNode - The JSX attribute value node
     * @returns {any|undefined} The extracted value or undefined if not extractable
     */
    function extractValue(valueNode) {
      if (!valueNode) return undefined;

      // Handle literal values directly
      if (valueNode.type === 'Literal') {
        return valueNode.value;
      }

      // Handle JSX expression containers with literal values
      if (valueNode.type === 'JSXExpressionContainer' && valueNode.expression.type === 'Literal') {
        return valueNode.expression.value;
      }

      // Skip complex expressions
      return undefined;
    }

    /**
     * Checks if a JSX attribute has a redundant default value
     * @param {import('estree').JSXAttribute} node - The JSX attribute node to check
     */
    function checkJSXAttribute(node) {
      if (node.type !== 'JSXAttribute' || !node.name || !node.value) {
        return;
      }

      const propName = node.name.name;

      // Check if this prop has a known redundant default
      if (!(propName in redundantDefaults)) {
        return;
      }

      const actualValue = extractValue(node.value);

      // Skip if we can't extract a simple value
      if (actualValue === undefined) {
        return;
      }

      const redundantValue = redundantDefaults[propName];

      // Check if the value matches the redundant default
      if (actualValue === redundantValue) {
        context.report({
          data: {
            propName,
            value: actualValue,
          },
          fix(fixer) {
            // Find the range to remove including surrounding whitespace
            const openingElement = node.parent;
            const attributes = openingElement.attributes;
            const currentIndex = attributes.indexOf(node);

            let start = node.range[0];
            let end = node.range[1];

            // Handle spacing by checking surrounding attributes
            if (currentIndex > 0) {
              // Not the first attribute - include preceding whitespace
              const prevAttribute = attributes[currentIndex - 1];
              const textBetween = sourceCode.text.slice(prevAttribute.range[1], start);
              if (/^\s+$/.test(textBetween)) {
                start = prevAttribute.range[1];
              }
            } else if (currentIndex === 0 && attributes.length > 1) {
              // First attribute with more attributes - include trailing whitespace
              const nextAttribute = attributes[currentIndex + 1];
              const textBetween = sourceCode.text.slice(end, nextAttribute.range[0]);
              if (/^\s+$/.test(textBetween)) {
                end = nextAttribute.range[0];
              }
            } else {
              // Only attribute - include any whitespace before the attribute
              const elementName = openingElement.name;
              const textBetween = sourceCode.text.slice(elementName.range[1], start);
              if (/^\s+$/.test(textBetween)) {
                start = elementName.range[1];
              }
            }

            return fixer.removeRange([start, end]);
          },
          messageId: 'redundantDefault',
          node,
        });
      }
    }

    return {
      JSXAttribute: checkJSXAttribute,
    };
  },
  meta: {
    docs: {
      description: 'Disallow redundant default prop values in JSX',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      redundantDefault: 'Redundant prop \'{{propName}}="{{value}}"\' - this is the default value and can be omitted',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          redundantDefaults: {
            additionalProperties: {
              oneOf: [{type: 'string'}, {type: 'boolean'}, {type: 'number'}, {type: 'null'}],
            },
            type: 'object',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
};
