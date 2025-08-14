/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, table, SPECIAL: CHARS,
} = mathml;

const { alpha, beta } = CHARS;

export const marginalRevenue = () => mathml([
  row([
    text('Marginal Revenue'),
    o('='),
    frac([i('dTR')], [i('dQ')]),
  ])
]);

const da = sub(CHARS.alpha, i('D'));
const db = sub(CHARS.beta, i('D'));
const sa = sub(CHARS.alpha, i('S'));
const sb = sub(CHARS.beta, i('S'));
const qm = sub(i('Q'), i('m'));

export const calcMarginalRevenue = () => mathml([
  rows([
    row([sub(i('P'), i('D')), o('='), da, o('-'), db, i('Q')]),
    row([i('TR'), o('='), i('Q'), CHARS.operation.dot, sub(i('P'), i('D'))]),
    row([i('TR'), o('='), i('Q'), paren([da, o('-'), db, i('Q')])]),
    row([i('TR'), o('='), da, i('Q'), o('-'), db, sup(i('Q'), n(2))]),
    row([i('MR'), o('='), frac([i('dTR')], [i('dQ')]), o('='), da, o('-'), n(2), db, i('Q')]),
  ]),
]);

export const profitMaximisingQuantity = () => mathml([
  rows([
    row([da, o('-'), n(2), db, qm, o('='), sa, o('+'), sb, qm]),
    row([da, o('-'), sa, o('='), qm, paren([n(2), db, o('+'), sb])]),
    row([qm, o('='), frac([da, o('-'), sa], [n(2), db, o('+'), sb])]),
  ]),
]);

export const monopolistPrice = () => mathml([
  row([sub(i('P'), i('m')), o('='), sa, o('+'), sb, qm]),
]);
