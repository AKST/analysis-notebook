/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';

const {
  call, o, i, n, sup, sub, sum, subsup,
  paren, row, rows, text, space, over, frac,
  SPECIAL, inv, under, table, sqrt,
} = mathml;

const { todo } = components;

const {
  greek: {
    beta, betaCrfx, Delta,
    rho, rhoCrfx,
    sigma, sigmaCrfx,
  },
} = mathml.SPECIAL;

const vars = {
  y: i('y'),
  yi: sub(i('y'), i('i')),
  yEst: i('ŷ'),
  yEstI: sub(i('ŷ'), i('i')),
  ysm: i('ȳ'),
  u: i('u'),
  ui: sub(i('u'), i('i')),
  uEst: i('û'),
  uEstI: sub(i('û'), i('i')),
  x: i('x'),
  xi: sub(i('x'), i('i')),
  xsm: i('x̄'),

  b0: sub(beta, n(0)),
  b1: sub(beta, n(1)),
  b0Est: sub(betaCrfx, n(0)),
  b1Est: sub(betaCrfx, n(1)),
  colXY: sub(rho, row([i('x'), i('y')])),
  colXYEst: sub(rhoCrfx, row([i('x'), i('y')])),
  stddevX: sub(sigma, i('x')),
  stddevXEst: sub(sigmaCrfx, i('x')),
  stddevY: sub(sigma, i('y')),
  stddevYEst: sub(sigmaCrfx, i('y')),
};

const {
  eqId, eq, add, mul3, minusSqP,
  minus, minusP, add3,
} = mathmlHelper;

/** @param {E.Item} a @param {E.Item} b */
const mul2 = (a, b) => row([a, b]);

/** @param {...E.Item} body */
const E = (...body) => call('E', frag([...body]))

/** @param {E.Item} a @param {E.Item} b */
const Covar = (a, b) => call('Covar', a, b)

const summaise = sum(i('n'), row([i('i'), o('='), n(0)]));

export const concequenceOfOmittedVariableBias = doc._figure(
  todo({}, 'See Slide 3'),
  doc.figcaption`Concequences of Omitted Variable Bias`,
);

export const residuals = doc._figure(
  mathml([
    eq(
      sub(vars.u, i('i')),
      minus(
        sub(i('y'), i('i')),
        sub(i('ŷ'), i('i'))
      )
    )
  ]),
  doc.figcaption`Residuals`,
);

/**
 * @param {string} name
 * @param {string} y
 * @param {string[]} xs
 * @param {{ yLog?: boolean }} [options]
 */
export const createFigure = (name, y, xs, options = {}) => doc._figure(
  mathml([
    row([
      under((
        options.yLog ? (
          row([call('log', i('y'))])
        ) : i('y')
      ), under(o('⏟'), text(y))),
      space(4), o('='), space(4),
      sub(i('β'), n(0)),
      space(4), o('+'), space(4),
      ...xs.flatMap((x, index) => [
        sub(i('β'), n(index + 1)),
        under(sub(i('x'), n(index + 1)), under(o('⏟'), text(x))),
        space(4), o('+'), space(4)
      ]),
      i('u'),
    ]),
  ]),
  doc.figcaption`${name}`,
);

export const quadraticExpressionInMLR = {
  regression: doc._figure(
    mathml([
      eq(
        i('y'),
        add3(
          sub(i('β'), n(0)),
          row([sub(i('β'), n(1)), sub(i('x'), n(1))]),
          add(
            row([sub(i('β'), n(2)), sup(sub(i('x'), n(1)), n(2))]),
            i('u')
          ),
        ),
      ),
    ]),
    doc.figcaption`Quadratic Equation`,
  ),
  relation: doc._figure(
    mathml([
      frac(
        [row([SPECIAL.greek.delta, i('y')])],
        [row([SPECIAL.greek.delta, sub(i('x'), n(1))])]
      ),
      row([
        space(4), o('≈'), space(4),
        sub(i('β'), n(1)),
        space(4), o('+'), space(4),
        n(2), sub(i('β'), n(2)), sub(i('x'), n(1))
      ])
    ]),
    doc.figcaption`Interpreting coefficent in quadratic equation MLRs`,
  ),
};

export const size2MLR = {
  ols: doc._figure(
    mathml([
      rows([
        row([
          o('{'), space(2),
          paren([
            sub(i('x'), row([i('i'), n(1)])), o(','), space(4),
            sub(i('x'), row([i('i'), n(2)])), o(','), space(4),
            sub(i('y'), i('i'))
          ]),
          space(6), o(':'), space(6),
          i('i'), space(4), o('='), space(4),
          n(1), o(','), space(4),
          n(2), o(','), space(4),
          SPECIAL.ellipse.h2, space(4), o(','), space(4),
          i('n'), space(2), o('}')
        ]),

        row([
          sum(i('n'), row([i('i'), space(4), o('='), space(4), n(1)])),
          space(8),
          sup(paren([
            sub(i('y'), i('i')), space(4), o('-'), space(4),
            sub(SPECIAL.greek.circumflex.beta, n(0)), space(4), o('-'), space(4),
            row([
              sub(SPECIAL.greek.circumflex.beta, n(1)),
              sub(i('x'), row([i('i'), n(1)]))
            ]),
            space(4), o('-'), space(4),
            row([
              sub(SPECIAL.greek.circumflex.beta, n(2)),
              sub(i('x'), row([i('i'), n(2)]))
            ])
          ]), n(2))
        ]),
      ])
    ]),
    doc.figcaption`OLS for 2 Regressors`,
  ),
  regression: doc._figure(
    mathml([
      eq(
        i('y'),
        add(
          add3(
            sub(i('β'), n(0)),
            mul2(sub(i('β'), n(1)), sub(i('x'), n(1))),
            mul2(sub(i('β'), n(2)), sub(i('x'), n(2)))
          ),
          i('u')
        ),
      ),
    ]),
    doc.figcaption`general MLR with 2 independent vars`,
  ),
  estimate: doc._figure(
    mathml([
      eq(
        mathml.i('𝑦̂'),
        add3(
          sub(mathml.SPECIAL.greek.circumflex.beta, n(0)),
          mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(1)), sub(i('x'), n(1))),
          mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(2)), sub(i('x'), n(2)))
        )
      ),
    ]),
    doc.figcaption`Estimated Model with 2 regressors`,
  ),
  missing: doc._figure(
    mathml([
      eq(
        mathml.i('ỹ'),
        add(
          sub(i('𝛽̃'), n(0)),
          mul2(sub(i('𝛽̃'), n(1)), sub(i('x'), n(1)))
        )
      ),
    ]),
    doc.figcaption`Modeling with missing variable`,
  ),
  assumption: doc._figure(
    mathml([
      eq(
        call(
          'E',
          row([
            i('u'), space(4), o('|'), space(4),
            sub(i('x'), n(1)), o(','), space(4),
            sub(i('x'), n(2))
          ])
        ),
        n(0)
      )
    ]),
    doc.figcaption`other factors affecting y do not affect x1 or x2`
  ),
  partialEffect: doc._figure(
    mathml([
      eq(
        row([
          SPECIAL.greek.delta,
          i('ŷ'),
        ]),
        add(
          mul2(
            sub(SPECIAL.greek.circumflex.beta, n(1)),
            mul2(SPECIAL.greek.delta, sub(i('x'), n(1)))
          ),
          mul2(
            sub(SPECIAL.greek.circumflex.beta, n(2)),
            mul2(SPECIAL.greek.delta, sub(i('x'), n(2)))
          )
        )
      )
    ]),
    doc.figcaption`Ceteris Paribus interpretation`,
  ),
};

export const sizeKMLR = {
  regression: doc._figure(
    mathml([
      eq(
        i('y'),
        row([
          sub(i('β'), n(0)), space(4), o('+'), space(4),
          sub(i('β'), n(1)), sub(i('x'), n(1)), space(4), o('+'), space(4),
          sub(i('β'), n(2)), sub(i('x'), n(2)), space(4), o('+'), space(4),
          sub(i('β'), n(3)), sub(i('x'), n(3)), space(4), o('+'), space(4),
          SPECIAL.ellipse.h2, space(4), o('+'), space(4),
          sub(i('β'), i('k')), sub(i('x'), i('k')), space(4), o('+'), space(4),
          i('u')
        ])
      )
    ]),
    doc.figcaption`General MLR`,
  ),
  estimate: doc._figure(
    mathml([
      eq(
        mathml.i('𝑦̂'),
        row([
          sub(i('𝛽̂'), n(0)), space(4), o('+'), space(4),
          sub(i('𝛽̂'), n(1)), sub(i('x'), n(1)), space(4), o('+'), space(4),
          sub(i('𝛽̂'), n(2)), sub(i('x'), n(2)), space(4), o('+'), space(4),
          SPECIAL.ellipse.h2, space(4), o('+'), space(4),
          sub(i('𝛽̂'), i('k')), sub(i('x'), i('k')), space(4),
        ])
      ),
    ]),
    doc.figcaption`Estimated Model with K regressors`,
  ),
  assumption: doc._figure(
    mathml([
      eq(
        call(
          'E',
          row([
            i('u'), space(4), o('|'), space(4),
            sub(i('x'), n(1)), o(','), space(4),
            sub(i('x'), n(2)), o(','), space(4),
            SPECIAL.ellipse.h2, o(','), space(4),
            sub(i('x'), i('k'))
          ])
        ),
        n(0)
      )
    ]),
    doc.figcaption`Conditional expectation assumption`,
  ),
  ols: () => {
    const inner = paren([
      sub(i('y'), i('i')), space(4), o('-'), space(4),
      sub(SPECIAL.greek.circumflex.beta, n(0)), space(4), o('-'), space(4),
      mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), sub(i('x'), row([i('i'), n(1)]))),
      space(4), o('-'), space(4),
      SPECIAL.ellipse.h2, space(4), o('-'), space(4),
      mul2(sub(SPECIAL.greek.circumflex.beta, i('k')), sub(i('x'), row([i('i'), i('k')]))),
    ]);

    /** @param {E.Item} body */
    const sigma = (body) =>
      row([
        sum(i('n'), row([i('i'), o('='), n(1)])),
        body
      ]);

    return doc._figure(
      mathml([
        table([
          [sigma(inner), o('='), n(0) ],
          [sigma(mul2(sub(i('x'), row([i('i'), n(1)])), inner)), o('='), n(0) ],
          [sigma(mul2(sub(i('x'), row([i('i'), n(2)])), inner)), o('='), n(0) ],
          [SPECIAL.ellipse.v, space(4), space(4) ],
          [sigma(mul2(sub(i('x'), row([i('i'), i('k')])), inner)), o('='), n(0) ],
        ], { columnalign: 'left center left' }),
      ]),
      doc.figcaption`OLS Constraint for K regressors`,
    );
  },
  partialEffect: doc._figure(
    mathml([
      eq(
        row([SPECIAL.greek.delta, i('ŷ')]),
        row([
          mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), mul2(SPECIAL.greek.delta, sub(i('x'), n(1)))),
          space(4), o('+'), space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(2)), mul2(SPECIAL.greek.delta, sub(i('x'), n(2)))),
          space(4), o('+'), space(4),
          SPECIAL.ellipse.h2,
          space(4), o('+'), space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, i('k')), mul2(SPECIAL.greek.delta, sub(i('x'), i('k'))))
        ])
      )
    ]),
    doc.figcaption`Ceteris Paribus interpretation`
  ),
  fitted: doc._figure(
    mathml([
      eq(
        sub(i('ŷ'), i('i')),
        row([
          sub(SPECIAL.greek.circumflex.beta, n(0)),
          space(4), o('+'), space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), sub(i('x'), row([i('i'), n(1)]))),
          space(4), o('+'), space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(2)), sub(i('x'), row([i('i'), n(2)]))),
          space(4), o('+'), space(4),
          SPECIAL.ellipse.h2,
          space(4), o('+'), space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, i('k')), sub(i('x'), row([i('i'), i('k')])))
        ])
      )
    ]),
    doc.figcaption`Fitted values`,
  ),
  throughOrigin: doc._figure(
    mathml([
      eq(
        i('ỹ'),
        row([
          mul2(sub(i('𝛽̃'), n(1)), sub(i('x'), n(1))),
          space(4), o('+'), space(4),
          mul2(sub(i('𝛽̃'), n(2)), sub(i('x'), n(2))),
          space(4), o('+'), space(4),
          SPECIAL.ellipse.h2,
          space(4), o('+'), space(4),
          mul2(sub(i('𝛽̃'), i('k')), sub(i('x'), i('k')))
        ])
      )
    ]),
    doc.figcaption`Regressoin through the origin`,
  ),
};

export const assumptions = {
  mlr4: doc._figure(
    mathml([
      eq(
        call(
          'E',
          row([
            i('u'), space(4), o('|'), space(4),
            sub(i('x'), n(1)), space(4), o(','), space(4),
            sub(i('x'), n(2)), space(4), o(','), space(4),
            SPECIAL.ellipse.h2, space(4), o(','), space(4),
            sub(i('x'), i('k'))
          ])
        ),
        n(0)
      )
    ]),
    doc.figcaption`Zero Conditional Mean`,
  ),
  mlr5: doc._figure(
    mathml([
      eq(
        call(
          'Var',
          row([
            i('u'), space(4), o('|'), space(4),
            sub(i('x'), n(1)), o(','), space(4),
            SPECIAL.ellipse.h2, o(','), space(4),
            sub(i('x'), i('k'))
          ])
        ),
        sup(SPECIAL.greek.sigma, n(2))
      )
    ]),
    doc.figcaption`Homoskedasticity`,
  ),
  mlr1234: doc._figure(
    mathml([
      eq(
        call('E', row([i('y'), space(4), o('|'), space(4), i('x')])),
        row([
          sub(i('β'), n(0)),
          space(4), o('+'), space(4),
          mul2(sub(i('β'), n(1)), sub(i('x'), n(1))),
          space(4), o('+'), space(4),
          mul2(sub(i('β'), n(2)), sub(i('x'), n(2))),
          space(4), o('+'), space(4),
          SPECIAL.ellipse.h2,
          space(4), o('+'), space(4),
          mul2(sub(i('β'), i('k')), sub(i('x'), i('k')))
        ])
      )
    ], { style: 'font-size: 12px' }),
    doc.figcaption`MLR 1, 2, 3, 4`,
  ),
};

export const unbiasedness = {
  theorum3_1: doc._figure(
    mathml([
      eq(
        call('E', sub(SPECIAL.greek.circumflex.beta, i('j'))),
        row([
          sub(i('β'), i('j')),
          o(','), space(4),
          i('j'), space(4), o('='), space(4),
          n(0), o(','), space(4),
          n(1), o(','), space(4),
          SPECIAL.ellipse.h2, o(','), space(4),
          i('k')
        ])
      )
    ]),
    doc.figcaption`Unbiasedness of OLS`,
  ),
  unbiasedExpansion: doc._figure(
    mathml([
      table([
        [
          call('E', sub(i('𝛽̃'), n(1))),
          o('='),
          call(
            'E',
            row([
              sub(SPECIAL.greek.circumflex.beta, n(1)),
              space(4), o('+'), space(4),
              mul2(
                sub(SPECIAL.greek.circumflex.beta, n(2)),
                sub(i('𝛿̃'), n(1))
              )
            ])
          ),
        ],
        [
          mathml.space(0),
          o('='),
          row([
            call('E', sub(SPECIAL.greek.circumflex.beta, n(1))),
            space(4), o('+'), space(4),
            mul2(
              call('E', sub(SPECIAL.greek.circumflex.beta, n(2))),
              sub(i('𝛿̃'), n(1))
            ),
          ]),
        ],
        [
          mathml.space(0),
          o('='),
          row([
            sub(i('𝛽'), n(1)),
            space(4), o('+'), space(4),
            mul2(
              sub(i('𝛽'), n(2)),
              sub(i('𝛿̃'), n(1))
            ),
          ]),
        ],
      ], { columnalign: 'right center left' }),
    ]),
    doc.figcaption`Solving for E(𝛽̃₁)`,
  ),
  omittedVariableBias: doc._figure(
    mathml([
      eq(
        call('Bias', sub(i('𝛽̃'), n(1))),
        row([
          call('E', sub(i('𝛽̃'), n(1))),
          space(4), o('−'), space(4),
          sub(i('𝛽'), n(1)),
          space(4), o('='), space(4),
          mul2(
            sub(i('𝛽'), n(2)),
            sub(i('𝛿̃'), n(1))
          )
        ])
      )
    ]),
    doc.figcaption`Bias of Omitted Variable`,
  ),
};

export const partiallingOut = doc._figure(
  mathml([
    eq(
      sub(SPECIAL.greek.circumflex.beta, n(1)),
      row([
        paren([
          row([
            sum(i('n'), row([i('i'), mathml.o('='), n(1)])),
            mul2(
              sub(i('r̂'), row([i('i'), n(1)])),
              sub(i('y'), i('i'))
            )
          ])
        ]),
        space(4), o('÷'), space(4),
        paren([
          row([
            sum(i('n'), row([i('i'), mathml.o('='), n(1)])),
            sup(
              sub(i('r̂'), row([i('i'), n(1)])),
              n(2)
            )
          ])
        ]),
      ])
    )
  ], { style: 'font-size: 12px' }),
  doc.figcaption`A "Partialling out" Interpretation of multiple regression`,
);

export const compareSLRAndMLR = doc._figure(
  mathml([
    mathml.table([
      [
        i('ỹ'),
        o('='),
        row([
          sub(i('𝛽̃'), n(0)),
          space(4), o('+'), space(4),
          mul2(sub(i('𝛽̃'), n(1)), sub(i('x̃'), n(1)))
        ])
      ],
      [
        i('ŷ'),
        o('='),
        row([
          sub(SPECIAL.greek.circumflex.beta, n(0)),
          space(4), o('+'), space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), sub(i('x'), n(1))),
          space(4), o('+'), space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(2)), sub(i('x'), n(2)))
        ])
      ],
      [
        sub(i('𝛽̃'), n(1)),
        o('='),
        row([
          sub(SPECIAL.greek.circumflex.beta, n(1)),
          space(4), o('+'), space(4),
          mul2(
            sub(SPECIAL.greek.circumflex.beta, n(2)),
            sub(i('𝛿̃'), n(1))
          )
        ])
      ]
    ], { columnalign: 'right center left' }),
  ]),
  doc.figcaption`Comparing SLR and MLR Estimates`,
);

export const samplingVarianceOfEstimators = doc._figure(
  mathml([
    eq(
      call('Var', sub(SPECIAL.greek.circumflex.beta, i('j'))),
      frac(
        [ sup(SPECIAL.greek.sigma, n(2)) ],
        [
          mul2(
            sub(i('SST'), i('j')),
            paren([
              n(1), space(4), o('−'), space(4),
              sup(sub(i('R'), i('j')), n(2))
            ])
          )
        ]
      )
    )
  ]),
  doc.figcaption`Sampling Variances of The OLS Slope Estimators`,
);

export const beyondTheScope = {
  logitModel: doc._figure(
    mathml([
      eq(
        call(
          'ln',
          frac(
            [sub(i('P'), i('i'))],
            [row([n(1), space(4), o('−'), space(4), sub(i('P'), i('i'))])]
          )
        ),
        row([
          sub(i('β'), n(0)),
          space(4), o('+'), space(4),
          mul2(sub(i('β'), n(1)), sub(i('x'), row([i('i'), n(1)]))),
          space(4), o('+'), space(4),
          sub(i('ε'), i('i'))
        ])
      )
    ]),
    doc.figcaption`Example Logit Model`,
  ),
  randomEffectsModelForLongitudinalData: doc._figure(
    mathml([
      eq(
        sub(i('y'), row([i('i'), i('j')])),
        row([
          sub(i('β'), n(0)),
          space(4), o('+'), space(4),
          mul2(sub(i('β'), n(1)), sub(i('x'), row([i('i'), i('j')]))),
          space(4), o('+'), space(4),
          sub(i('b'), i('i')),
          space(4), o('+'), space(4),
          sub(i('ε'), row([i('i'), i('j')]))
        ])
      )
    ]),
    doc.figcaption`Random Effects For Longitudinal Data`,
  ),
};

export const thoughtExperiment = doc._figure(
  mathml([
    mathml.table([
      [
        sub(i('ŷ'), i('i')),
        o('='),
        add3(
          sub(SPECIAL.greek.circumflex.beta, n(0)),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), sub(i('x'), i('1i'))),
          add(
            mul2(sub(SPECIAL.greek.circumflex.beta, n(2)), sub(i('x'), i('2i'))),
            sub(i('û'), i('i'))
          ),
        ),
      ],
      [
        sub(i('x̂'), i('2i')),
        o('='),
        add3(
          sub(SPECIAL.greek.circumflex.beta, sub(n(0), n(2))),
          mul2(sub(SPECIAL.greek.circumflex.beta, sub(n(1), n(2))), sub(i('x'), i('1i'))),
          sub(i('ê'), row([i('i'), n(2)])),
        ),
      ],
      [
        sub(i('ŷ'), row([i('i'), sub(i('x'), n(2))])),
        o('='),
        add3(
          sub(SPECIAL.greek.beta, row([n(0), sub(i('x'), n(2))])),
          mul2(sub(SPECIAL.greek.beta, row([n(1), sub(i('x'), n(2))])), sub(i('x'), i('1i'))),
          add(
            mul2(
              sub(SPECIAL.greek.beta, row([i('i'), n(2)])),
              over(
                over(sub(i('ê'), row([i('i'), sub(i('x'), n(2))])), o('⏞')),
                paren([minus(sub(i('x'), i('2i')), sub(i('x̂'), i('2i')))])
              ),
            ),
            sub(i('û'), row([i('i'), sub(i('x'), n(2))]))
          ),
        ),
      ],
    ], { columnalign: 'right center left' }),
  ]),
  doc.figcaption`Fitted value subtraction.`
);

export const varianceBiasComparison = {
  vif: doc._figure(
    mathml([
      eq(
        sub(i('VIF'), i('j')),
        frac(
          [n(1)],
          [paren([n(1), space(4), o('-'), space(4), sup(sub(i('R'), i('j')), n(2))])]
        ),
      ),
    ]),
    doc.figcaption`Variance Inflation Factor`
  ),
  var: doc._figure(
    mathml([
      eq(
        eq(
          call('Var', sub(SPECIAL.greek.circumflex.beta, i('j'))),
          mul2(
            frac(
              [sup(SPECIAL.greek.sigma, n(2))],
              [sub(i('SST'), i('j'))]
            ),
            sub(i('VIF'), i('j')),
          ),
        ),
        frac(
          [sup(SPECIAL.greek.sigma, n(2))],
          [sub(i('SST'), i('j')), paren([n(1), space(4), o('-'), space(4), sup(sub(i('R'), i('j')), n(2))])]
        ),
      ),
    ]),
    doc.figcaption`Variance of β̂ⱼ expressed using VIFⱼ.`
  ),
  biasBeta1: doc._figure(
    mathml([
      eq(
        call('Var', sub(i('𝛽̃'), n(1))),
        frac([sup(i('𝜎'), n(2))], [sub(i('SST'), n(1))]),
      ),
    ]),
    doc.figcaption`Variance of 𝛽̃₁ (biased 𝛽̂₁)`,
  ),
};

export const standardError = {
  estimateStdDevivation: doc._figure(
    mathml([
      mathml.table([
        [
          sub(i('û'), i('i')),
          o('='),
          row([
            sub(i('y'), i('i')),
            space(4), o('-'), space(4), sub(SPECIAL.greek.circumflex.beta, n(0)),
            space(4), o('-'), space(4), mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), sub(i('x'), row([i('i'), n(1)]))),
            space(4), o('-'), space(4), mul2(sub(SPECIAL.greek.circumflex.beta, n(2)), sub(i('x'), row([i('i'), n(2)]))),
            space(4), SPECIAL.ellipse.h2,
            space(4), o('-'), space(4), mul2(sub(SPECIAL.greek.circumflex.beta, i('k')), sub(i('x'), row([i('i'), i('k')]))),
            space(4), o('.'),
          ]),
        ],

        [
          sup(SPECIAL.greek.circumflex.sigma, n(2)),
          o('='),
          eq(
            frac(
              [
                paren([
                  row([
                    sum(i('n'), row([i('i'), space(4), o('='), space(4), n(1)])),
                    space(6),
                    sup(sub(i('û'), i('i')), n(2)),
                  ]),
                ]),
              ],
              [
                mathml.row([i('n'), space(4), o('-'), space(4), i('k'), space(4), o('-'), space(4), n(1)]),
              ],
            ),
            row([
              frac(
                [i('SSR')],
                [row([i('n'), space(4), o('-'), space(4), i('k'), space(4), o('-'), space(4), n(1)])]
              ),
              space(4), o('.'),
            ]),
          ),
        ],
      ]),
    ]),
    doc.figcaption`estimating unbiased standard of 𝜎²`
  ),
  se: doc._figure(
    mathml([
      mathml.table([
        [
          mathml.call('sd', sub(i('x'), i('j'))),
          o('='),
          over(
            over(text('standard deviation'), o('⏞')),
            sqrt(
              mul3(
                inv(i('n')),
                mathml.sum(
                  i('n'),
                  mathml.row([
                    i('i'),
                    space(2),
                    o('='),
                    space(2),
                    n(1),
                  ])
                ),
                sup(
                  paren([
                    minus(
                      sub(i('x'), row([i('i'), i('j')])),
                      sub(i('x̄'), i('j')),
                    ),
                  ]),
                  n(2),
                )
              )
            ),
          ),
        ],
        [
          call('se', sub(SPECIAL.greek.circumflex.beta, i('j'))),
          o('='),
          frac(
            [SPECIAL.greek.circumflex.sigma],
            [
              mul3(
                sqrt(i('n')),
                call('sd', sub(i('x'), i('j'))),
                sqrt(minus(n(1), sup(sub(i('R'), i('j')), n(2))))
              ),
            ]
          ),
        ],
      ]),
    ]),
    doc.figcaption`
      standard deviation and its relation ${doc.br()}
      to the unbiased standard error of 𝜎²
    `,
  )
};

