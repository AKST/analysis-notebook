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
  eqId, eq, add, mul3, minusSqP,
  minus, minusP, div, divP, add3,
} = mathmlHelper;

/** @param {E.Item} a @param {E.Item} b */
const mul2 = (a, b) => row([a, b]);

export const consistency = {
  proofOfUnbiasness: doc.figure(
    mathml([
      table([
        [
          sub(SPECIAL.greek.circumflex.beta, n(1)),
          o('='),
          div(
            mathml.paren([
              mathml.sum(
                i('n'),
                mathml.row([
                  i('i'),
                  space(4),
                  o('='),
                  space(4),
                  n(1),
                ])
              ),
              space(4),
              paren([
                minus(
                  sub(i('x'), row([i('i'), n(1)])),
                  over(i('x'), n(1))
                ),
              ]),
              sub(i('y'), i('i')),
            ]),
            mathml.paren([
              mathml.sum(
                i('n'),
                mathml.row([
                  i('i'),
                  space(4),
                  o('='),
                  space(4),
                  n(1),
                ])
              ),
              space(4),
              sup(
                paren([
                  minus(
                    sub(i('x'), row([i('i'), n(1)])),
                    over(i('x'), n(1))
                  ),
                ]),
                n(2)
              ),
            ]),
          ),
        ],

        [
          space(0),
          o('='),
          add(
            sub(SPECIAL.greek.beta, n(1)),
            div(
              paren([
                mul2(
                  mul2(
                    inv(i('n')),
                    mathml.sum(
                      i('n'),
                      mathml.row([
                        i('i'),
                        o('='),
                        n(1),
                      ])
                    ),
                  ), mul2(
                    paren([
                      minus(
                        sub(i('x'), row([i('i'), n(1)])),
                        over(i('x'), n(1))
                      ),
                    ]),
                    sub(i('u'), i('i'))
                  ),
                ),
              ]),
              paren([
                mul3(
                  inv(i('n')),
                  mathml.sum(
                    i('n'),
                    mathml.row([
                      i('i'),
                      o('='),
                      n(1),
                    ])
                  ),
                  sup(
                    paren([
                      minus(
                        sub(i('x'), row([i('i'), n(1)])),
                        over(i('x'), n(1))
                      ),
                    ]),
                    n(2)
                  )
                ),
              ]),
            ),
          ),
        ],
      ], { columnalign: 'right center left' }),
    ]),
    'derivation of β̂₁ using sample covariance and variance terms'
  ),
  probabilityLimits: doc.figure(
    mathml([
      mathml.table([
        [
          row([i('plim'), space(4), sub(SPECIAL.greek.circumflex.beta, n(1))]),
          o('='),
          add(
            sub(SPECIAL.greek.beta, n(1)),
            divP(
              mathml.call('Cov', row([sub(i('x'), n(1)), o(','), space(4), i('u')])),
              mathml.call('Var', row([sub(i('x'), n(1))]))
            ),
          ),
        ],
        [
          space(0),
          o('='),
          row([
            sub(SPECIAL.greek.beta, n(1)),
            space(16),
            mathml.text('because'),
            space(16),
            eq(
              mathml.call('Cov', row([sub(i('x'), n(1)), o(','), space(4), i('u')])),
              n(0)
            ),
          ]),
        ],
      ], { columnalign: 'right center left left' }),
    ]),
    'Probability limit and covariance condition'
  ),
  assumption: doc.figure(
    mathml([
      row([
        mathml.call('Var', sub(i('x'), n(1))),
        space(4),
        o('<'),
        space(4),
        i('∞'),
      ], { style: 'border: 1px solid black; padding: 4px 8px' }),
      space(32),
      row([
        mathml.call('Var', i('u')),
        space(4),
        o('<'),
        space(4),
        i('∞')
      ], { style: 'border: 1px solid black; padding: 4px 8px' })
    ]),
    'Finite variance condition'
  ),
  strongerMLR4_1: doc.figure(
    mathml([
      row([
        eq(
          mathml.call('E', i('u')),
          n(0)
        ),
        space(16),
        eq(
          mathml.call('Cov', sub(i('x'), i('j')), o(','), space(4), i('u')),
          n(0)
        ),
        o(','),
        space(4),
        mathml.text('for'),
        space(4),
        eq(
          i('j'),
          row([
            n(1),
            o(','),
            space(4),
            n(2),
            o(','),
            space(4),
            SPECIAL.ellipse.h2,
            o(','),
            space(4),
            i('k')
          ])
        )
      ])
    ]),
    "Assumption MLR 4' (stronger MLR 4)"
  ),
  prf: doc.figure(
    mathml([
      eq(
        row([
          call('E', i('y'), row([i('x₁'), o(','), space(4), SPECIAL.ellipse.h2, o(','), space(4), i('xₖ')])),
        ]),
        add3(
          sub(SPECIAL.greek.beta, n(0)),
          mul2(sub(SPECIAL.greek.beta, n(1)), sub(i('x'), n(1))),
          add(
            SPECIAL.ellipse.h2,
            mul2(sub(SPECIAL.greek.beta, i('k')), sub(i('x'), i('k')))
          )
        )
      )
    ]),
    'Population regression function'
  ),
};

export const inconsistency = {
  asymptoticBias: doc.figure(
    mathml([
      eq(
        row([
          i('plim'),
          space(4),
          sub(SPECIAL.greek.circumflex.beta, n(1)),
          space(4), o('-'), space(4),
          sub(SPECIAL.greek.beta, n(1))
        ]),
        frac(
          [call('Cov', sub(i('x'), n(1)), i('u'))],
          [call('Var', sub(i('x'), n(1)))]
        )
      ),
    ]),
    'Probability limit bias of β̂₁'
  ),
  omittedVarExample: doc.figure(
    mathml([
      table([
        [
          row([
            i('plim'),
            space(4),
            sub(i('𝛽̃'), n(1))
          ]),
          o('='),
          row([
            add(
              sub(SPECIAL.greek.beta, n(1)),
              mul2(sub(SPECIAL.greek.beta, n(2)), sub(SPECIAL.greek.delta, n(1)))
            )
          ])
        ],
        [
          sub(i('𝛿'), n(1)),
          o('='),
          div(
            call('Cov', sub(i('x'), n(1)), sub(i('x'), n(2))),
            call('Var', sub(i('x'), n(1)))
          )
        ]
      ], { columnalign: 'right center left' })
    ]),
    'Probability limit in omitted variable case'
  ),
};


