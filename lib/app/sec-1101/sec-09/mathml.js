/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL: CHARS, under,
} = mathml;

const socialMB = sub(i('MB'), text('social'));

export const positiveExtern = () => mathml([
  rows([
    row([
      sub(i('MB'), text('social')),
      o('='), i('MEB'), space(4), i('+'), space(4),
      sub(i('MB'), text('private')), o('>'),
      sub(i('MB'), text('private'))
    ]),
    row([]),
    row([
      sub(i('Demand'), text('social')),
      space(4), o('>'), space(4),
      sub(i('Demand'), text('prviate')),
    ]),
  ]),
]);

export const negativeExtern = () => mathml([
  rows([
    row([
      sub(i('MC'), text('social')),
      o('='), i('MEC'), space(4), i('+'), space(4),
      sub(i('MC'), text('private')), o('>'),
      sub(i('MC'), text('private'))
    ]),
    row([]),
    row([
      sub(i('Demand'), text('supply')),
      space(4), o('<'), space(4),
      sub(i('Demand'), text('supply')),
    ]),
  ]),
]);

const da = sub(CHARS.alpha, i('D'));
const db = sub(CHARS.beta, i('D'));
const sa = sub(CHARS.alpha, i('S'));
const sb = sub(CHARS.beta, i('S'));
const pd = sub(i('P'), i('D'));
const ps = sub(i('P'), i('S'));
const sq = sub(i('Q'), i('s'));

export const externalitySizeFromPreferredQuantity = () => mathml([
  row([
    rows([
      over(text('Definitions'), rows([
        row([sub(i('Q'), i('s')), o('='), text('Social Quantity')]),
        row([i('E'), o('='), text('Externality')]),
      ])),

      over(text('Market Curves'), rows([
        row([
          pd, space(2), o('='), space(2),
          da, space(2), o('-'), space(2),
          db, space(2), i('Q'),
        ]),
        row([
          ps, space(2), o('='), space(2),
          sa, space(2), o('+'), space(2),
          sb, space(2), i('Q'), space(2), o('+'), space(2),
          i('E'),
        ]),
      ])),
    ]),
  ]),
  space(32),
  row([
    rows([
      over(text('Get size of Externality'), rows([
        row([
          frac([da, o('-'), sa, o('-'), i('E')], [sb, o('+'), db]),
          o('='), sq
        ]),
        row([
          da, o('-'), sa, o('-'), i('E'), o('='),
          sq, paren([sb, o('+'), db]),
        ]),
        row([
          i('E'), o('='), o('-'), paren([
            sq, paren([sb, o('+'), db]),
            o('+'), sa, o('-'), da
          ]),
        ]),
      ])),
    ]),
  ]),
]);
