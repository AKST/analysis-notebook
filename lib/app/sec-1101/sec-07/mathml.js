/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const { mi, mo, mtext, mrow, mover, mn, msub, msup, msqrt, munder, mspace, mfrac } = mathml2;

const { rows, sum, call, parensA, SPECIAL } = mathmlHelper2;

const { greek: { alpha, beta, Delta }, operation } = SPECIAL;

export const marginalRevenue = () => mathml2.math(
  mrow(
    mtext`Marginal Revenue`,
    mo`=`,
    mfrac(mi`dTR`, mi`dQ`),
  )
);

const da = msub(alpha, mi`D`);
const db = msub(beta, mi`D`);
const sa = msub(alpha, mi`S`);
const sb = msub(beta, mi`S`);
const qm = msub(mi`Q`, mi`m`);

export const calcMarginalRevenue = () => mathml2.math(
  rows(
    mrow(msub(mi`P`, mi`D`), mo`=`, da, mo`-`, db, mi`Q`),
    mrow(mi`TR`, mo`=`, mi`Q`, operation.dot, msub(mi`P`, mi`D`)),
    mrow(mi`TR`, mo`=`, mi`Q`, parensA(da, mo`-`, db, mi`Q`)),
    mrow(mi`TR`, mo`=`, da, mi`Q`, mo`-`, db, msup(mi`Q`, mn(2))),
    mrow(mi`MR`, mo`=`, mfrac(mi`dTR`, mi`dQ`), mo`=`, da, mo`-`, mn(2), db, mi`Q`),
  ),
);

export const profitMaximisingQuantity = () => mathml2.math(
  rows(
    mrow(da, mo`-`, mn(2), db, qm, mo`=`, sa, mo`+`, sb, qm),
    mrow(da, mo`-`, sa, mo`=`, qm, parensA(mn(2), db, mo`+`, sb)),
    mrow(qm, mo`=`, mfrac(mrow(da, mo`-`, sa), mrow(mn(2), db, mo`+`, sb))),
  ),
);

export const monopolistPrice = () => mathml2.math(
  mrow(msub(mi`P`, mi`m`), mo`=`, sa, mo`+`, sb, qm),
);

export const averageCostPricing = () => mathml2.math(
  mover(mrow(
    mi`Profit`, mo`=`, mi`Q`,
    parensA(mi`Price`, mo`-`, mi`ATC`),
  ), mtext`Average Cost Pricing`),
);

export const firstDegreePriceDiscriminationTR = () => mathml2.math(
  munder(mover(rows(
    mrow(
      mi`TR`, mo`=`,
      sum(mi`N`, mrow(mi`i`, mo`=`, mn(1))),
      msub(mi`P`, mi`i`),
      parensA(
        msub(mi`Q`, mrow(mi`i`)),
        mo`-`,
        msub(mi`Q`, mrow(mi`i`, mo`-`, mn(1))),
      ),
    ),
  ), rows(
    mtext`First Degree Price`,
    mtext`Descrimination`,
    mtext`Total Revenue`
  )), rows(
    mspace(4),
    mspace(4),
    mrow(mi`N`, mo`=`, mtext`Number of unique reservation prices`),
    mrow(msub(mi`P`, mi`i`), mo`=`, mtext`Price of ith Reservation Price`),
    mrow(msub(mi`Q`, mi`i`), mo`=`, mtext`Quantity demanded at ith Reservation Price`),
  )),
);

export const firstDegreePriceDiscriminationMR = () => mathml2.math(
  mrow(mi`MR`, mo`=`, mfrac(mrow(Delta, mi`TR`), mrow(Delta, mi`Q`))),
);
