/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const {
  call, o, i, n, sup, sub, sum, subsup, table,
  paren, row, rows, text, space, over, frac,
  SPECIAL, inv, sqrt, under, multiscripts, abs,
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


export const normality = doc.figure(
  mathml([
    rows([
      row([
        i('u'), space(4), o('∼'), space(4),
        call('Normal', row([
          n(0), o(','), space(4),
          sup(SPECIAL.greek.sigma, n(2))
        ]))
      ]),
      row([
        call(
          'E',
          row([
            i('u'), space(4), o('|'), space(4),
            sub(i('x'), n(1)), o(','), space(4),
            SPECIAL.ellipse.h2, o(','), space(4),
            sub(i('x'), i('k'))
          ])
        ),
        space(4), o('='), space(4),
        call('E', i('u')),
        space(4), o('='), space(4),
        n(0)
      ]),
      row([
        call(
          'Var',
          row([
            i('u'), space(4), o('|'), space(4),
            sub(i('x'), n(1)), o(','), space(4),
            SPECIAL.ellipse.h2, o(','), space(4),
            sub(i('x'), i('k'))
          ])
        ),
        space(4), o('='), space(4),
        call('Var', i('u')),
        space(4), o('='), space(4),
        sup(SPECIAL.greek.sigma, n(2))
      ]),
    ])
  ], { style: 'font-size: 16px' }),
  'MLR 6 Normality Assumption',
);

export const samplingDistribution = doc.figure(
  mathml([
    rows([
      row([
        sub(SPECIAL.greek.circumflex.beta, i('j')),
        space(4), o('∼'), space(4),
        call(
          'Normal',
          row([
            sub(i('β'), i('j')),
            o(','), space(4),
            call('Var', sub(SPECIAL.greek.circumflex.beta, i('j')))
          ])
        )
      ]),
      row([space(8)]),
      row([
        frac(
          [
            row([
              sub(SPECIAL.greek.circumflex.beta, i('j')),
              space(4), o('−'), space(4),
              sub(i('β'), i('j'))
            ])
          ],
          [
            sqrt(call('Var', sub(SPECIAL.greek.circumflex.beta, i('j'))))
          ]
        ),
        space(4), o('∼'), space(4),
        call('Normal', row([n(0), o(','), space(4), n(1)]))
      ]),
      row([space(8)]),
    ])
  ], { style: 'font-size: 14px' }),
  'Nrm Sampling Dist under MLR1-6',
);

export const classicalLinearModel = doc.figure(
  mathml([
    rows([
      row([
        i('y'), space(4), o('|'), space(4), i('x'),
        space(4), o('∼'), space(4),
        call('Normal', row([
          sub(i('β'), n(0)),
          space(4), o('+'), space(4),
          mul2(sub(i('β'), n(1)), sub(i('x'), n(1))),
          space(4), o('+'), space(4),
          mul2(sub(i('β'), n(2)), sub(i('x'), n(2))),
          space(4), o('+'), space(4),
          SPECIAL.ellipse.h2,
          space(4), o('+'), space(4),
          mul2(sub(i('β'), i('k')), sub(i('x'), i('k'))),
          o(','), space(4),
          sup(SPECIAL.greek.sigma, n(2))
        ]))
      ]),
      row([]),
      row([
        i('x'), space(8),
        text('is short for'),
        space(8),
        row([
          paren([
            sub(i('x'), n(1)), o(','), space(8),
            SPECIAL.ellipse.h, o(','), space(8),
            sub(i('x'), i('k')),
          ]),
        ]),
      ]),
    ]),
  ], { style: 'font-size: 14px' }),
  'Summarising the Classical Linear Model (CLM)',
);

export const tDistributionOfEstimators = doc.figure(
  mathml([
    table([
      [
        i('A'),
        row([
          sub(SPECIAL.greek.circumflex.beta, i('j')),
          space(4), o('∼'), space(4),
          row([
            i('Normal'),
            ['mo', '['],
            sub(i('β'), i('j')),
            o(','), space(4),
            call('Var', sub(SPECIAL.greek.circumflex.beta, i('j'))),
            ['mo', ']']
          ])
        ])
      ],
      [
        i('B'),
        row([
          frac(
            [
              row([
                sub(SPECIAL.greek.circumflex.beta, i('j')),
                space(4), o('−'), space(4),
                sub(i('β'), i('j'))
              ])
            ],
            [
              call('sd', sub(SPECIAL.greek.circumflex.beta, i('j')))
            ]
          ),
          space(4), o('∼'), space(4),
          call('Normal', row([n(0), o(','), space(4), n(1)]))
        ])
      ]
    ])
  ]),
  'Classical Linear Model (CLM) assumptions 1 through 6 — showing Normal Sampling Distribution',
);

export const degreesOfFreedom = doc.figure(
  mathml([
    row([
      frac(
        [
          row([
            sub(SPECIAL.greek.circumflex.beta, i('j')),
            space(4), o('−'), space(4),
            sub(i('β'), i('j'))
          ])
        ],
        [
          call('se', sub(SPECIAL.greek.circumflex.beta, i('j')))
        ]
      ),
      space(4), o('∼'), space(4),
      sub(i('t'), row([i('n'), space(2), o('−'), space(2), i('k'), space(2), o('−'), space(2), n(1)])),
      space(4), o('='), space(4),
      sub(i('t'), i('df'))
    ])
  ]),
  doc.span.attr({ style: 'font-size: 8px' }).of(
    'Theorem for ', doc.b`degrees of freedom`,
    ' — the t-statistic for β̂', doc.br(),
    'follows a t-distribution with n−k−1 degrees of freedom.'
  ),
);

export const nullHypothesisOfBetaJ = doc.figure(
  mathml([
    row([
      sub(i('H'), n(0)),
      o(':'), space(4),
      sub(i('β'), i('j')),
      space(4), o('='), space(4),
      n(0)
    ])
  ]),
  'Null hypothesis for βⱼ — testing whether the coefficient equals zero.'
);

/**
 * @param {(m: typeof mathml) => E.Item} param
 * @param {{ null: string, alt: string }} cons
 * @param {(m: typeof mathml) => E.Item} thres
 * @param {E.Item} title
 * @param {{ test: 'one-sided' | 'two-sided' }} op
 */
export const hypothSet = (param, cons, thres, title, op) => doc.figure(
  mathml([
    rows([
      under(
        table([
          [row([sub(i('H'), n(0)), o(':')]), row([param(mathml), o(cons.null), thres(mathml)])],
          [row([sub(i('H'), n(1)), o(':')]), row([param(mathml), o(cons.alt), thres(mathml)])],
        ], { columnalign: 'right left' }),
        under(space(0), text('Hypothesis\'')),
      ),
      space(8),
      row([
        under(
          row([
            op.test === 'one-sided' ? row([
              multiscripts(param(mathml), { sup: [i('t'), undefined] }),
              space(4), o(cons.alt),
              space(4), i('c'),
            ]) : row([
              o('|'), i('c'), o('|'),
              space(4), o('<'), space(4),
              multiscripts(param(mathml), { sup: [i('t'), undefined] }),
            ]),
          ]),
          under(space(0), text('H₀ rejection rule')),
        ),
        space(32),
        under(
          row([
            op.test === 'one-sided' ? row([
              multiscripts(param(mathml), { sup: [i('t'), undefined] }),
              space(8), o(cons.null),
              space(8), i('c'),
            ]) : row([
              o('|'), i('c'), o('|'),
              space(4), o('>'), space(4),
              multiscripts(param(mathml), { sup: [i('t'), undefined] }),
            ]),
          ]),
          under(space(0), text('H₁ rejection rule')),
        ),
      ]),
    ]),
  ]),
  title,
);

export const tStatisticForBJ = doc.figure(
  mathml([
    eqId(
      sub(i('t'), sub(SPECIAL.greek.circumflex.beta, i('j'))),
      mathml.frac(
        [sub(SPECIAL.greek.circumflex.beta, i('j'))],
        [mathml.call('se', sub(SPECIAL.greek.circumflex.beta, i('j')))],
      ),
      o('.'),
    ),
  ]),
  't-statistic for β̂ⱼ'
);

export const signficantLevel = doc.figure(
  mathml([
    row([
      SPECIAL.greek.alpha,
      space(4),
      o('='),
      space(4),
      call(
        'P',
        row([
          text('Type 1 Error'),
          space(4),
          o('|'),
          space(4),
          sub(i('H'), n(0)),
        ])
      ),
    ]),
  ]),
  'Significance level'
);

export const criticalValue = doc.figure(
  mathml([
    mathml.table([
      [
        sub(i('c'), i('lower')),
        o('='),
        mathml.row([
          inv(i('CDF')),
          mathml.paren([
            frac([SPECIAL.greek.alpha], [n(2)]),
            o(';'),
            space(4),
            i('df'),
          ]),
        ]),
      ],
      [
        sub(i('c'), i('upper')),
        o('='),
        mathml.row([
          inv(i('CDF')),
          mathml.paren([
            minus(n(1), frac([SPECIAL.greek.alpha], [n(2)])),
            o(';'),
            space(4),
            i('df'),
          ]),
        ]),
      ],
    ], { columnalign: 'right center left' }),
  ]),
  'Critical Value',
);

export const pValue = doc.figure(
  mathml([eq(text('P-Value'), call('P', row([
    abs(i('T')),
    space(2), o('>'),
    space(2), abs(i('t')),
  ])))]),
  'The value of a P-Value',
);

export const tStatisticGeneral = doc.figure(
  mathml([
  ]),
  'General t-statistic'
)

export const ci95 = doc.figure(
  mathml([
    mathml.table([
      [
        sub(SPECIAL.greek.circumflex.beta, i('j')),
        o('±'),
        mul2(
          i('c'),
          mathml.call('se', sub(SPECIAL.greek.circumflex.beta, i('j')))
        ),
      ],

      [
        sub(i('β̲'), i('j')),
        o('≡'),
        minus(
          sub(SPECIAL.greek.circumflex.beta, i('j')),
          mul2(
            i('c'),
            mathml.call('se', sub(SPECIAL.greek.circumflex.beta, i('j')))
          )
        ),
      ],

      [
        sub(i('β̄'), i('j')),
        o('≡'),
        add(
          sub(SPECIAL.greek.circumflex.beta, i('j')),
          mul2(
            i('c'),
            mathml.call('se', sub(SPECIAL.greek.circumflex.beta, i('j')))
          )
        ),
      ],
    ], { columnalign: 'right center left' }),
  ]),
  '95 confidence interval'
);

export const exampleOfMultiParaHypothesis = {
  set: doc.figure(
    mathml([
      mathml.rows([
        mathml.row([
          sub(i('H'), n(0)),
          o(':'),
          space(4),
          eq(
            sub(SPECIAL.greek.beta, n(1)),
            sub(SPECIAL.greek.beta, n(2))
          ),
        ]),
        row([]),

        row([
          sub(i('H'), n(1)),
          o(':'),
          space(4),
          mathml.row([
            sub(SPECIAL.greek.beta, n(1)),
            space(4),
            o('<'),
            space(4),
            sub(SPECIAL.greek.beta, n(2)),
          ]),
        ]),

        row([]),

        row([
          i('t'),
          space(4),
          o('='),
          space(4),
          mathml.frac(
            [
              minus(
                sub(SPECIAL.greek.circumflex.beta, n(1)),
                sub(SPECIAL.greek.circumflex.beta, n(2))
              ),
            ],
            [
              mathml.call(
                'se',
                minus(
                  sub(SPECIAL.greek.circumflex.beta, n(1)),
                  sub(SPECIAL.greek.circumflex.beta, n(2))
                )
              ),
            ]
          ),
        ]),
      ]),
    ]),
    'Multi parameter hypothesises',
  ),
  rearranged: doc.figure(
    mathml([
      mathml.rows([
        // Row 1: H₀: β₁ − β₂ = 0
        mathml.row([
          sub(i('H'), n(0)),
          o(':'),
          space(4),
          eq(
            minus(
              sub(SPECIAL.greek.beta, n(1)),
              sub(SPECIAL.greek.beta, n(2))
            ),
            n(0)
          ),
        ]),

        // Row 2: H₁: β₁ − β₂ < 0
        mathml.row([
          sub(i('H'), n(1)),
          o(':'),
          space(4),
          mathml.row([
            minus(
              sub(SPECIAL.greek.beta, n(1)),
              sub(SPECIAL.greek.beta, n(2))
            ),
            space(4),
            o('<'),
            space(4),
            n(0),
            o(','),
          ]),
        ]),
      ]),
    ]),
    'one-sided hypothesis test for β₁ − β₂'
  ),
  constraint: doc.figure(
    mathml([
      eq(
        mathml.call(
          'Var',
          minus(
            sub(SPECIAL.greek.circumflex.beta, n(1)),
            sub(SPECIAL.greek.circumflex.beta, n(2))
          )
        ),
        add(
          mathml.call('Var', sub(SPECIAL.greek.circumflex.beta, n(1))),
          minus(
            mathml.call('Var', sub(SPECIAL.greek.circumflex.beta, n(2))),
            mul2(
              row([n(2), space(4)]),
              mathml.call(
                'Cov',
                sub(SPECIAL.greek.circumflex.beta, n(1)),
                sub(SPECIAL.greek.circumflex.beta, n(2))
              )
            )
          )
        ),
      ),
    ]),
    'variance of difference between β̂₁ and β̂₂'
  ),
  seConstraint: doc.figure(
    mathml([
      eq(
        mathml.call(
          'se',
          minus(
            sub(SPECIAL.greek.circumflex.beta, n(1)),
            sub(SPECIAL.greek.circumflex.beta, n(2))
          )
        ),
        sup(
          paren([
            minus(
              add(
                sup(
                  row([
                    o('['),
                    call('se', sub(SPECIAL.greek.circumflex.beta, n(1))),
                    o(']'),
                  ]),
                  n(2)
                ),
                sup(
                  row([
                    o('['),
                    call('se', sub(SPECIAL.greek.circumflex.beta, n(2))),
                    o(']'),
                  ]),
                  n(2)
                ),
              ),
              mul2(n(2), sub(i('s'), row([n(1), n(2)])))
            ),
          ]),
          frac([n(1)], [n(2)])
        )
      ),
    ]),
    'standard error of β̂₁ − β̂₂'
  ),
};

export const aliasOf2Params = {
  alias: doc.figure(
	  mathml([
	    eq(
	      sub(SPECIAL.greek.theta, n(1)),
	      minus(
	        sub(SPECIAL.greek.beta, n(1)),
	        sub(SPECIAL.greek.beta, n(2))
	      )
	    ),
	  ]),
	  'parameter definition θ₁'
	),
	null: doc.figure(
	  mathml([
	    mathml.row([
	      sub(i('H'), n(0)),
	      o(':'),
	      space(4),
	      eq(
	        sub(SPECIAL.greek.theta, n(1)),
	        n(0)
	      ),
	    ]),
	  ]),
	  'null hypothesis'
	),
	alt: doc.figure(
	  mathml([
	    mathml.row([
	      sub(i('H'), n(1)),
	      o(':'),
	      space(4),
	      mathml.row([
	        sub(SPECIAL.greek.theta, n(1)),
	        space(4),
	        o('<'),
	        space(4),
	        n(0),
	      ]),
	    ]),
	  ]),
	  'alternative hypothesis'
	),
	tStat: doc.figure(
	  mathml([
	    mathml.row([
	      i('t'),
	      space(4),
	      o('='),
	      space(4),
	      mathml.frac(
	        [sub(i('𝜃̂'), n(1))],
	        [mathml.call('se', sub(i('𝜃̂'), n(1)))]
	      ),
	    ]),
	  ]),
	  't-statistic for θ̂₁'
	),
	plugAlias: doc.figure(
		mathml([
	    table([
	      [
	        mathml.call('log', i('y')),
	        o('='),
	        add3(
	          sub(SPECIAL.greek.beta, n(0)),
	          mul2(
	            paren([
	              add(
	                sub(SPECIAL.greek.theta, n(1)),
	                sub(SPECIAL.greek.beta, n(2))
	              ),
	            ]),
	            sub(i('x'), n(1)),
	          ),
	          add3(
	            mul2(sub(SPECIAL.greek.beta, n(2)), sub(i('x'), n(2))),
	            mul2(sub(SPECIAL.greek.beta, n(3)), sub(i('x'), n(3))),
	            i('u')
	          )
	        ),
	      ],

	      [
	        mathml.space(0),
	        o('='),
	        add3(
	          sub(SPECIAL.greek.beta, n(0)),
	          mul2(sub(SPECIAL.greek.theta, n(1)), sub(i('x'), n(1))),
	          add3(
	            mul2(
                sub(SPECIAL.greek.beta, n(2)),
                paren([add(sub(i('x'), n(1)), sub(i('x'), n(2)))]),
              ),
	            mul2(sub(SPECIAL.greek.beta, n(3)), sub(i('x'), n(3))),
	            i('u')
	          )
	        ),
	      ],

        [
          space(0),
          o('='),
          add3(
            sub(SPECIAL.greek.beta, n(0)),
            mul2(sub(SPECIAL.greek.theta, n(1)), sub(i('x'), n(1))),
            add3(
              mul2(sub(SPECIAL.greek.beta, n(2)), sub(i('x'), row([n(1),o('+'),n(2)]))),
              mul2(sub(SPECIAL.greek.beta, n(3)), sub(i('x'), n(3))),
              i('u')
            )
          ),
        ],
	    ], { columnalign: 'right center left' }),
	  ]),
	  'plug alias into population model'
	),
  solvedModel: doc.figure(
    mathml([
      eq(
        mathml.call('log', i('y')),
        add3(
          sub(SPECIAL.greek.beta, n(0)),
          mul2(sub(SPECIAL.greek.theta, n(1)), sub(i('x'), n(1))),
          add3(
            mul2(sub(SPECIAL.greek.beta, n(2)), sub(i('x'), row([n(1),o('+'),n(2)]))),
            mul2(sub(SPECIAL.greek.beta, n(3)), sub(i('x'), n(3))),
            i('u')
          )
        )
      ),
    ]),
    'solved model'
  ),
}


