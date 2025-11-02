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

const { msqrt, mspace, math, mi, mo, mtext, mrow, mn, msup, msub, msubsup, mover, mfrac, munderover } = mathml;
const { mul0, eq, minus, add } = op;
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
