/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml2, doc } from '../../prelude.js';
import { mathmlHelper_2 as mathmlHelper } from '../prelude.js';

const {
  mi, mn, mo, mfrac, mrow, msub,
  msubsup, mtext
} = mathml2;

const {
  eq, eqId, add, mul0: mul, minus, imply,
  SPECIAL, table, minusPA, annotationUnder,
} = mathmlHelper;

const { greek: { pi, Delta } } = SPECIAL;

export const interestRates = {
  relationship: doc.figure(
    mathml2.math(
      table.attr({ columnalign: 'right center left' })(
        [
          msub(mi`i`, mi`t`),
          mo`=`,
          add(msub(mi`R`, mi`t`), msub(pi, mi`t`)),
        ],
        [
          msub(mi`R`, mi`t`),
          mo`=`,
          minus(msub(mi`i`, mi`t`), msub(pi, mi`t`)),
        ],
      ),
    ),
    doc.figcaption`Nominal and real interest rate relationship`,
  ),
};

export const inflation = {
  identity: doc.figure(
    mathml2.math(
      eqId(
        msub(pi, mi`t`),
        mfrac(
          minusPA(
            msub(mi`P`, mrow(mi`t`, mo`-`, mn(1))),
            msub(mi`P`, mi`t`),
          ),
          msub(mi`P`, mi`t`),
        ),
      ),
    ),
    doc.figcaption`Inflation Identity`,
  ),
  decomposition: doc.figure(
    mathml2.math(
      eq(
        msub(pi, mi`t`),
        add(
          annotationUnder.attr({ label: mtext`expected inflation` })(
            msubsup(pi, mi`t`, mi`e`),
          ),
          annotationUnder.attr({ label: mtext`demand conditions` })(
            mul(mi`v̄`, msub(mi`Ẏ`, mi`t`)),
          ),
        ),
      ),
    ),
    doc.figcaption`Decomposition into components`,
  ),
  dynamics: doc.figure(
    mathml2.math(
      table.attr({ columnalign: 'right center left' })(
        [
          msubsup(pi, mi`t`, mi`e`),
          mo`=`,
          msub(pi, mrow(mi`t`, mo`-`, mn(1))),
        ],
        [
          msub(pi, mi`t`),
          mo`=`,
          add(
            msub(pi, mrow(mi`t`, mo`-`, mn(1))),
            mul(mi`v̄`, msub(mi`Ẏ`, mi`t`))
          ),
        ],
        [
          msub(mrow(Delta, pi), mi`t`),
          mo`=`,
          minus(msub(pi, mi`t`), msub(pi, mrow(mi`t`, mo`-`, mn(1)))),
        ],
        [
          msub(mrow(Delta, pi), mi`t`),
          mo`=`,
          mul(mi`v̄`, msub(mi`Ẏ`, mi`t`)),
        ],
      ),
    ),
    doc.figcaption`Inflation dynamics over time`,
  ),
};

export const inflationChange2 = doc.figure(
  mathml2.math(
    table.attr({ columnalign: 'right center left' })(
      [
        msub(pi, mi`t`),
        mo`=`,
        add(
          msub(pi, mrow(mi`t`, mo`-`, mn(1))),
          mul(mi`v̄`, msub(mi`Ẏ`, mi`t`)),
          mi`ō`
        ),
      ],
      [
        msub(mrow(Delta, pi), mi`t`),
        mo`=`,
        add(mul(mi`v̄`, msub(mi`Ẏ`, mi`t`)), mi`ō`),
      ],
    ),
  ),
  doc.figcaption`Inflation including shock term`,
);

export const inANutShell = doc.figure(
  mathml2.math(
    table.attr({ columnalign: 'right left' })(
      [
        mtext`MP curve`,
        imply(mi`↑iₜ`, mi`↑Rₜ`),
      ],
      [
        mtext`IS curve`,
        imply(mi`↑Rₜ`, mi`↓Ẏₜ`),
      ],
      [
        mtext`Phillips curve`,
        imply(mi`↓Ẏₜ`, mi`↓Δπₜ`)
      ],
    ),
  ),
  doc.figcaption`relationships implied by MP, IS, and Phillips curves`,
);



