import { mathml } from '../../prelude.js';
import * as mathmlHelper2 from '../../../base/preludes/university/mathml_2.js';

const { mi, mo, mtext, mrow, mover, mn, msub, msup, msubsup, msqrt, munder, mspace, mfrac } = mathml;
const { piecewise, rows, annotationOver, sum, parensA, call, inv } = mathmlHelper2;
const {
  ellipse,
  rel: { exists, neq },
  greek: { alpha, eplison, ...greek },
  operation: { dot, plusMinus },
} = mathmlHelper2.SPECIAL;

const EST_Y = mi`ŷ`;
const EST_Y_MEAN = mi`ȳ`;
const EST_X_MEAN = mi`X̄`;
const EST_BETA = greek.circumflex.beta;
const EST_SKEW = greek.circumflex.gamma;
const EST_MEAN = greek.circumflex.mu;
const EST_SDEV = greek.circumflex.sigma;

export const meanFormular = mathml.math(mrow(
  msub(EST_MEAN, mi`x`), mo`=`, inv(mi`T`),
  sum(mi`T`, mrow(mi`i`, mo`=`, mn(1))),
  parensA(msub(mi`x`, mi`i`)),
));

export const varFormular = mathml.math(mrow(
  msubsup(EST_SDEV, mi`x`, mn(2)),
  mo`=`, inv(mi`T`),
  sum(mi`T`, mrow(mi`i`, mo`=`, mn(1))),
  msup(parensA(
    msub(mi`x`, mi`i`), mo`-`, msub(EST_MEAN, mi`x`),
  ), mn(2)),
));

export const stddevFormular = mathml.math(mrow(
  msub(EST_SDEV, mi`x`), mo`=`,
  msqrt(mrow(
    inv(mi`T`), sum(mi`T`, mrow(mi`i`, mo`=`, mn(1))),
    msup(parensA(
      msub(mi`x`, mi`i`), mo`-`, msub(EST_MEAN, mi`x`)
    ), mn(2)),
  )),
));

export const skewness = mathml.math(mrow(
  msub(EST_SKEW, mi`x`), mo`=`,
  inv(parensA(mi`T`, mo`-`, mn(1))),
  sum(mi`T`, mrow(mi`i`, mo`=`, mn(1))),
  msup(parensA(mfrac(
    mrow(msub(mi`x`, mi`i`), mo`-`, msub(EST_MEAN, mi`x`)),
    msub(EST_SDEV, mi`x`),
  )), mn(3)),
));

export const generalModel = mathml.math(mrow(
  msub(mi`y`, mi`i`), mo`=`,
  call.attr({ fn: mi`f` })(msub(mi`x`, mi`i`)), mo`+`,
  msub(eplison, mi`i`)
));

export const ordinaryLeastSquares = mathml.math(mrow(
  msub(EST_Y, mi`i`), mo`=`,
  msub(EST_BETA, mn(0)), mo`+`,
  msub(EST_BETA, mn(1)), msub(mi`X`, mn(1)), mo`+`,
  msub(EST_BETA, mn(2)), msub(mi`X`, mn(2)), mo`+`,
  ellipse.h,
  mo`+`, msub(EST_BETA, mi`n`), msub(mi`X`, mi`n`),
));

export const confinenceInterval = mathml.math(mrow(
  msub(EST_BETA, mn(1)), plusMinus, mn(1.96), dot,
  call.attr({ fn: mtext`SE` })(msub(EST_BETA, mn(1))),
));

export const confinenceInterval2 = mathml.math(rows(
  mrow(
    msub(EST_Y, mi`new`), plusMinus,
    msub(mi`t`, mrow(alpha, mo`/`, mn(2))),
    dot, msub(mi`SE`, mi`mean`),
  ),
  mspace(0),
  mrow(
    msub(mi`SE`, mi`mean`), mo`=`,
    msqrt(mrow(
      msup(mi`SE`, mn(2)), dot, parensA(
        mn(1), mo`+`, inv(mi`n`), mo`+`,
        mfrac(
          msup(parensA(msub(mi`X`, mi`new`), mo`-`, EST_X_MEAN), mn(2)),
          mrow(
            sum(mi`n`, mrow(mi`i`, mo`=`, mn(1))),
            msup(parensA(msub(mi`X`, mi`i`), mo`-`, EST_X_MEAN), mn(2)),
          )
        ),
      ),
    )),
  ),
));

export const predictionInterval = mathml.math(rows(
  mrow(
    msub(EST_Y, mi`new`), plusMinus,
    msub(mi`t`, mrow(alpha, mo`/`, mn(2))),
    dot, msub(mi`SE`, mi`pred`),
  ),
  mspace(0),
  mrow(
    msub(mi`SE`, mi`pred`), mo`=`,
    msqrt(mrow(
      msup(mi`SE`, mn(2)), dot, call.attr({ fn: mtext`Var` })(msub(EST_Y, mi`new`)),
    )),
  ),
));

export const hypothesisTests = mathml.math(rows(
  mover(mrow(
    msub(mi`H`, mn(0)), mo`:`, mspace(8),
    msub(greek.beta, mn(1)), mo`=`, mn(0),
    mspace(16), mtext`There is no relation`,
  ), mtext`Null hypothesis`),
  mspace(8),
  mover(mrow(
    msub(mi`H`, mn(1)), mo`:`, mspace(8),
    msub(greek.beta, mn(1)), neq, mn(0),
    mspace(16), mtext`There is some relation`,
  ), mtext`Alternative Hypothesis`),
));

export const modelFit = mathml.math(mrow(
  mover(mrow(
    sum(mi`n`, mrow(mi`i`, mo`=`, mn(0))),
    msup(parensA(
      msub(mi`y`, mi`i`), mspace(4),
      mo`-`, mspace(4),EST_Y_MEAN
    ), mn(2)),
  ), rows(
    mtext`Total Sum of squares (TSS)`,
    mtext`Total Variance of Response`,
  )),
  mo`=`,
  mover(mrow(
    mspace(8),
    parensA(
      mrow(
        sum(mi`n`, mrow(mi`i`, mo`=`, mn(0))),
        msup(parensA(
          msub(mi`y`, mi`i`), mspace(4),
          mo`-`, mspace(4), EST_Y_MEAN
        ), mn(2)),
      ),
      mo`-`,
      mrow(
        sum(mi`n`, mrow(mi`i`, mo`=`, mn(0))),
        msup(parensA(
          msub(mi`y`, mi`i`), mspace(4),
          mo`-`, mspace(4), EST_Y
        ), mn(2)),
      ),
    ),
    mspace(8),
  ), rows(
    mtext`Variablity explained by`,
    mtext`the regression (ESS)`,
  )),
  mo`+`,
  mover(mrow(
    mspace(8),
    sum(mi`n`, mrow(mi`i`, mo`=`, mn(0))),
    msup(parensA(
      msub(mi`y`, mi`i`), mspace(4),
      mo`-`, mspace(4), EST_Y
    ), mn(2)),
  ), rows(
    mtext`Residual sum of`,
    mtext`Squares (RSS)`,
  )),
));

export const rSquared = mathml.math(mrow(
  mover(msup(mi`R`, mn(2)), mtext`R Squared`), mo`=`,
  mfrac(mrow(mi`TSS`, mo`-`, mo`RSS`), mi`TSS`), mo`=`,
  mfrac(
    mo`RSS`,
    mi`TSS`,
  ),
));

export const mse = mathml.math(mrow(
  mi`MSE`, mo`=`,
  inv(mi`n`),
  sum(mi`n`, mrow(mi`i`, mo`=`, mn(1))),
  msup(parensA(
    msub(mi`y`, mi`i`), mo`-`,
    call.attr({ fn: mi`𝑓̂` })(msub(mi`x`, mi`i`)),
  ), mn(2)),
  mo`=`,
  inv(mi`n`),
  sum(mi`n`, mrow(mi`i`, mo`=`, mn(1))),
  msup(parensA(
    msub(mi`y`, mi`i`), mo`-`,
    msub(mi`ŷ`, mi`i`),
  ), mn(2)),
));

export const testMse = mathml.math(mrow(
  msub(mi`MSE`, mtext`test`), mo`=`,
  inv(mi`n`),
  sum(mspace(0), mrow(mi`i`, exists, mtext`Test Data`)),
  msup(parensA(
    msub(mi`y`, mi`i`), mo`-`,
    msub(mi`ŷ`, mi`i`),
  ), mn(2)),
));

export const logisticRegressionSimple = mathml.math(mrow(
  call.attr({ fn: mi`p` })(mi`X`), mo`=`,
  call.attr({ fn: mi`P` })(mi`Y`, mo`=`, mn(1), mo`|`, mi`X`),
));

export const logisticRegression = mathml.math(mrow(
  call.attr({ fn: mi`p` })(mi`X`), mo`=`,
  mfrac(
    call.attr({ fn: mtext`exp` })(mrow(
      msub(EST_BETA, mn(0)), mo`+`,
      msub(EST_BETA, mn(1)), msub(mi`X`, mn(1)), mo`+`,
      msub(EST_BETA, mn(2)), msub(mi`X`, mn(2)), mo`+`,
      ellipse.h,
      mo`+`, msub(EST_BETA, mi`n`), msub(mi`X`, mi`n`),
    )),
    mrow(
      mn(1), mo`+`,
      call.attr({ fn: mtext`exp` })(mrow(
        msub(EST_BETA, mn(0)), mo`+`,
        msub(EST_BETA, mn(1)), msub(mi`X`, mn(1)), mo`+`,
        msub(EST_BETA, mn(2)), msub(mi`X`, mn(2)), mo`+`,
        ellipse.h,
        mo`+`, msub(EST_BETA, mi`n`), msub(mi`X`, mi`n`),
      )),
    )
  ),
));

export const classificationAccuracy = mathml.math(mrow(
  mtext`Accuracy Rate`, mo`=`, mfrac(
    mtext`Correct Predictions`,
    mtext`Number of Observations`,
  ),
));

export const exampleOfClassificationModel = mathml.math(mrow(
  msub(EST_Y, mi`i`), mo`=`,
  piecewise(
    { then: mn(1), cond: mrow(msub(mi`P̂`, mi`i`), mo`>`, mn(0.5)) },
    { then: mn(0) },
  )
));

export const hedonicRegression = mathml.math(rows(
  munder(mrow(
    call.attr({ fn: mtext`log` })(msub(EST_Y, mi`i`)), mo`=`,
    msub(EST_BETA, mn(0)), mo`+`,
    msub(EST_BETA, mn(1)), msub(mi`subject`, mi`i`), mo`+`,
    msub(EST_BETA, mn(2)), msub(mi`event`, mi`i`), mo`+`,
    annotationOver.attr({ label: mtext`Difference in Difference` })(
      msub(EST_BETA, mn(3)),
      msub(mi`event`, mi`i`), dot,
      msub(mi`subject`, mi`i`),
    ),
    mo`+`, msub(eplison, mi`i`),
  ), mtext`subject is the opposite of control`),
  mspace(0),
  mrow(
    mtext`Classification`, mo`=`,
    piecewise(
      { then: mtext`"Subject After Event"`, cond: mrow(
        msub(mi`subject`, mi`i`), mo`=`,
        msub(mi`event`, mi`i`), mo`=`, mn(1)
      ) },
      { then: mtext`"Control After Event"`, cond: mrow(
        msub(mi`event`, mi`i`), mo`=`, mn(1),
      ) },
      { then: mtext`"Subject Before Event"`, cond: mrow(
        msub(mi`subject`, mi`i`), mo`=`, mn(1),
      ) },
      { then: mtext`"Control Before Event"` },
    ),
  ),
));
