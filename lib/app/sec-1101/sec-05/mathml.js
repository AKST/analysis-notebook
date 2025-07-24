/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL, under,
} = mathml;

const { alpha, beta } = SPECIAL;

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

