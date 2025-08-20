import { mathml } from '../../prelude.js';

const {
  i, o, n, row, rows, sub, sup, subsup, frac,
  call, sum, paren, SPECIAL: CHARS, sqrt, inv,
  space, text, over, under, piecewise,
} = mathml;

const EST_Y = i('ŷ');
const EST_Y_MEAN = i('ȳ');
const EST_X_MEAN = i('X̄');
const EST_BETA = CHARS.greek.circumflex.beta;
const EST_SKEW = CHARS.greek.circumflex.gamma;
const EST_MEAN = CHARS.greek.circumflex.mu;
const EST_SDEV = CHARS.greek.circumflex.sigma;
const { neq } = CHARS.constraint;
const { eplison, alpha, Sigma } = CHARS.greek;
const { exists, dot, plusMinus } = CHARS.operation;

export const meanFormular = mathml([row([
  sub(EST_MEAN, i('x')), o('='), inv(i('T')),
  sum(i('T'), row([i('i'), o('='), n(1)])),
  paren([sub(i('x'), i('i'))]),
])]);

export const varFormular = mathml([row([
  subsup(EST_SDEV, i('x'), n(2)),
  o('='), inv(i('T')),
  sum(i('T'), row([i('i'), o('='), n(1)])),
  sup(paren([
    sub(i('x'), i('i')), o('-'), sub(EST_MEAN, i('x')),
  ]), n(2)),
])]);

export const stddevFormular = mathml([row([
  sub(EST_SDEV, i('x')), o('='),
  sqrt(row([
    inv(i('T')), sum(i('T'), row([i('i'), o('='), n(1)])),
    sup(paren([
      sub(i('x'), i('i')), o('-'), sub(EST_MEAN, i('x'))
    ]), n(2)),
  ])),
])]);

export const skewness = mathml([row([
  sub(EST_SKEW, i('x')), o('='),
  inv(paren([i('T'), o('-'), n(1)])),
  sum(i('T'), row([i('i'), o('='), n(1)])),
  sup(paren([frac([
    sub(i('x'), i('i')), o('-'), sub(EST_MEAN, i('x')),
  ], [
    sub(EST_SDEV, i('x')),
  ])]), n(3)),
])]);

export const generalModel = mathml([row([
  sub(i('y'), i('i')), o('='),
  call('f', sub(i('x'), i('i'))), o('+'),
  sub(CHARS.greek.eplison, i('i'))
])]);

export const ordinaryLeastSquares = mathml([row([
  sub(EST_Y, i('i')), o('='),
  sub(EST_BETA, n(0)), o('+'),
  sub(EST_BETA, n(1)), sub(i('X'), n(1)), o('+'),
  sub(EST_BETA, n(2)), sub(i('X'), n(2)), o('+'),
  CHARS.ellipse.h,
  o('+'), sub(EST_BETA, i('n')), sub(i('X'), i('n')),
])]);

export const confinenceInterval = mathml([row([
  sub(EST_BETA, n(1)), plusMinus, n(1.96), dot,
  call('SE', sub(EST_BETA, n(1))),
])]);

export const confinenceInterval2 = mathml([rows([
  row([
    sub(EST_Y, i('new')), plusMinus,
    sub(i('t'), row([alpha, o('/'), n(2)])),
    dot, sub(i('SE'), i('mean')),
  ]),
  space(0),
  row([
    sub(i('SE'), i('mean')), o('='),
    sqrt(row([
      sup(i('SE'), n(2)), dot, paren([
        n(1), o('+'), inv(i('n')), o('+'),
        frac([
          sup(paren([sub(i('X'), i('new')), o('-'), EST_X_MEAN]), n(2))
        ], [
          sum(i('n'), row([i('i'), o('='), n(1)])),
          sup(paren([sub(i('X'), i('i')), o('-'), EST_X_MEAN]), n(2)),
        ]),
      ]),
    ])),
  ]),
])]);

export const predictionInterval = mathml([rows([
  row([
    sub(EST_Y, i('new')), plusMinus,
    sub(i('t'), row([alpha, o('/'), n(2)])),
    dot, sub(i('SE'), i('pred')),
  ]),
  space(0),
  row([
    sub(i('SE'), i('pred')), o('='),
    sqrt(row([
      sup(i('SE'), n(2)), dot, call('Var', sub(EST_Y, i('new'))),
    ])),
  ]),
])]);

export const hypothesisTests = mathml([rows([
  over(text('Null hypothesis'), row([
    sub(i('H'), n(0)), o(':'), space(8),
    sub(CHARS.greek.beta, n(1)), o('='), n(0),
    space(16), text('There is no relation'),
  ])),
  space(8),
  over(text('Alternative Hypothesis'), row([
    sub(i('H'), n(1)), o(':'), space(8),
    sub(CHARS.greek.beta, n(1)), neq, n(0),
    space(16), text('There is some relation'),
  ])),
])]);

export const modelFit = mathml([row([
  over(rows([
    text('Total Sum of squares (TSS)'),
    text('Total Variance of Response'),
  ]), row([
    sum(i('n'), row([i('i'), o('='), n(0)])),
    sup(paren([
      sub(i('y'), i('i')), space(4),
      o('-'), space(4),EST_Y_MEAN
    ]), n(2)),
  ])),
  o('='),
  over(rows([
    text('Variablity explained by'),
    text('the regression (ESS)'),
  ]), row([
    space(8),
    paren([
      row([
        sum(i('n'), row([i('i'), o('='), n(0)])),
        sup(paren([
          sub(i('y'), i('i')), space(4),
          o('-'), space(4), EST_Y_MEAN
        ]), n(2)),
      ]),
      o('-'),
      row([
        sum(i('n'), row([i('i'), o('='), n(0)])),
        sup(paren([
          sub(i('y'), i('i')), space(4),
          o('-'), space(4), EST_Y
        ]), n(2)),
      ]),
    ]),
    space(8),
  ])),
  o('+'),
  over(rows([
    text('Residual sum of'),
    text('Squares (RSS)'),
  ]), row([
    space(8),
    sum(i('n'), row([i('i'), o('='), n(0)])),
    sup(paren([
      sub(i('y'), i('i')), space(4),
      o('-'), space(4), EST_Y
    ]), n(2)),
  ])),
])]);

export const rSquared = mathml([row([
  over(text('R Squared'), sup(i('R'), n(2))), o('='),
  frac([i('TSS'), o('-'), o('RSS')], [i('TSS')]), o('='),
  frac([
    o('RSS'),
  ], [
    i('TSS'),
  ]),
])]);

export const mse = mathml([row([
  i('MSE'), o('='),
  inv(i('n')),
  sum(i('n'), row([i('i'), o('='), n(1)])),
  sup(paren([
    sub(i('y'), i('i')), o('-'),
    call('𝑓̂', sub(i('x'), i('i'))),
  ]), n(2)),
  o('='),
  inv(i('n')),
  sum(i('n'), row([i('i'), o('='), n(1)])),
  sup(paren([
    sub(i('y'), i('i')), o('-'),
    sub(i('ŷ'), i('i')),
  ]), n(2)),
])]);

export const testMse = mathml([row([
  sub(i('MSE'), text('test')), o('='),
  inv(i('n')),
  sum(space(0), row([i('i'), exists, text('Test Data')])),
  sup(paren([
    sub(i('y'), i('i')), o('-'),
    sub(i('ŷ'), i('i')),
  ]), n(2)),
])]);

export const logisticRegressionSimple = mathml([row([
  call('p', i('X')), o('='),
  call('P', i('Y'), o('='), n(1), o('|'), i('X')),
])]);

export const logisticRegression = mathml([row([
  call('p', i('X')), o('='),
  frac([
    call('exp', row([
      sub(EST_BETA, n(0)), o('+'),
      sub(EST_BETA, n(1)), sub(i('X'), n(1)), o('+'),
      sub(EST_BETA, n(2)), sub(i('X'), n(2)), o('+'),
      CHARS.ellipse.h,
      o('+'), sub(EST_BETA, i('n')), sub(i('X'), i('n')),
    ])),
  ], [
    n(1), o('+'),
    call('exp', row([
      sub(EST_BETA, n(0)), o('+'),
      sub(EST_BETA, n(1)), sub(i('X'), n(1)), o('+'),
      sub(EST_BETA, n(2)), sub(i('X'), n(2)), o('+'),
      CHARS.ellipse.h,
      o('+'), sub(EST_BETA, i('n')), sub(i('X'), i('n')),
    ])),
  ]),
])]);

export const classificationAccuracy = mathml([row([
  text('Accuracy Rate'), o('='), frac([
    text('Correct Predictions'),
  ], [
    text('Number of Observations'),
  ]),
])]);

export const exampleOfClassificationModel = mathml([row([
  sub(EST_Y, i('i')), o('='),
  mathml.piecewise([
    { then: [n(1)], cond: [sub(i('P̂'), i('i')), o('>'), n(0.5)] },
    { then: [n(0)] },
  ])
])]);

export const hedonicRegression = mathml([rows([
  under(row([
    call('log', sub(EST_Y, i('i'))), o('='),
    sub(EST_BETA, n(0)), o('+'),
    sub(EST_BETA, n(1)), sub(i('subject'), i('i')), o('+'),
    sub(EST_BETA, n(2)), sub(i('event'), i('i')), o('+'),
    over(text('Difference in Difference'), over(o('⏞'), row([
      sub(EST_BETA, n(3)),
      sub(i('event'), i('i')), dot,
      sub(i('subject'), i('i')),
    ]))),
    o('+'), sub(eplison, i('i')),
  ]), text('subject is the opposite of control')),
  space(0),
  row([
    text('Classification'), o('='),
    piecewise([
      { then: [text('"Subject After Event"')], cond: [
        sub(i('subject'), i('i')), o('='),
        sub(i('event'), i('i')), o('='), n(1)
      ] },
      { then: [text('"Control After Event"')], cond: [
        sub(i('event'), i('i')), o('='), n(1),
      ] },
      { then: [text('"Subject Before Event"')], cond: [
        sub(i('subject'), i('i')), o('='), n(1),
      ] },
      { then: [text('"Control Before Event"')] },
    ]),
  ]),
])]);

