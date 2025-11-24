import { Unreachable } from './type.js';

/**
 * @param {string} str
 * @returns {string}
 */
export function camelToKebab(str) {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

/**
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (str.length < 2) return str;
  return str
    .split(' ')
    .map(s => s[0].toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
}

/**
 * @param {number} n
 */
export function diff(n, decimals=2) {
  const sign = Math.sign(n) < 0 ? '-' : '+';
  return sign + Math.abs(n).toFixed(decimals);
}

/**
 * A valid template is something like "hello {entity}"
 * where entity is a key to look up in params.
 *
 * @param {string} template
 * @param {Record<string, any>} params
 * @param {{
 *    onUnknown: (
 *      | { kind: 'throw' }
 *      | { kind: 'use', value: any }
 *      | { kind: 'lookup', lookup: (k: string) => any }
 *    ),
 *  }} config
 *  @returns {string}
 */
export function template(template, params, { onUnknown }) {
  /** @type {(name: string) => any} */
  let onMissing;
  switch (onUnknown.kind) {
    case 'throw':
      onMissing = key => {
        throw new Error(`missing value for ${key}`);
      };
      break;

    case 'use':
      onMissing = _ => onUnknown.value;
      break;

    case 'lookup':
      onMissing = k => onUnknown.lookup(k);
      break;

    default:
      throw new Unreachable(onUnknown);
  }

  return template.replace(/{(\w+)}/g, (_, key) => {
    if (key in params) return params[key];
    return onMissing(key);
  });
}
