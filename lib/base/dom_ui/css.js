import { camelToKebab } from '../util/strings.js';

/**
 * Generate CSS text from a style object with support for nesting
 * @param {Object} styleObject - The style object to convert to CSS
 * @param {string | undefined} parentSelector - Parent selector to scope the styles
 * @param {number} depth - Current nesting depth for indentation
 * @returns {string} Generated CSS text
 */
export function generateCSS(styleObject, parentSelector = '', depth = 0) {
  let css = '';
  const indent = '  '.repeat(depth);

  for (const [selector, properties] of Object.entries(styleObject)) {
    const fullSelector = parentSelector ? `${parentSelector} ${selector}` : selector;
    const cssProperties = [];
    let nestedCSS = '';

    // Process properties and nested styles
    for (const [property, value] of Object.entries(properties)) {
      if (value == null) continue;

      if (typeof value === 'object' && !Array.isArray(value)) {
        // This is a nested style - process immediately
        nestedCSS += generateCSS({ [property]: value }, undefined, depth + 1);
      } else {
        // This is a regular CSS property
        const cssProperty = camelToKebab(property);
        const cssValue = formatStyleValue(value);
        cssProperties.push(`${indent}  ${cssProperty}: ${cssValue};`);
      }
    }

    // Generate the rule
    css += `${indent}${depth === 0 ? fullSelector : selector} {\n`;
    css += cssProperties.join('\n') + '\n';
    css += nestedCSS;
    css += `${indent}}\n\n`;
  }

  return css;
}

/**
 * Format a style value for CSS output
 * @param {*} value - The value to format
 * @returns {string} Formatted CSS value
 */
export function formatStyleValue(value) {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 0 ? '0' : `${value}px`;
  }

  if (Array.isArray(value)) {
    return value.map(formatStyleValue).join(' ');
  }

  return String(value);
}
