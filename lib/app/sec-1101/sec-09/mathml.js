/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2 } from '../../prelude.js';

const {
  sum, sub, n, inv, row, rows,
  space, call, paren, sup, over, text,
  set, frac, matrix, SPECIAL: CHARS, under,
} = mathml;

const { mi, mo } = mathml2;

const socialMB = sub(mi`MB`, text('social'));

export const positiveExtern = () => mathml([
  rows([
    row([
      sub(mi`MB`, text('social')),
      mo`=`, mi`MEB`, space(4), mi`+`, space(4),
      sub(mi`MB`, text('private')), mo`>`,
      sub(mi`MB`, text('private'))
    ]),
    row([]),
    row([
      sub(mi`Demand`, text('social')),
      space(4), mo`>`, space(4),
      sub(mi`Demand`, text('prviate')),
    ]),
  ]),
]);

export const negativeExtern = () => mathml([
  rows([
    row([
      sub(mi`MC`, text('social')),
      mo`=`, mi`MEC`, space(4), mi`+`, space(4),
      sub(mi`MC`, text('private')), mo`>`,
      sub(mi`MC`, text('private'))
    ]),
    row([]),
    row([
      sub(mi`Demand`, text('supply')),
      space(4), mo`<`, space(4),
      sub(mi`Demand`, text('supply')),
    ]),
  ]),
]);

const da = sub(CHARS.alpha, mi`D`);
const db = sub(CHARS.beta, mi`D`);
const sa = sub(CHARS.alpha, mi`S`);
const sb = sub(CHARS.beta, mi`S`);
const pd = sub(mi`P`, mi`D`);
const ps = sub(mi`P`, mi`S`);
const sq = sub(mi`Q`, mi`s`);

export const externalitySizeFromPreferredQuantity = () => mathml([
  row([
    rows([
      over(text('Definitions'), rows([
        row([sub(mi`Q`, mi`s`), mo`=`, text('Social Quantity')]),
        row([mi`E`, mo`=`, text('Externality')]),
      ])),

      over(text('Market Curves'), rows([
        row([
          pd, space(2), mo`=`, space(2),
          da, space(2), mo`-`, space(2),
          db, space(2), mi`Q`,
        ]),
        row([
          ps, space(2), mo`=`, space(2),
          sa, space(2), mo`+`, space(2),
          sb, space(2), mi`Q`, space(2), mo`+`, space(2),
          mi`E`,
        ]),
      ])),
    ]),
  ]),
  space(32),
  row([
    rows([
      over(text('Get size of Externality'), rows([
        row([
          frac([da, mo`-`, sa, mo`-`, mi`E`], [sb, mo`+`, db]),
          mo`=`, sq
        ]),
        row([
          da, mo`-`, sa, mo`-`, mi`E`, mo`=`,
          sq, paren([sb, mo`+`, db]),
        ]),
        row([
          mi`E`, mo`=`, mo`-`, paren([
            sq, paren([sb, mo`+`, db]),
            mo`+`, sa, mo`-`, da
          ]),
        ]),
      ])),
    ]),
  ]),
]);
