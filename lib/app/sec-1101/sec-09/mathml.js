/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const { paren, frac, SPECIAL: CHARS } = mathml;

const { mi, mo, mtext, mrow, mover, msub, mspace } = mathml2;

const { rows } = mathmlHelper2;

const socialMB = msub(mi`MB`, mtext`social`);

export const positiveExtern = () => mathml2.math(
  rows(
    mrow(
      msub(mi`MB`, mtext`social`),
      mo`=`, mi`MEB`, mspace(4), mi`+`, mspace(4),
      msub(mi`MB`, mtext`private`), mo`>`,
      msub(mi`MB`, mtext`private`)
    ),
    mrow(),
    mrow(
      msub(mi`Demand`, mtext`social`),
      mspace(4), mo`>`, mspace(4),
      msub(mi`Demand`, mtext`prviate`),
    ),
  ),
);

export const negativeExtern = () => mathml2.math(
  rows(
    mrow(
      msub(mi`MC`, mtext`social`),
      mo`=`, mi`MEC`, mspace(4), mi`+`, mspace(4),
      msub(mi`MC`, mtext`private`), mo`>`,
      msub(mi`MC`, mtext`private`)
    ),
    mrow(),
    mrow(
      msub(mi`Demand`, mtext`supply`),
      mspace(4), mo`<`, mspace(4),
      msub(mi`Demand`, mtext`supply`),
    ),
  ),
);

const da = msub(CHARS.alpha, mi`D`);
const db = msub(CHARS.beta, mi`D`);
const sa = msub(CHARS.alpha, mi`S`);
const sb = msub(CHARS.beta, mi`S`);
const pd = msub(mi`P`, mi`D`);
const ps = msub(mi`P`, mi`S`);
const sq = msub(mi`Q`, mi`s`);

export const externalitySizeFromPreferredQuantity = () => mathml2.math(
  mrow(
    rows(
      mover(rows(
        mrow(msub(mi`Q`, mi`s`), mo`=`, mtext`Social Quantity`),
        mrow(mi`E`, mo`=`, mtext`Externality`),
      ), mtext`Definitions`),

      mover(rows(
        mrow(
          pd, mspace(2), mo`=`, mspace(2),
          da, mspace(2), mo`-`, mspace(2),
          db, mspace(2), mi`Q`,
        ),
        mrow(
          ps, mspace(2), mo`=`, mspace(2),
          sa, mspace(2), mo`+`, mspace(2),
          sb, mspace(2), mi`Q`, mspace(2), mo`+`, mspace(2),
          mi`E`,
        ),
      ), mtext`Market Curves`),
    ),
  ),
  mspace(32),
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
