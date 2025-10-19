/**
 * @import { E } from '../../render_app/type.ts';
 */

import { mathml } from '../../render_app/index.js';
import { mathml as mathml2 } from '../../render_app/helper/mathml_2.js';

const { SPECIAL, space, paren, frac } = mathml;
const { mrow, mn } = mathml2;

/** @param {string} v @returns {E.Item} */
const o = v => ['mo', v];

/** @param {E.Item} a @param {...E.Item} b */
export const eq = (a, ...b) => mrow(a, space(4), o('='), space(4), ...b);

/** @param {E.Item} a @param {...E.Item} b */
export const eqId = (a, ...b) => mrow(a, space(4), o('≡'), space(4), ...b);

/** @param {E.Item} a @param {E.Item} b */
export const add = (a, b) => mrow(a, space(4), o('+'), space(4), b);

/** @param {E.Item} a @param {E.Item} b */
export const div = (a, b) => mrow(a, space(4), o('÷'), space(4), b);

/** @param {E.Item} a @param {E.Item} b */
export const divP = (a, b) => paren([
  mrow(a, space(4), o('÷'), space(4), b),
]);

/** @param {E.Item} a @param {E.Item} b */
export const addP = (a, b) => paren([
  a, space(4), o('+'), space(4), b,
]);

/** @param {E.Item} a @param {E.Item} b  @param {E.Item} c */
export const add3 = (a, b, c) => mrow(
  a, space(4), o('+'), space(4),
  b, space(4), o('+'), space(4),
  c,
);

/** @param {E.Item} a @param {E.Item} b */
export const minus = (a, b) => mrow(
  a, space(4), o('-'), space(4), b,
);

/** @param {E.Item} a @param {E.Item} b */
export const minusP = (a, b) => paren([
  a, space(4), o('-'), space(4), b,
]);

/** @param {E.Item} a @param {E.Item} b */
export const minusSqP = (a, b) => mrow(
  o('['),
  mrow(a, space(4), o('-'), space(4), b),
  o(']'),
);

/** @param {number} a @param {number} b */
export const nFrac = (a, b) => frac([mn(a)], [mn(b)]);

/** @param {E.Item} a @param {E.Item} b */
export const mul2 = (a, b) => mrow(
  a, space(4), o('·'), space(4), b,
);

/** @param {E.Item} a @param {E.Item} b  @param {E.Item} c */
export const mul3 = (a, b, c) => mrow(
  a, space(4), o('·'), space(4), b, space(4), o('·'), space(4), c,
);

/** @param {E.Item} a @param {E.Item} b */
export const implies = (a, b) => mrow(
  a, space(12), SPECIAL.arrow, space(12), b
);

