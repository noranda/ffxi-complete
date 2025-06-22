/**
 * Custom ESLint rules for FFXI Complete project
 * These rules enforce specific formatting requirements from our code guidelines
 */

/** @type {import('eslint').Rule.RuleModule} */
const jsxMultilineSpacing = {
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Checks if a JSX node spans multiple lines
     * @param {import('eslint').Rule.Node} node - The JSX node to check
     * @returns {boolean} True if the node spans multiple lines
     */
    function isMultiLine(node) {
      const startLine = node.loc.start.line;
      const endLine = node.loc.end.line;
      return endLine > startLine;
    }

    /**
     * Gets JSX element siblings from a parent, filtering out whitespace text nodes
     * @param {import('eslint').Rule.Node} parent - The parent JSX element
     * @returns {import('eslint').Rule.Node[]} Array of JSX element siblings
     */
    function getJSXElementSiblings(parent) {
      // Filter out text nodes that are just whitespace
      return parent.children.filter(
        child =>
          child.type === 'JSXElement' ||
          (child.type === 'JSXExpressionContainer' &&
            child.expression.type !== 'JSXEmptyExpression')
      );
    }

    /**
     * Checks a JSX element for proper spacing around multi-line elements
     * @param {import('eslint').Rule.Node} node - The JSX element to check
     * @returns {void}
     */
    function checkJSXElement(node) {
      const parent = node.parent;
      if (!parent || parent.type !== 'JSXElement') return;

      const jsxSiblings = getJSXElementSiblings(parent);
      const nodeIndex = jsxSiblings.indexOf(node);

      if (nodeIndex === -1) return;

      // Check if this is a multi-line element that needs spacing before it
      if (isMultiLine(node) && nodeIndex > 0) {
        const prevSibling = jsxSiblings[nodeIndex - 1];
        if (prevSibling.type === 'JSXElement') {
          // Get the actual tokens to check spacing
          const prevToken = sourceCode.getLastToken(prevSibling);
          const currentToken = sourceCode.getFirstToken(node);

          if (prevToken && currentToken) {
            // Count the number of line breaks between elements
            const linesBetween =
              currentToken.loc.start.line - prevToken.loc.end.line;

            // If there's only 1 line break (same line or next line), we need more spacing
            if (linesBetween <= 1) {
              context.report({
                fix(fixer) {
                  const textBetween = sourceCode
                    .getText()
                    .slice(prevToken.range[1], currentToken.range[0]);
                  // Replace with proper spacing (newline + blank line)
                  const replacement = textBetween.includes('\n')
                    ? '\n\n      '
                    : '\n\n      ';
                  return fixer.replaceTextRange(
                    [prevToken.range[1], currentToken.range[0]],
                    replacement
                  );
                },
                message:
                  'Multi-line JSX elements should have a blank line before them',
                node,
              });
            }
          }
        }
      }

      // Check if this is a single-line element followed by a multi-line element
      if (!isMultiLine(node) && nodeIndex < jsxSiblings.length - 1) {
        const nextSibling = jsxSiblings[nodeIndex + 1];
        if (nextSibling.type === 'JSXElement' && isMultiLine(nextSibling)) {
          const currentToken = sourceCode.getLastToken(node);
          const nextToken = sourceCode.getFirstToken(nextSibling);

          if (currentToken && nextToken) {
            const linesBetween =
              nextToken.loc.start.line - currentToken.loc.end.line;

            if (linesBetween <= 1) {
              context.report({
                fix(fixer) {
                  const textBetween = sourceCode
                    .getText()
                    .slice(currentToken.range[1], nextToken.range[0]);
                  const replacement = textBetween.includes('\n')
                    ? '\n\n      '
                    : '\n\n      ';
                  return fixer.replaceTextRange(
                    [currentToken.range[1], nextToken.range[0]],
                    replacement
                  );
                },
                message:
                  'Multi-line JSX elements should have a blank line before them',
                node: nextSibling,
              });
            }
          }
        }
      }
    }

    return {
      JSXElement: checkJSXElement,
    };
  },
  meta: {
    docs: {
      description: 'Enforce newlines around multi-line JSX elements',
    },
    fixable: 'whitespace',
    schema: [],
    type: 'layout',
  },
};

/** @type {import('eslint').Rule.RuleModule} */
const reactFcPattern = {
  create(context) {
    return {
      VariableDeclarator(node) {
        // Check if this is a component declaration (starts with capital letter)
        if (
          node.id &&
          node.id.type === 'Identifier' &&
          /^[A-Z]/.test(node.id.name) &&
          node.init &&
          node.init.type === 'ArrowFunctionExpression'
        ) {
          // Check if it has React.FC type annotation
          if (!node.id.typeAnnotation) {
            context.report({
              message: `Component '${node.id.name}' should use React.FC type annotation`,
              node: node.id,
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'Enforce React.FC pattern for component declarations',
    },
    fixable: null,
    schema: [],
    type: 'suggestion',
  },
};

/** @type {import('eslint').Rule.RuleModule} */
const preferDivOverP = {
  create(context) {
    return {
      JSXElement(node) {
        if (
          node.openingElement &&
          node.openingElement.name &&
          node.openingElement.name.type === 'JSXIdentifier' &&
          node.openingElement.name.name === 'p'
        ) {
          context.report({
            fix(fixer) {
              const fixes = [];
              // Fix opening tag
              fixes.push(fixer.replaceText(node.openingElement.name, 'div'));
              // Fix closing tag if it exists
              if (node.closingElement && node.closingElement.name) {
                fixes.push(fixer.replaceText(node.closingElement.name, 'div'));
              }
              return fixes;
            },
            message: 'Prefer <div> over <p> for text content',
            node: node.openingElement.name,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'Prefer div over p elements for text content',
    },
    fixable: 'code',
    schema: [],
    type: 'suggestion',
  },
};

/** @type {import('eslint').Linter.Config} */
export const customRulesConfig = {
  plugins: {
    'ffxi-custom': {
      rules: {
        'jsx-multiline-spacing': jsxMultilineSpacing,
        'prefer-div-over-p': preferDivOverP,
        'react-fc-pattern': reactFcPattern,
      },
    },
  },
  rules: {
    'ffxi-custom/jsx-multiline-spacing': 'error',
    'ffxi-custom/prefer-div-over-p': 'error',
    'ffxi-custom/react-fc-pattern': 'error',
  },
};

export default customRulesConfig;
