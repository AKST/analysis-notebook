/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml, mathml2 } from '../../prelude.js';

const {
  sum, sub, n, row, rows,
  space, call, paren, sup, over, text,
  frac, under, SPECIAL: CHARS,
} = mathml;

const { mi, mo } = mathml2;

const { alpha, beta } = CHARS;

export const marginalRevenue = () => mathml([
  row([
    text('Marginal Revenue'),
    mo`=`,
    frac([mi`dTR`], [mi`dQ`]),
  ])
]);

const da = sub(CHARS.alpha, mi`D`);
const db = sub(CHARS.beta, mi`D`);
const sa = sub(CHARS.alpha, mi`S`);
const sb = sub(CHARS.beta, mi`S`);
const qm = sub(mi`Q`, mi`m`);

export const calcMarginalRevenue = () => mathml([
  rows([
    row([sub(mi`P`, mi`D`), mo`=`, da, mo`-`, db, mi`Q`]),
    row([mi`TR`, mo`=`, mi`Q`, CHARS.operation.dot, sub(mi`P`, mi`D`)]),
    row([mi`TR`, mo`=`, mi`Q`, paren([da, mo`-`, db, mi`Q`])]),
    row([mi`TR`, mo`=`, da, mi`Q`, mo`-`, db, sup(mi`Q`, n(2))]),
    row([mi`MR`, mo`=`, frac([mi`dTR`], [mi`dQ`]), mo`=`, da, mo`-`, n(2), db, mi`Q`]),
  ]),
]);

export const profitMaximisingQuantity = () => mathml([
  rows([
    row([da, mo`-`, n(2), db, qm, mo`=`, sa, mo`+`, sb, qm]),
    row([da, mo`-`, sa, mo`=`, qm, paren([n(2), db, mo`+`, sb])]),
    row([qm, mo`=`, frac([da, mo`-`, sa], [n(2), db, mo`+`, sb])]),
  ]),
]);

export const monopolistPrice = () => mathml([
  row([sub(mi`P`, mi`m`), mo`=`, sa, mo`+`, sb, qm]),
]);

export const averageCostPricing = () => mathml([
  over(text('Average Cost Pricing'), row([
    mi`Profit`, mo`=`, mi`Q`,
    paren([mi`Price`, mo`-`, mi`ATC`]),
  ])),
]);

export const firstDegreePriceDiscriminationTR = () => mathml([
  under(over(rows([
    text('First Degree Price'),
    text('Descrimination'),
    text('Total Revenue')
  ]), rows([
    row([
      mi`TR`, mo`=`,
      sum(mi`N`, row([mi`i`, mo`=`, n(1)])),
      sub(mi`P`, mi`i`),
      paren([
        sub(mi`Q`, row([mi`i`])),
        mo`-`,
        sub(mi`Q`, row([mi`i`, mo`-`, n(1)])),
      ]),
    ]),
  ])), rows([
    space(4),
    space(4),
    row([mi`N`, mo`=`, text('Number of unique reservation prices')]),
    row([sub(mi`P`, mi`i`), mo`=`, text('Price of ith Reservation Price')]),
    row([sub(mi`Q`, mi`i`), mo`=`, text('Quantity demanded at ith Reservation Price')]),
  ])),
]);

export const firstDegreePriceDiscriminationMR = () => mathml([
  mi`MR`, mo`=`, frac([CHARS.delta, mi`TR`], [CHARS.delta, mi`Q`]),
]);
