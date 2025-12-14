/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import { sum, table, annotationUnder, op } from '@prelude-uni/mathml.js';

const { msup, msub, mfrac, math, mrow, mn, mo, mi, mtext } = mathml;
const { mul, eq, add, minus } = op;

export const savingIdentity = text.figure(
  math(
    eq(
      add(
        annotationUnder.attr({ label: mtext`private saving` }).of(
          add.paren(mi`Y`, minus(mi`T`), minus(mi`C`))
        ),
        annotationUnder.attr({ label: mtext`government saving` }).of(
          minus.paren(mi`T`, mi`G`)
        ),
        annotationUnder.attr({ label: mtext`foreign saving` }).of(
          minus.paren(mi`IM`, mi`EX`)
        )
      ),
      mi`I`
    )
  ),
  doc.figcaption`Saving identity`,
);

export const intertemporalTradeBalanceConstraint = text.figure(
  math(
    eq(
      sum({ max: mi`∞`, inc: eq.sub(mi`t`, mn(0)) }).of(
        mfrac(msub(mi`TB`, mi`t`), msup(add.paren(mn(0), mi`r`), mi`t`))
      ),
      mn(0),
    ),
  ),
  doc.figcaption`Intertemporal Trade Balance`,
);

export const nationalIncomeIdentity = text.figure(
  math(
    table({ columnalign: 'right center left' }).of(
      op.eqId.array(
        mi`S`,
        add(minus.paren(mi`Y`, mi`T`, mi`C`), minus.paren(mi`T`, mi`G`)),
      ),
      eq.array(
        annotationUnder.attr({ label: mtext`trade balance` }).of(
          mi`NX`
        ),
        annotationUnder.attr({ label: mtext`net capital outflow` }).of(
          minus.paren(mi`S`, mi`I`)
        )
      ),
    ),
  ),
  doc.figcaption`National income identity`,
);

export const nationalAccountingImplications = text.figure(
  math(
    table({ columnalign: 'right center left' }).of(
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

export const autarkyConsumpution = text.figure(
  math(
    table({ columnalign: 'right center left' }).of(
      eq.array(
        mfrac(
          mul(msub(mi`P`, mi`🍎`), msub(mi`C`, mi`🍎`)),
          mi`ω`,
        ),
        mfrac(mn(1), mn(2)),
      ),
      eq.array(
        mfrac(
          mul(msub(mi`P`, mi`💻`), msub(mi`C`, mi`💻`)),
          mi`ω`,
        ),
        mfrac(mn(1), mn(2)),
      ),
    ),
  ),
  doc.figcaption`Autarky Consumption`,
);
