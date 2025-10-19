/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  inv,
  space, call, paren,
  set, frac, matrix, SPECIAL,
} = mathml;

const { mi, mo, mtext, mrow, mover, mn, msub, msup, msqrt, munder } = mathml2;

const { sum } = mathmlHelper2;

const { rows } = mathmlHelper2;

const { alpha, beta, plusMinus } = SPECIAL;

export const solveForEqulibriumWithWedge = () => {
  return mathml2.math(
    rows(
      mrow(
        mover(munder(mrow(
          msub(mi`P`, mi`D`), mo`=`,
          alpha, mo`+`, beta, mi`Q`,
        ), mtext`Such that β < 0`), mtext`Demand`),
        space(32),
        mover(mrow(
          msub(mi`P`, mi`S`), mo`=`,
          mi`a`, mo`+`, mi`b`, mi`Q`,
        ), mtext`Supply`),
      ),
      mover(mrow(
        mi`W`, mo`=`, mtext`Taxes`, mo`-`, mtext`Subsidies`,
      ), mtext`Wedge`),
      mover(mrow(
        matrix([
          [mrow(mo`-`, beta), mn(1), mn(0)],
          [mrow(mo`-`, mi`b`), mn(0), mn(1)],
          [mn(0), mn(1), mrow(mo`-`, mn(1))],
        ]),
        matrix([
          [mi`Q`],
          [msub(mi`P`, mi`D`)],
          [msub(mi`P`, mi`S`)],
        ]),
        mo`=`,
        matrix([
          [alpha],
          [mi`a`],
          [mi`W`],
        ]),
      ), mtext`Establish Contraints`),
      mover(mrow(
        matrix([
          [mi`Q`],
          [msub(mi`P`, mi`D`)],
          [msub(mi`P`, mi`S`)],
        ]),
        mo`=`,
        inv(
          matrix([
            [mrow(mo`-`, beta), mn(1), mn(0)],
            [mrow(mo`-`, mi`b`), mn(0), mn(1)],
            [mn(0), mn(1), mrow(mo`-`, mn(1))],
          ]),
        ),
        matrix([
          [alpha],
          [mi`a`],
          [mi`W`],
        ]),
      ), mtext`Rearrange to solve`),
    ),
  )
};

export const curveExample = () => {
  return mathml2.math(
    mrow(
      mi`P`, space(4),
      mo`=`, space(4),
      alpha, space(4),
      plusMinus, space(4),
      mover(beta, mtext`slope`), mi`Q`,
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

  return mathml2.math(
    mathml.table([
      [mrow(
        munder(
          mrow(dp, mo`=`, da, mo`-`, db, mi`Q`),
          mtext`Consumer Price`,
        ), space(16),
      ), mrow(
        munder(mtext`Burden`, mtext`consumer`),
        mo`=`, frac([db], [sb, mo`-`, db]),
      )],
      [mrow(
        munder(
          mrow(sp, mo`=`, sa, mo`+`, sb, mi`Q`),
          mtext`Producer Price`,
        ), space(16),
      ), mrow(
        munder(mtext`Burden`, mtext`producer`),
        mo`=`, frac([sb], [sb, mo`-`, db]),
      )],
    ]),
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

  return mathml2.math(
    rows(
      mrow(
        mover(w, mtext`Wedge`), mo`=`, space(8),
        mtext`Taxes`, mo`-`, mtext`Subsidies`,
      ),
      mrow(
        q, mo`=`, frac([
          da, mo`-`, paren([sa, mo`+`, w]),
        ], [sb, mo`+`, db]),
      ),
      mrow(
        mrow(sp, mo`=`, sa, mo`+`, sb, q),
        space(16),
        mrow(dp, mo`=`, da, mo`-`, db, q),
      ),
    ),
  )
};
