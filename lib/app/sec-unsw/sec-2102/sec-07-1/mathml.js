/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { todo } from '@prelude-uni/components.js';
import { neg, rows, SPECIAL, call, op, parensA, table, annotationUnder } from '@prelude-uni/mathml.js';

const { math, mi, mo, mtext, mrow, mn, msup, msub, mfrac, munder, mspace } = mathml;
const { eq, add, minus, mul, mul0, div } = op;
const { greek } = SPECIAL;

export const irvingBudgetConstraint = doc.figure(
  math(
    table.attr({ columnalign: 'right center left' })(
      [
        add(
          msub(mi`c`, mtext`today`),
          minus.paren(msub(mi`f`, mtext`future`), msub(mi`f`, mtext`today`))
        ),
        mo`=`,
        msub(mi`y`, mtext`today`)
      ],
      [
        msub(mi`c`, mtext`future`),
        mo`=`,
        add(
          msub(mi`y`, mtext`future`),
          mul(
            add.paren(mn(1), mi`R`),
            msub(mi`f`, mtext`future`)
          )
        )
      ]
    )
  ),
  doc.figcaption`consumption plus saving equals income`,
);

export const intertemporalBudgetConstraint = doc.figure(
  math(
    table.attr({ columnalign: 'right center left' })(
      [
        add(
          msub(mi`c`, mtext`today`),
          mfrac(
            msub(mi`c`, mtext`future`),
            add.paren(mn(1), mi`R`)
          )
        ),
        mo`=`,
        add(
          msub(mi`f`, mtext`today`),
          add(
            msub(mi`y`, mtext`today`),
            mfrac(
              msub(mi`y`, mtext`future`),
              add.paren(mn(1), mi`R`)
            )
          )
        )
      ],
      [
        mtext`present value of consumption`,
        mo`=`,
        annotationUnder.attr({ label: mtext`total wealth` })(
          add(
            mtext`financial wealth`,
            mtext`human wealth`
          )
        )
      ]
    )
  ),
  doc.figcaption`Intertemporal budget constraint`,
);

export const lifetimeUtilityFunction = doc.figure(
  math(
    eq(
      mi`U`,
      add(
        call({ fn: mi`u` })(msub(mi`c`, mtext`today`)),
        mul(
          greek.beta,
          call({ fn: mi`u` })(msub(mi`c`, mtext`future`))
        )
      )
    )
  ),
  doc.figcaption`Lifetime utility function`,
);

export const utilityMaximisation = doc.figure(
  math(
    table.attr({ columnalign: 'right center left' })(
      eq.array(
        mrow(
          munder(
            mi`max`,
            mrow(msub(mi`c`, mtext`today`), mo`,`, mspace(4), msub(mi`c`, mtext`future`))
          ),
          mspace(8),
          mi`U`,
        ),
        add(
          call({ fn: mi`u` })(msub(mi`c`, mtext`today`)),
          mul(
            greek.beta,
            call({ fn: mi`u` })(msub(mi`c`, mtext`future`))
          )
        )
      ),
      eq.array(
        mi`X̄`,
        add(
          msub(mi`c`, mtext`today`),
          parensA(
            mfrac(
              msub(mi`c`, mtext`future`),
              add.paren(mn(1), mi`R`)
            )
          )
        ),
      ),
      op.eqId.array(
        mi`X̄`,
        add(
          msub(mi`f`, mtext`today`),
          msub(mi`y`, mtext`today`),
          mfrac(
            msub(mi`y`, mtext`future`),
            add(mn(1), mi`R`),
          ),
        ),
      ),
    )
  ),
  doc.figcaption`Utility maximisation`,
);

export const indifferenceCondition = doc.figure(
  math(
    eq(
      call({ fn: msup(mi`u`, mo`′`) })(msub(mi`c`, mtext`today`)),
      mul0(
        greek.beta,
        add.paren(mn(1), mi`R`),
        call({ fn: msup(mi`u`, mo`′`) })(msub(mi`c`, mtext`future`))
      )
    )
  ),
  doc.figcaption`Euler Equation, indifference`,
);

export const solvingMaximisation1 = doc.figure(
  math(
    table({ columnalign: 'right right center left' })(
      [
        munder(
          mi`max`,
          msub(mi`c`, mtext`today`)
        ),
        add(
          call({ fn: mi`u` })(msub(mi`c`, mtext`today`)),
          mul0(
            greek.beta,
            call({ fn: mi`u`, paren: '[]' })(
              mul(
                add.paren(mn(1), mi`R`),
                parensA(minus(mi`X̄`, msub(mi`c`, mtext`today`)))
              )
            )
          )
        )
      ],
      [
        mrow(),
        ...eq.array(
          add(
            call({ fn: msup(mi`u`, mo`′`) })(msub(mi`c`, mtext`today`)),
            mul0(
              greek.beta,
              call({ fn: msup(mi`u`, mo`′`) })(msub(mi`c`, mtext`future`)),
              add.paren(mn(1), mi`R`),
              parensA(neg(mn(1)))
            )
          ),
          mn(0)
        ),
      ],
    ),
  ),
  doc.figcaption`Solving consumption maximisation`,
);

export const solvingLogUtility = doc.figure(
  math(
    table({ columnalign: 'right center left' })(
      eq.array(
        mfrac(mn(1), msub(mi`c`, mtext`today`)),
        mul0(
          greek.beta,
          add.paren(mn(1), mi`R`),
          mfrac(mn(1), msub(mi`c`, mtext`future`))
        )
      ),
      eq.array(
        mfrac(
          msub(mi`c`, mtext`future`),
          msub(mi`c`, mtext`today`),
        ),
        mul0(greek.beta, add.paren(mn(1), mi`R`)),
      ),
    ),
  ),
  doc.figcaption`Solving log utility`,
);

export const logUtility = doc.figure(
  math(
    eq(
      mfrac(msub(mi`c`, mtext`future`), msub(mi`c`, mtext`today`)),
      mul0(greek.beta, add.paren(mn(1), mi`R`))
    )
  ),
  doc.figcaption`Log utility`,
);

export const solvingConsumptionWhenBetaIs1 = doc.figure(
  math({ style: '--fontsize-math-m: 14px' })(
    table.attr({ columnalign: 'right right center left' })(
      [
        mtext({ style: 'font-weight: 900' })`Where`,
        ...eq.array(
          mfrac(msub(mi`c`, mtext`future`), msub(mi`c`, mtext`today`)),
          mul0(greek.beta, add.paren(mn(1), mi`R`))
        ),
      ],
      [
        mrow(),
        ...eq.array(
          mi`X̄`,
          add(
            msub(mi`c`, mtext`today`),
            mfrac(
              msub(mi`c`, mtext`future`),
              add(mn(1), mi`R`)
            )
          ),
        ),
      ],
      [mrow()],
      [mrow()],
      [mrow()],
      [
        mtext({ style: 'font-weight: 900' })`Let`,
        ...eq.array(
          msub(mi`c`, mtext`today`),
          mul0(mfrac(mn(1), mn(2)), mi`X̄`),
        ),
      ],
      [
        mrow(),
        ...eq.array(
          msub(mi`c`, mtext`future`),
          mul0(
            mfrac(mn(1), mn(2)),
            add.paren(mn(1), mi`R`),
            mi`X̄`,
          ),
        ),
      ],
    )
  ),
  doc.figcaption`Solving consumption: β is 1`,
);

export const consumptionProportionalToWealth = doc.figure(
  math(
    eq(
      mi`X̄`,
      add(
        msub(mi`f`, mtext`today`),
        add(
          msub(mi`y`, mtext`today`),
          minus.square(
            mfrac(msub(mi`y`, mtext`future`), add.paren(mn(1), mi`R`))
          )
        )
      )
    )
  ),
  doc.figcaption`Irving constraint`,
);

export const irvingConstraint = doc.figure(
  math(
    op.lteq(
      msub(mi`c`, mtext`today`),
      msub(mi`y`, mtext`today`)
    )
  ),
  doc.figcaption`Irving constraint low income`,
);

export const irvingConstraintLowIncome = doc.figure(
  math(
    eq(
      msub(mi`c`, mtext`today`),
      msub(mi`y`, mtext`today`)
    )
  ),
  doc.figcaption`Irving constraint high income`,
);
