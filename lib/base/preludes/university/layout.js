/**
 * @import { E } from '../../render_app/type.ts';
 */

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
export const container = (...items) => ['div', { className: 'container' }, items]

/**
 * @param {E.Item} a
 * @param {E.Item} b
 * @returns {E.Item}
 */
export const twoColumns = (a, b) =>
  ['div', { className: 'c2' }, [a, b]]

/**
 * @param {E.Item} a
 * @param {E.Item} b
 * @returns {E.Item}
 */
export const twoThree = (a, b) =>
  ['div', { className: 'c2 twoThree' }, [a, b]]

/**
 * @param {E.Item} body
 * @param {number} f
 * @returns {E.Item}
 */
export const fontsize = (body, f) =>
  ['div', {style: `font-size: ${f}px` }, [body]];
