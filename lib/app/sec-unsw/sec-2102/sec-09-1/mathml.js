/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { table, annotationUnder, op } from '@prelude-uni/mathml.js';

const { math, mrow, mn, mo, mi, mtext } = mathml;
const { eq, add, minus } = op;

export const savingIdentity = doc.figure(
  math(
    eq(
      add(
        annotationUnder.attr({ label: mtext`private saving` })(
          add.paren(mi`Y`, minus(mi`T`), minus(mi`C`))
        ),
        annotationUnder.attr({ label: mtext`government saving` })(
          minus.paren(mi`T`, mi`G`)
        ),
        annotationUnder.attr({ label: mtext`foreign saving` })(
          minus.paren(mi`IM`, mi`EX`)
        )
      ),
      mi`I`
    )
  ),
  doc.figcaption`Saving identity`,
);

export const nationalIncomeIdentity = doc.figure(
  math(
    eq(
      annotationUnder.attr({ label: mtext`trade balance` })(
        mi`NX`
      ),
      annotationUnder.attr({ label: mtext`net capital outflow` })(
        minus.paren(mi`S`, mi`I`)
      )
    )
  ),
  doc.figcaption`National income identity`,
);

export const nationalAccountingImplications = doc.figure(
  math(
    table({ columnalign: 'right center left' })(
      eq.array(
        mi`Y`,
        add(mi`C`, mi`I`, mi`G`, mi`NX`),
      ),
      [mrow()],
      [
        mrow(),
        mo`∵`,
        op.eqId(mi`NX`, op.minus(mi`EX`, mi`IM`))
      ],
      [mrow()],
      op.imply.array(
        op.lt(mi`NX`, mn(0)),
        op.gt(add(mi`C`, mi`I`, mi`G`), mi`Y`),
      ),
      op.imply.array(
        op.gt(mi`NX`, mn(0)),
        op.lt(add(mi`C`, mi`I`, mi`G`), mi`Y`),
      ),
    ),
  ),
  doc.figcaption`Trade Implications`,
);
