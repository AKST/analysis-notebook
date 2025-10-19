/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml, mathml2, doc } from '../../prelude.js';
import { components, mathmlHelper, mathmlHelper_2 } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const {
  call, table,
  paren, frac,
  SPECIAL, inv, multiscripts, abs,
} = mathml;

const { mi, mo, mtext, mrow, mover, mn, msup, msub, msubsup, msqrt, munder, mspace } = mathml2;

const { rows: rows2, sum } = mathmlHelper_2;

const { todo } = components;

const {
  eqId, eq, add, mul3, minusSqP,
  minus, minusP, div, divP, add3,
} = mathmlHelper;

/** @param {E.Item} a @param {E.Item} b */
const mul2 = (a, b) => mrow(a, b);

const summaise = sum.attr({ max: mi`n`, inc: mrow(mi`i`, mo`=`, mn(0)) })();

export const consistency = {
  proofOfUnbiasness: doc.figure(
    mathml2.math(
      table([
        [
          msub(SPECIAL.greek.circumflex.beta, mn(1)),
          mo`=`,
          div(
            mathml.paren([
              summaise,
              mspace(4),
              paren([
                minus(
                  msub(mi`x`, mrow(mi`i`, mn(1))),
                  msub(mi`x̄`, mn(1))
                ),
              ]),
              msub(mi`y`, mi`i`),
            ]),
            mathml.paren([
              summaise,
              mspace(4),
              msup(
                paren([
                  minus(
                    msub(mi`x`, mrow(mi`i`, mn(1))),
                    msub(mi`x̄`, mn(1))
                  ),
                ]),
                mn(2)
              ),
            ]),
          ),
        ],

        [
          mspace(0),
          mo`=`,
          add(
            msub(SPECIAL.greek.beta, mn(1)),
            div(
              paren([
                mul2(
                  mul2(
                    inv(mi`n`),
                    summaise,
                  ), mul2(
                    paren([
                      minus(
                        msub(mi`x`, mrow(mi`i`, mn(1))),
                        msub(mi`x̄`, mn(1))
                      ),
                    ]),
                    msub(mi`u`, mi`i`)
                  ),
                ),
              ]),
              paren([
                mul3(
                  inv(mi`n`),
                  summaise,
                  msup(
                    paren([
                      minus(
                        msub(mi`x`, mrow(mi`i`, mn(1))),
                        msub(mi`x̄`, mn(1))
                      ),
                    ]),
                    mn(2)
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
          mrow(mi`plim`, mspace(4), msub(SPECIAL.greek.circumflex.beta, mn(1))),
          mo`=`,
          add(
            msub(SPECIAL.greek.beta, mn(1)),
            divP(
              mathml.call('Cov', mrow(msub(mi`x`, mn(1)), mo`,`, mspace(4), mi`u`)),
              mathml.call('Var', mrow(msub(mi`x`, mn(1))))
            ),
          ),
        ],
        [
          mspace(0),
          mo`=`,
          mrow(
            msub(SPECIAL.greek.beta, mn(1)),
            mspace(16),
            mtext`because`,
            mspace(16),
            eq(
              mathml.call('Cov', mrow(msub(mi`x`, mn(1)), mo`,`, mspace(4), mi`u`)),
              mn(0)
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
          mathml.call('Var', msub(mi`x`, mn(1))),
          mspace(4),
          mo`<`,
          mspace(4),
          mi`∞`,
        ),
        mspace(32),
        mrow.attr({ style: 'border: 1px solid black; padding: 4px 8px' })(
          mathml.call('Var', mi`u`),
          mspace(4),
          mo`<`,
          mspace(4),
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
          mn(0)
        ),
        mspace(16),
        eq(
          mathml.call('Cov', msub(mi`x`, mi`j`), mo`,`, mspace(4), mi`u`),
          mn(0)
        ),
        mo`,`,
        mspace(4),
        mtext`for`,
        mspace(4),
        eq(
          mi`j`,
          mrow(
            mn(1),
            mo`,`,
            mspace(4),
            mn(2),
            mo`,`,
            mspace(4),
            SPECIAL.ellipse.h2,
            mo`,`,
            mspace(4),
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
          call('E', mi`y`, mrow(mi`x₁`, mo`,`, mspace(4), SPECIAL.ellipse.h2, mo`,`, mspace(4), mi`xₖ`)),
        ),
        add3(
          msub(SPECIAL.greek.beta, mn(0)),
          mul2(msub(SPECIAL.greek.beta, mn(1)), msub(mi`x`, mn(1))),
          add(
            SPECIAL.ellipse.h2,
            mul2(msub(SPECIAL.greek.beta, mi`k`), msub(mi`x`, mi`k`))
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
          mspace(4),
          msub(SPECIAL.greek.circumflex.beta, mn(1)),
          mspace(4), mo`-`, mspace(4),
          msub(SPECIAL.greek.beta, mn(1))
        ),
        frac(
          [call('Cov', msub(mi`x`, mn(1)), mi`u`)],
          [call('Var', msub(mi`x`, mn(1)))]
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
            mspace(4),
            msub(mi`𝛽̃`, mn(1))
          ),
          mo`=`,
          mrow(
            add(
              msub(SPECIAL.greek.beta, mn(1)),
              mul2(msub(SPECIAL.greek.beta, mn(2)), msub(SPECIAL.greek.delta, mn(1)))
            )
          )
        ],
        [
          msub(mi`𝛿`, mn(1)),
          mo`=`,
          div(
            call('Cov', msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
            call('Var', msub(mi`x`, mn(1)))
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
          call('Normal', mn(0), mn(1))
        ],
        [
          div(
            minusP(SPECIAL.greek.circumflex.beta, SPECIAL.greek.beta),
            call('SE', SPECIAL.greek.circumflex.beta)
          ),
          mo`~ͣ`,
          call('Normal', mn(0), mn(1))
        ],
        [
          div(
            minusP(SPECIAL.greek.circumflex.beta, SPECIAL.greek.beta),
            call('SE', SPECIAL.greek.circumflex.beta)
          ),
          mo`~ͣ`,
          mrow(
            msub(mi`t`, mrow(mi`n`, mo`-`, mi`k`, mo`-`, mn(1))),
            mspace(4),
            mo`=`,
            mspace(4),
            msub(mi`t`, mi`df`)
          )
        ]
      ])
    ),
    doc.figcaption`Sampling distributions of standardized estimators`
  ),
  estimatedVariance: doc.figure(
    mathml2.math(
      eq(
        mathml.call('Var', msub(mathml.SPECIAL.greek.circumflex.beta, mi`j`)),
        frac(
          [ msup(mathml.SPECIAL.greek.circumflex.sigma, mn(2)) ],
          [
            mul2(
              msub(mi`SST`, mi`j`),
              paren([
                minus(mn(1), msubsup(mi`R`, mi`j`, mn(2)))
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
        mathml.call('se', msub(mathml.SPECIAL.greek.circumflex.beta, mi`j`)),
        mspace(4), mo`≈`, mspace(4),
        frac(
          [
            mi`σ`,
          ],
          [
            mul2(
              msub(mi`σ`, mi`j`),
              msqrt(
                minusP(mn(1), msup(msub(mathml.SPECIAL.greek.rho, mi`j`), mn(2)))
              )
            ),
            msqrt(mi`n`)
          ]
        ),
      ),
    ),
    doc.figcaption`Asymptotic standard error of β̂_j`
  ),
};


