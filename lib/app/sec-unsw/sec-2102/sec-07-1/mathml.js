/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { todo } from '@prelude-uni/components.js';
import {
  sum, inv, rows, neg, SPECIAL, call, op,
  parensB, parensA, table, annotationUnder,
} from '@prelude-uni/mathml.js';

const {
  mover, math, mi, mo, mtext, mrow, mn, msup, msub, mfrac,
  munder, mspace, mtable, mtr, mtd, msubsup,
} = mathml;
const { imply, eq, add, minus, mul, mul0, div } = op;
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
      eq.array(
        add(
          msub(mi`c`, mtext`today`),
          mfrac(
            msub(mi`c`, mtext`future`),
            add.paren(mn(1), mi`R`)
          )
        ),
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
      ),
      eq.array(
        mtext`present value of consumption`,
        annotationUnder.attr({ label: mtext`total wealth` })(
          add(
            mtext`financial wealth`,
            mtext`human wealth`
          )
        )
      ),
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
        mul0(
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
          mul0(
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
              mul0(
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
        annotationUnder({ label: mtext`PDV of income` })(
          add(
            msub(mi`y`, mtext`today`),
            minus.square(
              mfrac(msub(mi`y`, mtext`future`), add.paren(mn(1), mi`R`))
            )
          )
        ),
      )
    )
  ),
  doc.figcaption`Consumption propotional to Total wealth`,
);

export const averageUtility = doc.figure(
  math(
    table({ columnalign: 'left right center left' })(
      [mtext`General`, ...eq.array(
        call({ fn: mtext`𝔼` })(mi`C`),
        mul0(
          inv(mi`n`),
          parensA(sum({ max: mi`n`, inc: add.sub(mi`i`, mn(1)) })(msub(mi`c`, mi`i`))),
        ),
      )],
      [mrow()],
      [mtext`Two periods`, ...eq.array(
        call({ fn: mtext`𝔼` })(msub(mi`c`, mn(1)), msub(mi`c`, mn(2))),
        mfrac(add(msub(mi`c`, mn(1)), msub(mi`c`, mn(2))), mn(2)),
      )],
    ),
  ),
  doc.figcaption`Average utilty between 2 periods (c₁, c₂)`,
);

const taxHl = mi({ style: 'font-weight: 900; text-shadow: var(--txt-shadow-blue)' })`𝜏`;

export const richardianEquivalenceIbc = doc.figure(
  math({ style: '--fontsize-math-m: 14px' })(
    eq(
      add(
        msub(mi`c`, mtext`today`),
        mfrac(
          msub(mi`c`, mtext`future`),
          add.paren(mn(1), mi`R`)
        )
      ),
      add(
        msub(mi`f`, mtext`today`),
        add(
          minus.paren(msub(mi`y`, mtext`today`), msub(taxHl, mtext`today`)),
          mfrac(
            minus.paren(msub(mi`y`, mtext`future`), msub(taxHl, mtext`future`)),
            add.paren(mn(1), mi`R`)
          )
        ),
      )
    )
  ),
  doc.figcaption`IBC with taxes (𝜏) subtracted`,
);

export const richardianEquivalenceTotalWealth = doc.figure(
  math(
    eq(
      msub(mi`X̄`, mi`𝜏`),
      add(
        msub(mi`f`, mtext`today`),
        add(
          minus.paren(msub(mi`y`, mtext`today`), msub(mi`𝜏`, mtext`today`)),
          mfrac(
            minus.paren(msub(mi`y`, mtext`future`), msub(mi`𝜏`, mtext`future`)),
            add.paren(mn(1), mi`R`)
          )
        ),
      )
    )
  ),
  doc.figcaption`IBC with taxes (𝜏) subtracted`,
);

export const irvingConstraint = doc.figure(
  math(
    op.lteq(
      msub(mi`c`, mtext`today`),
      msub(mi`y`, mtext`today`)
    )
  ),
);

export const irvingConstraintLowIncome = doc.figure(
  math(
    eq(
      msub(mi`c`, mtext`today`),
      msub(mi`y`, mtext`today`)
    )
  ),
);

export const vars = {
  c1: msub(mi`c`, mn(1)),
  c2: msub(mi`c`, mn(2)),
  c1e: msubsup(mi`c`, mn(1), neg(mi`𝛾`)),
  c2e: msubsup(mi`c`, mn(2), neg(mi`𝛾`)),
  f1: msub(mi`f`, mn(1)),
  y1: msub(mi`y`, mn(1)),
  y2: msub(mi`y`, mn(2)),
};

const Utility = call({ fn: mi`U` });
const utility = call({ fn: mi`u` });
const utilityPrime = call({ fn: mrow(mi`u`, mo`'`) });
const lx = call({ fn: msub(mi`𝔏`, vars.c1) })
const ly = call({ fn: msub(mi`𝔏`, vars.c2) })
const ll = call({ fn: msub(mi`𝔏`, mi`𝜆`) })

export const lagrangian = {
  l: math(
    mtable(
      mtr(mtd({ columnalign: 'left', columnspan: 3 })(
        mtext`Lagrangian`
      )),
      eq.mtr({ pos: ['right', 'left'] })(
        call({ fn: mi`𝔏` })(vars.c1, vars.c2, mi`𝜆`),
        minus(
          add(utility(vars.c1), mul0(mi`𝛽`, utility(vars.c2))),
          mul0(
            mi`𝜆`,
            minus.square(
              add(vars.c1, mfrac(vars.c2, mi`ɹ`)),
              add.paren(vars.f1, vars.y1, mfrac(vars.y2, mi`ɹ`)),
            ),
          )
        ),
      ),
    ),
  ),
  definitions: math(
    mtable(
      mtr(mtd(
        table({
          columnalign: 'right center left',
        })(
          eq.array(
            mrow(mtext`Where`, mspace(8), mi`ɹ`),
            add(mn(1), mi`r`),
          ),
          eq.array(
            utility(mi`c`),
            mfrac(
              msup(mi`c`, minus.sup(mn(1), mi`𝛾`)),
              minus(mn(1), mi`𝛾`),
            ),
          ),
          eq.array(
            utilityPrime(mi`c`),
            msup(mi`c`, neg(mi`𝛾`)),
          ),
        ),
      )),
    ),
  ),
  functions: math(
    mtable(
      mtr(mtd({ columnalign: 'left', columnspan: 3 })(
        mtext`Utility and IBC`
      )),
      eq.mtr({ pos: ['right', 'left'] })(
        add(vars.c1, mfrac(vars.c2, mi`ɹ`)),
        add(vars.f1, vars.y1, mfrac(vars.y2, mi`ɹ`)),
      ),
      eq.mtr({ pos: ['right', 'left'] })(
        Utility(vars.c1, vars.c2),
        add(utility(vars.c1), mul(mi`𝛽`, utility(vars.c2))),
      ),
    ),
  ),
  firstOrderCondition: math(
    mtable(
      mtr(mtd(mrow())),
      mtr(mtd({ columnalign: 'left', columnspan: 3 })(
        mtext`First Order Condition`
      )),
      eq.mtr({ pos: ['right', 'left'] })(
        lx(vars.c1, vars.c2, mi`𝜆`),
        imply(
          eq(minus(
            utilityPrime(vars.c1),
            mi`𝜆`,
          ), mn(0)),
          eq(
            utilityPrime(vars.c1),
            mi`𝜆`,
          ),
        ),
      ),
      eq.mtr({ pos: ['right', 'left'] })(
        ly(vars.c1, vars.c2, mi`𝜆`),
        imply(
          eq(minus(
            mul0(mi`𝛽`, utilityPrime(vars.c2)),
            mfrac(mi`𝜆`, mi`ɹ`),
          ), mn(0)),
          eq(
            mul0(utilityPrime(vars.c2), mi`𝛽`, mi`ɹ`),
            mi`𝜆`
          ),
        ),
      ),
      eq.mtr({ pos: ['right', 'left'] })(
        ll(vars.c1, vars.c2, mi`𝜆`),
        imply(
          eq(
            minus(
              add(vars.c1, mfrac(vars.c2, mi`ɹ`)),
              add.paren(vars.f1, vars.y1, mfrac(vars.y2, mi`ɹ`)),
            ),
            mn(0),
          ),
          eq(
            add(vars.c1, mfrac(vars.c2, mi`ɹ`)),
            add(vars.f1, vars.y1, mfrac(vars.y2, mi`ɹ`)),
          ),
        ),
      ),
      imply.mtr({ pos: ['right', 'left'] })(
        op.and(
          msub(mi`𝔏`, msub(mi`c`, mn(1))),
          msub(mi`𝔏`, msub(mi`c`, mn(2))),
        ),
        imply(
          eq(
            mul0(utilityPrime(vars.c2), mi`𝛽`, mi`ɹ`),
            utilityPrime(vars.c1),
          ),
          eq(
            mul0(mi`𝛽`, mi`ɹ`),
            mfrac(vars.c1e, vars.c2e),
            msup(
              parensA(mfrac(vars.c2, vars.c1)),
              mi`𝛾`,
            ),
          ),
          annotationUnder({
            label: mtext`Euler Equation`,
          })(
            eq(
              vars.c2,
              mul0(
                vars.c1,
                msup(
                  mul0.square(mi`𝛽`, add.paren(mn(1), mi`r`)),
                  mfrac(mn(1), mi`𝛾`),
                )
              ),
            ),
          ),
        ),
      ),
    ),
  ),
  optimalConsumption: math(
    mtable(
      imply.mtr({ pos: ['right', 'left'] })(
        op.and(msub(mi`𝔏`, vars.c1), msub(mi`𝔏`, vars.c2), msub(mi`𝔏`, mi`𝜆`)),
        eq(
          add(vars.f1, vars.y1, mfrac(vars.y2, mi`ɹ`)),
          add(
            vars.c1,
            mfrac(
              mul0(
                vars.c1,
                msup(
                  mul0.square(mi`𝛽`, add.paren(mn(1), mi`r`)),
                  mfrac(mn(1), mi`𝛾`),
                )
              ),
              mi`ɹ`,
            ),
          ),
          mul0(
            vars.c1,
            add.paren(
              mn(1),
              mfrac(
                msup(
                  mul0.square(mi`𝛽`, add.paren(mn(1), mi`r`)),
                  mfrac(mn(1), mi`𝛾`),
                ),
                mi`ɹ`,
              ),
            ),
          ),
        ),
      ),
      imply.mtr({ pos: ['right', 'left'] })(
        mrow(),
        eq(
          vars.c1,
          imply(
            mfrac(
              add(vars.f1, vars.y1, mul0(vars.y2, inv(mi`ɹ`))),
              add(
                mn(1),
                mul(
                  msup(
                    mul0.square(mi`𝛽`, add.paren(mn(1), mi`r`)),
                    mfrac(mn(1), mi`𝛾`),
                  ),
                  inv(mi`ɹ`),
                ),
              ),
            ),
            eq(
              msubsup(mi`c`, mn(1), mo`*`),
              mfrac(
                add(mul0(mi`ɹ`, add.paren(vars.f1, vars.y1)), vars.y2),
                add(
                  mi`ɹ`,
                  msup(
                    mul0.square(mi`𝛽`, add.paren(mn(1), mi`r`)),
                    mfrac(mn(1), mi`𝛾`),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      imply.mtr({ pos: ['right', 'left'] })(
        mrow(),
        eq(
          msubsup(mi`c`, mn(2), mo`*`),
          mul0(
            msubsup(mi`c`, mn(1), mo`*`),
            msup(
              mul0.square(mi`𝛽`, add.paren(mn(1), mi`r`)),
              mfrac(mn(1), mi`𝛾`),
            )
          ),
        ),
      ),
    ),
  ),
};
