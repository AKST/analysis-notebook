/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  inv,
  space, call, paren,
  set, frac, table, SPECIAL: CHARS,
} = mathml;

const { mi, mo, mtext, mrow, mn, msub, msup } = mathml2;

const { rows, sum } = mathmlHelper2;

export const definitions = () => mathml2.math(
  table([
    [msup(mi`P`, mo`*`), mtext`Domestic price`],
    [msub(mi`P`, mi`d`), mtext`Domestic price`],
    [msub(mi`P`, mi`w`), mtext`World price`],
    [msub(mi`P`, mrow(
      mi`w`, mo`+`, mi`t`,
    )), mtext`World price + Tariff`],
  ]),
);

export const importingCondition = () => mathml2.math(
  mrow(msub(mi`P`, mi`d`), mo`>`, msub(mi`P`, mi`w`)),
);

export const exportingCondition = () => mathml2.math(
  mrow(msub(mi`P`, mi`w`), mo`>`, msub(mi`P`, mi`d`)),
);
