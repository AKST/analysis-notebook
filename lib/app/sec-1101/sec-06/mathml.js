/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml } from '../../prelude.js';

const {
  sum, i, sub, o, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, table, SPECIAL: CHARS,
} = mathml;


export const definitions = () => mathml([
  table([
    [sup(i('P'), o('*')), text('Domestic price')],
    [sub(i('P'), i('d')), text('Domestic price')],
    [sub(i('P'), i('w')), text('World price')],
    [sub(i('P'), row([
      i('w'), o('+'), i('t'),
    ])), text('World price + Tariff')],
  ]),
]);

export const importingCondition = () => mathml([
  row([sub(i('P'), i('d')), o('>'), sub(i('P'), i('w'))]),
]);

export const exportingCondition = () => mathml([
  row([sub(i('P'), i('w')), o('>'), sub(i('P'), i('d'))]),
]);
