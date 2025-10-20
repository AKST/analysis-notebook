/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml } from '../../prelude.js';
import { mathmlHelper } from '../prelude.js';

const { mi, mo, mtext, mrow, mover, mn, msub, msup, munder, mspace, mfrac } = mathml;
const { SPECIAL, eq, add, minus, addMinus, mul, matrix, rows, inv, parensA, table } = mathmlHelper;
const { greek: { alpha, beta } } = SPECIAL;

export const solveForEqulibriumWithWedge = () => {
  return mathml.math(
    rows(
      mrow(
        mover(munder(mrow(
          msub(mi`P`, mi`D`), mo`=`,
          alpha, mo`+`, beta, mi`Q`,
        ), mtext`Such that β < 0`), mtext`Demand`),
        mspace(32),
        mover(mrow(
          msub(mi`P`, mi`S`), mo`=`,
          mi`a`, mo`+`, mi`b`, mi`Q`,
        ), mtext`Supply`),
      ),
      mover(mrow(
        mi`W`, mo`=`, mtext`Taxes`, mo`-`, mtext`Subsidies`,
      ), mtext`Wedge`),
      mover(mrow(
        matrix(
          [mrow(mo`-`, beta), mn(1), mn(0)],
          [mrow(mo`-`, mi`b`), mn(0), mn(1)],
          [mn(0), mn(1), mrow(mo`-`, mn(1))],
        ),
        matrix(
          [mi`Q`],
          [msub(mi`P`, mi`D`)],
          [msub(mi`P`, mi`S`)],
        ),
        mo`=`,
        matrix(
          [alpha],
          [mi`a`],
          [mi`W`],
        ),
      ), mtext`Establish Contraints`),
      mover(mrow(
        matrix(
          [mi`Q`],
          [msub(mi`P`, mi`D`)],
          [msub(mi`P`, mi`S`)],
        ),
        mo`=`,
        inv(
          matrix(
            [mrow(mo`-`, beta), mn(1), mn(0)],
            [mrow(mo`-`, mi`b`), mn(0), mn(1)],
            [mn(0), mn(1), mrow(mo`-`, mn(1))],
          ),
        ),
        matrix(
          [alpha],
          [mi`a`],
          [mi`W`],
        ),
      ), mtext`Rearrange to solve`),
    ),
  )
};

export const curveExample = () => {
  return mathml.math(
    eq(mi`P`, addMinus(alpha, mul(mover(beta, mtext`slope`), mi`Q`)),
    ),
  )
};

export const taxBurden = () => {
  const dp = msub(mi`P`, mi`D`);
  const sp = msub(mi`P`, mi`S`);
  const da = msub(alpha, mi`D`);
  const sa = msub(alpha, mi`S`);
  const db = msub(beta, mi`D`);
  const sb = msub(beta, mi`S`);

  return mathml.math(
    table(
      [mrow(
        munder(
          mrow(dp, mo`=`, da, mo`-`, db, mi`Q`),
          mtext`Consumer Price`,
        ), mspace(16),
      ), mrow(
        munder(mtext`Burden`, mtext`consumer`),
        mo`=`, mfrac(db, mrow(sb, mo`-`, db)),
      )],
      [mrow(
        munder(
          mrow(sp, mo`=`, sa, mo`+`, sb, mi`Q`),
          mtext`Producer Price`,
        ), mspace(16),
      ), mrow(
        munder(mtext`Burden`, mtext`producer`),
        mo`=`, mfrac(sb, mrow(sb, mo`-`, db)),
      )],
    ),
  )
};

export const newEquilibrium = () => {
  const w = mi`W`;
  const q = msup(mi`Q`, mo`*`);
  const dp = msub(mi`P`, mi`D`);
  const sp = msub(mi`P`, mi`S`);
  const da = msub(alpha, mi`D`);
  const sa = msub(alpha, mi`S`);
  const db = msub(beta, mi`D`);
  const sb = msub(beta, mi`S`);

  return mathml.math(
    rows(
      eq(mover(w, mtext`Wedge`), minus(mtext`Taxes`, mtext`Subsidies`)),
      eq(q, mfrac(minus(da, parensA(sa, mo`+`, w)), add(sb, db))),
      eq(sp, add(sa, mul(sb, q))),
      eq(dp, minus(da, mul(db, q))),
    ),
  )
};
