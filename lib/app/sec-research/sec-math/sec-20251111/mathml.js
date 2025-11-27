/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import {
  parensA, call, table, op, neg,
  parensB, SPECIAL, abs, annotationOver,
  parensD, rows,
} from '@prelude-uni/mathml.js';

const {
  math, mi, mo, mtext, mrow, mn, msup, msub, msubsup,
  mtable, mtr, mtd, msqrt, munder, mspace, mfrac,
} = mathml;

const {
  comma, imply, eqId, eq, add, minus,
  div, mul, mul0, approxEq, sumDir,
} = op;

const realPolynomial = call({ fn: mi`ℝ`, paren: '[]' });

export const generalisedComplex = {
  def: text.figure(
    math(
      table({ columnalign: 'right right center left center left' })(
        [
          mtext`Let`,
          mi`ℂ`,
          mo`=`,
          ...approxEq.array(
            mfrac(realPolynomial(mi`i`), mi`I`),
            sumDir(mi`ℝ`, mul0(mi`ℝ`, mi`i`)),
          ),
        ],
        [
          mtext`Where`,
          mi`I`,
          mo`=`,
          ...imply.array(
            comma.angle(add(msup(mi`i`, mn(2)), mn(1))),
            eq(msup(mi`i`, mn(2)), neg(mn(1))),
          ),
        ],
      ),
    ),
    doc.figcaption`Generalise Complex Numbers`,
  ),
  mod: math(mfrac(realPolynomial(mi`i`), mi`I`)),
};
