/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import { sum, parensA, abs, neg, table, rows, call, op } from '@prelude-uni/mathml.js';

const { minus, mul0, eq, add } = op;
const {
  msqrt, mtr, mtd, mspace, math, mi, mo, mtext,
  mrow, mn, msup, msub, msubsup, mover,
  mfrac, munderover, mtable, munder,
} = mathml;

export const nonlinearFittedValues = {
  ySquared: text.figure(
    math(
      eq(msub(mi`ŷ`, mn(2)), add(
        msub(mi`β̂`, mn(0)),
        mul0(msub(mi`β̂`, mn(1)), msubsup(mi`x`, mn(1), mn(2))),
        mul0(msub(mi`β̂`, mn(2)), msubsup(mi`x`, mn(2), mn(2))),
        mo`⋯`,
        mul0(msub(mi`β̂`, mi`j`), msubsup(mi`x`, mi`j`, mn(2))),
      )),
    ),
    doc.figcaption`ŷ² as a nonlinear function of xⱼ`,
  ),
  yCubed: text.figure(
    math(
      eq(msub(mi`ŷ`, mn(3)), add(
        msub(mi`β̂`, mn(0)),
        mul0(msub(mi`β̂`, mn(1)), msubsup(mi`x`, mn(1), mn(3))),
        mul0(msub(mi`β̂`, mn(2)), msubsup(mi`x`, mn(2), mn(3))),
        mo`⋯`,
        mul0(msub(mi`β̂`, mi`j`), msubsup(mi`x`, mi`j`, mn(3))),
      )),
    ),
    doc.figcaption`ŷ³ as a nonlinear function of xⱼ`,
  ),
};

export const reset = {
  models: {
    original: text.figure(
      math(
        eq(mi`y`, add(
          msub(mi`β̂`, mn(0)),
          mul0(msub(mi`β̂`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`β̂`, mn(2)), msub(mi`x`, mn(2))),
          mo`⋯`,
          mul0(msub(mi`β̂`, mi`k`), msub(mi`x`, mi`k`)),
        )),
      ),
      doc.figcaption`Original Model`,
    ),
    resetVariant: text.figure(
      math(
        eq(mi`y`, add(
          msub(mi`β̂`, mn(0)),
          mul0(msub(mi`β̂`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`β̂`, mn(2)), msub(mi`x`, mn(2))),
          mo`⋯`,
          mul0(msub(mi`β̂`, mi`k`), msub(mi`x`, mi`k`)),
          mul0(msub(mi`δ̂`, mn(1)), msup(mi`ŷ`, mn({ style: 'color: #ff0099' }).of(2))),
          mul0(msub(mi`δ̂`, mn(2)), msup(mi`ŷ`, mn({ style: 'color: #ff0099' }).of(3))),
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
        eq(msub(mi`δ̂`, mn(1)), mn(0)),
        eq(msub(mi`δ̂`, mn(2)), mn(0)),
      ),
    ),
  },
};

const x1 = msub(mi`x`, mn(1));
const x2 = msub(mi`x`, mn(2));
const x3 = msub(mi`x`, mn(3));
const xk = msub(mi`x`, mi`k`);

/**
 * @template {Function} F
 * @param {{ of: F }} helper
 * @returns {(...params: Parameters<F>) => ReturnType<F>}
 */
const bindOf = (helper) => {
  return helper.of.bind(helper);
};

const Log = bindOf(call({ fn: mtext`Log` }));
const Expect = bindOf(call({ fn: mi`𝔼` }));
const Variance = bindOf(call({ fn: mi`𝕍` }));
const CoVar = bindOf(call({ fn: mi`Covar` }));

export const nonnested = {
  example: text.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] }).of(mi`y`, add(
          msub(mi`β`, mn(0)),
          mul0(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`β`, mn(2)), msub(mi`x`, mn(2))),
          mi`u`,
        )),
        eq.mtr({ pos: ['right', 'left'] }).of(mi`y`, add(
          msub(mi`β`, mn(0)),
          mul0(msub(mi`β`, mn(1)), Log(msub(mi`x`, mn(1)))),
          mul0(msub(mi`β`, mn(2)), Log(msub(mi`x`, mn(2)))),
          mi`u`,
        )),
      ),
    ),
    doc.figcaption`Example of nonnested models`,
  ),
  mizon: text.figure(
    math(
      rows(
        eq(mi`y`, add(
          msub(mi`γ`, mn(0)),
          mul0(msub(mi`γ`, mn(1)), msub(mi`x`, mn(1))),
          mul0(msub(mi`γ`, mn(2)), msub(mi`x`, mn(2))),
          mul0(msub(mi`γ`, mn(3)), Log(msub(mi`x`, mn(1)))),
          mul0(msub(mi`γ`, mn(4)), Log(msub(mi`x`, mn(2)))),
          mi`u`,
        )),
        mrow(
          mrow({ style: 'padding: 2px; border: 0.5px solid var(--fg-white)' }).of(
            mrow(msub(mi`H`, mn(0)), mo`:`), mspace(4),
            op.comma(
              eq(msub(mi`γ`, mn(3)), mn(0)),
              eq(msub(mi`γ`, mn(4)), mn(0)),
            ),
          ),
          mspace(16),
          mtext`or`,
          mspace(16),
          mrow({ style: 'padding: 2px; border: 0.5px solid var(--fg-white)' }).of(
            mrow(msub(mi`H`, mn(0)), mo`:`), mspace(4),
            op.comma(
              eq(msub(mi`γ`, mn(1)), mn(0)),
              eq(msub(mi`γ`, mn(2)), mn(0)),
            ),
          )
        ),
      ),
    ),
    doc.figcaption`Mizon & Richard Test`,
  ),
  davidson: {
    assumption: text.figure(
      math(eq(Expect(op.cond(mi`y`, op.comma(x1, x2))), mn(0))),
      doc.figcaption`Davidson-MacKinnon Assumption`,
    ),
    model: text.figure(
      math(
        mtable(
          eq.mtr({ pos: ['right', 'left'] }).of(
            mi`y̌`,
            mtext`fitted values from other model`,
          ),
          eq.mtr({ pos: ['right', 'left'] }).of(mi`y`, add(
            msub(mi`p`, mn(0)),
            mul0(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`β`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`θ`, mn(1)), mi`y̌`),
            mi`error`,
          )),
        ),
      ),
      doc.figcaption`Davidson-MacKinnon Auxiliary model`,
    ),
  },
};

export const proxy = {
  solve: text.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] }).of(
          mi`y`,
          add(
            msub(mi`β`, mn(0)),
            mul0(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`β`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`β`, mn(3)), msubsup(mi`x`, mn(3), mo`*`)),
            mi`u`
          )
        ),
        eq.mtr({ pos: ['right', 'left'] }).of(
          msubsup(mi`x`, mn(3), mo`*`),
          add(
            msub(mi`δ`, mn(0)),
            mul0(msub(mi`δ`, mn(3)), msub(mi`x`, mn(3))),
            msub(mi`v`, mn(3))
          )
        ),
        eq.mtr({ pos: ['right', 'left'] }).of(
          mi`y`,
          add(
            add.paren(msub(mi`β`, mn(0)), mul0(msub(mi`β`, mn(3)), msub(mi`δ`, mn(0)))),
            mul0(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`β`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`β`, mn(3)), msub(mi`δ`, mn(3)), msub(mi`x`, mn(3))),
            mi`u`,
            mul0(msub(mi`β`, mn(3)), msub(mi`v`, mn(3)))
          )
        ),
        eq.mtr({ pos: ['right', 'left'] }).of(
          mi`y`,
          add(
            msub(mi`α`, mn(0)),
            mul0(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`β`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`α`, mn(3)), msub(mi`x`, mn(3))),
            mi`e`
          )
        ),
        eq.mtr({ pos: ['right', 'left'] }).of(
          mrow(
            mtext`where`,
            mspace(8),
            msub(mi`α`, mn(0))
          ),
          add.paren(msub(mi`β`, mn(0)), mul0(msub(mi`β`, mn(3)), msub(mi`δ`, mn(0))))
        ),
        eq.mtr({ pos: ['right', 'left'] }).of(
          mrow(
            mtext`and`,
            mspace(8),
            msub(mi`α`, mn(3))
          ),
          mul0(msub(mi`β`, mn(3)), msub(mi`δ`, mn(3)))
        )
      )
    ),
    doc.figcaption`Proxy variable solution`,
  ),
  assumption: text.figure(
    math(
      eq(
        call({ fn: mtext`E` }).of(op.cond(msubsup(mi`x`, mn(3), mo`*`), mrow(msub(mi`x`, mn(1)), op.comma(msub(mi`x`, mn(2)), msub(mi`x`, mn(3)))))),
        call({ fn: mtext`E` }).of(op.cond(msubsup(mi`x`, mn(3), mo`*`), msub(mi`x`, mn(3)))),
        add(
          msub(mi`δ`, mn(0)),
          mul0(msub(mi`δ`, mn(3)), msub(mi`x`, mn(3)))
        )
      )
    ),
    doc.figcaption`Proxy variable Assumptions`,
  ),
  summary: text.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left', 'left'] }).of(
          Expect(op.cond(
            msubsup(mi`x`, mi`j`, mo`*`),
            op.comma(msub(mi`x`, mn(1)), mo`⋯`, msub(mi`x`, mi`k`)),
          )),
          Expect(op.cond(msubsup(mi`x`, mi`j`, mo`*`), msub(mi`x`, mi`j`))),
          mn(0),
        ),
        eq.mtr({ pos: ['right', 'left', 'left'] }).of(
          CoVar(op.cond(msub(mi`x`, op.comma.sub(mn(1), mo`⋯`, mi`k`)), mi`v`)),
          CoVar(op.cond(msub(mi`x`, mi`j`), mi`v`)),
          mn(0),
        ),
      ),
    ),
    doc.figcaption`Summary of when we can use proxies`,
  ),
};

export const potentialOutcomes = {
  example: text.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] }).of(
          mrow(mi`y`, add.paren(mn(0))),
          add(
            msub(mi`μ`, mn(0)),
            mrow(mi`v`, add.paren(mn(0)))
          )
        ),
        eq.mtr({ pos: ['right', 'left'] }).of(
          mrow(mi`y`, add.paren(mn(1))),
          add(
            msub(mi`μ`, mn(1)),
            mrow(mi`v`, add.paren(mn(1)))
          )
        ),
        eq.mtr({ pos: ['right', 'left'] }).of(
          msub(mi`τ`, mi`ate`),
          op.minus(msub(mi`μ`, mn(1)), msub(mi`μ`, mn(0)))
        )
      )
    ),
    doc.figcaption`Counterfactual outcomes`,
  ),
  conditionalExpectations: text.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] }).of(
          call({ fn: mtext`E` }).of(op.cond(mrow(mi`v`, add.paren(mn(0))), mrow(mi`w`, op.comma(mi`x`)))),
          eq(
            call({ fn: mtext`E` }).of(op.cond(mrow(mi`v`, add.paren(mn(0))), mi`x`)),
            mul0(minus.paren(mi`x`, call({ fn: mtext`E` }).of(mi`x`)), msub(mi`β`, mn(0)))
          ),
        ),
        eq.mtr({ pos: ['right', 'left'] }).of(
          call({ fn: mtext`E` }).of(op.cond(mrow(mi`v`, add.paren(mn(1))), mrow(mi`w`, op.comma(mi`x`)))),
          eq(
            call({ fn: mtext`E` }).of(op.cond(mrow(mi`v`, add.paren(mn(1))), mi`x`)),
            mul0(minus.paren(mi`x`, call({ fn: mtext`E` }).of(mi`x`)), msub(mi`β`, mn(1)))
          ),
        )
      )
    ),
    doc.figcaption`Conditional expectations of potential outcomes`,
  ),
};

export const measurementError = {
  model: {
    dependentVar: text.figure(
      math(
        eq(
          msup(mi`y`, mo`*`),
          add(
            msub(mi`β`, mn(0)),
            mul0(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`β`, mn(2)), msub(mi`x`, mn(2))),
            mo`⋯`,
            mul0(msub(mi`β`, mi`j`), msub(mi`x`, mi`j`)),
            mi`u`
          )
        )
      ),
      doc.figcaption`Measurement error in${doc.br()}Dependent Variable`,
    ),
    dependentVarControlled: text.figure(
      math(
        mtable(
          eq.mtr({ pos: ['right', 'left'] }).of(
            mrow(mo`∵`, mspace(8), msup(mi`y`, mo`*`)),
            minus(mi`y`, msub(mi`e`, mn(0)))
          ),
          eq.mtr({ pos: ['right', 'left'] }).of(
            mi`y`,
            add(
              msub(mi`β`, mn(0)),
              mul0(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
              mul0(msub(mi`β`, mn(2)), msub(mi`x`, mn(2))),
              mo`⋯`,
              mul0(msub(mi`β`, mi`j`), msub(mi`x`, mi`j`)),
              mi`u`,
              msub(mi`e`, mn(0)),
            )
          )
        ),
      ),
      doc.figcaption`Measurement error in${doc.br()}Dependent Variable`,
    ),
    explanatoryVar: text.figure(
      math(
        eq(
          mi`y`,
          add(
            msub(mi`β`, mn(0)),
            mul0(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            mo`⋯`,
            mul0(msub(mi`β`, mi`j`), msubsup(mi`x`, mi`j`, mo`*`)),
            mo`⋯`,
            mul0(msub(mi`β`, mi`k`), msub(mi`x`, mi`k`)),
            mi`u`
          )
        )
      ),
      doc.figcaption`Measurement error in${doc.br()}Explanatory Variable`,
    ),
    explanatoryVarSolved: text.figure(
      math(
        eq(
          mi`y`,
          add(
            msub(mi`β`, mn(0)),
            mul0(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            mo`⋯`,
            mul0(msub(mi`β`, mi`j`), msub(mi`x`, mi`j`)),
            mo`⋯`,
            mul0(msub(mi`β`, mi`k`), msub(mi`x`, mi`k`)),
            minus.paren(mi`u`, mul0(msub(mi`β`, mi`j`), msub(mi`e`, mi`j`))),
          ),
        )
      ),
      doc.figcaption`Implications of measurement error assumptions`,
    ),
  },
  error: {
    dependentVar: text.figure(
      math(
        eq(
          msub(mi`e`, mn(0)),
          minus(mi`y`, msup(mi`y`, mo`*`)),
        )
      ),
      doc.figcaption`Measurement error in${doc.br()}Dependent Variable`,
    ),
    dependentVarRandomDraw: text.figure(
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
    dependentVarLog: text.figure(
      math({ style: '--fontsize-math-m: 14px' }).of(
        mtable(
          eq.mtr({ pos: ['right', 'left' ] }).of(
            Log(mi`y`),
            add(Log(msup(mi`y`, mo`*`)), msub(mi`e`, mn(0))),
          ),
          eq.mtr({ pos: ['right', 'left' ] }).of(
            mi`y`,
            mul0(msup(mi`y`, mo`*`), msub(mi`a`, mn(0))),
          ),
          op.gt.mtr({ pos: ['right', 'left' ] }).of(
            msub(mi`a`, mn(0)),
            mn(0),
          ),
          eq.mtr({ pos: ['right', 'left' ] }).of(
            msub(mi`e`, mn(0)),
            Log(msub(mi`a`, mn(0))),
          ),
        ),
      ),
      doc.figcaption`Multiplicative measurment error`,
    ),
    explanatoryVar: text.figure(
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
    depVarErrorUnrelatedToExplanatoryVar: text.figure(
      math(
        op.gt(
          eq(
            call({ fn: mtext`Var` }).of(add(mi`u`, msub(mi`e`, mn(0)))),
            add(
              msubsup(mi`σ`, mi`u`, mn(2)),
              msubsup(mi`σ`, mn(0), mn(2)),
            ),
          ),
          msubsup(mi`σ`, mi`u`, mn(2)),
        ),
      ),
      doc.figcaption`Error uncorrelated to residual assumption`,
    ),
    expErrMean: text.figure(
      math(eq(Expect(msub(mi`e`, mi`j`)), mn(0))),
      doc.figcaption`Mean error${doc.br()}In population`,
    ),
    expErrMeanImplication: text.figure(
      math({ style: '--fontsize-math-m: 14px' }).of(
        table({ columnalign: 'left right center left' }).of(
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
    expErrCoVarA: text.figure(
      math(eq(call({ fn: mtext`CoVar` }).of(msub(mi`e`, mi`j`), msub(mi`x`, mi`j`)), mn(0))),
      doc.figcaption`E covariance with observed`,
    ),
    expErrCoVarB: text.figure(
      math(eq(call({ fn: mtext`CoVar` }).of(msub(mi`e`, mi`j`), msubsup(mi`x`, mi`j`, mo`*`)), mn(0))),
      doc.figcaption`E covariance with unobserved`,
    ),
    expErrCoVarAImplication: text.figure(
      math({ style: '--fontsize-math-m: 14px' }).of(
        table({ columnalign: 'left right center left' }).of(
          [mo`∵`, ...eq.array(
            call({ fn: mtext`CoVar` }).of(msub(mi`e`, mi`j`), msub(mi`x`, mi`j`)),
            mn(0),
          )],
          [mo`⇒`, ...op.gt.array(
            abs(call({ fn: mtext`CoVar` }).of(msub(mi`e`, mi`j`), msubsup(mi`x`, mi`j`, mo`*`))),
            mn(0),
          )],
        ),
        table({ columnalign: 'left right center left' }).of(
          [mo`∧`, ...eq.array(Expect(msub(mi`e`, mi`j`)), mn(0))],
          [mo`∧`, ...eq.array(
            msubsup(mi`x`, mi`j`, mo`*`),
            minus(msub(mi`x`, mi`j`), msub(mi`e`, mi`j`)),
          )],
        ),
      ),
      doc.figcaption`Implicaitons of Error covariance`,
    ),
    expErrCoVarA2: text.figure(
      math(
        eq(
          Variance(minus(mi`u`, mul0(msub(mi`β`, mi`j`), msub(mi`e`, mi`j`)))),
          add(
            msubsup(mi`σ`, mi`u`, mn(2)),
            mul0(
              msubsup(mi`β`, mi`j`, mn(2)),
              msubsup(mi`σ`, msub(mi`e`, mi`j`), mn(2)),
            ),
          ),
        ),
      ),
      doc.figcaption`Variance of error`,
    ),
    expErrCoVarB2: text.figure(
      math(
        op.imply(
          eq(call({ fn: mtext`CoVar` }).of(msub(mi`e`, mi`j`), msubsup(mi`x`, mi`j`, mo`*`)), mn(0)),
          eq(msub(mi`x`, mi`j`), add(msubsup(mi`x`, mi`j`, mo`*`), msub(mi`e`, mi`j`))),
        ),
      ),
      doc.figcaption`E covariance with unobserved`,
    ),
    expErrCoVarB3: text.figure(
      math(
        eq(
          call({ fn: mtext`CoVar` }).of(msub(mi`e`, mi`j`), msub(mi`x`, mi`j`)),
          Expect(mul0(msub(mi`e`, mi`j`), msub(mi`x`, mi`j`))),
          add(
            Expect(mul0(msub(mi`e`, mi`j`), msubsup(mi`x`, mi`j`, mo`*`))),
            Expect(msubsup(mi`e`, mi`j`, mn(2))),
          ),
          add(
            mn(0),
            msubsup(mi`σ`, msub(mi`e`, mi`j`), mn(2)),
          ),
          msubsup(mi`σ`, msub(mi`e`, mi`j`), mn(2)),
        ),
      ),
      doc.figcaption`Variance under CEV assumption`,
    ),
  },
  cev: {
    covariance: text.figure(
      math(
        eq(
          call({ fn: mtext`Cov` }).of(msub(mi`x`, mi`j`), minus(mi`u`, mul0(msub(mi`β`, mi`j`), msub(mi`e`, mi`j`)))),
          mul0(neg(msub(mi`β`, mi`j`)), call({ fn: mtext`Cov` }).of(msub(mi`x`, mi`j`), msub(mi`e`, mi`j`))),
          mul0(neg(msub(mi`β`, mi`j`)), msubsup(mi`σ`, msub(mi`e`, mi`j`), mn(2)))
        )
      ),
      doc.figcaption`Covar between xⱼ and composite error`,
    ),
    plim: text.figure(
      math(
        mtable(
          eq.mtr({ pos: ['right', 'left'] }).of(
            mrow(mi`plim`, add.paren(msub(mi`β̂`, mi`j`))),
            add(
              msub(mi`β`, mi`j`),
              mfrac(
                call({ fn: mtext`Cov` }).of(msub(mi`x`, mi`j`), minus(mi`u`, mul0(msub(mi`β`, mi`j`), msub(mi`e`, mi`j`)))),
                call({ fn: mtext`Var` }).of(msub(mi`x`, mi`j`))
              )
            )
          ),
          eq.mtr({ pos: ['right', 'left'] }).of(
            mrow(),
            minus(
              msub(mi`β`, mi`j`),
              mfrac(
                mul0(msub(mi`β`, mi`j`), msubsup(mi`σ`, msub(mi`e`, mi`j`), mn(2))),
                add(msubsup(mi`σ`, msub(mi`x`, mi`j`), mrow(mn(2), mo`*`)), msubsup(mi`σ`, msub(mi`e`, mi`j`), mn(2)))
              )
            )
          ),
          eq.mtr({ pos: ['right', 'left'] }).of(
            mrow(),
            mul0(
              msub(mi`β`, mi`j`),
              minus.paren(
                mn(1),
                mfrac(
                  msubsup(mi`σ`, msub(mi`e`, mi`j`), mn(2)),
                  add(msubsup(mi`σ`, msub(mi`x`, mi`j`), mrow(mn(2), mo`*`)), msubsup(mi`σ`, msub(mi`e`, mi`j`), mn(2)))
                )
              )
            )
          ),
          eq.mtr({ pos: ['right', 'left'] }).of(
            mrow(),
            mul0(
              msub(mi`β`, mi`j`),
              parensA(
                mfrac(
                  msubsup(mi`σ`, msub(mi`x`, mi`j`), mrow(mn(2), mo`*`)),
                  add(msubsup(mi`σ`, msub(mi`x`, mi`j`), mrow(mn(2), mo`*`)), msubsup(mi`σ`, msub(mi`e`, mi`j`), mn(2)))
                )
              )
            )
          )
        )
      ),
      doc.figcaption`Probability limit under CEV`,
    ),
    plimSimplified: text.figure(
      math(
        eq(
          mrow(mi`plim`, add.paren(msub(mi`β̂`, mn(1)))),
          mul0(
            msub(mi`β`, mn(1)),
            parensA(
              mfrac(
                msubsup(mi`σ`, msub(mi`r`, mn(1)), mrow(mn(2), mo`*`)),
                add(msubsup(mi`σ`, msub(mi`r`, mn(1)), mrow(mn(2), mo`*`)), msubsup(mi`σ`, msub(mi`e`, mn(1)), mn(2)))
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
          mtd({ columnalign: 'right' }).of(mtext`where`),
          mtd({ columnalign: 'right' }).of(mi`r`),
          mtd({ columnalign: 'center' }).of(mo`=`),
          mtd({ columnalign: 'left' }).of(mtext`the population error ...`),
        ),
        mtr(
          mtd({ columnalign: 'right' }).of(mtext`in`),
          mtd({ columnalign: 'right' }).of(msubsup(mi`x`, mi`j`, mi`*`)),
          mtd({ columnalign: 'center' }).of(mo`=`),
          mtd({ columnalign: 'left' }).of(
            add(
              msub(mi`α`, mn(0)),
              mul0(msub(mi`α`, mn(1)), msub(mi`x`, mn(1))),
              mo`⋯`,
              mul0(msub(mi`α`, minus.sub(mi`k`, mn(1))), msub(mi`x`, minus.sub(mi`k`, mn(1)))),
              msubsup(mi`r`, mi`j`, mo`*`),
            ),
          ),
        ),
      ),
    ),
  },
};

export const missingData = {
  regression: text.figure(
    math(
      eq(
        msub(mi`y`, mi`i`),
        add(
          msub(mi`β`, mn(0)),
          mul0(msub(mi`β`, mn(1)), msub(mi`x`, mrow(mi`i`, mn(1)))),
          mo`⋯`,
          mul0(msub(mi`β`, mi`j`), msub(mi`x`, mrow(mi`i`, mi`j`))),
          mo`⋯`,
          mul0(msub(mi`β`, mi`k`), msub(mi`x`, mrow(mi`i`, mi`k`))),
          mul0(msub(mi`α`, mn(0)), msub(mi`Z`, mrow(mi`i`, mi`k`))),
          mul0(msub(mi`α`, mn(1)), msub(mi`m`, mrow(mi`i`, mi`k`))),
          mi`u`
        )
      )
    ),
    doc.figcaption`Regression with missing data indicators`,
  ),
};

export const lad = {
  lad: text.figure(
    math(
      mrow(
        munder(
          mi`min`,
          mrow(msub(mi`b`, mn(0)), op.comma(
            msub(mi`b`, mn(1)),
            mo`⋯`,
            msub(mi`b`, mi`k`),
          )),
        ),
        mspace(4),
        sum({ max: mi`n`, inc: eq.sub(mi`i`, mn(1)) }).of(
          abs(
            rows(
              minus(
                msub(mi`y`, mi`i`),
                msub(mi`b`, mn(0)),
                mul0(msub(mi`b`, mn(1)), msub(mi`x`, mrow(mi`i`, mn(1)))),
                mo`⋯`,
                mul0(msub(mi`b`, mi`k`), msub(mi`x`, mrow(mi`i`, mi`k`)))
              ),
            ),
          )
        ),
      )
    ),
    doc.figcaption`Least Absolute Deviations`,
  ),
  implication: text.figure(
    math({ style: '--fontsize-math-m: 14px' }).of(
      table({ columnalign: 'left right center left' }).of(
        [
          mo`∵`,
          call({ fn: mtext`log` }).of(mi`y`),
          mo`=`,
          add(
            msub(mi`β`, mn(0)),
            mul0(mi`x`, mi`β`),
            mi`u`
          )
        ],
        [
          mo`∧`,
          call({ fn: mtext`Med` }).of(op.cond(mi`u`, mi`x`)),
          mo`=`,
          mn(0)
        ],
        [
          mo`⇒`,
          call({ fn: mtext`Med`, paren: '[]' }).of(
            op.cond(call({ fn: mtext`log` }).of(mi`y`), mi`x`),
          ),
          mo`=`,
          add(
            msub(mi`β`, mn(0)),
            mul0(mi`x`, mi`β`)
          )
        ],
        [
          mo`∧`,
          call({ fn: mtext`Med` }).of(op.cond(mi`y`, mi`x`)),
          mo`=`,
          call({ fn: mtext`exp` }).of(
            add(
              msub(mi`β`, mn(0)),
              mul0(mi`x`, mi`β`)
            )
          )
        ],
      ),
    ),
    doc.figcaption`LAD monotonic transformations`,
  ),
};
