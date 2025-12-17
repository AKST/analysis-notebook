/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import { multiscripts, call, rows, sum, abs, SPECIAL, parensA, table, inv, op } from '@prelude-uni/mathml.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const { mi, mo, mtext, mrow, mn, msup, msub, msqrt, munder, mspace, mfrac } = mathml;
const { eqId, eq, add, div, minus, mul } = op;

const { greek: { beta, rho, sigma, ...greek } } = SPECIAL;

const vars = {
  y: mi`y`,
  yi: msub(mi`y`, mi`i`),
  yEst: mi`ŷ`,
  yEstI: msub(mi`ŷ`, mi`i`),
  ysm: mi`ȳ`,
  u: mi`u`,
  ui: msub(mi`u`, mi`i`),
  uEst: mi`û`,
  uEstI: msub(mi`û`, mi`i`),
  x: mi`x`,
  xi: msub(mi`x`, mi`i`),
  xsm: mi`x̄`,

  b0: msub(beta, mn(0)),
  b1: msub(beta, mn(1)),
  b0Est: msub(greek.circumflex.beta, mn(0)),
  b1Est: msub(greek.circumflex.beta, mn(1)),
  colXY: msub(rho, mrow(mi`x`, mi`y`)),
  colXYEst: msub(greek.circumflex.rho, mrow(mi`x`, mi`y`)),
  stddevX: msub(sigma, mi`x`),
  stddevXEst: msub(greek.circumflex.sigma, mi`x`),
  stddevY: msub(sigma, mi`y`),
  stddevYEst: msub(greek.circumflex.sigma, mi`y`),
};



const summaise = sum.attr({ max: mi`n`, inc: mrow(mi`i`, mo`=`, mn(0)) }).of();

/**
 * @template {Function} F
 * @param {{ of: F }} helper
 * @returns {(...params: Parameters<F>) => ReturnType<F>}
 */
const bindOf = (helper) => {
  return helper.of.bind(helper);
};

const Normal = bindOf(call.attr({ fn: mtext`Normal` }))
const Cov = bindOf(call.attr({ fn: mtext`Cov` }))
const Log = bindOf(call.attr({ fn: mtext`log` }))
const Var = bindOf(call.attr({ fn: mtext`Var` }))
const Se = bindOf(call.attr({ fn: mtext`Se` }))
const Sd = bindOf(call.attr({ fn: mtext`Sd` }))
const E = bindOf(call.attr({ fn: mtext`E` }))
const P = bindOf(call.attr({ fn: mtext`P` }))

export const normality = text.figure(
  mathml.math.attr({ style: 'font-size: 16px' }).of(
    rows(
      mrow(
        mi`u`, mspace(4), mo`∼`, mspace(4),
        Normal(mrow(
          mn(0), mo`,`, mspace(4),
          msup(SPECIAL.greek.sigma, mn(2))
        ))
      ),
      mrow(
        E(
          mrow(
            mi`u`, mspace(4), mo`|`, mspace(4),
            msub(mi`x`, mn(1)), mo`,`, mspace(4),
            SPECIAL.ellipse.h2, mo`,`, mspace(4),
            msub(mi`x`, mi`k`)
          )
        ),
        mspace(4), mo`=`, mspace(4),
        E(mi`u`),
        mspace(4), mo`=`, mspace(4),
        mn(0)
      ),
      mrow(
        Var(
          mrow(
            mi`u`, mspace(4), mo`|`, mspace(4),
            msub(mi`x`, mn(1)), mo`,`, mspace(4),
            SPECIAL.ellipse.h2, mo`,`, mspace(4),
            msub(mi`x`, mi`k`)
          )
        ),
        mspace(4), mo`=`, mspace(4),
        Var(mi`u`),
        mspace(4), mo`=`, mspace(4),
        msup(SPECIAL.greek.sigma, mn(2))
      ),
    )
  ),
  doc.figcaption`MLR 6 Normality Assumption`,
);

export const samplingDistribution = text.figure(
  mathml.math.attr({ style: 'font-size: 14px' }).of(
    rows(
      mrow(
        msub(SPECIAL.greek.circumflex.beta, mi`j`),
        mspace(4), mo`∼`, mspace(4),
        Normal(
          mrow(
            msub(mi`β`, mi`j`),
            mo`,`, mspace(4),
            Var(msub(SPECIAL.greek.circumflex.beta, mi`j`))
          )
        )
      ),
      mrow(mspace(8)),
      mrow(
        mfrac(
          mrow(
            msub(SPECIAL.greek.circumflex.beta, mi`j`),
            mspace(4), mo`−`, mspace(4),
            msub(mi`β`, mi`j`)
          ),
          msqrt(Var(msub(SPECIAL.greek.circumflex.beta, mi`j`)))
        ),
        mspace(4), mo`∼`, mspace(4),
        Normal(mrow(mn(0), mo`,`, mspace(4), mn(1)))
      ),
      mrow(mspace(8)),
    )
  ),
  doc.figcaption`Nrm Sampling Dist under MLR1-6`,
);

export const classicalLinearModel = text.figure(
  mathml.math.attr({ style: 'font-size: 14px' }).of(
    rows(
      mrow(
        mi`y`, mspace(4), mo`|`, mspace(4), mi`x`,
        mspace(4), mo`∼`, mspace(4),
        Normal(mrow(
          msub(mi`β`, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
          mspace(4), mo`+`, mspace(4),
          mul(msub(mi`β`, mn(2)), msub(mi`x`, mn(2))),
          mspace(4), mo`+`, mspace(4),
          SPECIAL.ellipse.h2,
          mspace(4), mo`+`, mspace(4),
          mul(msub(mi`β`, mi`k`), msub(mi`x`, mi`k`)),
          mo`,`, mspace(4),
          msup(SPECIAL.greek.sigma, mn(2))
        ))
      ),
      mrow(),
      mrow(
        mi`x`, mspace(8),
        mtext`is short for`,
        mspace(8),
        mrow(
          parensA(
            msub(mi`x`, mn(1)), mo`,`, mspace(8),
            SPECIAL.ellipse.h, mo`,`, mspace(8),
            msub(mi`x`, mi`k`),
          ),
        ),
      ),
    ),
  ),
  doc.figcaption`Summarising the Classical Linear Model (CLM)`,
);

export const tDistributionOfEstimators = text.figure(
  mathml.math(
    table(
      [
        mi`A`,
        mrow(
          msub(SPECIAL.greek.circumflex.beta, mi`j`),
          mspace(4), mo`∼`, mspace(4),
          mrow(
            mi`Normal`,
            mo`[`,
            msub(mi`β`, mi`j`),
            mo`,`, mspace(4),
            Var(msub(SPECIAL.greek.circumflex.beta, mi`j`)),
            mo`]`
          )
        )
      ],
      [
        mi`B`,
        mrow(
          mfrac(
            mrow(
              msub(SPECIAL.greek.circumflex.beta, mi`j`),
              mspace(4), mo`−`, mspace(4),
              msub(mi`β`, mi`j`)
            ),
            Sd(msub(SPECIAL.greek.circumflex.beta, mi`j`))
          ),
          mspace(4), mo`∼`, mspace(4),
          Normal(mrow(mn(0), mo`,`, mspace(4), mn(1)))
        )
      ]
    )
  ),
  doc.figcaption`Classical Linear Model (CLM) assumptions 1 through 6 — showing Normal Sampling Distribution`,
);

export const degreesOfFreedom = text.figure(
  mathml.math(
    mrow(
      mfrac(
        mrow(
          msub(SPECIAL.greek.circumflex.beta, mi`j`),
          mspace(4), mo`−`, mspace(4),
          msub(mi`β`, mi`j`)
        ),
        Se(msub(SPECIAL.greek.circumflex.beta, mi`j`))
      ),
      mspace(4), mo`∼`, mspace(4),
      msub(mi`t`, mrow(mi`n`, mspace(2), mo`−`, mspace(2), mi`k`, mspace(2), mo`−`, mspace(2), mn(1))),
      mspace(4), mo`=`, mspace(4),
      msub(mi`t`, mi`df`)
    )
  ),
  doc.figcaption.attr({ style: 'font-size: 8px' }).of(
    'Theorem for ', text.b`degrees of freedom`,
    ' — the t-statistic for β̂', doc.br(),
    'follows a t-distribution with n−k−1 degrees of freedom.'
  ),
);

export const nullHypothesisOfBetaJ = text.figure(
  mathml.math(
    mrow(
      msub(mi`H`, mn(0)),
      mo`:`, mspace(4),
      msub(mi`β`, mi`j`),
      mspace(4), mo`=`, mspace(4),
      mn(0)
    )
  ),
  doc.figcaption`Null hypothesis for βⱼ — testing whether the coefficient equals zero.`
);

/**
 * @param {(m: typeof mathml) => E.Item} param
 * @param {{ null: string, alt: string }} cons
 * @param {(m: typeof mathml) => E.Item} thres
 * @param {E.Item} title
 * @param {{ test: 'one-sided' | 'two-sided' }} op
 */
export const hypothSet = (param, cons, thres, title, op) => text.figure(
  mathml.math(
    rows(
      munder(
        table.attr({ columnalign: 'right left' }).of(
          [mrow(msub(mi`H`, mn(0)), mo`:`), mrow(param(mathml), mo.of(cons.null), thres(mathml))],
          [mrow(msub(mi`H`, mn(1)), mo`:`), mrow(param(mathml), mo.of(cons.alt), thres(mathml))],
        ),
        munder(mspace(0), mtext`Hypothesis'`),
      ),
      mspace(8),
      mrow(
        munder(
          mrow(
            op.test === 'one-sided' ? mrow(
              multiscripts.attr({ sup: [mi`t`, undefined] }).of(param(mathml)),
              mspace(4), mo.of(cons.alt),
              mspace(4), mi`c`,
            ) : mrow(
              mo`|`, mi`c`, mo`|`,
              mspace(4), mo`<`, mspace(4),
              multiscripts.attr({ sup: [mi`t`, undefined] }).of(param(mathml)),
            ),
          ),
          munder(mspace(0), mtext`H₀ rejection rule`),
        ),
        mspace(32),
        munder(
          mrow(
            op.test === 'one-sided' ? mrow(
              multiscripts.attr({ sup: [mi`t`, undefined] }).of(param(mathml)),
              mspace(8), mo.of(cons.null),
              mspace(8), mi`c`,
            ) : mrow(
              mo`|`, mi`c`, mo`|`,
              mspace(4), mo`>`, mspace(4),
              multiscripts.attr({ sup: [mi`t`, undefined] }).of(param(mathml)),
            ),
          ),
          munder(mspace(0), mtext`H₁ rejection rule`),
        ),
      ),
    ),
  ),
  doc.figcaption.of(title),
);

export const tStatisticForBJ = text.figure(
  mathml.math(
    eqId(
      msub(mi`t`, msub(SPECIAL.greek.circumflex.beta, mi`j`)),
      mfrac(
        msub(SPECIAL.greek.circumflex.beta, mi`j`),
        Se(msub(SPECIAL.greek.circumflex.beta, mi`j`)),
      ),
      mo`.`,
    ),
  ),
  doc.figcaption`t-statistic for β̂ⱼ`
);

export const signficantLevel = text.figure(
  mathml.math(
    mrow(
      SPECIAL.greek.alpha,
      mspace(4),
      mo`=`,
      mspace(4),
      P(
        mrow(
          mtext`Type 1 Error`,
          mspace(4),
          mo`|`,
          mspace(4),
          msub(mi`H`, mn(0)),
        )
      ),
    ),
  ),
  doc.figcaption`Significance level`
);

export const criticalValue = text.figure(
  mathml.math(
    table.attr({ columnalign: 'right center left' }).of(
      [
        msub(mi`c`, mi`lower`),
        mo`=`,
        mrow(
          inv(mi`CDF`),
          parensA(
            mfrac(SPECIAL.greek.alpha, mn(2)),
            mo`;`,
            mspace(4),
            mi`df`,
          ),
        ),
      ],
      [
        msub(mi`c`, mi`upper`),
        mo`=`,
        mrow(
          inv(mi`CDF`),
          parensA(
            minus(mn(1), mfrac(SPECIAL.greek.alpha, mn(2))),
            mo`;`,
            mspace(4),
            mi`df`,
          ),
        ),
      ],
    ),
  ),
  doc.figcaption`Critical Value`,
);

export const pValue = text.figure(
  mathml.math(eq(mtext`P-Value`, P(mrow(
    abs(mi`T`),
    mspace(2), mo`>`,
    mspace(2), abs(mi`t`),
  )))),
  doc.figcaption`The value of a P-Value`,
);

export const tStatisticGeneral = text.figure(
  mathml.math(
  ),
  doc.figcaption`General t-statistic`
)

export const ci95 = text.figure(
  mathml.math(
    table.attr({ columnalign: 'right center left' }).of(
      [
        msub(SPECIAL.greek.circumflex.beta, mi`j`),
        mo`±`,
        mul(
          mrow(mi`c`, mspace(4)),
          Se(msub(SPECIAL.greek.circumflex.beta, mi`j`))
        ),
      ],

      [
        msub(mi`β̲`, mi`j`),
        mo`≡`,
        minus(
          msub(SPECIAL.greek.circumflex.beta, mi`j`),
          mul(
            mrow(mi`c`, mspace(4)),
            Se(msub(SPECIAL.greek.circumflex.beta, mi`j`))
          )
        ),
      ],

      [
        msub(mi`β̄`, mi`j`),
        mo`≡`,
        add(
          msub(SPECIAL.greek.circumflex.beta, mi`j`),
          mul(
            mrow(mi`c`, mspace(4)),
            Se(msub(SPECIAL.greek.circumflex.beta, mi`j`))
          )
        ),
      ],
    ),
  ),
  doc.figcaption`95 confidence interval`
);

export const exampleOfMultiParaHypothesis = {
  set: text.figure(
    mathml.math(
      rows(
        mrow(
          msub(mi`H`, mn(0)),
          mo`:`,
          mspace(4),
          eq(
            msub(SPECIAL.greek.beta, mn(1)),
            msub(SPECIAL.greek.beta, mn(2))
          ),
        ),
        mrow(),

        mrow(
          msub(mi`H`, mn(1)),
          mo`:`,
          mspace(4),
          mrow(
            msub(SPECIAL.greek.beta, mn(1)),
            mspace(4),
            mo`<`,
            mspace(4),
            msub(SPECIAL.greek.beta, mn(2)),
          ),
        ),

        mrow(),

        mrow(
          mi`t`,
          mspace(4),
          mo`=`,
          mspace(4),
          mfrac(
            minus(
              msub(SPECIAL.greek.circumflex.beta, mn(1)),
              msub(SPECIAL.greek.circumflex.beta, mn(2))
            ),
            Se(
              minus(
                msub(SPECIAL.greek.circumflex.beta, mn(1)),
                msub(SPECIAL.greek.circumflex.beta, mn(2))
              )
            ),
          ),
        ),
      ),
    ),
    doc.figcaption`Multi parameter hypothesises`,
  ),
  rearranged: text.figure(
    mathml.math(
      rows(
        // Row 1: H₀: β₁ − β₂ = 0
        mrow(
          msub(mi`H`, mn(0)),
          mo`:`,
          mspace(4),
          eq(
            minus(
              msub(SPECIAL.greek.beta, mn(1)),
              msub(SPECIAL.greek.beta, mn(2))
            ),
            mn(0)
          ),
        ),

        // Row 2: H₁: β₁ − β₂ < 0
        mrow(
          msub(mi`H`, mn(1)),
          mo`:`,
          mspace(4),
          mrow(
            minus(
              msub(SPECIAL.greek.beta, mn(1)),
              msub(SPECIAL.greek.beta, mn(2))
            ),
            mspace(4),
            mo`<`,
            mspace(4),
            mn(0),
            mo`,`,
          ),
        ),
      ),
    ),
    doc.figcaption`one-sided hypothesis test for β₁ − β₂`
  ),
  constraint: text.figure(
    mathml.math(
      eq(
        Var(
          minus(
            msub(SPECIAL.greek.circumflex.beta, mn(1)),
            msub(SPECIAL.greek.circumflex.beta, mn(2))
          )
        ),
        add(
          Var(msub(SPECIAL.greek.circumflex.beta, mn(1))),
          minus(
            Var(msub(SPECIAL.greek.circumflex.beta, mn(2))),
            mul(
              mrow(mn(2), mspace(4)),
              Cov(
                msub(SPECIAL.greek.circumflex.beta, mn(1)),
                msub(SPECIAL.greek.circumflex.beta, mn(2))
              )
            )
          )
        ),
      ),
    ),
    doc.figcaption`variance of difference between β̂₁ and β̂₂`
  ),
  seConstraint: text.figure(
    mathml.math(
      eq(
        Se(
          minus(
            msub(SPECIAL.greek.circumflex.beta, mn(1)),
            msub(SPECIAL.greek.circumflex.beta, mn(2))
          )
        ),
        msup(
          parensA(
            minus(
              add(
                msup(
                  mrow(
                    mo`[`,
                    Se(msub(SPECIAL.greek.circumflex.beta, mn(1))),
                    mo`]`,
                  ),
                  mn(2)
                ),
                msup(
                  mrow(
                    mo`[`,
                    Se(msub(SPECIAL.greek.circumflex.beta, mn(2))),
                    mo`]`,
                  ),
                  mn(2)
                ),
              ),
              mul(mn(2), msub(mi`s`, mrow(mn(1), mn(2))))
            ),
          ),
          mfrac(mn(1), mn(2))
        )
      ),
    ),
    doc.figcaption`standard error of β̂₁ − β̂₂`
  ),
  matrixP1: text.figure(
    mathml.math(
      table.attr({ columnalign: 'right center left' }).of(
        [
          SPECIAL.greek.circumflex.beta,
          mo`=`,
          mul(
            inv(
              parensA( mul( msup(mi`X`, mi`⊤`), mi`X` ) )
            ),
            mul( msup(mi`X`, mi`⊤`), mi`y` )
          )
        ],
        [
          Var(SPECIAL.greek.circumflex.beta),
          mo`=`,
          mul(
            msup(SPECIAL.greek.circumflex.sigma, mn(2)),
            inv( parensA( mul( msup(mi`X`, mi`⊤`), mi`X` ) ) )
          )
        ],
        [
          msup(SPECIAL.greek.circumflex.sigma, mn(2)),
          mo`=`,
          eq(
            mfrac(mi`SSR`, mrow(minus(mi`n`, mi`k`))),
            mul(
              parensA(
                summaise,
                msup(msub(mi`û`, mi`i`), mn(2)),
              ),
              inv(parensA(minus(mi`n`, mi`k`))),
            ),
          ),
        ],
      ),
    ),
    doc.figcaption`Solve for s Part 1`,
  ),
  matrixP2: text.figure(
    mathml.math(
      table.attr({ columnalign: 'right center left center left' }).of(
        [
          mi`V`,
          mo`=`,
          Var(SPECIAL.greek.circumflex.beta),
          mo`=`,
          mul(
            msup(SPECIAL.greek.circumflex.sigma, mn(2)),
            inv( parensA( mul( msup(mi`X`, mi`⊤`), mi`X` ) ) )
          ),
        ],
        [
          msub(mi`s`, mn(12)),
          mo`=`,
          Cov(
            mrow(
              msub(SPECIAL.greek.circumflex.beta, mn(1)),
              mo`,`,
              mspace(4),
              msub(SPECIAL.greek.circumflex.beta, mn(2)),
            )
          ),
          mo`=`,
          mul(
            msup(SPECIAL.greek.circumflex.sigma, mn(2)),
            msub(
              inv( parensA( mul( msup(mi`X`, mi`⊤`), mi`X` ) ) ),
              mn(12)
            )
          ),
        ],
      ),
    ),
    doc.figcaption`Solve for s Part 2`
  )
};

export const aliasOf2Params = {
  alias: text.figure(
	  mathml.math(
	    eq(
	      msub(SPECIAL.greek.theta, mn(1)),
	      minus(
	        msub(SPECIAL.greek.beta, mn(1)),
	        msub(SPECIAL.greek.beta, mn(2))
	      )
	    ),
	  ),
	  doc.figcaption`parameter definition θ₁`
	),
	null: text.figure(
	  mathml.math(
	    mrow(
	      msub(mi`H`, mn(0)),
	      mo`:`,
	      mspace(4),
	      eq(
	        msub(SPECIAL.greek.theta, mn(1)),
	        mn(0)
	      ),
	    ),
	  ),
	  doc.figcaption`null hypothesis`
	),
	alt: text.figure(
	  mathml.math(
	    mrow(
	      msub(mi`H`, mn(1)),
	      mo`:`,
	      mspace(4),
	      mrow(
	        msub(SPECIAL.greek.theta, mn(1)),
	        mspace(4),
	        mo`<`,
	        mspace(4),
	        mn(0),
	      ),
	    ),
	  ),
	  doc.figcaption`alternative hypothesis`
	),
	tStat: text.figure(
	  mathml.math(
	    mrow(
	      mi`t`,
	      mspace(4),
	      mo`=`,
	      mspace(4),
	      mfrac(
	        msub(mi`θ̂`, mn(1)),
	        Se(msub(mi`θ̂`, mn(1)))
	      ),
	    ),
	  ),
	  doc.figcaption`t-statistic for θ̂₁`
	),
	plugAlias: text.figure(
		mathml.math(
	    table.attr({ columnalign: 'right center left' }).of(
	      [
	        Log(mi`y`),
	        mo`=`,
	        add(
	          msub(SPECIAL.greek.beta, mn(0)),
	          mul(
	            parensA(
	              add(
	                msub(SPECIAL.greek.theta, mn(1)),
	                msub(SPECIAL.greek.beta, mn(2))
	              ),
	            ),
	            msub(mi`x`, mn(1)),
	          ),
	          add(
	            mul(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mn(2))),
	            mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(3))),
	            mi`u`
	          )
	        ),
	      ],

	      [
	        mspace(0),
	        mo`=`,
	        add(
	          msub(SPECIAL.greek.beta, mn(0)),
	          mul(msub(SPECIAL.greek.theta, mn(1)), msub(mi`x`, mn(1))),
	          add(
	            mul(
                msub(SPECIAL.greek.beta, mn(2)),
                parensA(add(msub(mi`x`, mn(1)), msub(mi`x`, mn(2)))),
              ),
	            mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(3))),
	            mi`u`
	          )
	        ),
	      ],

        [
          mspace(0),
          mo`=`,
          add(
            msub(SPECIAL.greek.beta, mn(0)),
            mul(msub(SPECIAL.greek.theta, mn(1)), msub(mi`x`, mn(1))),
            add(
              mul(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mrow(mn(1),mo`+`,mn(2)))),
              mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(3))),
              mi`u`
            )
          ),
        ],
	    ),
	  ),
	  doc.figcaption`plug alias into population model`
	),
  solvedModel: text.figure(
    mathml.math(
      eq(
        Log(mi`y`),
        add(
          msub(SPECIAL.greek.beta, mn(0)),
          mul(msub(SPECIAL.greek.theta, mn(1)), msub(mi`x`, mn(1))),
          add(
            mul(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mrow(mn(1),mo`+`,mn(2)))),
            mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(3))),
            mi`u`
          )
        )
      ),
    ),
    doc.figcaption`solved model`
  ),
  ci95: text.figure(
    mathml.math(
      mrow(
        msub(mi`θ̂`, mn(1)),
        mspace(4),
        mo`±`,
        mspace(4),
        mul(
          mrow(mn(1.96), mspace(8)),
          Se(msub(mi`θ̂`, mn(1)))
        ),
      ),
    ),
    doc.figcaption`95% ci`
  ),
};

export const jointHypothesisTest = text.figure(
  mathml.math(
    table.attr({ columnalign: 'left' }).of(
      [mrow(
        msub(mi`H`, mn(0)),
        mo`:`,
        mspace(4),
        eq(msub(SPECIAL.greek.beta, mn(3)), mn(0)),
        mo`,`,
        mspace(4),
        eq(msub(SPECIAL.greek.beta, mn(4)), mn(0)),
        mo`,`,
        mspace(4),
        eq(msub(SPECIAL.greek.beta, mn(5)), mn(0)),
      )],

      [mrow()],

      [mrow(
        msub(mi`H`, mn(1)),
        mo`:`,
        mspace(4),
        msub(mi`H`, mn(0)),
        mspace(4),
        mtext`is not true`,
      )],
    ),
  ),
  doc.figcaption`
    Joint hypothesis test for ${doc.br()}
    β 3 to 5 have no effect when ${doc.br()}
    controlling for β 1 and 2.
  `
);

export const fStat = text.figure(
  mathml.math.attr({ style: 'font-size: 14px' }).of(
    table.attr({ columnalign: 'right center left center left' }).of(
      [mi`F`, mo`=`, mfrac(
          div(minus.paren(
            msub(mi`SSR`, mi`r`),
            msub(mi`SSR`, mi`ur`)
          ), mi`q`),
          div(
            msub(mi`SSR`, mi`ur`),
            parensA(mi`n`, mspace(4), mo`-`, mspace(4), mi`k`, mspace(4), mo`-`, mspace(4), mn(1)),
          ),
      ), mspace(0), mspace(0)],

      [mspace(0)],
      [mspace(0)],

      [mi`q`,
        mo`=`,
        mtext`numerator degrees of freedom`,
        mo`=`,
        minus(
          msub(mi`df`, mi`r`),
          msub(mi`df`, mi`ur`)
        ),
      ],

      [
        minus(mi`n`, minus(mi`k`, mn(1))),
        mo`=`,
        mtext`denominator degrees of freedom`,
        mo`=`,
        msub(mi`df`, mi`ur`),
      ],
    ),
  ),
  doc.figcaption`F-statistic`
);

export const fStatDistribution = text.figure(
  mathml.math(
    mrow(
      mi`F`,
      mspace(4),
      mo`∼`,
      mspace(4),
      msub(
        mi`F`,
        mrow(
          mi`q`,
          mo`,`,
          mspace(4),
          minus(
            mi`n`,
            add(mi`k`, mn(1))
          ),
        )
      ),
    ),
  ),
  doc.figcaption`sampling distribution of the F-statistic`
);

export const fStatInTermsOfRSq = text.figure(
  mathml.math.attr({ style: 'font-size: 10px' }).of(
    eq(
      eq(
        mi`F`,
        mfrac(
          div(
            parensA(
              minus(
                msup(msub(mi`R`, mi`ur`), mn(2)),
                msup(msub(mi`R`, mi`r`), mn(2))
              ),
            ),
            mi`q`,
          ),
          div(
            parensA(
              minus(
                mn(1),
                msup(msub(mi`R`, mi`ur`), mn(2))
              ),
            ),
            parensA(mi`n`, mspace(4), mo`-`, mspace(4), mi`k`, mspace(4), mo`-`, mspace(4), mn(1)),
          ),
        ),
      ),
      mfrac(
        div(
          parensA(
            minus(
              msup(msub(mi`R`, mi`ur`), mn(2)),
              msup(msub(mi`R`, mi`r`), mn(2))
            ),
          ),
          mi`q`,
        ),
        mul(
          minus(
            mn(1),
            msup(msub(mi`R`, mi`ur`), mn(2))
          ),
          msub(mi`df`, mi`ur`)
        ),
      ),
    ),
  ),
  doc.figcaption`F-statistic expressed using R² values for restricted and unrestricted models`
);

export const pValues = text.figure(
  mathml.math(
    eq(
      mtext`p-value`,
      P(
        mrow(
          SPECIAL.cursive.F,
          mspace(4),
          mo`>`,
          mspace(4),
          mi`F`,
        ),
      ),
    ),
  ),
  doc.figcaption`P value of F`
)

export const testingGeneralLinearRestrictions = {
  restricted: text.figure(
    mathml.math(
      eq(
        mi`y`,
        add(
          msub(SPECIAL.greek.beta, mn(0)),
          mi`x₁`,
          mi`u`
        )
      )
    ),
    doc.figcaption`General Linear Restrictions: restricted`
  ),
  unrestricted: text.figure(
    mathml.math(
      eq(
        mi`y`,
        add(
          msub(SPECIAL.greek.beta, mn(0)),
          mul(msub(SPECIAL.greek.beta, mn(1)), msub(mi`x`, mn(1))),
          add(
            mul(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mn(2))),
            mul(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(3))),
            add(
              mul(msub(SPECIAL.greek.beta, mn(4)), msub(mi`x`, mn(4))),
              mi`u`
            ),
          )
        )
      )
    ),
    doc.figcaption`General Linear Restrictions: unrestricted`
  ),
  null: text.figure(
    mathml.math(
      mrow(
        msub(mi`H`, mn(0)),
        mo`:`,
        mspace(4),
        eq(msub(SPECIAL.greek.beta, mn(1)), mn(1)),
        mo`,`,
        mspace(4),
        eq(msub(SPECIAL.greek.beta, mn(2)), mn(0)),
        mo`,`,
        mspace(4),
        eq(msub(SPECIAL.greek.beta, mn(3)), mn(0)),
        mo`,`,
        mspace(4),
        eq(msub(SPECIAL.greek.beta, mn(4)), mn(0))
      )
    ),
    doc.figcaption`Null hypothesis`
  ),
};


