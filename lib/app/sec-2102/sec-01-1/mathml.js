/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL, under,
} = mathml;

const { alpha } = SPECIAL.greek;

const vars = {
  tech: i('A'),
  techFixed: i('Ā'),
  labour: i('L'),
  labourE: sup(i('L'), alpha),
  capital: i('K'),
  capitalE: sup(i('K'), paren([n(1), o('-'), alpha])),
};

export const production = {
  generalForm: mathml([
    row([
      i('Y'), o('='),
      call('F', vars.capital, vars.labour, vars.tech),
    ]),
  ]),
  cobbDouglas: mathml([
    row([
      i('Y'), o('='),
      vars.techFixed, space(3),
      vars.capitalE, space(2),
      vars.labourE,
    ]),
  ]),
};

export const noop = () => undefined;
