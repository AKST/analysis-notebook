/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { parensA, abs, neg, table, rows, call, op } from '@prelude-uni/mathml.js';

const { minus, mul0, eq, add } = op;
const {
  msqrt, mtr, mtd, mspace, math, mi, mo, mtext,
  mrow, mn, msup, msub, msubsup, mover,
  mfrac, munderover, mtable,
} = mathml;

export const nonlinearFittedValues = {
  ySquared: doc.figure(
    math(
      eq(msub(mi`ŷ`, mn(2)), add(
        msub(mi`𝛽̂`, mn(0)),
        mul0(msub(mi`𝛽̂`, mn(1)), msubsup(mi`x`, mn(1), mn(2))),
        mul0(msub(mi`𝛽̂`, mn(2)), msubsup(mi`x`, mn(2), mn(2))),
        mo`⋯`,
        mul0(msub(mi`𝛽̂`, mi`j`), msubsup(mi`x`, mi`j`, mn(2))),
      )),
    ),
    doc.figcaption`ŷ² as a nonlinear function of xⱼ`,
  ),
  yCubed: doc.figure(
    math(
      eq(msub(mi`ŷ`, mn(3)), add(
        msub(mi`𝛽̂`, mn(0)),
        mul0(msub(mi`𝛽̂`, mn(1)), msubsup(mi`x`, mn(1), mn(3))),
        mul0(msub(mi`𝛽̂`, mn(2)), msubsup(mi`x`, mn(2), mn(3))),
        mo`⋯`,
        mul0(msub(mi`𝛽̂`, mi`j`), msubsup(mi`x`, mi`j`, mn(3))),
      )),
    ),
    doc.figcaption`ŷ³ as a nonlinear function of xⱼ`,
  ),
};

export const reset = {
  models: {
    original: doc.figure(
      math(
        eq(mi`y`, add(
          msub(mi`𝛽̂`, mn(0)),
          mul0(msub(mi`𝛽̂`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`𝛽̂`, mn(2)), msub(mi`x`, mn(2))),
          mo`⋯`,
          mul0(msub(mi`𝛽̂`, mi`k`), msub(mi`x`, mi`k`)),
        )),
      ),
      doc.figcaption`Original Model`,
    ),
    resetVariant: doc.figure(
      math(
        eq(mi`y`, add(
          msub(mi`𝛽̂`, mn(0)),
          mul0(msub(mi`𝛽̂`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`𝛽̂`, mn(2)), msub(mi`x`, mn(2))),
          mo`⋯`,
          mul0(msub(mi`𝛽̂`, mi`k`), msub(mi`x`, mi`k`)),
          mul0(msub(mi`𝛿̂`, mn(1)), msup(mi`ŷ`, mn({ style: 'color: #ff0099' })(2))),
          mul0(msub(mi`𝛿̂`, mn(2)), msup(mi`ŷ`, mn({ style: 'color: #ff0099' })(3))),
        )),
      ),
      doc.figcaption`Reset Variant`,
    ),
  },
  hypothesis: {
    null: math(
      mrow(msub(mi`H`, mn(0)), mo`:`),
      mspace(4),
      op.comma(
        eq(msub(mi`𝛿̂`, mn(1)), mn(0)),
        eq(msub(mi`𝛿̂`, mn(2)), mn(0)),
      ),
    ),
  },
};

const x1 = msub(mi`x`, mn(1));
const x2 = msub(mi`x`, mn(2));
const x3 = msub(mi`x`, mn(3));
const xk = msub(mi`x`, mi`k`);
const Log = call({ fn: mtext`Log` });
const Expect = call({ fn: mi`𝔼` });
const Variance = call({ fn: mi`𝕍` });

export const nonnested = {
  example: doc.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] })(mi`y`, add(
          msub(mi`𝛽`, mn(0)),
          mul0(msub(mi`𝛽`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`𝛽`, mn(2)), msub(mi`x`, mn(2))),
          mi`u`,
        )),
        eq.mtr({ pos: ['right', 'left'] })(mi`y`, add(
          msub(mi`𝛽`, mn(0)),
          mul0(msub(mi`𝛽`, mn(1)), Log(msub(mi`x`, mn(1)))),
          mul0(msub(mi`𝛽`, mn(2)), Log(msub(mi`x`, mn(2)))),
          mi`u`,
        )),
      ),
    ),
    doc.figcaption`Example of nonnested models`,
  ),
  mizon: doc.figure(
    math(
      rows(
        eq(mi`y`, add(
          msub(mi`𝛾`, mn(0)),
          mul0(msub(mi`𝛾`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`𝛾`, mn(2)), msub(mi`x`, mn(2))),
          mul0(msub(mi`𝛾`, mn(3)), Log(msub(mi`x`, mn(1)))),
          mul0(msub(mi`𝛾`, mn(4)), Log(msub(mi`x`, mn(2)))),
          mi`u`,
        )),
        mrow(
          mrow({ style: 'padding: 2px; border: 0.5px solid var(--fg-white)' })(
            mrow(msub(mi`H`, mn(0)), mo`:`), mspace(4),
            op.comma(
              eq(msub(mi`𝛾`, mn(3)), mn(0)),
              eq(msub(mi`𝛾`, mn(4)), mn(0)),
            ),
          ),
          mspace(16),
          mtext`or`,
          mspace(16),
          mrow({ style: 'padding: 2px; border: 0.5px solid var(--fg-white)' })(
            mrow(msub(mi`H`, mn(0)), mo`:`), mspace(4),
            op.comma(
              eq(msub(mi`𝛾`, mn(1)), mn(0)),
              eq(msub(mi`𝛾`, mn(2)), mn(0)),
            ),
          )
        ),
      ),
    ),
    doc.figcaption`Mizon & Richard Test`,
  ),
  davidson: {
    assumption: doc.figure(
      math(eq(Expect(op.cond(mi`y`, op.comma(x1, x2))), mn(0))),
      doc.figcaption`Davidson-MacKinnon Assumption`,
    ),
    model: doc.figure(
      math(
        mtable(
          eq.mtr({ pos: ['right', 'left'] })(
            mi`y̌`,
            mtext`fitted values from other model`,
          ),
          eq.mtr({ pos: ['right', 'left'] })(mi`y`, add(
            msub(mi`p`, mn(0)),
            mul0(msub(mi`𝛽`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`𝛽`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`𝜃`, mn(1)), mi`y̌`),
            mi`error`,
          )),
        ),
      ),
      doc.figcaption`Davidson-MacKinnon Auxiliary model`,
    ),
  },
};

export const proxy = {
  solve: doc.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] })(
          mi`y`,
          add(
            msub(mi`𝛽`, mn(0)),
            mul0(msub(mi`𝛽`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`𝛽`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`𝛽`, mn(3)), msubsup(mi`x`, mn(3), mo`*`)),
            mi`u`
          )
        ),
        eq.mtr({ pos: ['right', 'left'] })(
          msubsup(mi`x`, mn(3), mo`*`),
          add(
            msub(mi`𝛿`, mn(0)),
            mul0(msub(mi`𝛿`, mn(3)), msub(mi`x`, mn(3))),
            msub(mi`v`, mn(3))
          )
        ),
        eq.mtr({ pos: ['right', 'left'] })(
          mi`y`,
          add(
            add.paren(msub(mi`𝛽`, mn(0)), mul0(msub(mi`𝛽`, mn(3)), msub(mi`𝛿`, mn(0)))),
            mul0(msub(mi`𝛽`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`𝛽`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`𝛽`, mn(3)), msub(mi`𝛿`, mn(3)), msub(mi`x`, mn(3))),
            mi`u`,
            mul0(msub(mi`𝛽`, mn(3)), msub(mi`v`, mn(3)))
          )
        ),
        eq.mtr({ pos: ['right', 'left'] })(
          mi`y`,
          add(
            msub(mi`𝛼`, mn(0)),
            mul0(msub(mi`𝛽`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`𝛽`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`𝛼`, mn(3)), msub(mi`x`, mn(3))),
            mi`e`
          )
        ),
        eq.mtr({ pos: ['right', 'left'] })(
          mrow(
            mtext`where`,
            mspace(8),
            msub(mi`𝛼`, mn(0))
          ),
          add.paren(msub(mi`𝛽`, mn(0)), mul0(msub(mi`𝛽`, mn(3)), msub(mi`𝛿`, mn(0))))
        ),
        eq.mtr({ pos: ['right', 'left'] })(
          mrow(
            mtext`and`,
            mspace(8),
            msub(mi`𝛼`, mn(3))
          ),
          mul0(msub(mi`𝛽`, mn(3)), msub(mi`𝛿`, mn(3)))
        )
      )
    ),
    doc.figcaption`Proxy variable solution`,
  ),
  assumption: doc.figure(
    math(
      eq(
        call({ fn: mtext`E` })(op.cond(msubsup(mi`x`, mn(3), mo`*`), mrow(msub(mi`x`, mn(1)), op.comma(msub(mi`x`, mn(2)), msub(mi`x`, mn(3)))))),
        call({ fn: mtext`E` })(op.cond(msubsup(mi`x`, mn(3), mo`*`), msub(mi`x`, mn(3)))),
        add(
          msub(mi`𝛿`, mn(0)),
          mul0(msub(mi`𝛿`, mn(3)), msub(mi`x`, mn(3)))
        )
      )
    ),
    doc.figcaption`Proxy variable Assumptions`,
  ),
};

export const potentialOutcomes = {
  example: doc.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] })(
          mrow(mi`y`, add.paren(mn(0))),
          add(
            msub(mi`𝜇`, mn(0)),
            mrow(mi`v`, add.paren(mn(0)))
          )
        ),
        eq.mtr({ pos: ['right', 'left'] })(
          mrow(mi`y`, add.paren(mn(1))),
          add(
            msub(mi`𝜇`, mn(1)),
            mrow(mi`v`, add.paren(mn(1)))
          )
        ),
        eq.mtr({ pos: ['right', 'left'] })(
          msub(mi`𝜏`, mi`ate`),
          op.minus(msub(mi`𝜇`, mn(1)), msub(mi`𝜇`, mn(0)))
        )
      )
    ),
    doc.figcaption`Counterfactual outcomes`,
  ),
  conditionalExpectations: doc.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] })(
          call({ fn: mtext`E` })(op.cond(mrow(mi`v`, add.paren(mn(0))), mrow(mi`w`, op.comma(mi`x`)))),
          eq(
            call({ fn: mtext`E` })(op.cond(mrow(mi`v`, add.paren(mn(0))), mi`x`)),
            mul0(minus.paren(mi`x`, call({ fn: mtext`E` })(mi`x`)), msub(mi`𝛽`, mn(0)))
          ),
        ),
        eq.mtr({ pos: ['right', 'left'] })(
          call({ fn: mtext`E` })(op.cond(mrow(mi`v`, add.paren(mn(1))), mrow(mi`w`, op.comma(mi`x`)))),
          eq(
            call({ fn: mtext`E` })(op.cond(mrow(mi`v`, add.paren(mn(1))), mi`x`)),
            mul0(minus.paren(mi`x`, call({ fn: mtext`E` })(mi`x`)), msub(mi`𝛽`, mn(1)))
          ),
        )
      )
    ),
    doc.figcaption`Conditional expectations of potential outcomes`,
  ),
};

export const measurementError = {
  model: {
    dependentVar: doc.figure(
      math(
        eq(
          msup(mi`y`, mo`*`),
          add(
            msub(mi`𝛽`, mn(0)),
            mul0(msub(mi`𝛽`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`𝛽`, mn(2)), msub(mi`x`, mn(2))),
            mo`⋯`,
            mul0(msub(mi`𝛽`, mi`j`), msub(mi`x`, mi`j`)),
            mi`u`
          )
        )
      ),
      doc.figcaption`Measurement error in${doc.br()}Dependent Variable`,
    ),
    dependentVarControlled: doc.figure(
      math(
        mtable(
          eq.mtr({ pos: ['right', 'left'] })(
            mrow(mo`∵`, mspace(8), msup(mi`y`, mo`*`)),
            minus(mi`y`, msub(mi`e`, mn(0)))
          ),
          eq.mtr({ pos: ['right', 'left'] })(
            mi`y`,
            add(
              msub(mi`𝛽`, mn(0)),
              mul0(msub(mi`𝛽`, mn(1)), msub(mi`x`, mn(1))),
              mul0(msub(mi`𝛽`, mn(2)), msub(mi`x`, mn(2))),
              mo`⋯`,
              mul0(msub(mi`𝛽`, mi`j`), msub(mi`x`, mi`j`)),
              mi`u`,
              msub(mi`e`, mn(0)),
            )
          )
        ),
      ),
      doc.figcaption`Measurement error in${doc.br()}Dependent Variable`,
    ),
    explanatoryVar: doc.figure(
      math(
        eq(
          mi`y`,
          add(
            msub(mi`𝛽`, mn(0)),
            mul0(msub(mi`𝛽`, mn(1)), msub(mi`x`, mn(1))),
            mo`⋯`,
            mul0(msub(mi`𝛽`, mi`j`), msubsup(mi`x`, mi`j`, mo`*`)),
            mo`⋯`,
            mul0(msub(mi`𝛽`, mi`k`), msub(mi`x`, mi`k`)),
            mi`u`
          )
        )
      ),
      doc.figcaption`Measurement error in${doc.br()}Explanatory Variable`,
    ),
    explanatoryVarSolved: doc.figure(
      math(
        eq(
          mi`y`,
          add(
            msub(mi`𝛽`, mn(0)),
            mul0(msub(mi`𝛽`, mn(1)), msub(mi`x`, mn(1))),
            mo`⋯`,
            mul0(msub(mi`𝛽`, mi`j`), msub(mi`x`, mi`j`)),
            mo`⋯`,
            mul0(msub(mi`𝛽`, mi`k`), msub(mi`x`, mi`k`)),
            minus.paren(mi`u`, mul0(msub(mi`𝛽`, mi`j`), msub(mi`e`, mi`j`))),
          ),
        )
      ),
      doc.figcaption`Implications of measurement error assumptions`,
    ),
  },
  error: {
    dependentVar: doc.figure(
      math(
        eq(
          msub(mi`e`, mn(0)),
          minus(mi`y`, msup(mi`y`, mo`*`)),
        )
      ),
      doc.figcaption`Measurement error in${doc.br()}Dependent Variable`,
    ),
    dependentVarRandomDraw: doc.figure(
      math(
        eq(
          msub(mi`e`, mrow(mi`i`, mn(0))),
          minus(
            msub(mi`y`, mi`i`),
            msubsup(mi`y`, mi`i`, mo`*`),
          ),
        )
      ),
      doc.figcaption.of(
        doc.span`Measurement error of Dependent`,
        doc.br(),
        doc.span`Variable from random draw`,
      ),
    ),
    dependentVarLog: doc.figure(
      math({ style: '--fontsize-math-m: 14px' })(
        mtable(
          eq.mtr({ pos: ['right', 'left' ] })(
            Log(mi`y`),
            add(Log(msup(mi`y`, mo`*`)), msub(mi`e`, mn(0))),
          ),
          eq.mtr({ pos: ['right', 'left' ] })(
            mi`y`,
            mul0(msup(mi`y`, mo`*`), msub(mi`a`, mn(0))),
          ),
          op.gt.mtr({ pos: ['right', 'left' ] })(
            msub(mi`a`, mn(0)),
            mn(0),
          ),
          eq.mtr({ pos: ['right', 'left' ] })(
            msub(mi`e`, mn(0)),
            Log(msub(mi`a`, mn(0))),
          ),
        ),
      ),
      doc.figcaption`Multiplicative measurment error`,
    ),
    explanatoryVar: doc.figure(
      math(
        eq(
          msub(mi`e`, mi`j`),
          minus(mi`x`, msubsup(mi`x`, mi`j`, mo`*`)),
        )
      ),
      doc.figcaption`Measurement error in${doc.br()}Explanatory Variable`,
    ),
  },
  assumption: {
    depVarErrorUnrelatedToExplanatoryVar: doc.figure(
      math(
        op.gt(
          eq(
            call({ fn: mtext`Var` })(add(mi`u`, msub(mi`e`, mn(0)))),
            add(
              msubsup(mi`𝜎`, mi`u`, mn(2)),
              msubsup(mi`𝜎`, mn(0), mn(2)),
            ),
          ),
          msubsup(mi`𝜎`, mi`u`, mn(2)),
        ),
      ),
      doc.figcaption`Error uncorrelated to residual assumption`,
    ),
    expErrMean: doc.figure(
      math(eq(Expect(msub(mi`e`, mi`j`)), mn(0))),
      doc.figcaption`Mean error${doc.br()}In population`,
    ),
    expErrMeanImplication: doc.figure(
      math({ style: '--fontsize-math-m: 14px' })(
        table({ columnalign: 'left right center left' })(
          [mo`∵`, ...eq.array(
            Expect(msub(mi`e`, mi`j`)),
            mn(0)
          )],
          [mo`⇒`, ...eq.array(
            Expect(
              op.cond(
                mi`y`,
                op.comma(
                  msub(mi`x`, mi`j`),
                  msubsup(mi`x`, mi`j`, mo`*`),
                ),
              ),
            ),
            Expect(op.cond(mi`y`, msub(mi`x`, mi`j`))),
          )],
        ),
      ),
      doc.figcaption`Implicaitons of Mean error`,
    ),
    expErrCoVarA: doc.figure(
      math(eq(call({ fn: mtext`CoVar` })(msub(mi`e`, mi`j`), msub(mi`x`, mi`j`)), mn(0))),
      doc.figcaption`E covariance with observed`,
    ),
    expErrCoVarB: doc.figure(
      math(eq(call({ fn: mtext`CoVar` })(msub(mi`e`, mi`j`), msubsup(mi`x`, mi`j`, mo`*`)), mn(0))),
      doc.figcaption`E covariance with unobserved`,
    ),
    expErrCoVarAImplication: doc.figure(
      math({ style: '--fontsize-math-m: 14px' })(
        table({ columnalign: 'left right center left' })(
          [mo`∵`, ...eq.array(
            call({ fn: mtext`CoVar` })(msub(mi`e`, mi`j`), msub(mi`x`, mi`j`)),
            mn(0),
          )],
          [mo`⇒`, ...op.gt.array(
            abs(call({ fn: mtext`CoVar` })(msub(mi`e`, mi`j`), msubsup(mi`x`, mi`j`, mo`*`))),
            mn(0),
          )],
        ),
        table({ columnalign: 'left right center left' })(
          [mo`∧`, ...eq.array(Expect(msub(mi`e`, mi`j`)), mn(0))],
          [mo`∧`, ...eq.array(
            msubsup(mi`x`, mi`j`, mo`*`),
            minus(msub(mi`x`, mi`j`), msub(mi`e`, mi`j`)),
          )],
        ),
      ),
      doc.figcaption`Implicaitons of Error covariance`,
    ),
    expErrCoVarA2: doc.figure(
      math(
        eq(
          Variance(minus(mi`u`, mul0(msub(mi`𝛽`, mi`j`), msub(mi`e`, mi`j`)))),
          add(
            msubsup(mi`𝜎`, mi`u`, mn(2)),
            mul0(
              msubsup(mi`𝛽`, mi`j`, mn(2)),
              msubsup(mi`𝜎`, msub(mi`e`, mi`j`), mn(2)),
            ),
          ),
        ),
      ),
      doc.figcaption`Variance of error`,
    ),
    expErrCoVarB2: doc.figure(
      math(
        op.imply(
          eq(call({ fn: mtext`CoVar` })(msub(mi`e`, mi`j`), msubsup(mi`x`, mi`j`, mo`*`)), mn(0)),
          eq(msub(mi`x`, mi`j`), add(msubsup(mi`x`, mi`j`, mo`*`), msub(mi`e`, mi`j`))),
        ),
      ),
      doc.figcaption`E covariance with unobserved`,
    ),
    expErrCoVarB3: doc.figure(
      math(
        eq(
          call({ fn: mtext`CoVar` })(msub(mi`e`, mi`j`), msub(mi`x`, mi`j`)),
          Expect(mul0(msub(mi`e`, mi`j`), msub(mi`x`, mi`j`))),
          add(
            Expect(mul0(msub(mi`e`, mi`j`), msubsup(mi`x`, mi`j`, mo`*`))),
            Expect(msubsup(mi`e`, mi`j`, mn(2))),
          ),
          add(
            mn(0),
            msubsup(mi`𝜎`, msub(mi`e`, mi`j`), mn(2)),
          ),
          msubsup(mi`𝜎`, msub(mi`e`, mi`j`), mn(2)),
        ),
      ),
      doc.figcaption`Variance under CEV assumption`,
    ),
  },
  cev: {
    covariance: doc.figure(
      math(
        eq(
          call({ fn: mtext`Cov` })(msub(mi`x`, mi`j`), minus(mi`u`, mul0(msub(mi`𝛽`, mi`j`), msub(mi`e`, mi`j`)))),
          mul0(neg(msub(mi`𝛽`, mi`j`)), call({ fn: mtext`Cov` })(msub(mi`x`, mi`j`), msub(mi`e`, mi`j`))),
          mul0(neg(msub(mi`𝛽`, mi`j`)), msubsup(mi`𝜎`, msub(mi`e`, mi`j`), mn(2)))
        )
      ),
      doc.figcaption`Covar between xⱼ and composite error`,
    ),
    plim: doc.figure(
      math(
        mtable(
          eq.mtr({ pos: ['right', 'left'] })(
            mrow(mi`plim`, add.paren(msub(mi`𝛽̂`, mi`j`))),
            add(
              msub(mi`𝛽`, mi`j`),
              mfrac(
                call({ fn: mtext`Cov` })(msub(mi`x`, mi`j`), minus(mi`u`, mul0(msub(mi`𝛽`, mi`j`), msub(mi`e`, mi`j`)))),
                call({ fn: mtext`Var` })(msub(mi`x`, mi`j`))
              )
            )
          ),
          eq.mtr({ pos: ['right', 'left'] })(
            mrow(),
            minus(
              msub(mi`𝛽`, mi`j`),
              mfrac(
                mul0(msub(mi`𝛽`, mi`j`), msubsup(mi`𝜎`, msub(mi`e`, mi`j`), mn(2))),
                add(msubsup(mi`𝜎`, msub(mi`x`, mi`j`), mrow(mn(2), mo`*`)), msubsup(mi`𝜎`, msub(mi`e`, mi`j`), mn(2)))
              )
            )
          ),
          eq.mtr({ pos: ['right', 'left'] })(
            mrow(),
            mul0(
              msub(mi`𝛽`, mi`j`),
              minus.paren(
                mn(1),
                mfrac(
                  msubsup(mi`𝜎`, msub(mi`e`, mi`j`), mn(2)),
                  add(msubsup(mi`𝜎`, msub(mi`x`, mi`j`), mrow(mn(2), mo`*`)), msubsup(mi`𝜎`, msub(mi`e`, mi`j`), mn(2)))
                )
              )
            )
          ),
          eq.mtr({ pos: ['right', 'left'] })(
            mrow(),
            mul0(
              msub(mi`𝛽`, mi`j`),
              parensA(
                mfrac(
                  msubsup(mi`𝜎`, msub(mi`x`, mi`j`), mrow(mn(2), mo`*`)),
                  add(msubsup(mi`𝜎`, msub(mi`x`, mi`j`), mrow(mn(2), mo`*`)), msubsup(mi`𝜎`, msub(mi`e`, mi`j`), mn(2)))
                )
              )
            )
          )
        )
      ),
      doc.figcaption`Probability limit under CEV`,
    ),
    plimSimplified: doc.figure(
      math(
        eq(
          mrow(mi`plim`, add.paren(msub(mi`𝛽̂`, mn(1)))),
          mul0(
            msub(mi`𝛽`, mn(1)),
            parensA(
              mfrac(
                msubsup(mi`𝜎`, msub(mi`r`, mn(1)), mrow(mn(2), mo`*`)),
                add(msubsup(mi`𝜎`, msub(mi`r`, mn(1)), mrow(mn(2), mo`*`)), msubsup(mi`𝜎`, msub(mi`e`, mn(1)), mn(2)))
              )
            )
          )
        )
      ),
      doc.figcaption`Simplified probability limit`,
    ),
    r: math(
      mtable(
        mtr(
          mtd({ columnalign: 'right' })(mtext`where`),
          mtd({ columnalign: 'right' })(mi`r`),
          mtd({ columnalign: 'center' })(mo`=`),
          mtd({ columnalign: 'left' })(mtext`the population error ...`),
        ),
        mtr(
          mtd({ columnalign: 'right' })(mtext`in`),
          mtd({ columnalign: 'right' })(msubsup(mi`x`, mi`j`, mi`*`)),
          mtd({ columnalign: 'center' })(mo`=`),
          mtd({ columnalign: 'left' })(
            add(
              msub(mi`𝛼`, mn(0)),
              mul0(msub(mi`𝛼`, mn(1)), msub(mi`x`, mn(1))),
              mo`⋯`,
              mul0(msub(mi`𝛼`, minus.sub(mi`k`, mn(1))), msub(mi`x`, minus.sub(mi`k`, mn(1)))),
              msubsup(mi`r`, mi`j`, mo`*`),
            ),
          ),
        ),
      ),
    ),
  },
};
