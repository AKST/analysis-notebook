/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';

const {
  call, o, i, n, sup, sub, sum, subsup, table,
  paren, row, rows, text, space, over, frac,
  SPECIAL, inv, sqrt,
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
  eqId, eq, add, mul2, mul3, minusSqP,
  minus, minusP, add3,
} = mathmlHelper;

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

export const tStatistic = doc.figure(
  todo({}, 'See Slide 13'),
  'T Statistic',
);
