/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const {
  sum, sub, n, inv,
  space, call, paren, sup,
  set, frac, matrix, SPECIAL: CHARS, under,
} = mathml;

const { mi, mo, mtext, mrow, mover } = mathml2;

const { rows } = mathmlHelper2;

const socialMB = sub(mi`MB`, mtext`social`);

export const positiveExtern = () => mathml2.math(
  rows(
    mrow(
      sub(mi`MB`, mtext`social`),
      mo`=`, mi`MEB`, space(4), mi`+`, space(4),
      sub(mi`MB`, mtext`private`), mo`>`,
      sub(mi`MB`, mtext`private`)
    ),
    mrow(),
    mrow(
      sub(mi`Demand`, mtext`social`),
      space(4), mo`>`, space(4),
      sub(mi`Demand`, mtext`prviate`),
    ),
  ),
);

export const negativeExtern = () => mathml2.math(
  rows(
    mrow(
      sub(mi`MC`, mtext`social`),
      mo`=`, mi`MEC`, space(4), mi`+`, space(4),
      sub(mi`MC`, mtext`private`), mo`>`,
      sub(mi`MC`, mtext`private`)
    ),
    mrow(),
    mrow(
      sub(mi`Demand`, mtext`supply`),
      space(4), mo`<`, space(4),
      sub(mi`Demand`, mtext`supply`),
    ),
  ),
);

const da = sub(CHARS.alpha, mi`D`);
const db = sub(CHARS.beta, mi`D`);
const sa = sub(CHARS.alpha, mi`S`);
const sb = sub(CHARS.beta, mi`S`);
const pd = sub(mi`P`, mi`D`);
const ps = sub(mi`P`, mi`S`);
const sq = sub(mi`Q`, mi`s`);

export const externalitySizeFromPreferredQuantity = () => mathml2.math(
  mrow(
    rows(
      mover(rows(
        mrow(sub(mi`Q`, mi`s`), mo`=`, mtext`Social Quantity`),
        mrow(mi`E`, mo`=`, mtext`Externality`),
      ), mtext`Definitions`),

      mover(rows(
        mrow(
          pd, space(2), mo`=`, space(2),
          da, space(2), mo`-`, space(2),
          db, space(2), mi`Q`,
        ),
        mrow(
          ps, space(2), mo`=`, space(2),
          sa, space(2), mo`+`, space(2),
          sb, space(2), mi`Q`, space(2), mo`+`, space(2),
          mi`E`,
        ),
      ), mtext`Market Curves`),
    ),
  ),
  space(32),
  mrow(
    rows(
      mover(rows(
        mrow(
          frac([da, mo`-`, sa, mo`-`, mi`E`], [sb, mo`+`, db]),
          mo`=`, sq
        ),
        mrow(
          da, mo`-`, sa, mo`-`, mi`E`, mo`=`,
          sq, paren([sb, mo`+`, db]),
        ),
        mrow(
          mi`E`, mo`=`, mo`-`, paren([
            sq, paren([sb, mo`+`, db]),
            mo`+`, sa, mo`-`, da
          ]),
        ),
      ), mtext`Get size of Externality`),
    ),
  ),
);
