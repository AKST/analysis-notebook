/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { mathml, doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import { SPECIAL, sum, parensA, call, table, inv, op } from '@prelude-uni/mathml.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const { mi, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, mspace, mfrac } = mathml;
const { eq, add, minus, div, mul } = op;

const summaise = sum.attr({ max: mi`n`, inc: mrow(mi`i`, mo`=`, mn(0)) }).c();

/**
 * @template {Function} F
 * @param {{ c: F }} helper
 * @returns {(...params: Parameters<F>) => ReturnType<F>}
 */
const bindOf = (helper) => {
  return helper.c.bind(helper);
};

const Normal = bindOf(call.attr({ fn: mtext`Normal` }))
const Cov = bindOf(call.attr({ fn: mtext`Cov` }))
const Var = bindOf(call.attr({ fn: mtext`Var` }))
const Se = bindOf(call.attr({ fn: mtext`Se` }))
const Sd = bindOf(call.attr({ fn: mtext`Sd` }))
const E = bindOf(call.attr({ fn: mtext`E` }))

export const consistency = {
  proofOfUnbiasness: text.figure(
    mathml.math(
      table.attr({ columnalign: 'right center left' }).c(
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
                mul(
                  mul(
                    inv(mi`n`),
                    summaise,
                  ), mul(
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
                mul(
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
  probabilityLimits: text.figure(
    mathml.math(
      table.attr({ columnalign: 'right center left left' }).c(
        [
          mrow(mi`plim`, mspace(4), msub(SPECIAL.greek.circumflex.beta, mn(1))),
          mo`=`,
          add(
            msub(SPECIAL.greek.beta, mn(1)),
            div.paren(
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
  assumption: text.figure(
    mathml.math(
      mrow(
        mrow.attr({ style: 'border: 1px solid black; padding: 4px 8px' }).c(
          Var(msub(mi`x`, mn(1))),
          mspace(4),
          mo`<`,
          mspace(4),
          mi`∞`,
        ),
        mspace(32),
        mrow.attr({ style: 'border: 1px solid black; padding: 4px 8px' }).c(
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
  strongerMLR4_1: text.figure(
    mathml.math(
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
  prf: text.figure(
    mathml.math(
      eq(
        mrow(
          E(mi`y`, mrow(mi`x₁`, mo`,`, mspace(4), SPECIAL.ellipse.h2, mo`,`, mspace(4), mi`xₖ`)),
        ),
        add(
          msub(SPECIAL.greek.beta, mn(0)),
          mul(msub(SPECIAL.greek.beta, mn(1)), msub(mi`x`, mn(1))),
          add(
            SPECIAL.ellipse.h2,
            mul(msub(SPECIAL.greek.beta, mi`k`), msub(mi`x`, mi`k`))
          )
        )
      )
    ),
    doc.figcaption`Population regression function`
  ),
};

export const inconsistency = {
  asymptoticBias: text.figure(
    mathml.math(
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
  omittedVarExample: text.figure(
    mathml.math(
      table.attr({ columnalign: 'right center left' }).c(
        [
          mrow(
            mi`plim`,
            mspace(4),
            msub(mi`β̃`, mn(1))
          ),
          mo`=`,
          mrow(
            add(
              msub(SPECIAL.greek.beta, mn(1)),
              mul(msub(SPECIAL.greek.beta, mn(2)), msub(SPECIAL.greek.Delta, mn(1)))
            )
          )
        ],
        [
          msub(mi`δ`, mn(1)),
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
  samplingDistribution: text.figure(
    mathml.math(
      table(
        [
          div(
            minus.paren(SPECIAL.greek.circumflex.beta, SPECIAL.greek.beta),
            Sd(SPECIAL.greek.circumflex.beta)
          ),
          mo`~ͣ`,
          Normal(mn(0), mn(1))
        ],
        [
          div(
            minus.paren(SPECIAL.greek.circumflex.beta, SPECIAL.greek.beta),
            Se(SPECIAL.greek.circumflex.beta)
          ),
          mo`~ͣ`,
          Normal(mn(0), mn(1))
        ],
        [
          div(
            minus.paren(SPECIAL.greek.circumflex.beta, SPECIAL.greek.beta),
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
  estimatedVariance: text.figure(
    mathml.math(
      eq(
        Var(msub(SPECIAL.greek.circumflex.beta, mi`j`)),
        mfrac(
          msup(SPECIAL.greek.circumflex.sigma, mn(2)),
          mul(
            msub(mi`SST`, mi`j`),
            minus.paren(mn(1), msubsup(mi`R`, mi`j`, mn(2)))
          )
        )
      ),
    ),
    doc.figcaption`Estimated Variance of β̂ⱼ`,
  ),
  asymptoticStdErr: text.figure(
    mathml.math(
      mrow(
        Se(msub(SPECIAL.greek.circumflex.beta, mi`j`)),
        mspace(4), mo`≈`, mspace(4),
        mfrac(
          mi`σ`,
          mrow(
            mul(
              msub(mi`σ`, mi`j`),
              msqrt(
                minus.paren(mn(1), msup(msub(SPECIAL.greek.rho, mi`j`), mn(2)))
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


