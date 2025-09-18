/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL, under,
} = mathml;

const {
  cursive, constraint, alpha,
  beta, ellipse
} = SPECIAL;

const optimalQ = sup(i('Q'), o('*'));
const optimalP = sup(i('P'), o('*'));
const optimalA = sup(alpha, o('*'));
const optimalB = sup(beta, o('*'));

export const verticalSummation = () => mathml([
  rows([
    row([
      cursive.F, space(4), o('='), space(4),
      row([
        o('{'), space(2),
        sub(i('f'), i('i')), space(2),
        o(':'), space(2),
        i('i'), space(2), SPECIAL.operation.exists, space(2),
        set([n(1), n(2), ellipse.h, i('n')]),
        space(2), o('}'),
      ]),
    ]),
    row([
      sub(i('f'), i('i')), paren([i('Q')]),
      space(2), o('='), space(2),
      row([
        sub(alpha, i('i')), o('+'),
        sub(beta, i('i')), i('Q'),
      ]),
      space(16), text('where'), space(16),
      row([i('i'), constraint.lteq, i('n')]),
    ]),
    row([
      optimalA, o('='),
      row([sum(i('n'), row([i('i'), o('='), n(1)])), sub(alpha, i('i'))]),
      space(32),
      optimalB, o('='),
      row([sum(i('n'), row([i('i'), o('='), n(1)])), sub(beta, i('i'))]),
    ]),
    row([
      optimalP, o('='), space(4),
      sup(alpha, o('*')), o('+'), space(4),
      sup(beta, o('*')), i('Q'),
    ]),
  ]),
]);

export const lindahlPrice = () => mathml([
  rows([
    row([
      optimalQ, space(4), o('='), space(4),
      frac([optimalP, o('-'), space(4), optimalA], [optimalB]),
    ]),
    row([
      sub(i('P'), i('i')), space(4),
      o('='), space(4),
      sub(alpha, i('i')), o('+'),
      sub(beta, i('i')), optimalQ,
    ]),
    row([
      i('MC'), space(4), o('='), space(4),
      sum(i('n'), row([i('i'), o('+'), n(1)])),
      sub(i('P'), i('i')),
    ]),
  ]),
]);

