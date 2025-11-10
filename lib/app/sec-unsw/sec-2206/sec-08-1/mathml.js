/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { sum, parensA, abs, neg, table, rows, call, op } from '@prelude-uni/mathml.js';

const { minus, mul0, eq, add, comma } = op;
const {
  msqrt, mtr, mtd, mspace, math, mi, mo, mtext,
  mrow, mn, msup, msub, msubsup, mover,
  mfrac, munderover, mtable, munder,
} = mathml;

const Log = call({ fn: mtext`Log` });
const Expect = call({ fn: mi`𝔼` });
const Variance = call({ fn: mi`𝕍` });

const subscript = {
  /**
   * @param {'t' |  E.Item} t
   */
  tInner: t => typeof t === 'string' ? mi.of(t) : t,
  /**
   * @param {number | string} index
   */
  idx: index => typeof index === 'number' ? mn(index) : mi.of(index),

  /**
   * @param {number | string | undefined} index
   * @param {'t' |  E.Item} t
   */
  t: (index, t) => index != null
    ? comma.sub(subscript.idx(index), subscript.tInner(t))
    : subscript.tInner(t),
};

const $ = {
  /**
   * @param {string} label
   * @param {number | string | undefined} index
   */
  var: (label, index) => (
    index != null
      ? msub(mi.of(label), subscript.idx(index))
      : mi.of(label)
  ),
  /**
   * @param {string} label
   * @param {number | string | undefined} [index]
   * @param {'t' |  E.Item} [t]
   */
  varT: (label, index = undefined, t = 't') => (
     msub(mi.of(label), subscript.t(index, t))
  ),
  /**
   * @param {string} label
   * @param {number | string | undefined} index
   * @param {number} lag
   */
  varLag: (label, index, lag) => (
     $.varT(label, index, minus.sub(mi`t`, mn(lag)))
  ),
  /**
   * @param {number | string | undefined} index
   * @param {string} [label]
   */
  coeff: (index, label = '𝛽') => $.var(label, index),
};

export const staticModels = {
  example: doc.figure(
    math(
      eq($.varT('y'), add(
        $.coeff(0),
        mul0($.coeff(1), $.varT('x', 1)),
        mo`⋯`,
        mul0($.coeff('k'), $.varT('x', 'k')),
        $.varT('u'),
      )),
    ),
    doc.figcaption`Example of a static model`,
  ),
};

export const lagModels = {
  example: doc.figure(
    math(
      eq($.varT('y'), add(
        $.coeff(0, '𝛼'),
        mul0($.coeff(0, '𝛿'), $.varT('x', 1)),
        mul0($.coeff(1, '𝛿'), $.varLag('x', 1, 1)),
        mul0($.coeff(2, '𝛿'), $.varLag('x', 1, 2)),
        $.varT('u'),
      )),
    ),
    doc.figcaption`Example of a static model`,
  ),
};
