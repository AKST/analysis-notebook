/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL, under,
} = mathml;

const { alpha, beta, plusMinus } = SPECIAL;

export const solveForEqulibriumWithWedge = () => {
  return mathml([
    rows([
      row([
        over(text('Demand'), under(row([
          sub(i('P'), i('D')), o('='),
          alpha, o('+'), beta, i('Q'),
        ]), text('Such that β < 0'))),
        space(32),
        over(text('Supply'), row([
          sub(i('P'), i('S')), o('='),
          i('a'), o('+'), i('b'), i('Q'),
        ])),
      ]),
      over(text('Wedge'), row([
        i('W'), o('='), text('Taxes'), o('-'), text('Subsidies'),
      ])),
      over(text('Establish Contraints'), row([
        matrix([
          [row([o('-'), beta]), n(1), n(0)],
          [row([o('-'), i('b')]), n(0), n(1)],
          [n(0), n(1), row([o('-'), n(1)])],
        ]),
        matrix([
          [i('Q')],
          [sub(i('P'), i('D'))],
          [sub(i('P'), i('S'))],
        ]),
        o('='),
        matrix([
          [alpha],
          [i('a')],
          [i('W')],
        ]),
      ])),
      over(text('Rearrange to solve'), row([
        matrix([
          [i('Q')],
          [sub(i('P'), i('D'))],
          [sub(i('P'), i('S'))],
        ]),
        o('='),
        inv(
          matrix([
            [row([o('-'), beta]), n(1), n(0)],
            [row([o('-'), i('b')]), n(0), n(1)],
            [n(0), n(1), row([o('-'), n(1)])],
          ]),
        ),
        matrix([
          [alpha],
          [i('a')],
          [i('W')],
        ]),
      ])),
    ]),
  ])
};

export const curveExample = () => {
  return mathml([
    row([
      i('P'), space(4),
      o('='), space(4),
      alpha, space(4),
      plusMinus, space(4),
      over(text('slope'), beta), i('Q'),
    ]),
  ])
};

export const taxBurden = () => {
  const dp = sub(i('P'), i('D'));
  const sp = sub(i('P'), i('S'));
  const da = sub(alpha, i('D'));
  const sa = sub(alpha, i('S'));
  const db = sub(beta, i('D'));
  const sb = sub(beta, i('S'));

  return mathml([
    mathml.table([
      [row([
        under(
          row([dp, o('='), da, o('-'), db, i('Q')]),
          text('Consumer Price'),
        ), space(16),
      ]), row([
        under(text('Burden'), text('consumer')),
        o('='), frac([sb], [sb, o('-'), db]),
      ])],
      [row([
        under(
          row([sp, o('='), sa, o('+'), sb, i('Q')]),
          text('Producer Price'),
        ), space(16),
      ]), row([
        under(text('Burden'), text('producer')),
        o('='), frac([db], [sb, o('-'), db]),
      ])],
    ]),
  ])
};

export const newEquilibrium = () => {
  const w = i('W');
  const q = sup(i('Q'), o('*'));
  const dp = sub(i('P'), i('D'));
  const sp = sub(i('P'), i('S'));
  const da = sub(alpha, i('D'));
  const sa = sub(alpha, i('S'));
  const db = sub(beta, i('D'));
  const sb = sub(beta, i('S'));

  return mathml([
    rows([
      row([
        over(text('Wedge'), w), o('='), space(8),
        text('Taxes'), o('-'), text('Subsidies'),
      ]),
      row([
        q, o('='), frac([
          da, o('-'), paren([sa, o('+'), w]),
        ], [sb, o('+'), db]),
      ]),
      row([
        row([sp, o('='), sa, o('+'), sb, q]),
        space(16),
        row([dp, o('='), da, o('-'), db, q]),
      ]),
    ]),
  ])
};
