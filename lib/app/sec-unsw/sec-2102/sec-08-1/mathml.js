/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { text, todo } from '@prelude-uni/components.js';
import { sum, SPECIAL, call, op, annotationUnder, parensC } from '@prelude-uni/mathml.js';

const { math, mi, mo, mtext, mrow, mn, msup, msub, msubsup, mspace, mfrac, munderover } = mathml;
const { eq, add, mul0, minus } = op;

export const noop = text.figure(
  todo({}, 'Noop'),
  doc.figcaption`noop`,
);

export const govtBudgetConstraint = text.figure(
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
  doc.figcaption`Flow version of the Government budget constraint`,
);

export const bondsEvolution = text.figure(
  math(
    eq(
      msub(mi`B`, add.sub(mi`t`, mn(1))),
      add(
        mul0(add.paren(mn(1), mi`i`), msub(mi`B`, mi`t`)),
        annotationUnder.attr({ label: mtext`deficit` })(
          minus(
            msub(mi`G`, mi`t`),
            msub(mi`T`, mi`t`)
          )
        )
      )
    )
  ),
  doc.figcaption`Evolution of government bonds`,
);

export const intertemporalBudgetConstraint = text.figure(
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

export const nationalIncomeIdentity = text.figure(
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

export const savingIdentity = text.figure(
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

export const intertemporalDebtEvolution = text.figure(
  math(
    eq(
      msub(mi`B`, add.sub(mi`t`, mn(1))),
      add(
        mul0(
          munderover(
            mi`∏`,
            mrow(mi`p`, mo`=`, mn(1)),
            mi`t`
          ),
          add.paren(mn(1), msub(mi`i`, mi`p`)),
          msub(mi`B`, mn(0))
        ),
        sum({ inc: eq.sub(mi`p`, mn(1)), max: mi`t` })(
          parensC(
            add.square(
              mul0(
                munderover(
                  mi`∏`,
                  eq.sub(mi`q`, mi`p`),
                  minus.sub(mi`t`, mn(1)),
                ),
                add.paren(mn(1), msub(mi`i`, mi`q`))
              ),
            ),
            minus.paren(
              msub(mi`G`, mi`p`),
              msub(mi`T`, mi`p`)
            )
          )
        ),
        minus.paren(
          msub(mi`G`, mi`t`),
          msub(mi`T`, mi`t`)
        )
      )
    )
  ),
  doc.figcaption`Intertemporal evolution of government debt`,
);

export const primaryBudgetBalance = text.figure(
  math(
    eq(
      msub(mi`B`, mi`t`),
      minus(
        mul0(
          msub(mi`B`, minus.sub(mi`t`, mn(1))),
          add.paren(mn(1), mi`i`),
        ),

        annotationUnder({ label: mtext`Primary Budget Balance` })(
          minus.square(
            msub(mi`T`, mi`t`),
            msub(mi`G`, mi`t`),
            msub(mi`TR`, mi`t`),
          ),
        ),
      ),
    ),
  ),
  doc.figcaption`Primary Budget Balance (PBBₜ)`,
);

export const debtToGdpRatio = text.figure(
  math(
    eq(
      mfrac(msub(mi`B`, mi`t`), msub(mi`Y`, mi`t`)),
      mtext`Debt to GDP Ratio for period t`,
    ),
  ),
);

export const bondValue = text.figure(
  math(
    eq(
      call({ fn: mtext`BondValue` })(
        mtext`Coupon`,
        mtext`FaceValue`,
        mi`N`,
      ),
      add(
        sum({ max: mi`N`, inc: eq.sub(mi`t`, mn(1)) })(
          mfrac(mtext`Coupon`, msup(add.paren(mn(1), mi`r`), mi`t`)),
        ),
        mfrac(mtext`FaceValue`, msup(add.paren(mn(1), mi`r`), mi`n`)),
      ),
    ),
  ),
  doc.figcaption`Bond Value`,
);

export const privateSectorSavings = text.figure(
  math(
    minus(mi`Y`, mi`T`, mi`C`),
  ),
  doc.figcaption`Private Sector Savings`,
);
