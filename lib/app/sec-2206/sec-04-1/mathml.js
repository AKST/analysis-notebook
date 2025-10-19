/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml, mathml2, doc } from '../../prelude.js';
import { components, mathmlHelper, mathmlHelper_2 } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const {
  call, n, sup, sub, sum, subsup, table,
  paren, space, frac,
  SPECIAL, inv, sqrt, under, multiscripts, abs,
} = mathml;

const { mi, mo, mtext, mrow, mover } = mathml2;

const { rows: rows2 } = mathmlHelper_2;

const { todo } = components;

const {
  eqId, eq, add, mul3, minusSqP,
  minus, minusP, div, divP, add3,
} = mathmlHelper;

/** @param {E.Item} a @param {E.Item} b */
const mul2 = (a, b) => mrow(a, b);

export const consistency = {
  proofOfUnbiasness: doc.figure(
    mathml2.math(
      table([
        [
          sub(SPECIAL.greek.circumflex.beta, n(1)),
          mo`=`,
          div(
            mathml.paren([
              mathml.sum(
                mi`n`,
                mrow(
                  mi`i`,
                  space(4),
                  mo`=`,
                  space(4),
                  n(1),
                )
              ),
              space(4),
              paren([
                minus(
                  sub(mi`x`, mrow(mi`i`, n(1))),
                  mover(n(1), mi`x`)
                ),
              ]),
              sub(mi`y`, mi`i`),
            ]),
            mathml.paren([
              mathml.sum(
                mi`n`,
                mrow(
                  mi`i`,
                  space(4),
                  mo`=`,
                  space(4),
                  n(1),
                )
              ),
              space(4),
              sup(
                paren([
                  minus(
                    sub(mi`x`, mrow(mi`i`, n(1))),
                    mover(n(1), mi`x`)
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
                      mrow(
                        mi`i`,
                        mo`=`,
                        n(1),
                      )
                    ),
                  ), mul2(
                    paren([
                      minus(
                        sub(mi`x`, mrow(mi`i`, n(1))),
                        mover(n(1), mi`x`)
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
                    mrow(
                      mi`i`,
                      mo`=`,
                      n(1),
                    )
                  ),
                  sup(
                    paren([
                      minus(
                        sub(mi`x`, mrow(mi`i`, n(1))),
                        mover(n(1), mi`x`)
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
    ),
    doc.figcaption`derivation of β̂₁ using sample covariance and variance terms`
  ),
  probabilityLimits: doc.figure(
    mathml2.math(
      mathml.table([
        [
          mrow(mi`plim`, space(4), sub(SPECIAL.greek.circumflex.beta, n(1))),
          mo`=`,
          add(
            sub(SPECIAL.greek.beta, n(1)),
            divP(
              mathml.call('Cov', mrow(sub(mi`x`, n(1)), mo`,`, space(4), mi`u`)),
              mathml.call('Var', mrow(sub(mi`x`, n(1))))
            ),
          ),
        ],
        [
          space(0),
          mo`=`,
          mrow(
            sub(SPECIAL.greek.beta, n(1)),
            space(16),
            mtext`because`,
            space(16),
            eq(
              mathml.call('Cov', mrow(sub(mi`x`, n(1)), mo`,`, space(4), mi`u`)),
              n(0)
            ),
          ),
        ],
      ], { columnalign: 'right center left left' }),
    ),
    doc.figcaption`Probability limit and covariance condition`
  ),
  assumption: doc.figure(
    mathml2.math(
      mrow(
        mrow.attr({ style: 'border: 1px solid black; padding: 4px 8px' })(
          mathml.call('Var', sub(mi`x`, n(1))),
          space(4),
          mo`<`,
          space(4),
          mi`∞`,
        ),
        space(32),
        mrow.attr({ style: 'border: 1px solid black; padding: 4px 8px' })(
          mathml.call('Var', mi`u`),
          space(4),
          mo`<`,
          space(4),
          mi`∞`
        )
      )
    ),
    doc.figcaption`Finite variance condition`
  ),
  strongerMLR4_1: doc.figure(
    mathml2.math(
      mrow(
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
        mtext`for`,
        space(4),
        eq(
          mi`j`,
          mrow(
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
          )
        )
      )
    ),
    doc.figcaption`Assumption MLR 4' (stronger MLR 4)`
  ),
  prf: doc.figure(
    mathml2.math(
      eq(
        mrow(
          call('E', mi`y`, mrow(mi`x₁`, mo`,`, space(4), SPECIAL.ellipse.h2, mo`,`, space(4), mi`xₖ`)),
        ),
        add3(
          sub(SPECIAL.greek.beta, n(0)),
          mul2(sub(SPECIAL.greek.beta, n(1)), sub(mi`x`, n(1))),
          add(
            SPECIAL.ellipse.h2,
            mul2(sub(SPECIAL.greek.beta, mi`k`), sub(mi`x`, mi`k`))
          )
        )
      )
    ),
    doc.figcaption`Population regression function`
  ),
};

export const inconsistency = {
  asymptoticBias: doc.figure(
    mathml2.math(
      eq(
        mrow(
          mi`plim`,
          space(4),
          sub(SPECIAL.greek.circumflex.beta, n(1)),
          space(4), mo`-`, space(4),
          sub(SPECIAL.greek.beta, n(1))
        ),
        frac(
          [call('Cov', sub(mi`x`, n(1)), mi`u`)],
          [call('Var', sub(mi`x`, n(1)))]
        )
      ),
    ),
    doc.figcaption`Probability limit bias of β̂₁`
  ),
  omittedVarExample: doc.figure(
    mathml2.math(
      table([
        [
          mrow(
            mi`plim`,
            space(4),
            sub(mi`𝛽̃`, n(1))
          ),
          mo`=`,
          mrow(
            add(
              sub(SPECIAL.greek.beta, n(1)),
              mul2(sub(SPECIAL.greek.beta, n(2)), sub(SPECIAL.greek.delta, n(1)))
            )
          )
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
    ),
    doc.figcaption`Probability limit in omitted variable case`
  ),
};

export const normality = {
  samplingDistribution: doc.figure(
    mathml2.math(
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
          mrow(
            sub(mi`t`, mrow(mi`n`, mo`-`, mi`k`, mo`-`, n(1))),
            space(4),
            mo`=`,
            space(4),
            sub(mi`t`, mi`df`)
          )
        ]
      ])
    ),
    doc.figcaption`Sampling distributions of standardized estimators`
  ),
  estimatedVariance: doc.figure(
    mathml2.math(
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
    ),
    doc.figcaption`Estimated Variance of β̂ⱼ`,
  ),
  asymptoticStdErr: doc.figure(
    mathml2.math(
      mrow(
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
      ),
    ),
    doc.figcaption`Asymptotic standard error of β̂_j`
  ),
};


