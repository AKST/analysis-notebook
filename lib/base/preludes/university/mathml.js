/**
 * @import { E } from '../../render_app/type.ts';
 */

import { frag, mathml } from '../../render_app/index.js';

const { n, o, space, paren, frac } = mathml;

/** @param {E.Item} a @param {...E.Item} b */
export const eq = (a, ...b) => frag([a, space(4), o('='), space(4), ...b]);

/** @param {E.Item} a @param {...E.Item} b */
export const eqId = (a, ...b) => frag([a, space(4), o('≡'), space(4), ...b]);

/** @param {E.Item} a @param {E.Item} b */
export const add = (a, b) => frag([a, space(4), o('+'), space(4), b]);

/** @param {E.Item} a @param {E.Item} b  @param {E.Item} c */
export const add3 = (a, b, c) => frag([
  a, space(4), o('+'), space(4),
  b, space(4), o('+'), space(4),
  c,
]);

/** @param {E.Item} a @param {E.Item} b */
export const minus = (a, b) => frag([
  a, space(4), o('-'), space(4), b,
]);

/** @param {E.Item} a @param {E.Item} b */
export const minusP = (a, b) => paren([
  a, space(4), o('-'), space(4), b,
]);

/** @param {number} a @param {number} b */
export const nFrac = (a, b) => frac([n(a)], [n(b)]);

/** @param {E.Item} a @param {E.Item} b */
export const mul2 = (a, b) => frag([
  a, space(6), b,
]);

/** @param {E.Item} a @param {E.Item} b  @param {E.Item} c */
export const mul3 = (a, b, c) => frag([
  a, space(6), b, space(6), c,
]);

