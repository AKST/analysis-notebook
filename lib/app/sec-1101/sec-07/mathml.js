/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  sum, sub, n,
  space, call, paren, sup,
  frac, under, SPECIAL: CHARS,
} = mathml;

const { mi, mo, mtext, mrow, mover } = mathml2;

const { rows } = mathmlHelper2;

const { alpha, beta } = CHARS;

export const marginalRevenue = () => mathml2.math(
  mrow(
    mtext`Marginal Revenue`,
    mo`=`,
    frac([mi`dTR`], [mi`dQ`]),
  )
);

const da = sub(CHARS.alpha, mi`D`);
const db = sub(CHARS.beta, mi`D`);
const sa = sub(CHARS.alpha, mi`S`);
const sb = sub(CHARS.beta, mi`S`);
const qm = sub(mi`Q`, mi`m`);

export const calcMarginalRevenue = () => mathml2.math(
  rows(
    mrow(sub(mi`P`, mi`D`), mo`=`, da, mo`-`, db, mi`Q`),
    mrow(mi`TR`, mo`=`, mi`Q`, CHARS.operation.dot, sub(mi`P`, mi`D`)),
    mrow(mi`TR`, mo`=`, mi`Q`, paren([da, mo`-`, db, mi`Q`])),
    mrow(mi`TR`, mo`=`, da, mi`Q`, mo`-`, db, sup(mi`Q`, n(2))),
    mrow(mi`MR`, mo`=`, frac([mi`dTR`], [mi`dQ`]), mo`=`, da, mo`-`, n(2), db, mi`Q`),
  ),
);

export const profitMaximisingQuantity = () => mathml2.math(
  rows(
    mrow(da, mo`-`, n(2), db, qm, mo`=`, sa, mo`+`, sb, qm),
    mrow(da, mo`-`, sa, mo`=`, qm, paren([n(2), db, mo`+`, sb])),
    mrow(qm, mo`=`, frac([da, mo`-`, sa], [n(2), db, mo`+`, sb])),
  ),
);

export const monopolistPrice = () => mathml2.math(
  mrow(sub(mi`P`, mi`m`), mo`=`, sa, mo`+`, sb, qm),
);

export const averageCostPricing = () => mathml2.math(
  mover(mrow(
    mi`Profit`, mo`=`, mi`Q`,
    paren([mi`Price`, mo`-`, mi`ATC`]),
  ), mtext`Average Cost Pricing`),
);

export const firstDegreePriceDiscriminationTR = () => mathml2.math(
  under(mover(rows(
    mrow(
      mi`TR`, mo`=`,
      sum(mi`N`, mrow(mi`i`, mo`=`, n(1))),
      sub(mi`P`, mi`i`),
      paren([
        sub(mi`Q`, mrow(mi`i`)),
        mo`-`,
        sub(mi`Q`, mrow(mi`i`, mo`-`, n(1))),
      ]),
    ),
  ), rows(
    mtext`First Degree Price`,
    mtext`Descrimination`,
    mtext`Total Revenue`
  )), rows(
    space(4),
    space(4),
    mrow(mi`N`, mo`=`, mtext`Number of unique reservation prices`),
    mrow(sub(mi`P`, mi`i`), mo`=`, mtext`Price of ith Reservation Price`),
    mrow(sub(mi`Q`, mi`i`), mo`=`, mtext`Quantity demanded at ith Reservation Price`),
  )),
);

export const firstDegreePriceDiscriminationMR = () => mathml2.math(
  mrow(mi`MR`, mo`=`, frac([CHARS.delta, mi`TR`], [CHARS.delta, mi`Q`])),
);
