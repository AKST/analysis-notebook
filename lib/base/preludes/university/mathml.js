/**
 * @import { E } from '../../render_app/type.ts';
 */

import { mathml } from '../../render_app/helper/mathml.js';
import { SPECIAL, parensA } from './mathml_2.js';

const { rel } = SPECIAL;
const { mrow, mspace } = mathml;

/** @param {string} v @returns {E.Item} */
const o = v => ['mo', v];

/** @param {E.Item} a @param {E.Item} b */
export const divP = (a, b) => parensA(
  mrow(a, mspace(4), o('÷'), mspace(4), b),
);

/** @param {E.Item} a @param {E.Item} b */
export const addP = (a, b) => parensA(
  a, mspace(4), o('+'), mspace(4), b,
);

/** @param {E.Item} a @param {E.Item} b  @param {E.Item} c */
export const add3 = (a, b, c) => mrow(
  a, mspace(4), o('+'), mspace(4),
  b, mspace(4), o('+'), mspace(4),
  c,
);

/** @param {E.Item} a @param {E.Item} b */
export const minusP = (a, b) => parensA(
  a, mspace(4), o('-'), mspace(4), b,
);

/** @param {E.Item} a @param {E.Item} b */
export const minusSqP = (a, b) => mrow(
  o('['),
  mrow(a, mspace(4), o('-'), mspace(4), b),
  o(']'),
);

/** @param {E.Item} a @param {E.Item} b */
export const mul2 = (a, b) => mrow(
  a, mspace(4), o('·'), mspace(4), b,
);

/** @param {E.Item} a @param {E.Item} b  @param {E.Item} c */
export const mul3 = (a, b, c) => mrow(
  a, mspace(4), o('·'), mspace(4), b, mspace(4), o('·'), mspace(4), c,
);

/** @param {E.Item} a @param {E.Item} b */
export const implies = (a, b) => mrow(
  a, mspace(12), rel.imply, mspace(12), b
);

