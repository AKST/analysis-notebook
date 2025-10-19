/**
 * @import { E } from '../../render_app/type.ts';
 */

import { mathml } from '../../render_app/index.js';

const { row, SPECIAL, n, space, paren, frac } = mathml;

/** @param {string} v @returns {E.Item} */
const o = v => ['mo', v];

/** @param {E.Item} a @param {...E.Item} b */
export const eq = (a, ...b) => row([a, space(4), o('='), space(4), ...b]);

/** @param {E.Item} a @param {...E.Item} b */
export const eqId = (a, ...b) => row([a, space(4), o('≡'), space(4), ...b]);

/** @param {E.Item} a @param {E.Item} b */
export const add = (a, b) => row([a, space(4), o('+'), space(4), b]);

/** @param {E.Item} a @param {E.Item} b */
export const div = (a, b) => row([a, space(4), o('÷'), space(4), b]);

/** @param {E.Item} a @param {E.Item} b */
export const divP = (a, b) => paren([
  row([a, space(4), o('÷'), space(4), b]),
]);

/** @param {E.Item} a @param {E.Item} b */
export const addP = (a, b) => paren([
  a, space(4), o('+'), space(4), b,
]);

/** @param {E.Item} a @param {E.Item} b  @param {E.Item} c */
export const add3 = (a, b, c) => row([
  a, space(4), o('+'), space(4),
  b, space(4), o('+'), space(4),
  c,
]);

/** @param {E.Item} a @param {E.Item} b */
export const minus = (a, b) => row([
  a, space(4), o('-'), space(4), b,
]);

/** @param {E.Item} a @param {E.Item} b */
export const minusP = (a, b) => paren([
  a, space(4), o('-'), space(4), b,
]);

/** @param {E.Item} a @param {E.Item} b */
export const minusSqP = (a, b) => row([
  o('['),
  row([a, space(4), o('-'), space(4), b]),
  o(']'),
]);

/** @param {number} a @param {number} b */
export const nFrac = (a, b) => frac([n(a)], [n(b)]);

/** @param {E.Item} a @param {E.Item} b */
export const mul2 = (a, b) => row([
  a, space(4), o('·'), space(4), b,
]);

/** @param {E.Item} a @param {E.Item} b  @param {E.Item} c */
export const mul3 = (a, b, c) => row([
  a, space(4), o('·'), space(4), b, space(4), o('·'), space(4), c,
]);

/** @param {E.Item} a @param {E.Item} b */
export const implies = (a, b) => row([
  a, space(12), SPECIAL.arrow, space(12), b
]);

