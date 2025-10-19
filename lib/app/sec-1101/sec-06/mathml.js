/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml, mathml2 } from '../../prelude.js';

const {
  sum, sub, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, table, SPECIAL: CHARS,
} = mathml;

const { mi, mo } = mathml2;

export const definitions = () => mathml([
  table([
    [sup(mi`P`, mo`*`), text('Domestic price')],
    [sub(mi`P`, mi`d`), text('Domestic price')],
    [sub(mi`P`, mi`w`), text('World price')],
    [sub(mi`P`, row([
      mi`w`, mo`+`, mi`t`,
    ])), text('World price + Tariff')],
  ]),
]);

export const importingCondition = () => mathml([
  row([sub(mi`P`, mi`d`), mo`>`, sub(mi`P`, mi`w`)]),
]);

export const exportingCondition = () => mathml([
  row([sub(mi`P`, mi`w`), mo`>`, sub(mi`P`, mi`d`)]),
]);
