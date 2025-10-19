/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  sum, sub, n, inv,
  space, call, paren, sup, over,
  set, frac, matrix, SPECIAL, under,
} = mathml;

const { mi, mo, mtext, mrow } = mathml2;

const { rows } = mathmlHelper2;

const {
  cursive, constraint, alpha,
  beta, ellipse
} = SPECIAL;

const optimalQ = sup(mi`Q`, mo`*`);
const optimalP = sup(mi`P`, mo`*`);
const optimalA = sup(alpha, mo`*`);
const optimalB = sup(beta, mo`*`);

export const verticalSummation = () => mathml2.math(
  rows(
    mrow(
      cursive.F, space(4), mo`=`, space(4),
      mrow(
        mo`{`, space(2),
        sub(mi`f`, mi`i`), space(2),
        mo`:`, space(2),
        mi`i`, space(2), SPECIAL.operation.exists, space(2),
        set([n(1), n(2), ellipse.h, mi`n`]),
        space(2), mo`}`,
      ),
    ),
    mrow(
      sub(mi`f`, mi`i`), paren([mi`Q`]),
      space(2), mo`=`, space(2),
      mrow(
        sub(alpha, mi`i`), mo`+`,
        sub(beta, mi`i`), mi`Q`,
      ),
      space(16), mtext`where`, space(16),
      mrow(mi`i`, constraint.lteq, mi`n`),
    ),
    mrow(
      optimalA, mo`=`,
      mrow(sum(mi`n`, mrow(mi`i`, mo`=`, n(1))), sub(alpha, mi`i`)),
      space(32),
      optimalB, mo`=`,
      mrow(sum(mi`n`, mrow(mi`i`, mo`=`, n(1))), sub(beta, mi`i`)),
    ),
    mrow(
      optimalP, mo`=`, space(4),
      sup(alpha, mo`*`), mo`+`, space(4),
      sup(beta, mo`*`), mi`Q`,
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
      sub(mi`P`, mi`i`), space(4),
      mo`=`, space(4),
      sub(alpha, mi`i`), mo`+`,
      sub(beta, mi`i`), optimalQ,
    ),
    mrow(
      mi`MC`, space(4), mo`=`, space(4),
      sum(mi`n`, mrow(mi`i`, mo`+`, n(1))),
      sub(mi`P`, mi`i`),
    ),
  ),
);
