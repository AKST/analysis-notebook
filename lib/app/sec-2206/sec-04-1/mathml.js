/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml, mathml2, doc } from '../../prelude.js';
import { components, mathmlHelper } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const {
  call, n, sup, sub, sum, subsup, table,
  paren, row, rows, text, space, over, frac,
  SPECIAL, inv, sqrt, under, multiscripts, abs,
} = mathml;

const { mi, mo } = mathml2;

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
          mo`=`,
          div(
            mathml.paren([
              mathml.sum(
                mi`n`,
                mathml.row([
                  mi`i`,
                  space(4),
                  mo`=`,
                  space(4),
                  n(1),
                ])
              ),
              space(4),
              paren([
                minus(
                  sub(mi`x`, row([mi`i`, n(1)])),
                  over(mi`x`, n(1))
                ),
              ]),
              sub(mi`y`, mi`i`),
            ]),
            mathml.paren([
              mathml.sum(
                mi`n`,
                mathml.row([
                  mi`i`,
                  space(4),
                  mo`=`,
                  space(4),
                  n(1),
                ])
              ),
              space(4),
              sup(
                paren([
                  minus(
                    sub(mi`x`, row([mi`i`, n(1)])),
                    over(mi`x`, n(1))
                  ),
                ]),
                n(2)
              ),
            ]),
          ),
        ],

        [
          space(0),
          mo`=`,
          add(
            sub(SPECIAL.greek.beta, n(1)),
            div(
              paren([
                mul2(
                  mul2(
                    inv(mi`n`),
                    mathml.sum(
                      mi`n`,
                      mathml.row([
                        mi`i`,
                        mo`=`,
                        n(1),
                      ])
                    ),
                  ), mul2(
                    paren([
                      minus(
                        sub(mi`x`, row([mi`i`, n(1)])),
                        over(mi`x`, n(1))
                      ),
                    ]),
                    sub(mi`u`, mi`i`)
                  ),
                ),
              ]),
              paren([
                mul3(
                  inv(mi`n`),
                  mathml.sum(
                    mi`n`,
                    mathml.row([
                      mi`i`,
                      mo`=`,
                      n(1),
                    ])
                  ),
                  sup(
                    paren([
                      minus(
                        sub(mi`x`, row([mi`i`, n(1)])),
                        over(mi`x`, n(1))
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
    doc.figcaption`derivation of β̂₁ using sample covariance and variance terms`
  ),
  probabilityLimits: doc.figure(
    mathml([
      mathml.table([
        [
          row([mi`plim`, space(4), sub(SPECIAL.greek.circumflex.beta, n(1))]),
          mo`=`,
          add(
            sub(SPECIAL.greek.beta, n(1)),
            divP(
              mathml.call('Cov', row([sub(mi`x`, n(1)), mo`,`, space(4), mi`u`])),
              mathml.call('Var', row([sub(mi`x`, n(1))]))
            ),
          ),
        ],
        [
          space(0),
          mo`=`,
          row([
            sub(SPECIAL.greek.beta, n(1)),
            space(16),
            mathml.text('because'),
            space(16),
            eq(
              mathml.call('Cov', row([sub(mi`x`, n(1)), mo`,`, space(4), mi`u`])),
              n(0)
            ),
          ]),
        ],
      ], { columnalign: 'right center left left' }),
    ]),
    doc.figcaption`Probability limit and covariance condition`
  ),
  assumption: doc.figure(
    mathml([
      row([
        mathml.call('Var', sub(mi`x`, n(1))),
        space(4),
        mo`<`,
        space(4),
        mi`∞`,
      ], { style: 'border: 1px solid black; padding: 4px 8px' }),
      space(32),
      row([
        mathml.call('Var', mi`u`),
        space(4),
        mo`<`,
        space(4),
        mi`∞`
      ], { style: 'border: 1px solid black; padding: 4px 8px' })
    ]),
    doc.figcaption`Finite variance condition`
  ),
  strongerMLR4_1: doc.figure(
    mathml([
      row([
        eq(
          mathml.call('E', mi`u`),
          n(0)
        ),
        space(16),
        eq(
          mathml.call('Cov', sub(mi`x`, mi`j`), mo`,`, space(4), mi`u`),
          n(0)
        ),
        mo`,`,
        space(4),
        mathml.text('for'),
        space(4),
        eq(
          mi`j`,
          row([
            n(1),
            mo`,`,
            space(4),
            n(2),
            mo`,`,
            space(4),
            SPECIAL.ellipse.h2,
            mo`,`,
            space(4),
            mi`k`
          ])
        )
      ])
    ]),
    doc.figcaption`Assumption MLR 4' (stronger MLR 4)`
  ),
  prf: doc.figure(
    mathml([
      eq(
        row([
          call('E', mi`y`, row([mi`x₁`, mo`,`, space(4), SPECIAL.ellipse.h2, mo`,`, space(4), mi`xₖ`])),
        ]),
        add3(
          sub(SPECIAL.greek.beta, n(0)),
          mul2(sub(SPECIAL.greek.beta, n(1)), sub(mi`x`, n(1))),
          add(
            SPECIAL.ellipse.h2,
            mul2(sub(SPECIAL.greek.beta, mi`k`), sub(mi`x`, mi`k`))
          )
        )
      )
    ]),
    doc.figcaption`Population regression function`
  ),
};

export const inconsistency = {
  asymptoticBias: doc.figure(
    mathml([
      eq(
        row([
          mi`plim`,
          space(4),
          sub(SPECIAL.greek.circumflex.beta, n(1)),
          space(4), mo`-`, space(4),
          sub(SPECIAL.greek.beta, n(1))
        ]),
        frac(
          [call('Cov', sub(mi`x`, n(1)), mi`u`)],
          [call('Var', sub(mi`x`, n(1)))]
        )
      ),
    ]),
    doc.figcaption`Probability limit bias of β̂₁`
  ),
  omittedVarExample: doc.figure(
    mathml([
      table([
        [
          row([
            mi`plim`,
            space(4),
            sub(mi`𝛽̃`, n(1))
          ]),
          mo`=`,
          row([
            add(
              sub(SPECIAL.greek.beta, n(1)),
              mul2(sub(SPECIAL.greek.beta, n(2)), sub(SPECIAL.greek.delta, n(1)))
            )
          ])
        ],
        [
          sub(mi`𝛿`, n(1)),
          mo`=`,
          div(
            call('Cov', sub(mi`x`, n(1)), sub(mi`x`, n(2))),
            call('Var', sub(mi`x`, n(1)))
          )
        ]
      ], { columnalign: 'right center left' })
    ]),
    doc.figcaption`Probability limit in omitted variable case`
  ),
};

export const normality = {
  samplingDistribution: doc.figure(
    mathml([
      table([
        [
          div(
            minusP(SPECIAL.greek.circumflex.beta, SPECIAL.greek.beta),
            call('SD', SPECIAL.greek.circumflex.beta)
          ),
          mo`~ͣ`,
          call('Normal', n(0), n(1))
        ],
        [
          div(
            minusP(SPECIAL.greek.circumflex.beta, SPECIAL.greek.beta),
            call('SE', SPECIAL.greek.circumflex.beta)
          ),
          mo`~ͣ`,
          call('Normal', n(0), n(1))
        ],
        [
          div(
            minusP(SPECIAL.greek.circumflex.beta, SPECIAL.greek.beta),
            call('SE', SPECIAL.greek.circumflex.beta)
          ),
          mo`~ͣ`,
          row([
            sub(mi`t`, row([mi`n`, mo`-`, mi`k`, mo`-`, n(1)])),
            space(4),
            mo`=`,
            space(4),
            sub(mi`t`, mi`df`)
          ])
        ]
      ])
    ]),
    doc.figcaption`Sampling distributions of standardized estimators`
  ),
  estimatedVariance: doc.figure(
    mathml([
      eq(
        mathml.call('Var', sub(mathml.SPECIAL.greek.circumflex.beta, mi`j`)),
        frac(
          [ sup(mathml.SPECIAL.greek.circumflex.sigma, n(2)) ],
          [
            mul2(
              sub(mi`SST`, mi`j`),
              paren([
                minus(n(1), subsup(mi`R`, mi`j`, n(2)))
              ])
            )
          ]
        )
      ),
    ]),
    doc.figcaption`Estimated Variance of β̂ⱼ`,
  ),
  asymptoticStdErr: doc.figure(
    mathml([
      row([
        mathml.call('se', sub(mathml.SPECIAL.greek.circumflex.beta, mi`j`)),
        space(4), mo`≈`, space(4),
        frac(
          [
            mi`σ`,
          ],
          [
            mul2(
              sub(mi`σ`, mi`j`),
              mathml.sqrt(
                minusP(n(1), sup(sub(mathml.SPECIAL.greek.rho, mi`j`), n(2)))
              )
            ),
            mathml.sqrt(mi`n`)
          ]
        ),
      ]),
    ]),
    doc.figcaption`Asymptotic standard error of β̂_j`
  ),
};


