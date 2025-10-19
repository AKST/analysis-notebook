/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  inv,
  space, call, paren,
  set, frac, matrix, SPECIAL,
} = mathml;

const { mi, mo, mtext, mrow, mn, msub, msup, munder } = mathml2;

const { rows, sum } = mathmlHelper2;

const {
  cursive, constraint, alpha,
  beta, ellipse
} = SPECIAL;

const optimalQ = msup(mi`Q`, mo`*`);
const optimalP = msup(mi`P`, mo`*`);
const optimalA = msup(alpha, mo`*`);
const optimalB = msup(beta, mo`*`);

export const verticalSummation = () => mathml2.math(
  rows(
    mrow(
      cursive.F, space(4), mo`=`, space(4),
      mrow(
        mo`{`, space(2),
        msub(mi`f`, mi`i`), space(2),
        mo`:`, space(2),
        mi`i`, space(2), SPECIAL.operation.exists, space(2),
        set([mn(1), mn(2), ellipse.h, mi`n`]),
        space(2), mo`}`,
      ),
    ),
    mrow(
      msub(mi`f`, mi`i`), paren([mi`Q`]),
      space(2), mo`=`, space(2),
      mrow(
        msub(alpha, mi`i`), mo`+`,
        msub(beta, mi`i`), mi`Q`,
      ),
      space(16), mtext`where`, space(16),
      mrow(mi`i`, constraint.lteq, mi`n`),
    ),
    mrow(
      optimalA, mo`=`,
      mrow(sum(mi`n`, mrow(mi`i`, mo`=`, mn(1))), msub(alpha, mi`i`)),
      space(32),
      optimalB, mo`=`,
      mrow(sum(mi`n`, mrow(mi`i`, mo`=`, mn(1))), msub(beta, mi`i`)),
    ),
    mrow(
      optimalP, mo`=`, space(4),
      msup(alpha, mo`*`), mo`+`, space(4),
      msup(beta, mo`*`), mi`Q`,
    ),
  ),
);

export const lindahlPrice = () => mathml2.math(
  rows(
    mrow(
      optimalQ, space(4), mo`=`, space(4),
      frac([optimalP, mo`-`, space(4), optimalA], [optimalB]),
    ),
    mrow(
      msub(mi`P`, mi`i`), space(4),
      mo`=`, space(4),
      msub(alpha, mi`i`), mo`+`,
      msub(beta, mi`i`), optimalQ,
    ),
    mrow(
      mi`MC`, space(4), mo`=`, space(4),
      sum(mi`n`, mrow(mi`i`, mo`+`, mn(1))),
      msub(mi`P`, mi`i`),
    ),
  ),
);
