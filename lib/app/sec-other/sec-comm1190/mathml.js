import { mathml, mathml2 } from '../../prelude.js';
import * as mathmlHelper2 from '../../../base/preludes/university/mathml_2.js';

const {
  frac,
  call, paren, SPECIAL: CHARS, inv,
  piecewise,
} = mathml;

const { mi, mo, mtext, mrow, mover, mn, msub, msup, msubsup, msqrt, munder, mspace } = mathml2;

const { rows, annotationOver, sum } = mathmlHelper2;

const EST_Y = mi`ŷ`;
const EST_Y_MEAN = mi`ȳ`;
const EST_X_MEAN = mi`X̄`;
const EST_BETA = CHARS.greek.circumflex.beta;
const EST_SKEW = CHARS.greek.circumflex.gamma;
const EST_MEAN = CHARS.greek.circumflex.mu;
const EST_SDEV = CHARS.greek.circumflex.sigma;
const { neq } = CHARS.constraint;
const { eplison, alpha, Sigma } = CHARS.greek;
const { exists, dot, plusMinus } = CHARS.operation;

export const meanFormular = mathml2.math(mrow(
  msub(EST_MEAN, mi`x`), mo`=`, inv(mi`T`),
  sum(mi`T`, mrow(mi`i`, mo`=`, mn(1))),
  paren([msub(mi`x`, mi`i`)]),
));

export const varFormular = mathml2.math(mrow(
  msubsup(EST_SDEV, mi`x`, mn(2)),
  mo`=`, inv(mi`T`),
  sum(mi`T`, mrow(mi`i`, mo`=`, mn(1))),
  msup(paren([
    msub(mi`x`, mi`i`), mo`-`, msub(EST_MEAN, mi`x`),
  ]), mn(2)),
));

export const stddevFormular = mathml2.math(mrow(
  msub(EST_SDEV, mi`x`), mo`=`,
  msqrt(mrow(
    inv(mi`T`), sum(mi`T`, mrow(mi`i`, mo`=`, mn(1))),
    msup(paren([
      msub(mi`x`, mi`i`), mo`-`, msub(EST_MEAN, mi`x`)
    ]), mn(2)),
  )),
));

export const skewness = mathml2.math(mrow(
  msub(EST_SKEW, mi`x`), mo`=`,
  inv(paren([mi`T`, mo`-`, mn(1)])),
  sum(mi`T`, mrow(mi`i`, mo`=`, mn(1))),
  msup(paren([frac([
    msub(mi`x`, mi`i`), mo`-`, msub(EST_MEAN, mi`x`),
  ], [
    msub(EST_SDEV, mi`x`),
  ])]), mn(3)),
));

export const generalModel = mathml2.math(mrow(
  msub(mi`y`, mi`i`), mo`=`,
  call('f', msub(mi`x`, mi`i`)), mo`+`,
  msub(CHARS.greek.eplison, mi`i`)
));

export const ordinaryLeastSquares = mathml2.math(mrow(
  msub(EST_Y, mi`i`), mo`=`,
  msub(EST_BETA, mn(0)), mo`+`,
  msub(EST_BETA, mn(1)), msub(mi`X`, mn(1)), mo`+`,
  msub(EST_BETA, mn(2)), msub(mi`X`, mn(2)), mo`+`,
  CHARS.ellipse.h,
  mo`+`, msub(EST_BETA, mi`n`), msub(mi`X`, mi`n`),
));

export const confinenceInterval = mathml2.math(mrow(
  msub(EST_BETA, mn(1)), plusMinus, mn(1.96), dot,
  call('SE', msub(EST_BETA, mn(1))),
));

export const confinenceInterval2 = mathml2.math(rows(
  mrow(
    msub(EST_Y, mi`new`), plusMinus,
    msub(mi`t`, mrow(alpha, mo`/`, mn(2))),
    dot, msub(mi`SE`, mi`mean`),
  ),
  mspace(0),
  mrow(
    msub(mi`SE`, mi`mean`), mo`=`,
    msqrt(mrow(
      msup(mi`SE`, mn(2)), dot, paren([
        mn(1), mo`+`, inv(mi`n`), mo`+`,
        frac([
          msup(paren([msub(mi`X`, mi`new`), mo`-`, EST_X_MEAN]), mn(2))
        ], [
          sum(mi`n`, mrow(mi`i`, mo`=`, mn(1))),
          msup(paren([msub(mi`X`, mi`i`), mo`-`, EST_X_MEAN]), mn(2)),
        ]),
      ]),
    )),
  ),
));

export const predictionInterval = mathml2.math(rows(
  mrow(
    msub(EST_Y, mi`new`), plusMinus,
    msub(mi`t`, mrow(alpha, mo`/`, mn(2))),
    dot, msub(mi`SE`, mi`pred`),
  ),
  mspace(0),
  mrow(
    msub(mi`SE`, mi`pred`), mo`=`,
    msqrt(mrow(
      msup(mi`SE`, mn(2)), dot, call('Var', msub(EST_Y, mi`new`)),
    )),
  ),
));

export const hypothesisTests = mathml2.math(rows(
  mover(mrow(
    msub(mi`H`, mn(0)), mo`:`, mspace(8),
    msub(CHARS.greek.beta, mn(1)), mo`=`, mn(0),
    mspace(16), mtext`There is no relation`,
  ), mtext`Null hypothesis`),
  mspace(8),
  mover(mrow(
    msub(mi`H`, mn(1)), mo`:`, mspace(8),
    msub(CHARS.greek.beta, mn(1)), neq, mn(0),
    mspace(16), mtext`There is some relation`,
  ), mtext`Alternative Hypothesis`),
));

export const modelFit = mathml2.math(mrow(
  mover(mrow(
    sum(mi`n`, mrow(mi`i`, mo`=`, mn(0))),
    msup(paren([
      msub(mi`y`, mi`i`), mspace(4),
      mo`-`, mspace(4),EST_Y_MEAN
    ]), mn(2)),
  ), rows(
    mtext`Total Sum of squares (TSS)`,
    mtext`Total Variance of Response`,
  )),
  mo`=`,
  mover(mrow(
    mspace(8),
    paren([
      mrow(
        sum(mi`n`, mrow(mi`i`, mo`=`, mn(0))),
        msup(paren([
          msub(mi`y`, mi`i`), mspace(4),
          mo`-`, mspace(4), EST_Y_MEAN
        ]), mn(2)),
      ),
      mo`-`,
      mrow(
        sum(mi`n`, mrow(mi`i`, mo`=`, mn(0))),
        msup(paren([
          msub(mi`y`, mi`i`), mspace(4),
          mo`-`, mspace(4), EST_Y
        ]), mn(2)),
      ),
    ]),
    mspace(8),
  ), rows(
    mtext`Variablity explained by`,
    mtext`the regression (ESS)`,
  )),
  mo`+`,
  mover(mrow(
    mspace(8),
    sum(mi`n`, mrow(mi`i`, mo`=`, mn(0))),
    msup(paren([
      msub(mi`y`, mi`i`), mspace(4),
      mo`-`, mspace(4), EST_Y
    ]), mn(2)),
  ), rows(
    mtext`Residual sum of`,
    mtext`Squares (RSS)`,
  )),
));

export const rSquared = mathml2.math(mrow(
  mover(msup(mi`R`, mn(2)), mtext`R Squared`), mo`=`,
  frac([mi`TSS`, mo`-`, mo`RSS`], [mi`TSS`]), mo`=`,
  frac([
    mo`RSS`,
  ], [
    mi`TSS`,
  ]),
));

export const mse = mathml2.math(mrow(
  mi`MSE`, mo`=`,
  inv(mi`n`),
  sum(mi`n`, mrow(mi`i`, mo`=`, mn(1))),
  msup(paren([
    msub(mi`y`, mi`i`), mo`-`,
    call('𝑓̂', msub(mi`x`, mi`i`)),
  ]), mn(2)),
  mo`=`,
  inv(mi`n`),
  sum(mi`n`, mrow(mi`i`, mo`=`, mn(1))),
  msup(paren([
    msub(mi`y`, mi`i`), mo`-`,
    msub(mi`ŷ`, mi`i`),
  ]), mn(2)),
));

export const testMse = mathml2.math(mrow(
  msub(mi`MSE`, mtext`test`), mo`=`,
  inv(mi`n`),
  sum(mspace(0), mrow(mi`i`, exists, mtext`Test Data`)),
  msup(paren([
    msub(mi`y`, mi`i`), mo`-`,
    msub(mi`ŷ`, mi`i`),
  ]), mn(2)),
));

export const logisticRegressionSimple = mathml2.math(mrow(
  call('p', mi`X`), mo`=`,
  call('P', mi`Y`, mo`=`, mn(1), mo`|`, mi`X`),
));

export const logisticRegression = mathml2.math(mrow(
  call('p', mi`X`), mo`=`,
  frac([
    call('exp', mrow(
      msub(EST_BETA, mn(0)), mo`+`,
      msub(EST_BETA, mn(1)), msub(mi`X`, mn(1)), mo`+`,
      msub(EST_BETA, mn(2)), msub(mi`X`, mn(2)), mo`+`,
      CHARS.ellipse.h,
      mo`+`, msub(EST_BETA, mi`n`), msub(mi`X`, mi`n`),
    )),
  ], [
    mn(1), mo`+`,
    call('exp', mrow(
      msub(EST_BETA, mn(0)), mo`+`,
      msub(EST_BETA, mn(1)), msub(mi`X`, mn(1)), mo`+`,
      msub(EST_BETA, mn(2)), msub(mi`X`, mn(2)), mo`+`,
      CHARS.ellipse.h,
      mo`+`, msub(EST_BETA, mi`n`), msub(mi`X`, mi`n`),
    )),
  ]),
));

export const classificationAccuracy = mathml2.math(mrow(
  mtext`Accuracy Rate`, mo`=`, frac([
    mtext`Correct Predictions`,
  ], [
    mtext`Number of Observations`,
  ]),
));

export const exampleOfClassificationModel = mathml2.math(mrow(
  msub(EST_Y, mi`i`), mo`=`,
  piecewise([
    { then: [mn(1)], cond: [msub(mi`P̂`, mi`i`), mo`>`, mn(0.5)] },
    { then: [mn(0)] },
  ])
));

export const hedonicRegression = mathml2.math(rows(
  munder(mrow(
    call('log', msub(EST_Y, mi`i`)), mo`=`,
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
    piecewise([
      { then: [mtext`"Subject After Event"`], cond: [
        msub(mi`subject`, mi`i`), mo`=`,
        msub(mi`event`, mi`i`), mo`=`, mn(1)
      ] },
      { then: [mtext`"Control After Event"`], cond: [
        msub(mi`event`, mi`i`), mo`=`, mn(1),
      ] },
      { then: [mtext`"Subject Before Event"`], cond: [
        msub(mi`subject`, mi`i`), mo`=`, mn(1),
      ] },
      { then: [mtext`"Control Before Event"`] },
    ]),
  ),
));
