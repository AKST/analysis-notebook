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

const { alpha, beta, plusMinus } = SPECIAL;

export const solveForEqulibriumWithWedge = () => {
  return mathml2.math(
    rows(
      mrow(
        over(mtext`Demand`, under(mrow(
          sub(mi`P`, mi`D`), mo`=`,
          alpha, mo`+`, beta, mi`Q`,
        ), mtext`Such that β < 0`)),
        space(32),
        over(mtext`Supply`, mrow(
          sub(mi`P`, mi`S`), mo`=`,
          mi`a`, mo`+`, mi`b`, mi`Q`,
        )),
      ),
      over(mtext`Wedge`, mrow(
        mi`W`, mo`=`, mtext`Taxes`, mo`-`, mtext`Subsidies`,
      )),
      over(mtext`Establish Contraints`, mrow(
        matrix([
          [mrow(mo`-`, beta), n(1), n(0)],
          [mrow(mo`-`, mi`b`), n(0), n(1)],
          [n(0), n(1), mrow(mo`-`, n(1))],
        ]),
        matrix([
          [mi`Q`],
          [sub(mi`P`, mi`D`)],
          [sub(mi`P`, mi`S`)],
        ]),
        mo`=`,
        matrix([
          [alpha],
          [mi`a`],
          [mi`W`],
        ]),
      )),
      over(mtext`Rearrange to solve`, mrow(
        matrix([
          [mi`Q`],
          [sub(mi`P`, mi`D`)],
          [sub(mi`P`, mi`S`)],
        ]),
        mo`=`,
        inv(
          matrix([
            [mrow(mo`-`, beta), n(1), n(0)],
            [mrow(mo`-`, mi`b`), n(0), n(1)],
            [n(0), n(1), mrow(mo`-`, n(1))],
          ]),
        ),
        matrix([
          [alpha],
          [mi`a`],
          [mi`W`],
        ]),
      )),
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
      over(mtext`slope`, beta), mi`Q`,
    ),
  )
};

export const taxBurden = () => {
  const dp = sub(mi`P`, mi`D`);
  const sp = sub(mi`P`, mi`S`);
  const da = sub(alpha, mi`D`);
  const sa = sub(alpha, mi`S`);
  const db = sub(beta, mi`D`);
  const sb = sub(beta, mi`S`);

  return mathml2.math(
    mathml.table([
      [mrow(
        under(
          mrow(dp, mo`=`, da, mo`-`, db, mi`Q`),
          mtext`Consumer Price`,
        ), space(16),
      ), mrow(
        under(mtext`Burden`, mtext`consumer`),
        mo`=`, frac([db], [sb, mo`-`, db]),
      )],
      [mrow(
        under(
          mrow(sp, mo`=`, sa, mo`+`, sb, mi`Q`),
          mtext`Producer Price`,
        ), space(16),
      ), mrow(
        under(mtext`Burden`, mtext`producer`),
        mo`=`, frac([sb], [sb, mo`-`, db]),
      )],
    ]),
  )
};

export const newEquilibrium = () => {
  const w = mi`W`;
  const q = sup(mi`Q`, mo`*`);
  const dp = sub(mi`P`, mi`D`);
  const sp = sub(mi`P`, mi`S`);
  const da = sub(alpha, mi`D`);
  const sa = sub(alpha, mi`S`);
  const db = sub(beta, mi`D`);
  const sb = sub(beta, mi`S`);

  return mathml2.math(
    rows(
      mrow(
        over(mtext`Wedge`, w), mo`=`, space(8),
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
