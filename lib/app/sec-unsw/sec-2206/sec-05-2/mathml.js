/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { mathml, doc } from '@app/prelude.js';
import { responsiveGridAutoRow, twoThree, twoColumns, container } from '@prelude-uni/layout.js';
import { text, todo } from '@prelude-uni/components.js';
import {
  rows, SPECIAL, call, op,
  parensB, parensA, sum, table,
} from '@prelude-uni/mathml.js';

const {
  msqrt, mspace, math, mi, mo, mtext,
  mrow, mn, msup, msub, msubsup, mover,
  mfrac, munderover, mtable,
} = mathml;
const { div, cond, mul0, eq, minus, add, comma } = op;
const { greek } = SPECIAL;

export const noop = text.figure(
  todo({}, 'Noop'),
  doc.figcaption`noop`,
);

export const homoskedasticity = text.figure(
  math(
    eq(
      call({ fn: mtext`Var` }).c(
        op.cond(
          mi`u`,
          mrow(msub(mi`x`, mn(1)), mo`...`, msub(mi`x`, mi`K`))
        )
      ),
      msup(greek.sigma, mn(2))
    )
  ),
  doc.figcaption`Homoskedasticity`,
);

export const unbiasedEstimatorUnderMlr5 = text.figure(
  math(
    eq(
      call({ fn: mover(mtext`Var`, mo`^`) }).c(
        msub(mi`β̂`, mn(1))
      ),
      mfrac(
        msup(mi`σ̂`, mn(2)),
        mrow(
          munderover(
            mo`Σ`,
            eq.sub(mi`i`, mn(1)),
            mi`N`
          ),
          msup(minus.paren(msub(mi`x`, mi`i`), mi`x̄`), mn(2))
        )
      )
    )
  ),
  doc.figcaption`Unbiased estimator under MLR.5`,
);

/**
 * @template {Function} F
 * @param {{ c: F }} helper
 * @returns {(...params: Parameters<F>) => ReturnType<F>}
 */
const bindOf = (helper) => {
  return helper.c.bind(helper);
};

const sumConst = bindOf(sum({ inc: eq.sub(mi`i`, mn(1)), max: mi`n` }));
const h = bindOf(call({ fn: mtext`h` }));
const SE = bindOf(call({ fn: mtext`SE` }));
const SD = bindOf(call({ fn: mtext`StdDev` }));
const Expect = bindOf(call({ fn: mtext`E` }));
const ExpectS = bindOf(call({ fn: mtext`E`, paren: '[]' }));
const varFun = bindOf(call({ fn: mtext`Var` }));
const varEstFun = bindOf(call({ fn: mover(mtext`Var`, mo`^`) }));

export const heteroskedasticRobostSENotes = {
  exampleModel: text.figure(
    math(
      eq(
        msub(mi`y`, mi`i`),
        add(
          msub(greek.beta, mn(0)),
          add(
            op.mul0(msub(greek.beta, mn(1)), msub(mi`x`, mi`i`)),
            msub(mi`u`, mi`i`)
          )
        )
      )
    ),
    doc.figcaption`Example Model`,
  ),
  varianceUnderHeteroskedasticity: text.figure(
    math(
      eq(
        varFun(op.cond(msub(mi`u`, mi`i`), msub(mi`x`, mi`i`))),
        msubsup(greek.sigma, mi`i`, mn(2))
      )
    ),
    doc.figcaption`Variance Under Heteroskedasticity`,
  ),
  estimateBeta1: text.figure(
    math(
      eq(
        msub(mi`β̂`, mn(1)),
        add(
          msub(greek.beta, mn(1)),
          mfrac(
            sumConst(
              op.mul0(
                minus.paren(msub(mi`x`, mi`i`), mi`x̄`),
                msub(mi`u`, mi`i`)
              )
            ),
            sumConst(
              msup(minus.paren(msub(mi`x`, mi`i`), mi`x̄`), mn(2))
            )
          )
        )
      )
    ),
    doc.figcaption`Estimate Beta 1`,
  ),
  withHomo: {
    sumOfSquares: text.figure(
      math({ style: 'font-size: 11px' }).c(
        eq(
          msubsup(mtext`SST`, mi`x`, mn(2)),
          sumConst(
            msup(minus.paren(msub(mi`x`, mi`i`), mi`x̄`), mn(2))
          )
        )
      ),
      doc.figcaption`Sum of Squares`,
    ),
    general: text.figure(
      math({ style: 'font-size: 11px' }).c(
        eq(
          varFun(msub(mi`β̂`, mn(1))),
          mfrac(
            sumConst(
              op.mul0(
                msup(minus.paren(msub(mi`x`, mi`i`), mi`x̄`), mn(2)),
                msubsup(greek.sigma, mi`i`, mn(2))
              )
            ),
            msubsup(mtext`SST`, mi`x`, mn(2)),
          )
        )
      ),
      doc.figcaption`Invalid Estimate Beta 1 Variance`,
    ),
  },
  withHetro: {
    convergence: text.figure(
      math({ style: 'font-size: 11px' }).c(
        eq(
          mrow(
            munderover(
              mi`lim`,
              mrow(mi`n`, mo`→`, mo`∞`),
              mrow()
            ),
            varFun(msub(mi`β̂`, mn(1))),
          ),
          mfrac(
            mrow(
              mtext`E`,
              parensB(
                op.mul0(
                  msup(minus.paren(msub(mi`x`, mi`i`), msub(greek.mu, mi`x`)), mn(2)),
                  msubsup(mi`u`, mi`i`, mn(2))
                )
              )
            ),
            msup(
              parensA(msubsup(greek.sigma, mi`x`, mn(2))),
              mn(2)
            )
          )
        )
      ),
      doc.figcaption`Convergence as n approaches infinity`,
    ),
    slr: text.figure(
      math(
        eq(
          varEstFun(msub(mi`β̂`, mn(1))),
          mfrac(
            sumConst(
              op.mul0(
                msup(minus.paren(msub(mi`x`, mi`i`), mi`x̄`), mn(2)),
                msubsup(mi`û`, mi`i`, mn(2))
              )
            ),
            msubsup(mtext`SST`, mi`x`, mn(2)),
          )
        )
      ),
      doc.figcaption`SLR: Estimate Beta 1 Variance`,
    ),
    mlr: text.figure(
      math(
        eq(
          varEstFun(msub(mi`β̂`, mn(1))),
          mfrac(
            sumConst(
              op.mul0(
                msubsup(mi`r̂`, mi`ij`, mn(2)),
                msubsup(mi`û`, mi`i`, mn(2))
              )
            ),
            msubsup(mtext`SSR`, mi`i`, mn(2)),
          )
        )
      ),
      doc.figcaption`MLR: Estimate Beta 1 Variance`,
    ),
    expr: text.figure(
      math({ style: 'font-size: 11px' }).c(
        mrow(
          eq(
            msub(mi`r̂`, mrow(mi`i`, mi`j`)),
            msub(mi`u`, mi`i`)
          ),
          mspace(8),
          mtext` from regressing `,
          mspace(8),
          msub(mi`x`, mi`j`),
        ),
      ),
      doc.figcaption`Expression for residuals`,
    ),
  },
  hetroRobustSE: text.figure(
    math(
      eq(
        SE(msub(mi`β̂`, mn(1))),
        msqrt(mfrac(
          sumConst(
            op.mul0(
              msubsup(mi`r̂`, mi`ij`, mn(2)),
              msubsup(mi`û`, mi`i`, mn(2))
            )
          ),
          msubsup(mtext`SSR`, mi`i`, mn(2)),
        )),
      )
    ),
    doc.figcaption`Heteroskedastic Robust Standard Error`,
  ),
  correction: math(
    mfrac(mi`n`, minus(mi`n`, mi`k`, mn(1))),
  ),
  ssrj: text.figure(
    math(
      eq(
        msub(mi`SSR`, mi`j`),
        mul0(
          msub(mi`SST`, mi`j`),
          minus.paren(mn(1), msubsup(mi`R`, mi`j`, mn(2))),
        ),
      ),
    ),
    doc.figcaption`Defining SSR${doc.sub`j`}`,
  ),
};

export const testingForHeteroskedasticity = {
  model: {
    uSquare: text.figure(
      math(
        eq(
          msup(mi`u`, mn(2)),
          add(
            msub(greek.delta, mn(0)),
            mul0(msub(greek.delta, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(greek.delta, mn(2)), msub(mi`x`, mn(2))),
            SPECIAL.ellipse.h2,
            mul0(msub(greek.delta, mi`k`), msub(mi`x`, mi`k`)),
            mi`v`
          )
        )
      ),
      doc.figcaption`Auxiliary regression model`,
    ),
    uSquareEst: text.figure(
      math(
        eq(
          msup(mi`û`, mn(2)),
          add(
            msub(greek.delta, mn(0)),
            mul0(msub(greek.delta, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(greek.delta, mn(2)), msub(mi`x`, mn(2))),
            SPECIAL.ellipse.h2,
            mul0(msub(greek.delta, mi`k`), msub(mi`x`, mi`k`)),
            mi`error`
          )
        )
      ),
      doc.figcaption`Estimated auxiliary regression model`,
    ),
  },
  fStat: {
    breucshPagan: text.figure(
      math(
        eq(
          mi`F`,
          mfrac(
            op.div(msubsup(mi`R`, msup(mi`û`, mn(2)), mn(2)), mi`k`),
            op.div(
              minus.paren(mn(1), msubsup(mi`R`, msup(mi`û`, mn(2)), mn(2))),
              minus.paren(mi`n`, mi`k`, mn(1))
            )
          )
        )
      ),
      doc.figcaption`F-statistic for Breusch-Pagan test`,
    ),
  },
  lm: {
    breucshPagan: text.figure(
      math(
        eq(
          mi`LM`,
          op.mul(
            mi`n`,
            msubsup(mi`R`, msup(mi`û`, mn(2)), mn(2)),
          )
        ),
      ),
      doc.figcaption`LM-statistic for Breusch-Pagan test`,
    ),
  },
  definition: {
    rSquaredResidualSquare: text.figure(
      math(msubsup(mi`R`, msup(mi`û`, mn(2)), mn(2))),
      doc.figcaption`R Squared from Residual Regression`,
    ),
  },
  hypothesis: {
    null: text.figure(
      math(
        table({ columnalign: 'right left' }).c(
          [
            mrow(msub(mi`H`, mn(0)), mo`:`),
            eq(
              varFun(op.cond(
                mi`u`,
                comma(
                  msub(mi`x`, mn(1)),
                  msub(mi`x`, mn(2)),
                  SPECIAL.ellipse.h2,
                  msub(mi`x`, mi`k`)
                )
              )),
              msup(greek.sigma, mn(2))
            )
          ],
          [
            mrow(msub(mi`H`, mn(0)), mo`:`),
            eq(
              Expect(op.cond(
                mi`u`,
                comma(
                  msub(mi`x`, mn(1)),
                  msub(mi`x`, mn(2)),
                  SPECIAL.ellipse.h2,
                  msub(mi`x`, mi`k`)
                )
              )),
              Expect(msup(mi`u`, mn(2))),
              msup(greek.sigma, mn(2))
            )
          ],
        )
      ),
      doc.figcaption`Two equilivant null hypothesises`,
    ),
    nullUSquare: text.figure(
      math(
        table({ columnalign: 'right left' }).c(
          [
            mrow(msub(mi`H`, mn(0)), mo`:`),
            eq(
              msub(greek.delta, mn(1)),
              msub(greek.delta, mn(2)),
              SPECIAL.ellipse.h2,
              msub(greek.delta, mi`k`),
              mn(0)
            )
          ]
        )
      ),
      doc.figcaption`Null hypothesis for auxiliary regression`,
    ),
  },
};

export const white1980 = {
  models: text.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] }).c(
          msup(mi`ŷ`, mn(2)),
          add(
            msub(mi`β̂`, mn(0)),
            mul0(msub(mi`β̂`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`β̂`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`β̂`, mn(3)), msub(mi`x`, mn(3))),
            mi`û`,
          ),
        ),
        eq.mtr({ pos: ['right', 'left'] }).c(
          msup(mi`û`, mn(2)),
          add(
            msub(mi`δ`, mn(0)),
            mul0(msub(mi`δ`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`δ`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`δ`, mn(3)), msub(mi`x`, mn(3))),
            mul0(msub(mi`δ`, mn(4)), msubsup(mi`x`, mn(1), mn(2))),
            mul0(msub(mi`δ`, mn(5)), msubsup(mi`x`, mn(2), mn(2))),
            mul0(msub(mi`δ`, mn(6)), msubsup(mi`x`, mn(3), mn(2))),
            mul0(msub(mi`δ`, mn(7)), msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
            mul0(msub(mi`δ`, mn(8)), msub(mi`x`, mn(1)), msub(mi`x`, mn(3))),
            mul0(msub(mi`δ`, mn(9)), msub(mi`x`, mn(3)), msub(mi`x`, mn(3))),
            mi`error`,
          ),
        ),
      ),
    ),
    doc.figcaption`K=3 and its white auxillary model`,
  ),
  simplified: text.figure(
    math(
      eq(
        msub(mi`û`, mn(2)),
        add(
          msub(mi`δ`, mn(0)),
          mul0(msub(mi`δ`, mn(1)), mi`ŷ`),
          mul0(msub(mi`δ`, mn(2)), msup(mi`ŷ`, mn(2))),
          mi`error`,
        ),
      ),
    ),
    doc.figcaption`White Auxillary Simplified`,
  ),
  null: text.figure(
    math(
      eq(
        mrow(mi`H`, mo`:`, mspace(4), msub(mi`δ`, mn(1))),
        msub(mi`δ`, mn(2)),
        mn(0),
      ),
    ),
    doc.figcaption`White null hypothesis`,
  ),
};

/** @param {E.Item} a */
const hFrac = a => mfrac(a, msub(mi`h`, mi`i`));

/** @param {E.Item} a */
const hSqrtFrac = a => mfrac(a, msqrt(msub(mi`h`, mi`i`)));

export const wls = {
  variance: {
    residual: text.figure(
      math(
        mtable(
          eq.mtr({ pos: ['right', 'left'] }).c(
            varFun(cond(mi`u`, mi`x`)),
            mul0(msup(mi`σ`, mn(2)), h(mi`x`)),
          ),
          op.gt.mtr({ pos: ['right', 'left'] }).c(h(mi`x`), mn(0)),
        ),
      ),
      doc.figcaption`Var(u) under Heteroskedacity`,
    ),
    populationRandomDraw: text.figure(
      math(
        eq(
          msubsup(greek.sigma, mi`i`, mn(2)),
          varFun(cond(msub(mi`u`, mi`i`), msub(mi`x`, mi`i`))),
          mul0(msup(greek.sigma, mn(2)), h(msub(mi`x`, mi`i`))),
          mul0(msup(greek.sigma, mn(2)), msub(mi`h`, mi`i`))
        )
      ),
      doc.figcaption`Population variance with heteroskedasticity`,
    ),
    solveForResidualVariance: text.figure(
      math(
        eq(
          SD(cond(msub(mi`u`, mi`i`), msub(mi`x`, mi`i`))),
          mul0(mi`σ`, msqrt(msub(mi`x`, mi`i`))),
        ),
      ),
      doc.figcaption`Conditional Residual Variance`,
    ),
  },
  model: {
    solve: text.figure(
      math(
        mtable(
          eq.mtr({ pos: ['right', 'left'] }).c(
            mrow(
              mo`∵`, mspace(8),
              varFun(cond(msub(mi`u`, mi`i`), msub(mi`x`, mi`i`))),
            ),
            eq(
              Expect(cond(msubsup(mi`u`, mi`i`, mn(2)), msub(mi`x`, mi`i`))),
              mul0(msup(mi`σ`, mn(2)), msub(mi`h`, mi`i`)),
            ),
          ),
          eq.mtr({ pos: ['right', 'left'] }).c(
            ExpectS(msup(parensA(mfrac(msub(mi`u`, mi`i`), msqrt(msub(mi`h`, mi`i`)))), mn(2))),
            eq(
              hFrac(Expect(msubsup(mi`u`, mi`i`, mn(2)))),
              hFrac(mul0.paren(msup(mi`σ`, mn(2)), msub(mi`h`, mi`i`))),
              msup(mi`σ`, mn(2)),
            ),
          ),
          eq.mtr({ pos: ['right', 'left'] }).c(
            hSqrtFrac(msub(mi`y`, mi`i`)),
            add(
              hSqrtFrac(msub(mi`β`, mn(0))),
              mul0(msub(mi`β`, mn(1)), hSqrtFrac(msub(mi`x`, mrow(mi`i`, mspace(1), mn(1))))),
              mul0(msub(mi`β`, mn(2)), hSqrtFrac(msub(mi`x`, mrow(mi`i`, mspace(1), mn(2))))),
              mo`⋯`,
              mul0(msub(mi`β`, mi`k`), hSqrtFrac(msub(mi`x`, mrow(mi`i`, mspace(1), mi`k`)))),
              hSqrtFrac(msub(mi`u`, mi`i`)),
            ),
          ),
          eq.mtr({ pos: ['right', 'left'] }).c(
            msubsup(mi`y`, mi`i`, mo`*`),
            add(
              mul0(msub(mi`β`, mn(0)), msubsup(mi`x`, mrow(mi`i`, mn(0)), mo`*`)),
              mul0(msub(mi`β`, mn(1)), msubsup(mi`x`, mrow(mi`i`, mn(1)), mo`*`)),
              mul0(msub(mi`β`, mn(2)), msubsup(mi`x`, mrow(mi`i`, mn(2)), mo`*`)),
              mo`⋯`,
              mul0(msub(mi`β`, mi`k`), msubsup(mi`x`, mrow(mi`i`, mi`k`), mo`*`)),
              msubsup(mi`u`, mi`i`, mo`*`),
            ),
          ),
          eq.mtr({ pos: ['right', 'left'] }).c(
            mrow(
              mtext`Where`, mspace(24),
              mul0(msub(mi`β`, mn(0)), msubsup(mi`x`, mrow(mi`i`, mn(0)), mo`*`)),
            ),
            hSqrtFrac(mn(1)),
          ),
        ),
      ),
      doc.figcaption`Solving for GLS`,
    ),
  },
  constraints: {
    original: text.figure(
      math(
        mfrac(
          sumConst(
            msup(
              minus.paren(
                msub(mi`y`, mi`i`),
                msub(mi`b`, mn(0)),
                mul0(msub(mi`b`, mn(1)), msub(mi`x`, mrow(mi`i`, mn(1)))),
                mul0(msub(mi`b`, mn(2)), msub(mi`x`, mrow(mi`i`, mn(2)))),
                SPECIAL.ellipse.h2,
                mul0(msub(mi`b`, mi`k`), msub(mi`x`, mrow(mi`i`, mi`k`)))
              ),
              mn(2)
            )
          ),
          msub(mi`h`, mi`i`)
        )
      ),
      doc.figcaption`WLS objective function`,
    ),
    transformed: text.figure(
      math(
        sumConst(
          msup(
            minus.paren(
              msubsup(mi`y`, mi`i`, mo`*`),
              mul0(msub(mi`b`, mn(0)), msubsup(mi`x`, mrow(mi`i`, mn(0)), mo`*`)),
              mul0(msub(mi`b`, mn(1)), msubsup(mi`x`, mrow(mi`i`, mn(1)), mo`*`)),
              mul0(msub(mi`b`, mn(2)), msubsup(mi`x`, mrow(mi`i`, mn(2)), mo`*`)),
              SPECIAL.ellipse.h2,
              mul0(msub(mi`b`, mi`k`), msubsup(mi`x`, mrow(mi`i`, mi`k`), mo`*`))
            ),
            mn(2)
          )
        )
      ),
      doc.figcaption`WLS transformed objective function`,
    ),
  },
};

export const fgls = {
  assumption: text.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] }).c(
          varFun(cond(mi`u`, mi`x`)),
          mul0(
            msup(greek.sigma, mn(2)),
            call({ fn: mtext`exp` }).c(
              add(
                msub(greek.delta, mn(0)),
                mul0(msub(greek.delta, mn(1)), msub(mi`x`, mn(1))),
                mul0(msub(greek.delta, mn(2)), msub(mi`x`, mn(2))),
                SPECIAL.ellipse.h2,
                mul0(msub(greek.delta, mi`k`), msub(mi`x`, mi`k`))
              )
            )
          )
        ),
        eq.mtr({ pos: ['right', 'left'] }).c(
          h(mi`x`),
          mul0(
            call({ fn: mtext`exp` }).c(
              add(
                msub(greek.delta, mn(0)),
                mul0(msub(greek.delta, mn(1)), msub(mi`x`, mn(1))),
                mul0(msub(greek.delta, mn(2)), msub(mi`x`, mn(2))),
                SPECIAL.ellipse.h2,
                mul0(msub(greek.delta, mi`k`), msub(mi`x`, mi`k`))
              )
            )
          )
        )
      ),
    ),
    doc.figcaption`FGLS variance assumption`,
  ),
  linearForm: text.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] }).c(
          msup(mi`u`, mn(2)),
          mul0(
            msup(greek.sigma, mn(2)),
            call({ fn: mtext`exp` }).c(
              add(
                msub(greek.delta, mn(0)),
                mul0(msub(greek.delta, mn(1)), msub(mi`x`, mn(1))),
                mul0(msub(greek.delta, mn(2)), msub(mi`x`, mn(2))),
                SPECIAL.ellipse.h2,
                mul0(msub(greek.delta, mi`k`), msub(mi`x`, mi`k`))
              )
            ),
            mi`v`
          )
        ),
        eq.mtr({ pos: ['right', 'left'] }).c(
          call({ fn: mtext`log` }).c(msup(mi`u`, mn(2))),
          add(
            msub(greek.alpha, mn(0)),
            mul0(msub(greek.delta, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(greek.delta, mn(2)), msub(mi`x`, mn(2))),
            SPECIAL.ellipse.h2,
            mul0(msub(greek.delta, mi`k`), msub(mi`x`, mi`k`)),
            mi`e`
          )
        )
      )
    ),
    doc.figcaption`FGLS linear form`,
  ),
  estimate: text.figure(
    math(
      eq(
        msub(mi`ĥ`, mi`i`),
        call({ fn: mtext`exp` }).c(msub(mi`ĝ`, mi`i`)),
      ),
    ),
    doc.figcaption`Estimated HetroSkedascity`,
  ),
  alternative: text.figure(
    math(
      eq(
        call({ fn: mtext`log` }).c(msup(mi`û`, mn(2))),
        add(
          msub(greek.alpha, mn(0)),
          mul0(msub(greek.delta, mn(1)), msub(mi`ŷ`, mn(1))),
          mul0(msub(greek.delta, mn(2)), msubsup(mi`ŷ`, mn(2), mn(2))),
          mi`e`
        )
      )
    ),
    doc.figcaption`Alternative method`,
  ),
};
