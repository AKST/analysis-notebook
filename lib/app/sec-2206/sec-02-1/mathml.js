/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';

const {
  call, o, i, n, sup, sub, sum, subsup,
  paren, row, rows, text, space, over, frac,
  SPECIAL, inv, under, table,
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

export const concequenceOfOmittedVariableBias = doc.figure(
  todo({}, 'See Slide 3'),
  'Concequences of Omitted Variable Bias',
);

export const residuals = doc.figure(
  mathml([
    eq(
      sub(vars.u, i('i')),
      minus(
        sub(i('y'), i('i')),
        sub(i('ŷ'), i('i'))
      )
    )
  ]),
  'Residuals',
);

/**
 * @param {string} name
 * @param {string} y
 * @param {string[]} xs
 */
export const createFigure = (name, y, xs) => doc.figure(
  mathml([
    row([
      under(i('y'), under(o('⏟'), text(y))),
      space(4), o('='), space(4),
      ...xs.flatMap((x, index) => [
        sub(i('β'), n(index)),
        under(sub(i('x'), n(index)), under(o('⏟'), text(x))),
        space(4), o('+'), space(4)
      ]),
      i('u'),
    ]),
  ]),
  name,
);

export const quadraticExpressionInMLR = {
  regression: doc.figure(
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
    'Quadratic Equation',
  ),
  relation: doc.figure(
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
    'Interpreting coefficent in quadratic equation MLRs',
  ),
};

export const size2MLR = {
  ols: doc.figure(
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
    'OLS for 2 Regressors',
  ),
  regression: doc.figure(
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
    'general MLR with 2 independent vars',
  ),
  estimate: doc.figure(
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
    'Estimated Model with 2 regressors',
  ),
  assumption: doc.figure(
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
    'other factors affecting y do not affect x1 or x2'
  ),
  partialEffect: doc.figure(
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
    'Ceteris Paribus interpretation',
  ),
};

export const sizeKMLR = {
  regression: doc.figure(
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
    'General MLR',
  ),
  estimate: doc.figure(
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
    'Estimated Model with K regressors',
  ),
  assumption: doc.figure(
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
    'Conditional expectation assumption',
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

    return doc.figure(
      mathml([
        table([
          [sigma(inner), o('='), n(0) ],
          [sigma(mul2(sub(i('x'), row([i('i'), n(1)])), inner)), o('='), n(0) ],
          [sigma(mul2(sub(i('x'), row([i('i'), n(2)])), inner)), o('='), n(0) ],
          [SPECIAL.ellipse.v, space(4), space(4) ],
          [sigma(mul2(sub(i('x'), row([i('i'), i('k')])), inner)), o('='), n(0) ],
        ], { columnalign: 'left center left' }),
      ]),
      'OLS Constraint for K regressors',
    );
  },
  partialEffect: doc.figure(
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
    'Ceteris Paribus interpretation'
  ),
  fitted: doc.figure(
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
    'Fitted values',
  ),
  throughOrigin: doc.figure(
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
    'Regressoin through the origin',
  ),
};

export const assumptions = {
  mlr4: doc.figure(
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
    'Zero Conditional Mean',
  ),
  mlr5: doc.figure(
    mathml([]),
    'Homoskedasticity',
  ),
};

export const unbiasedness = {
  theorum3_1: doc.figure(
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
    'Unbiasedness of OLS',
  ),
};
