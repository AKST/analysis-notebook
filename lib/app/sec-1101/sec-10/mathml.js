/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2 } from '../../prelude.js';

const {
  sum, sub, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL, under,
} = mathml;

const { mi, mo } = mathml2;

const {
  cursive, constraint, alpha,
  beta, ellipse
} = SPECIAL;

const optimalQ = sup(mi`Q`, mo`*`);
const optimalP = sup(mi`P`, mo`*`);
const optimalA = sup(alpha, mo`*`);
const optimalB = sup(beta, mo`*`);

export const verticalSummation = () => mathml([
  rows([
    row([
      cursive.F, space(4), mo`=`, space(4),
      row([
        mo`{`, space(2),
        sub(mi`f`, mi`i`), space(2),
        mo`:`, space(2),
        mi`i`, space(2), SPECIAL.operation.exists, space(2),
        set([n(1), n(2), ellipse.h, mi`n`]),
        space(2), mo`}`,
      ]),
    ]),
    row([
      sub(mi`f`, mi`i`), paren([mi`Q`]),
      space(2), mo`=`, space(2),
      row([
        sub(alpha, mi`i`), mo`+`,
        sub(beta, mi`i`), mi`Q`,
      ]),
      space(16), text('where'), space(16),
      row([mi`i`, constraint.lteq, mi`n`]),
    ]),
    row([
      optimalA, mo`=`,
      row([sum(mi`n`, row([mi`i`, mo`=`, n(1)])), sub(alpha, mi`i`)]),
      space(32),
      optimalB, mo`=`,
      row([sum(mi`n`, row([mi`i`, mo`=`, n(1)])), sub(beta, mi`i`)]),
    ]),
    row([
      optimalP, mo`=`, space(4),
      sup(alpha, mo`*`), mo`+`, space(4),
      sup(beta, mo`*`), mi`Q`,
    ]),
  ]),
]);

export const lindahlPrice = () => mathml([
  rows([
    row([
      optimalQ, space(4), mo`=`, space(4),
      frac([optimalP, mo`-`, space(4), optimalA], [optimalB]),
    ]),
    row([
      sub(mi`P`, mi`i`), space(4),
      mo`=`, space(4),
      sub(alpha, mi`i`), mo`+`,
      sub(beta, mi`i`), optimalQ,
    ]),
    row([
      mi`MC`, space(4), mo`=`, space(4),
      sum(mi`n`, row([mi`i`, mo`+`, n(1)])),
      sub(mi`P`, mi`i`),
    ]),
  ]),
]);
