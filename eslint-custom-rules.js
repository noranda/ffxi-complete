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
          (child.type === 'JSXExpressionContainer' && child.expression.type !== 'JSXEmptyExpression')
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
            const linesBetween = currentToken.loc.start.line - prevToken.loc.end.line;

            // If there's only 1 line break (same line or next line), we need more spacing
            if (linesBetween <= 1) {
              context.report({
                fix(fixer) {
                  const textBetween = sourceCode.getText().slice(prevToken.range[1], currentToken.range[0]);
                  // Replace with proper spacing (newline + blank line)
                  const replacement = textBetween.includes('\n') ? '\n\n      ' : '\n\n      ';
                  return fixer.replaceTextRange([prevToken.range[1], currentToken.range[0]], replacement);
                },
                message: 'Multi-line JSX elements should have a blank line before them',
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
            const linesBetween = nextToken.loc.start.line - currentToken.loc.end.line;

            if (linesBetween <= 1) {
              context.report({
                fix(fixer) {
                  const textBetween = sourceCode.getText().slice(currentToken.range[1], nextToken.range[0]);
                  const replacement = textBetween.includes('\n') ? '\n\n      ' : '\n\n      ';
                  return fixer.replaceTextRange([currentToken.range[1], nextToken.range[0]], replacement);
                },
                message: 'Multi-line JSX elements should have a blank line before them',
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
const jsxExpressionSpacing = {
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Checks if two JSX children need a newline between them
     * @param {import('eslint').Rule.Node} current - Current JSX child node
     * @param {import('eslint').Rule.Node} next - Next JSX child node
     * @returns {boolean} True if they need spacing
     */
    function needsSpacing(current, next) {
      // Check if current is JSX element and next is JSX expression container
      if (current.type === 'JSXElement' && next.type === 'JSXExpressionContainer') {
        return true;
      }
      // Check if current is JSX expression container and next is JSX element
      if (current.type === 'JSXExpressionContainer' && next.type === 'JSXElement') {
        return true;
      }
      return false;
    }

    /**
     * Checks JSX element for proper spacing between elements and expressions
     * @param {import('eslint').Rule.Node} node - The JSX element to check
     * @returns {void}
     */
    function checkJSXElement(node) {
      if (!node.children || node.children.length < 2) return;

      // Get all non-whitespace children
      const nonWhitespaceChildren = node.children.filter(child => {
        if (child.type === 'JSXText') {
          // Only skip if it's pure whitespace
          return child.value.trim() !== '';
        }
        if (child.type === 'JSXExpressionContainer' && child.expression.type === 'JSXEmptyExpression') {
          return false;
        }
        return true;
      });

      for (let i = 0; i < nonWhitespaceChildren.length - 1; i++) {
        const current = nonWhitespaceChildren[i];
        const next = nonWhitespaceChildren[i + 1];

        if (needsSpacing(current, next)) {
          const currentToken = sourceCode.getLastToken(current);
          const nextToken = sourceCode.getFirstToken(next);

          if (currentToken && nextToken) {
            const linesBetween = nextToken.loc.start.line - currentToken.loc.end.line;

            // If there's only one line or they're on the same line
            if (linesBetween <= 1) {
              context.report({
                fix(fixer) {
                  // Find the text between the two tokens
                  const textBetween = sourceCode.getText().slice(currentToken.range[1], nextToken.range[0]);

                  // Insert a newline if they're on the same line, or add extra newline if just one line apart
                  const replacement =
                    linesBetween === 0 ? '\n\n                ' : textBetween.replace(/\n(\s*)/, '\n\n$1');

                  return fixer.replaceTextRange([currentToken.range[1], nextToken.range[0]], replacement);
                },
                message: 'JSX elements and expressions should be separated by a newline',
                node: next,
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
      description: 'Enforce newlines between JSX elements and JSX expression blocks',
    },
    fixable: 'whitespace',
    schema: [],
    type: 'layout',
  },
};

/** @type {import('eslint').Rule.RuleModule} */
const noUnnecessaryDivWrapper = {
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Checks if a JSX element has meaningful attributes (not just className/style)
     * @param {import('eslint').Rule.Node} node - The JSX element to check
     * @returns {boolean} True if the element has meaningful attributes
     */
    function hasMeaningfulAttributes(node) {
      if (!node.openingElement.attributes.length) return false;

      // Allow certain attributes that provide functionality
      const meaningfulAttributes = [
        'id',
        'role',
        'aria-',
        'data-',
        'onClick',
        'onSubmit',
        'onKeyDown',
        'onChange',
        'tabIndex',
        'ref',
      ];

      return node.openingElement.attributes.some(attr => {
        if (attr.type !== 'JSXAttribute') return false;
        const name = attr.name.name;

        // Allow event handlers and accessibility attributes
        return meaningfulAttributes.some(meaningful => name.startsWith(meaningful));
      });
    }

    /**
     * Checks if the div serves a layout purpose
     * @param {import('eslint').Rule.Node} node - The JSX element to check
     * @returns {boolean} True if the div serves a layout purpose
     */
    function servesLayoutPurpose(node) {
      // Check if div has className that suggests layout purpose
      const classNameAttr = node.openingElement.attributes.find(
        attr => attr.type === 'JSXAttribute' && attr.name.name === 'className'
      );

      if (classNameAttr && classNameAttr.value) {
        if (classNameAttr.value.type === 'Literal') {
          const classes = classNameAttr.value.value;
          // Common layout classes that justify a wrapper div
          const layoutClasses = [
            'flex',
            'grid',
            'space-',
            'gap-',
            'p-',
            'px-',
            'py-',
            'm-',
            'mx-',
            'my-',
            'w-',
            'h-',
            'max-w',
            'max-h',
            'min-w',
            'min-h',
            'absolute',
            'relative',
            'fixed',
            'sticky',
            'top-',
            'bottom-',
            'left-',
            'right-',
            'inset-',
            'z-',
            'container',
            'rounded',
            'border',
            'bg-',
            'text-center',
            'text-left',
            'text-right',
            'justify-',
            'items-',
            'self-',
            'overflow-',
            'font-',
            'text-',
          ];

          return layoutClasses.some(layoutClass => classes.includes(layoutClass));
        }
      }

      return false;
    }

    /**
     * Gets non-whitespace children
     * @param {import('eslint').Rule.Node} node - The JSX element
     * @returns {import('eslint').Rule.Node[]} Array of non-whitespace children
     */
    function getNonWhitespaceChildren(node) {
      return node.children.filter(child => {
        if (child.type === 'JSXText') {
          return child.value.trim() !== '';
        }
        if (child.type === 'JSXExpressionContainer' && child.expression.type === 'JSXEmptyExpression') {
          return false;
        }
        return true;
      });
    }

    return {
      JSXElement(node) {
        // Only check div elements
        if (
          !node.openingElement ||
          !node.openingElement.name ||
          node.openingElement.name.type !== 'JSXIdentifier' ||
          node.openingElement.name.name !== 'div'
        ) {
          return;
        }

        // Skip if div has meaningful attributes or serves a layout purpose
        if (hasMeaningfulAttributes(node) || servesLayoutPurpose(node)) {
          return;
        }

        const nonWhitespaceChildren = getNonWhitespaceChildren(node);

        // Only report if there's exactly one child
        if (nonWhitespaceChildren.length === 1) {
          const child = nonWhitespaceChildren[0];

          // Only suggest removal if the child is also a div or a simple element
          if (child.type === 'JSXElement' || child.type === 'JSXExpressionContainer') {
            context.report({
              fix(fixer) {
                // Get the text content of the child
                const childText = sourceCode.getText(child);
                return fixer.replaceText(node, childText);
              },
              message: 'Unnecessary div wrapper. Consider removing the wrapper or adding meaningful attributes.',
              node: node.openingElement,
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'Disallow unnecessary div wrappers around single elements',
    },
    fixable: 'code',
    schema: [],
    type: 'suggestion',
  },
};

/** @type {import('eslint').Rule.RuleModule} */
const preferCnForClassname = {
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Checks if a node is a className attribute with template literal containing interpolation
     * @param {import('eslint').Rule.Node} node - The JSX attribute node to check
     * @returns {boolean} True if it's a className with template literal interpolation
     */
    function isClassNameWithTemplateLiteral(node) {
      return (
        node.type === 'JSXAttribute' &&
        node.name &&
        node.name.type === 'JSXIdentifier' &&
        node.name.name === 'className' &&
        node.value &&
        node.value.type === 'JSXExpressionContainer' &&
        node.value.expression &&
        node.value.expression.type === 'TemplateLiteral' &&
        node.value.expression.expressions.length > 0 // Has interpolations
      );
    }

    /**
     * Checks if the file already imports cn function
     * @returns {boolean} True if cn is imported
     */
    function hasCnImport() {
      const program = context.sourceCode.ast;
      return program.body.some(node => {
        if (node.type === 'ImportDeclaration') {
          return node.specifiers.some(
            spec => spec.type === 'ImportSpecifier' && spec.imported && spec.imported.name === 'cn'
          );
        }
        return false;
      });
    }

    return {
      JSXAttribute(node) {
        if (isClassNameWithTemplateLiteral(node)) {
          const templateLiteral = node.value.expression;

          // Build suggested cn usage
          const parts = [];
          const quasis = templateLiteral.quasis;
          const expressions = templateLiteral.expressions;

          // Simple case: base classes + conditional
          if (quasis.length === 2 && expressions.length === 1) {
            const baseClasses = quasis[0].value.cooked.trim();
            const conditionalExpression = sourceCode.getText(expressions[0]);

            if (baseClasses) {
              parts.push(`'${baseClasses}'`);
            }
            parts.push(conditionalExpression);
          }

          const suggestedCode = `cn(${parts.join(', ')})`;

          context.report({
            fix(fixer) {
              // Add cn import if not present
              const fixes = [];

              if (!hasCnImport()) {
                const program = context.sourceCode.ast;
                const imports = program.body.filter(node => node.type === 'ImportDeclaration');
                const lastImport = imports[imports.length - 1];

                if (lastImport) {
                  fixes.push(fixer.insertTextAfter(lastImport, "\n\nimport {cn} from '@/lib/utils';"));
                }
              }

              // Replace the className value
              fixes.push(fixer.replaceText(node.value, `{${suggestedCode}}`));

              return fixes;
            },
            message: 'Use cn() function for conditional className logic instead of template literals',
            node: node.value,
            suggest: [
              {
                desc: `Use cn(${parts.join(', ')})`,
                fix: fixer => fixer.replaceText(node.value, `{${suggestedCode}}`),
              },
            ],
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'Enforce using cn() function for conditional className logic',
    },
    fixable: 'code',
    hasSuggestions: true,
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

/** @type {import('eslint').Rule.RuleModule} */
const preferSingleLineArrowFunctions = {
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      ArrowFunctionExpression(node) {
        // Only check arrow functions with block statements
        if (node.body.type === 'BlockStatement' && node.body.body.length === 1) {
          const statement = node.body.body[0];

          // Handle single expression statements (not return statements)
          if (statement.type === 'ExpressionStatement') {
            context.report({
              fix(fixer) {
                // Get the parameter list including parentheses and type annotations
                let paramsText;
                if (node.params.length === 0) {
                  paramsText = '()';
                } else if (node.params.length === 1 && !node.params[0].typeAnnotation) {
                  // Single parameter without type annotation doesn't need parentheses
                  paramsText = sourceCode.getText(node.params[0]);
                } else {
                  // Multiple parameters or single parameter with type annotation needs parentheses
                  paramsText = `(${node.params.map(parameter => sourceCode.getText(parameter)).join(', ')})`;
                }

                const expression = sourceCode.getText(statement.expression);

                // Preserve async keyword if present
                const asyncKeyword = node.async ? 'async ' : '';

                const replacement = `${asyncKeyword}${paramsText} => ${expression}`;

                return fixer.replaceText(node, replacement);
              },
              message: 'Arrow function with single statement should be condensed to single line',
              node,
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'Enforce single-line arrow functions for simple statements',
    },
    fixable: 'code',
    schema: [],
    type: 'style',
  },
};

/** @type {import('eslint').Linter.Config} */
export const customRulesConfig = {
  plugins: {
    'ffxi-custom': {
      rules: {
        'jsx-expression-spacing': jsxExpressionSpacing,
        'jsx-multiline-spacing': jsxMultilineSpacing,
        'no-unnecessary-div-wrapper': noUnnecessaryDivWrapper,
        'prefer-cn-for-classname': preferCnForClassname,
        'prefer-div-over-p': preferDivOverP,
        'prefer-single-line-arrow-functions': preferSingleLineArrowFunctions,
        'react-fc-pattern': reactFcPattern,
      },
    },
  },
  rules: {
    'ffxi-custom/jsx-expression-spacing': 'error',
    'ffxi-custom/jsx-multiline-spacing': 'error',
    'ffxi-custom/no-unnecessary-div-wrapper': 'error',
    'ffxi-custom/prefer-cn-for-classname': 'error',
    'ffxi-custom/prefer-div-over-p': 'error',
    'ffxi-custom/prefer-single-line-arrow-functions': 'error',
    'ffxi-custom/react-fc-pattern': 'error',
  },
};

export default customRulesConfig;
