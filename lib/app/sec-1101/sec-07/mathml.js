/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, row, rows,
  space, call, paren, sup, over, text,
  frac, under, SPECIAL: CHARS,
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

export const averageCostPricing = () => mathml([
  over(text('Average Cost Pricing'), row([
    i('Profit'), o('='), i('Q'),
    paren([i('Price'), o('-'), i('ATC')]),
  ])),
]);

export const firstDegreePriceDiscriminationTR = () => mathml([
  under(over(rows([
    text('First Degree Price'),
    text('Descrimination'),
    text('Total Revenue')
  ]), rows([
    row([
      i('TR'), o('='),
      sum(i('N'), row([i('i'), o('='), n(1)])),
      sub(i('P'), i('i')),
      paren([
        sub(i('Q'), row([i('i')])),
        o('-'),
        sub(i('Q'), row([i('i'), o('-'), n(1)])),
      ]),
    ]),
  ])), rows([
    space(4),
    space(4),
    row([i('N'), o('='), text('Number of unique reservation prices')]),
    row([sub(i('P'), i('i')), o('='), text('Price of ith Reservation Price')]),
    row([sub(i('Q'), i('i')), o('='), text('Quantity demanded at ith Reservation Price')]),
  ])),
]);

export const firstDegreePriceDiscriminationMR = () => mathml([
  i('MR'), o('='), frac([CHARS.delta, i('TR')], [CHARS.delta, i('Q')]),
]);
