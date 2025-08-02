/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL, under,
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
