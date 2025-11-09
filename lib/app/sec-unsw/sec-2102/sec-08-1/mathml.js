/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { todo } from '@prelude-uni/components.js';
import { SPECIAL, call, op, annotationUnder } from '@prelude-uni/mathml.js';

const { math, mi, mo, mtext, mrow, mn, msup, msub, mspace, mfrac } = mathml;
const { eq, add, mul0 } = op;

export const noop = doc.figure(
  todo({}, 'Noop'),
  doc.figcaption`noop`,
);

export const govtBudgetConstraint = doc.figure(
  math(
    eq(
      annotationUnder.attr({ label: mtext`uses` })(
        add(
          msub(mi`G`, mi`t`),
          mul0(msub(mi`Tr`, mi`t`)),
          mul0(mi`i`, msub(mi`B`, mi`t`))
        )
      ),
      annotationUnder.attr({ label: mtext`sources` })(
        add(
          msub(mi`T`, mi`t`),
          add(
            msub(mi`ΔB`, mrow(mi`t`, mo`+`, mn(1))),
            msub(mi`ΔM`, mrow(mi`t`, mo`+`, mn(1)))
          )
        )
      )
    )
  ),
  doc.figcaption`Government budget constraint`,
);

export const bondsEvolution = doc.figure(
  math(
    eq(
      msub(mi`B`, add.sub(mi`t`, mn(1))),
      add(
        mul0(add.paren(mn(1), mi`i`), msub(mi`B`, mi`t`)),
        annotationUnder.attr({ label: mtext`deficit` })(
          add(
            msub(mi`G`, mi`t`),
            op.minus(msub(mi`T`, mi`t`))
          )
        )
      )
    )
  ),
  doc.figcaption`Evolution of government bonds`,
);

export const intertemporalBudgetConstraint = doc.figure(
  math(
    eq(
      add(
        annotationUnder.attr({ label: mtext`pdv of spending` })(
          add(
            msub(mi`G`, mn(1)),
            mfrac(
              msub(mi`G`, mn(2)),
              add.paren(mn(1), mi`i`)
            )
          )
        ),
        annotationUnder.attr({ label: mtext`initial debt` })(
          mul0(add.paren(mn(1), mi`i`), msub(mi`B`, mn(1)))
        )
      ),
      add(
        msub(mi`T`, mn(1)),
        annotationUnder.attr({ label: mtext`pdv of taxes` })(
          mfrac(
            msub(mi`T`, mn(2)),
            add.paren(mn(1), mi`i`)
          )
        )
      )
    )
  ),
  doc.figcaption`Intertemporal budget constraint`,
);

export const nationalIncomeIdentity = doc.figure(
  math(
    eq(
      add(
        mi`Y`,
        op.minus(mi`C`),
        op.minus(mi`G`),
        add.paren(mi`IM`, op.minus(mi`EX`))
      ),
      mi`I`
    )
  ),
  doc.figcaption`National income identity`,
);

export const savingIdentity = doc.figure(
  math(
    eq(
      add(
        annotationUnder.attr({ label: mtext`private saving` })(
          add.paren(mi`Y`, op.minus(mi`T`), op.minus(mi`C`))
        ),
        annotationUnder.attr({ label: mtext`government saving` })(
          add.paren(mi`T`, op.minus(mi`G`))
        ),
        annotationUnder.attr({ label: mtext`foreign saving` })(
          add.paren(mi`IM`, op.minus(mi`EX`))
        )
      ),
      mi`I`
    )
  ),
  doc.figcaption`Saving identity`,
);
