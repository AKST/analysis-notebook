/**
 * @import { E } from '../../prelude-type.ts';
 */
import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  sum, sub, n, inv,
  space, call, paren, sup, over,
  set, frac, table, SPECIAL: CHARS,
} = mathml;

const { mi, mo, mtext, mrow } = mathml2;

const { rows } = mathmlHelper2;

export const definitions = () => mathml2.math(
  table([
    [sup(mi`P`, mo`*`), mtext`Domestic price`],
    [sub(mi`P`, mi`d`), mtext`Domestic price`],
    [sub(mi`P`, mi`w`), mtext`World price`],
    [sub(mi`P`, mrow(
      mi`w`, mo`+`, mi`t`,
    )), mtext`World price + Tariff`],
  ]),
);

export const importingCondition = () => mathml2.math(
  mrow(sub(mi`P`, mi`d`), mo`>`, sub(mi`P`, mi`w`)),
);

export const exportingCondition = () => mathml2.math(
  mrow(sub(mi`P`, mi`w`), mo`>`, sub(mi`P`, mi`d`)),
);
