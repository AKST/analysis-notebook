/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  inv,
  call, paren,
  set, frac, matrix, SPECIAL,
} = mathml;

const { mi, mo, mtext, mrow, mn, msub, msup, munder, mspace } = mathml2;

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
      cursive.F, mspace(4), mo`=`, mspace(4),
      mrow(
        mo`{`, mspace(2),
        msub(mi`f`, mi`i`), mspace(2),
        mo`:`, mspace(2),
        mi`i`, mspace(2), SPECIAL.operation.exists, mspace(2),
        set([mn(1), mn(2), ellipse.h, mi`n`]),
        mspace(2), mo`}`,
      ),
    ),
    mrow(
      msub(mi`f`, mi`i`), paren([mi`Q`]),
      mspace(2), mo`=`, mspace(2),
      mrow(
        msub(alpha, mi`i`), mo`+`,
        msub(beta, mi`i`), mi`Q`,
      ),
      mspace(16), mtext`where`, mspace(16),
      mrow(mi`i`, constraint.lteq, mi`n`),
    ),
    mrow(
      optimalA, mo`=`,
      mrow(sum(mi`n`, mrow(mi`i`, mo`=`, mn(1))), msub(alpha, mi`i`)),
      mspace(32),
      optimalB, mo`=`,
      mrow(sum(mi`n`, mrow(mi`i`, mo`=`, mn(1))), msub(beta, mi`i`)),
    ),
    mrow(
      optimalP, mo`=`, mspace(4),
      msup(alpha, mo`*`), mo`+`, mspace(4),
      msup(beta, mo`*`), mi`Q`,
    ),
  ),
);

export const lindahlPrice = () => mathml2.math(
  rows(
    mrow(
      optimalQ, mspace(4), mo`=`, mspace(4),
      frac([optimalP, mo`-`, mspace(4), optimalA], [optimalB]),
    ),
    mrow(
      msub(mi`P`, mi`i`), mspace(4),
      mo`=`, mspace(4),
      msub(alpha, mi`i`), mo`+`,
      msub(beta, mi`i`), optimalQ,
    ),
    mrow(
      mi`MC`, mspace(4), mo`=`, mspace(4),
      sum(mi`n`, mrow(mi`i`, mo`+`, mn(1))),
      msub(mi`P`, mi`i`),
    ),
  ),
);
