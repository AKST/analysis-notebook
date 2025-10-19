import { mathml, mathml2 } from '../../prelude.js';
import * as mathmlHelper2 from '../../../base/preludes/university/mathml_2.js';

const {
  n, sub, sup, subsup, frac,
  call, sum, paren, SPECIAL: CHARS, sqrt, inv,
  space, under, piecewise,
} = mathml;

const { mi, mo, mtext, mrow, mover } = mathml2;

const { rows, annotationOver } = mathmlHelper2;

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
  sub(EST_MEAN, mi`x`), mo`=`, inv(mi`T`),
  sum(mi`T`, mrow(mi`i`, mo`=`, n(1))),
  paren([sub(mi`x`, mi`i`)]),
));

export const varFormular = mathml2.math(mrow(
  subsup(EST_SDEV, mi`x`, n(2)),
  mo`=`, inv(mi`T`),
  sum(mi`T`, mrow(mi`i`, mo`=`, n(1))),
  sup(paren([
    sub(mi`x`, mi`i`), mo`-`, sub(EST_MEAN, mi`x`),
  ]), n(2)),
));

export const stddevFormular = mathml2.math(mrow(
  sub(EST_SDEV, mi`x`), mo`=`,
  sqrt(mrow(
    inv(mi`T`), sum(mi`T`, mrow(mi`i`, mo`=`, n(1))),
    sup(paren([
      sub(mi`x`, mi`i`), mo`-`, sub(EST_MEAN, mi`x`)
    ]), n(2)),
  )),
));

export const skewness = mathml2.math(mrow(
  sub(EST_SKEW, mi`x`), mo`=`,
  inv(paren([mi`T`, mo`-`, n(1)])),
  sum(mi`T`, mrow(mi`i`, mo`=`, n(1))),
  sup(paren([frac([
    sub(mi`x`, mi`i`), mo`-`, sub(EST_MEAN, mi`x`),
  ], [
    sub(EST_SDEV, mi`x`),
  ])]), n(3)),
));

export const generalModel = mathml2.math(mrow(
  sub(mi`y`, mi`i`), mo`=`,
  call('f', sub(mi`x`, mi`i`)), mo`+`,
  sub(CHARS.greek.eplison, mi`i`)
));

export const ordinaryLeastSquares = mathml2.math(mrow(
  sub(EST_Y, mi`i`), mo`=`,
  sub(EST_BETA, n(0)), mo`+`,
  sub(EST_BETA, n(1)), sub(mi`X`, n(1)), mo`+`,
  sub(EST_BETA, n(2)), sub(mi`X`, n(2)), mo`+`,
  CHARS.ellipse.h,
  mo`+`, sub(EST_BETA, mi`n`), sub(mi`X`, mi`n`),
));

export const confinenceInterval = mathml2.math(mrow(
  sub(EST_BETA, n(1)), plusMinus, n(1.96), dot,
  call('SE', sub(EST_BETA, n(1))),
));

export const confinenceInterval2 = mathml2.math(rows(
  mrow(
    sub(EST_Y, mi`new`), plusMinus,
    sub(mi`t`, mrow(alpha, mo`/`, n(2))),
    dot, sub(mi`SE`, mi`mean`),
  ),
  space(0),
  mrow(
    sub(mi`SE`, mi`mean`), mo`=`,
    sqrt(mrow(
      sup(mi`SE`, n(2)), dot, paren([
        n(1), mo`+`, inv(mi`n`), mo`+`,
        frac([
          sup(paren([sub(mi`X`, mi`new`), mo`-`, EST_X_MEAN]), n(2))
        ], [
          sum(mi`n`, mrow(mi`i`, mo`=`, n(1))),
          sup(paren([sub(mi`X`, mi`i`), mo`-`, EST_X_MEAN]), n(2)),
        ]),
      ]),
    )),
  ),
));

export const predictionInterval = mathml2.math(rows(
  mrow(
    sub(EST_Y, mi`new`), plusMinus,
    sub(mi`t`, mrow(alpha, mo`/`, n(2))),
    dot, sub(mi`SE`, mi`pred`),
  ),
  space(0),
  mrow(
    sub(mi`SE`, mi`pred`), mo`=`,
    sqrt(mrow(
      sup(mi`SE`, n(2)), dot, call('Var', sub(EST_Y, mi`new`)),
    )),
  ),
));

export const hypothesisTests = mathml2.math(rows(
  mover(mrow(
    sub(mi`H`, n(0)), mo`:`, space(8),
    sub(CHARS.greek.beta, n(1)), mo`=`, n(0),
    space(16), mtext`There is no relation`,
  ), mtext`Null hypothesis`),
  space(8),
  mover(mrow(
    sub(mi`H`, n(1)), mo`:`, space(8),
    sub(CHARS.greek.beta, n(1)), neq, n(0),
    space(16), mtext`There is some relation`,
  ), mtext`Alternative Hypothesis`),
));

export const modelFit = mathml2.math(mrow(
  mover(mrow(
    sum(mi`n`, mrow(mi`i`, mo`=`, n(0))),
    sup(paren([
      sub(mi`y`, mi`i`), space(4),
      mo`-`, space(4),EST_Y_MEAN
    ]), n(2)),
  ), rows(
    mtext`Total Sum of squares (TSS)`,
    mtext`Total Variance of Response`,
  )),
  mo`=`,
  mover(mrow(
    space(8),
    paren([
      mrow(
        sum(mi`n`, mrow(mi`i`, mo`=`, n(0))),
        sup(paren([
          sub(mi`y`, mi`i`), space(4),
          mo`-`, space(4), EST_Y_MEAN
        ]), n(2)),
      ),
      mo`-`,
      mrow(
        sum(mi`n`, mrow(mi`i`, mo`=`, n(0))),
        sup(paren([
          sub(mi`y`, mi`i`), space(4),
          mo`-`, space(4), EST_Y
        ]), n(2)),
      ),
    ]),
    space(8),
  ), rows(
    mtext`Variablity explained by`,
    mtext`the regression (ESS)`,
  )),
  mo`+`,
  mover(mrow(
    space(8),
    sum(mi`n`, mrow(mi`i`, mo`=`, n(0))),
    sup(paren([
      sub(mi`y`, mi`i`), space(4),
      mo`-`, space(4), EST_Y
    ]), n(2)),
  ), rows(
    mtext`Residual sum of`,
    mtext`Squares (RSS)`,
  )),
));

export const rSquared = mathml2.math(mrow(
  mover(sup(mi`R`, n(2)), mtext`R Squared`), mo`=`,
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
  sum(mi`n`, mrow(mi`i`, mo`=`, n(1))),
  sup(paren([
    sub(mi`y`, mi`i`), mo`-`,
    call('𝑓̂', sub(mi`x`, mi`i`)),
  ]), n(2)),
  mo`=`,
  inv(mi`n`),
  sum(mi`n`, mrow(mi`i`, mo`=`, n(1))),
  sup(paren([
    sub(mi`y`, mi`i`), mo`-`,
    sub(mi`ŷ`, mi`i`),
  ]), n(2)),
));

export const testMse = mathml2.math(mrow(
  sub(mi`MSE`, mtext`test`), mo`=`,
  inv(mi`n`),
  sum(space(0), mrow(mi`i`, exists, mtext`Test Data`)),
  sup(paren([
    sub(mi`y`, mi`i`), mo`-`,
    sub(mi`ŷ`, mi`i`),
  ]), n(2)),
));

export const logisticRegressionSimple = mathml2.math(mrow(
  call('p', mi`X`), mo`=`,
  call('P', mi`Y`, mo`=`, n(1), mo`|`, mi`X`),
));

export const logisticRegression = mathml2.math(mrow(
  call('p', mi`X`), mo`=`,
  frac([
    call('exp', mrow(
      sub(EST_BETA, n(0)), mo`+`,
      sub(EST_BETA, n(1)), sub(mi`X`, n(1)), mo`+`,
      sub(EST_BETA, n(2)), sub(mi`X`, n(2)), mo`+`,
      CHARS.ellipse.h,
      mo`+`, sub(EST_BETA, mi`n`), sub(mi`X`, mi`n`),
    )),
  ], [
    n(1), mo`+`,
    call('exp', mrow(
      sub(EST_BETA, n(0)), mo`+`,
      sub(EST_BETA, n(1)), sub(mi`X`, n(1)), mo`+`,
      sub(EST_BETA, n(2)), sub(mi`X`, n(2)), mo`+`,
      CHARS.ellipse.h,
      mo`+`, sub(EST_BETA, mi`n`), sub(mi`X`, mi`n`),
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
  sub(EST_Y, mi`i`), mo`=`,
  piecewise([
    { then: [n(1)], cond: [sub(mi`P̂`, mi`i`), mo`>`, n(0.5)] },
    { then: [n(0)] },
  ])
));

export const hedonicRegression = mathml2.math(rows(
  under(mrow(
    call('log', sub(EST_Y, mi`i`)), mo`=`,
    sub(EST_BETA, n(0)), mo`+`,
    sub(EST_BETA, n(1)), sub(mi`subject`, mi`i`), mo`+`,
    sub(EST_BETA, n(2)), sub(mi`event`, mi`i`), mo`+`,
    annotationOver.attr({ label: mtext`Difference in Difference` })(
      sub(EST_BETA, n(3)),
      sub(mi`event`, mi`i`), dot,
      sub(mi`subject`, mi`i`),
    ),
    mo`+`, sub(eplison, mi`i`),
  ), mtext`subject is the opposite of control`),
  space(0),
  mrow(
    mtext`Classification`, mo`=`,
    piecewise([
      { then: [mtext`"Subject After Event"`], cond: [
        sub(mi`subject`, mi`i`), mo`=`,
        sub(mi`event`, mi`i`), mo`=`, n(1)
      ] },
      { then: [mtext`"Control After Event"`], cond: [
        sub(mi`event`, mi`i`), mo`=`, n(1),
      ] },
      { then: [mtext`"Subject Before Event"`], cond: [
        sub(mi`subject`, mi`i`), mo`=`, n(1),
      ] },
      { then: [mtext`"Control Before Event"`] },
    ]),
  ),
));
