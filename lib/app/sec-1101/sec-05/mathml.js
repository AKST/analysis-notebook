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

const { alpha, beta, plusMinus } = SPECIAL;

export const solveForEqulibriumWithWedge = () => {
  return mathml([
    rows([
      row([
        over(text('Demand'), under(row([
          sub(mi`P`, mi`D`), mo`=`,
          alpha, mo`+`, beta, mi`Q`,
        ]), text('Such that β < 0'))),
        space(32),
        over(text('Supply'), row([
          sub(mi`P`, mi`S`), mo`=`,
          mi`a`, mo`+`, mi`b`, mi`Q`,
        ])),
      ]),
      over(text('Wedge'), row([
        mi`W`, mo`=`, text('Taxes'), mo`-`, text('Subsidies'),
      ])),
      over(text('Establish Contraints'), row([
        matrix([
          [row([mo`-`, beta]), n(1), n(0)],
          [row([mo`-`, mi`b`]), n(0), n(1)],
          [n(0), n(1), row([mo`-`, n(1)])],
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
      ])),
      over(text('Rearrange to solve'), row([
        matrix([
          [mi`Q`],
          [sub(mi`P`, mi`D`)],
          [sub(mi`P`, mi`S`)],
        ]),
        mo`=`,
        inv(
          matrix([
            [row([mo`-`, beta]), n(1), n(0)],
            [row([mo`-`, mi`b`]), n(0), n(1)],
            [n(0), n(1), row([mo`-`, n(1)])],
          ]),
        ),
        matrix([
          [alpha],
          [mi`a`],
          [mi`W`],
        ]),
      ])),
    ]),
  ])
};

export const curveExample = () => {
  return mathml([
    row([
      mi`P`, space(4),
      mo`=`, space(4),
      alpha, space(4),
      plusMinus, space(4),
      over(text('slope'), beta), mi`Q`,
    ]),
  ])
};

export const taxBurden = () => {
  const dp = sub(mi`P`, mi`D`);
  const sp = sub(mi`P`, mi`S`);
  const da = sub(alpha, mi`D`);
  const sa = sub(alpha, mi`S`);
  const db = sub(beta, mi`D`);
  const sb = sub(beta, mi`S`);

  return mathml([
    mathml.table([
      [row([
        under(
          row([dp, mo`=`, da, mo`-`, db, mi`Q`]),
          text('Consumer Price'),
        ), space(16),
      ]), row([
        under(text('Burden'), text('consumer')),
        mo`=`, frac([db], [sb, mo`-`, db]),
      ])],
      [row([
        under(
          row([sp, mo`=`, sa, mo`+`, sb, mi`Q`]),
          text('Producer Price'),
        ), space(16),
      ]), row([
        under(text('Burden'), text('producer')),
        mo`=`, frac([sb], [sb, mo`-`, db]),
      ])],
    ]),
  ])
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

  return mathml([
    rows([
      row([
        over(text('Wedge'), w), mo`=`, space(8),
        text('Taxes'), mo`-`, text('Subsidies'),
      ]),
      row([
        q, mo`=`, frac([
          da, mo`-`, paren([sa, mo`+`, w]),
        ], [sb, mo`+`, db]),
      ]),
      row([
        row([sp, mo`=`, sa, mo`+`, sb, q]),
        space(16),
        row([dp, mo`=`, da, mo`-`, db, q]),
      ]),
    ]),
  ])
};
