import { mathml, mathml2 } from '../../prelude.js';

const {
  n, row, rows, sub, sup, subsup, frac,
  call, sum, paren, SPECIAL: CHARS, sqrt, inv,
  space, text, over, under, piecewise,
} = mathml;

const { mi, mo } = mathml2;

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

export const meanFormular = mathml([row([
  sub(EST_MEAN, mi`x`), mo`=`, inv(mi`T`),
  sum(mi`T`, row([mi`i`, mo`=`, n(1)])),
  paren([sub(mi`x`, mi`i`)]),
])]);

export const varFormular = mathml([row([
  subsup(EST_SDEV, mi`x`, n(2)),
  mo`=`, inv(mi`T`),
  sum(mi`T`, row([mi`i`, mo`=`, n(1)])),
  sup(paren([
    sub(mi`x`, mi`i`), mo`-`, sub(EST_MEAN, mi`x`),
  ]), n(2)),
])]);

export const stddevFormular = mathml([row([
  sub(EST_SDEV, mi`x`), mo`=`,
  sqrt(row([
    inv(mi`T`), sum(mi`T`, row([mi`i`, mo`=`, n(1)])),
    sup(paren([
      sub(mi`x`, mi`i`), mo`-`, sub(EST_MEAN, mi`x`)
    ]), n(2)),
  ])),
])]);

export const skewness = mathml([row([
  sub(EST_SKEW, mi`x`), mo`=`,
  inv(paren([mi`T`, mo`-`, n(1)])),
  sum(mi`T`, row([mi`i`, mo`=`, n(1)])),
  sup(paren([frac([
    sub(mi`x`, mi`i`), mo`-`, sub(EST_MEAN, mi`x`),
  ], [
    sub(EST_SDEV, mi`x`),
  ])]), n(3)),
])]);

export const generalModel = mathml([row([
  sub(mi`y`, mi`i`), mo`=`,
  call('f', sub(mi`x`, mi`i`)), mo`+`,
  sub(CHARS.greek.eplison, mi`i`)
])]);

export const ordinaryLeastSquares = mathml([row([
  sub(EST_Y, mi`i`), mo`=`,
  sub(EST_BETA, n(0)), mo`+`,
  sub(EST_BETA, n(1)), sub(mi`X`, n(1)), mo`+`,
  sub(EST_BETA, n(2)), sub(mi`X`, n(2)), mo`+`,
  CHARS.ellipse.h,
  mo`+`, sub(EST_BETA, mi`n`), sub(mi`X`, mi`n`),
])]);

export const confinenceInterval = mathml([row([
  sub(EST_BETA, n(1)), plusMinus, n(1.96), dot,
  call('SE', sub(EST_BETA, n(1))),
])]);

export const confinenceInterval2 = mathml([rows([
  row([
    sub(EST_Y, mi`new`), plusMinus,
    sub(mi`t`, row([alpha, mo`/`, n(2)])),
    dot, sub(mi`SE`, mi`mean`),
  ]),
  space(0),
  row([
    sub(mi`SE`, mi`mean`), mo`=`,
    sqrt(row([
      sup(mi`SE`, n(2)), dot, paren([
        n(1), mo`+`, inv(mi`n`), mo`+`,
        frac([
          sup(paren([sub(mi`X`, mi`new`), mo`-`, EST_X_MEAN]), n(2))
        ], [
          sum(mi`n`, row([mi`i`, mo`=`, n(1)])),
          sup(paren([sub(mi`X`, mi`i`), mo`-`, EST_X_MEAN]), n(2)),
        ]),
      ]),
    ])),
  ]),
])]);

export const predictionInterval = mathml([rows([
  row([
    sub(EST_Y, mi`new`), plusMinus,
    sub(mi`t`, row([alpha, mo`/`, n(2)])),
    dot, sub(mi`SE`, mi`pred`),
  ]),
  space(0),
  row([
    sub(mi`SE`, mi`pred`), mo`=`,
    sqrt(row([
      sup(mi`SE`, n(2)), dot, call('Var', sub(EST_Y, mi`new`)),
    ])),
  ]),
])]);

export const hypothesisTests = mathml([rows([
  over(text('Null hypothesis'), row([
    sub(mi`H`, n(0)), mo`:`, space(8),
    sub(CHARS.greek.beta, n(1)), mo`=`, n(0),
    space(16), text('There is no relation'),
  ])),
  space(8),
  over(text('Alternative Hypothesis'), row([
    sub(mi`H`, n(1)), mo`:`, space(8),
    sub(CHARS.greek.beta, n(1)), neq, n(0),
    space(16), text('There is some relation'),
  ])),
])]);

export const modelFit = mathml([row([
  over(rows([
    text('Total Sum of squares (TSS)'),
    text('Total Variance of Response'),
  ]), row([
    sum(mi`n`, row([mi`i`, mo`=`, n(0)])),
    sup(paren([
      sub(mi`y`, mi`i`), space(4),
      mo`-`, space(4),EST_Y_MEAN
    ]), n(2)),
  ])),
  mo`=`,
  over(rows([
    text('Variablity explained by'),
    text('the regression (ESS)'),
  ]), row([
    space(8),
    paren([
      row([
        sum(mi`n`, row([mi`i`, mo`=`, n(0)])),
        sup(paren([
          sub(mi`y`, mi`i`), space(4),
          mo`-`, space(4), EST_Y_MEAN
        ]), n(2)),
      ]),
      mo`-`,
      row([
        sum(mi`n`, row([mi`i`, mo`=`, n(0)])),
        sup(paren([
          sub(mi`y`, mi`i`), space(4),
          mo`-`, space(4), EST_Y
        ]), n(2)),
      ]),
    ]),
    space(8),
  ])),
  mo`+`,
  over(rows([
    text('Residual sum of'),
    text('Squares (RSS)'),
  ]), row([
    space(8),
    sum(mi`n`, row([mi`i`, mo`=`, n(0)])),
    sup(paren([
      sub(mi`y`, mi`i`), space(4),
      mo`-`, space(4), EST_Y
    ]), n(2)),
  ])),
])]);

export const rSquared = mathml([row([
  over(text('R Squared'), sup(mi`R`, n(2))), mo`=`,
  frac([mi`TSS`, mo`-`, mo`RSS`], [mi`TSS`]), mo`=`,
  frac([
    mo`RSS`,
  ], [
    mi`TSS`,
  ]),
])]);

export const mse = mathml([row([
  mi`MSE`, mo`=`,
  inv(mi`n`),
  sum(mi`n`, row([mi`i`, mo`=`, n(1)])),
  sup(paren([
    sub(mi`y`, mi`i`), mo`-`,
    call('𝑓̂', sub(mi`x`, mi`i`)),
  ]), n(2)),
  mo`=`,
  inv(mi`n`),
  sum(mi`n`, row([mi`i`, mo`=`, n(1)])),
  sup(paren([
    sub(mi`y`, mi`i`), mo`-`,
    sub(mi`ŷ`, mi`i`),
  ]), n(2)),
])]);

export const testMse = mathml([row([
  sub(mi`MSE`, text('test')), mo`=`,
  inv(mi`n`),
  sum(space(0), row([mi`i`, exists, text('Test Data')])),
  sup(paren([
    sub(mi`y`, mi`i`), mo`-`,
    sub(mi`ŷ`, mi`i`),
  ]), n(2)),
])]);

export const logisticRegressionSimple = mathml([row([
  call('p', mi`X`), mo`=`,
  call('P', mi`Y`, mo`=`, n(1), mo`|`, mi`X`),
])]);

export const logisticRegression = mathml([row([
  call('p', mi`X`), mo`=`,
  frac([
    call('exp', row([
      sub(EST_BETA, n(0)), mo`+`,
      sub(EST_BETA, n(1)), sub(mi`X`, n(1)), mo`+`,
      sub(EST_BETA, n(2)), sub(mi`X`, n(2)), mo`+`,
      CHARS.ellipse.h,
      mo`+`, sub(EST_BETA, mi`n`), sub(mi`X`, mi`n`),
    ])),
  ], [
    n(1), mo`+`,
    call('exp', row([
      sub(EST_BETA, n(0)), mo`+`,
      sub(EST_BETA, n(1)), sub(mi`X`, n(1)), mo`+`,
      sub(EST_BETA, n(2)), sub(mi`X`, n(2)), mo`+`,
      CHARS.ellipse.h,
      mo`+`, sub(EST_BETA, mi`n`), sub(mi`X`, mi`n`),
    ])),
  ]),
])]);

export const classificationAccuracy = mathml([row([
  text('Accuracy Rate'), mo`=`, frac([
    text('Correct Predictions'),
  ], [
    text('Number of Observations'),
  ]),
])]);

export const exampleOfClassificationModel = mathml([row([
  sub(EST_Y, mi`i`), mo`=`,
  mathml.piecewise([
    { then: [n(1)], cond: [sub(mi`P̂`, mi`i`), mo`>`, n(0.5)] },
    { then: [n(0)] },
  ])
])]);

export const hedonicRegression = mathml([rows([
  under(row([
    call('log', sub(EST_Y, mi`i`)), mo`=`,
    sub(EST_BETA, n(0)), mo`+`,
    sub(EST_BETA, n(1)), sub(mi`subject`, mi`i`), mo`+`,
    sub(EST_BETA, n(2)), sub(mi`event`, mi`i`), mo`+`,
    over(text('Difference in Difference'), over(mo`⏞`, row([
      sub(EST_BETA, n(3)),
      sub(mi`event`, mi`i`), dot,
      sub(mi`subject`, mi`i`),
    ]))),
    mo`+`, sub(eplison, mi`i`),
  ]), text('subject is the opposite of control')),
  space(0),
  row([
    text('Classification'), mo`=`,
    piecewise([
      { then: [text('"Subject After Event"')], cond: [
        sub(mi`subject`, mi`i`), mo`=`,
        sub(mi`event`, mi`i`), mo`=`, n(1)
      ] },
      { then: [text('"Control After Event"')], cond: [
        sub(mi`event`, mi`i`), mo`=`, n(1),
      ] },
      { then: [text('"Subject Before Event"')], cond: [
        sub(mi`subject`, mi`i`), mo`=`, n(1),
      ] },
      { then: [text('"Control Before Event"')] },
    ]),
  ]),
])]);
