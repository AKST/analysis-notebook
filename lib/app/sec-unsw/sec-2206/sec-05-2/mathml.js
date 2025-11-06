/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { mathml, doc } from '@app/prelude.js';
import { responsiveGridAutoRow, twoThree, twoColumns, container } from '@prelude-uni/layout.js';
import { todo } from '@prelude-uni/components.js';
import {
  rows, SPECIAL, call, op,
  parensB, parensA, sum, table,
} from '@prelude-uni/mathml.js';

const {
  msqrt, mspace, math, mi, mo, mtext,
  mrow, mn, msup, msub, msubsup, mover,
  mfrac, munderover, mtable,
} = mathml;
const { mul0, eq, minus, add, comma } = op;
const { greek } = SPECIAL;

export const noop = doc.figure(
  todo({}, 'Noop'),
  doc.figcaption`noop`,
);

export const homoskedasticity = doc.figure(
  math(
    eq(
      call.attr({ fn: mtext`Var` })(
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

export const unbiasedEstimatorUnderMlr5 = doc.figure(
  math(
    eq(
      call.attr({ fn: mover(mtext`Var`, mo`^`) })(
        msub(mi`𝛽̂`, mn(1))
      ),
      mfrac(
        msup(mi`𝜎̂`, mn(2)),
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

const sumConst = sum({ inc: eq(mi`i`, mn(1)), max: mi`n` });
const SE = call({ fn: mtext`SE` });
const Expect = call({ fn: mtext`E` });
const varFun = call({ fn: mtext`Var` });
const varEstFun = call({ fn: mover(mtext`Var`, mo`^`) });

export const heteroskedasticRobostSENotes = {
  exampleModel: doc.figure(
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
  varianceUnderHeteroskedasticity: doc.figure(
    math(
      eq(
        varFun(op.cond(msub(mi`u`, mi`i`), msub(mi`x`, mi`i`))),
        msubsup(greek.sigma, mi`i`, mn(2))
      )
    ),
    doc.figcaption`Variance Under Heteroskedasticity`,
  ),
  estimateBeta1: doc.figure(
    math(
      eq(
        msub(mi`𝛽̂`, mn(1)),
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
    sumOfSquares: doc.figure(
      math({ style: 'font-size: 11px' })(
        eq(
          msubsup(mtext`SST`, mi`x`, mn(2)),
          sumConst(
            msup(minus.paren(msub(mi`x`, mi`i`), mi`x̄`), mn(2))
          )
        )
      ),
      doc.figcaption`Sum of Squares`,
    ),
    general: doc.figure(
      math({ style: 'font-size: 11px' })(
        eq(
          varFun(msub(mi`𝛽̂`, mn(1))),
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
    convergence: doc.figure(
      math({ style: 'font-size: 11px' })(
        eq(
          mrow(
            munderover(
              mi`lim`,
              mrow(mi`n`, mo`→`, mo`∞`),
              mrow()
            ),
            varFun(msub(mi`𝛽̂`, mn(1))),
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
    slr: doc.figure(
      math(
        eq(
          varEstFun(msub(mi`𝛽̂`, mn(1))),
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
    mlr: doc.figure(
      math(
        eq(
          varEstFun(msub(mi`𝛽̂`, mn(1))),
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
    expr: doc.figure(
      math({ style: 'font-size: 11px' })(
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
  hetroRobustSE: doc.figure(
    math(
      eq(
        SE(msub(mi`𝛽̂`, mn(1))),
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
  ssrj: doc.figure(
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
    uSquare: doc.figure(
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
    uSquareEst: doc.figure(
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
    breucshPagan: doc.figure(
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
    breucshPagan: doc.figure(
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
    rSquaredResidualSquare: doc.figure(
      math(msubsup(mi`R`, msup(mi`û`, mn(2)), mn(2))),
      doc.figcaption`R Squared from Residual Regression`,
    ),
  },
  hypothesis: {
    null: doc.figure(
      math(
        table({ columnalign: 'right left' })(
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
    nullUSquare: doc.figure(
      math(
        table({ columnalign: 'right left' })(
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
  models: doc.figure(
    math(
      mtable(
        eq.mtr({ pos: ['right', 'left'] })(
          msup(mi`ŷ`, mn(2)),
          add(
            msub(mi`𝛽̂`, mn(0)),
            mul0(msub(mi`𝛽̂`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`𝛽̂`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`𝛽̂`, mn(3)), msub(mi`x`, mn(3))),
            mi`û`,
          ),
        ),
        eq.mtr({ pos: ['right', 'left'] })(
          msup(mi`û`, mn(2)),
          add(
            msub(mi`𝛿`, mn(0)),
            mul0(msub(mi`𝛿`, mn(1)), msub(mi`x`, mn(1))),
            mul0(msub(mi`𝛿`, mn(2)), msub(mi`x`, mn(2))),
            mul0(msub(mi`𝛿`, mn(3)), msub(mi`x`, mn(3))),
            mul0(msub(mi`𝛿`, mn(4)), msubsup(mi`x`, mn(1), mn(2))),
            mul0(msub(mi`𝛿`, mn(5)), msubsup(mi`x`, mn(2), mn(2))),
            mul0(msub(mi`𝛿`, mn(6)), msubsup(mi`x`, mn(3), mn(2))),
            mul0(msub(mi`𝛿`, mn(7)), msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
            mul0(msub(mi`𝛿`, mn(8)), msub(mi`x`, mn(1)), msub(mi`x`, mn(3))),
            mul0(msub(mi`𝛿`, mn(9)), msub(mi`x`, mn(3)), msub(mi`x`, mn(3))),
            mi`error`,
          ),
        ),
      ),
    ),
    doc.figcaption`K=3 and its white auxillary model`,
  ),
  simplified: doc.figure(
    math(
      eq(
        msub(mi`û`, mn(2)),
        add(
          msub(mi`𝛿`, mn(0)),
          mul0(msub(mi`𝛿`, mn(1)), mi`ŷ`),
          mul0(msub(mi`𝛿`, mn(2)), msup(mi`ŷ`, mn(2))),
          mi`error`,
        ),
      ),
    ),
    doc.figcaption`White Auxillary Simplified`,
  ),
  null: doc.figure(
    math(
      eq(
        mrow(mi`H`, mo`:`, mspace(4), msub(mi`𝛿`, mn(1))),
        msub(mi`𝛿`, mn(2)),
        mn(0),
      ),
    ),
    doc.figcaption`White null hypothesis`,
  ),
};
