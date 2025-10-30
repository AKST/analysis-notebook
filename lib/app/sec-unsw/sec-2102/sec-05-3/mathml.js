/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { SPECIAL, table, annotationUnder, op } from '@prelude-uni/mathml.js';

const {
  mi, mn, mo, mfrac, mrow, msub,
  msubsup, mtext
} = mathml;

const { eq, eqId, add, mul0: mul, minus, imply } = op;

const { greek: { pi, Delta } } = SPECIAL;

export const interestRates = {
  relationship: doc.figure(
    mathml.math(
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
    mathml.math(
      eqId(
        msub(pi, mi`t`),
        mfrac(
          minus.paren(
            msub(mi`P`, minus.attr({ subsup: true })(mi`t`, mn(1))),
            msub(mi`P`, mi`t`),
          ),
          msub(mi`P`, mi`t`),
        ),
      ),
    ),
    doc.figcaption`Inflation Identity`,
  ),
  decomposition: doc.figure(
    mathml.math(
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
    mathml.math(
      table.attr({ columnalign: 'right center left' })(
        [
          msubsup(pi, mi`t`, mi`e`),
          mo`=`,
          msub(pi, minus.sub(mi`t`, mn(1))),
        ],
        [
          msub(pi, mi`t`),
          mo`=`,
          add(
            msub(pi, minus.sub(mi`t`, mn(1))),
            mul(mi`v̄`, msub(mi`Ẏ`, mi`t`))
          ),
        ],
        [
          msub(mrow(Delta, pi), mi`t`),
          mo`=`,
          minus(msub(pi, mi`t`), msub(pi, minus.sub(mi`t`, mn(1)))),
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
  mathml.math(
    table.attr({ columnalign: 'right center left' })(
      [
        msub(pi, mi`t`),
        mo`=`,
        add(
          msub(pi, minus.sub(mi`t`, mn(1))),
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
  mathml.math(
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



