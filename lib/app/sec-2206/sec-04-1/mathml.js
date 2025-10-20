/**
 * @import { E } from '../../prelude-type.ts';
 */
import { frag, mathml, mathml2, doc } from '../../prelude.js';
import { components, mathmlHelper, mathmlHelper_2 } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const { SPECIAL } = mathml;

const { mi, mo, mtext, mrow, mover, mn, msup, msub, msubsup, msqrt, munder, mspace, mfrac } = mathml2;

const { rows: rows2, sum, parensA, call, table, inv } = mathmlHelper_2;

const { todo } = components;

const {
  eqId, eq, add, mul3, minusSqP,
  minus, minusP, div, divP, add3,
} = mathmlHelper;

/** @param {E.Item} a @param {E.Item} b */
const mul2 = (a, b) => mrow(a, b);

const summaise = sum.attr({ max: mi`n`, inc: mrow(mi`i`, mo`=`, mn(0)) })();
const Normal = call.attr({ fn: mtext`Normal` })
const Cov = call.attr({ fn: mtext`Cov` })
const Var = call.attr({ fn: mtext`Var` })
const Se = call.attr({ fn: mtext`Se` })
const Sd = call.attr({ fn: mtext`Sd` })
const E = call.attr({ fn: mtext`E` })

export const consistency = {
  proofOfUnbiasness: doc.figure(
    mathml2.math(
      table.attr({ columnalign: 'right center left' })(
        [
          msub(SPECIAL.greek.circumflex.beta, mn(1)),
          mo`=`,
          div(
            parensA(
              summaise,
              mspace(4),
              parensA(
                minus(
                  msub(mi`x`, mrow(mi`i`, mn(1))),
                  msub(mi`x̄`, mn(1))
                ),
              ),
              msub(mi`y`, mi`i`),
            ),
            parensA(
              summaise,
              mspace(4),
              msup(
                parensA(
                  minus(
                    msub(mi`x`, mrow(mi`i`, mn(1))),
                    msub(mi`x̄`, mn(1))
                  ),
                ),
                mn(2)
              ),
            ),
          ),
        ],

        [
          mspace(0),
          mo`=`,
          add(
            msub(SPECIAL.greek.beta, mn(1)),
            div(
              parensA(
                mul2(
                  mul2(
                    inv(mi`n`),
                    summaise,
                  ), mul2(
                    parensA(
                      minus(
                        msub(mi`x`, mrow(mi`i`, mn(1))),
                        msub(mi`x̄`, mn(1))
                      ),
                    ),
                    msub(mi`u`, mi`i`)
                  ),
                ),
              ),
              parensA(
                mul3(
                  inv(mi`n`),
                  summaise,
                  msup(
                    parensA(
                      minus(
                        msub(mi`x`, mrow(mi`i`, mn(1))),
                        msub(mi`x̄`, mn(1))
                      ),
                    ),
                    mn(2)
                  )
                ),
              ),
            ),
          ),
        ],
      ),
    ),
    doc.figcaption`derivation of β̂₁ using sample covariance and variance terms`
  ),
  probabilityLimits: doc.figure(
    mathml2.math(
      table.attr({ columnalign: 'right center left left' })(
        [
          mrow(mi`plim`, mspace(4), msub(SPECIAL.greek.circumflex.beta, mn(1))),
          mo`=`,
          add(
            msub(SPECIAL.greek.beta, mn(1)),
            divP(
              Cov(mrow(msub(mi`x`, mn(1)), mo`,`, mspace(4), mi`u`)),
              Var(mrow(msub(mi`x`, mn(1))))
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
              Cov(mrow(msub(mi`x`, mn(1)), mo`,`, mspace(4), mi`u`)),
              mn(0)
            ),
          ),
        ],
      ),
    ),
    doc.figcaption`Probability limit and covariance condition`
  ),
  assumption: doc.figure(
    mathml2.math(
      mrow(
        mrow.attr({ style: 'border: 1px solid black; padding: 4px 8px' })(
          Var(msub(mi`x`, mn(1))),
          mspace(4),
          mo`<`,
          mspace(4),
          mi`∞`,
        ),
        mspace(32),
        mrow.attr({ style: 'border: 1px solid black; padding: 4px 8px' })(
          Var(mi`u`),
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
          E(mi`u`),
          mn(0)
        ),
        mspace(16),
        eq(
          Cov(msub(mi`x`, mi`j`), mo`,`, mspace(4), mi`u`),
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
          E(mi`y`, mrow(mi`x₁`, mo`,`, mspace(4), SPECIAL.ellipse.h2, mo`,`, mspace(4), mi`xₖ`)),
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
        mfrac(
          Cov(msub(mi`x`, mn(1)), mi`u`),
          Var(msub(mi`x`, mn(1))),
        )
      ),
    ),
    doc.figcaption`Probability limit bias of β̂₁`
  ),
  omittedVarExample: doc.figure(
    mathml2.math(
      table.attr({ columnalign: 'right center left' })(
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
            Cov(msub(mi`x`, mn(1)), msub(mi`x`, mn(2))),
            Var(msub(mi`x`, mn(1)))
          )
        ]
      ),
    ),
    doc.figcaption`Probability limit in omitted variable case`
  ),
};

export const normality = {
  samplingDistribution: doc.figure(
    mathml2.math(
      table(
        [
          div(
            minusP(SPECIAL.greek.circumflex.beta, SPECIAL.greek.beta),
            Sd(SPECIAL.greek.circumflex.beta)
          ),
          mo`~ͣ`,
          Normal(mn(0), mn(1))
        ],
        [
          div(
            minusP(SPECIAL.greek.circumflex.beta, SPECIAL.greek.beta),
            Se(SPECIAL.greek.circumflex.beta)
          ),
          mo`~ͣ`,
          Normal(mn(0), mn(1))
        ],
        [
          div(
            minusP(SPECIAL.greek.circumflex.beta, SPECIAL.greek.beta),
            Se(SPECIAL.greek.circumflex.beta)
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
      )
    ),
    doc.figcaption`Sampling distributions of standardized estimators`
  ),
  estimatedVariance: doc.figure(
    mathml2.math(
      eq(
        Var(msub(SPECIAL.greek.circumflex.beta, mi`j`)),
        mfrac(
          msup(SPECIAL.greek.circumflex.sigma, mn(2)),
          mul2(
            msub(mi`SST`, mi`j`),
            minusP(mn(1), msubsup(mi`R`, mi`j`, mn(2)))
          )
        )
      ),
    ),
    doc.figcaption`Estimated Variance of β̂ⱼ`,
  ),
  asymptoticStdErr: doc.figure(
    mathml2.math(
      mrow(
        Se(msub(SPECIAL.greek.circumflex.beta, mi`j`)),
        mspace(4), mo`≈`, mspace(4),
        mfrac(
          mi`σ`,
          mrow(
            mul2(
              msub(mi`σ`, mi`j`),
              msqrt(
                minusP(mn(1), msup(msub(SPECIAL.greek.rho, mi`j`), mn(2)))
              )
            ),
            msqrt(mi`n`)
          )
        ),
      ),
    ),
    doc.figcaption`Asymptotic standard error of β̂_j`
  ),
};


