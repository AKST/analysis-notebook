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

const { mi, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, munder, mspace } = mathml2;
const { rows, sum } = mathmlHelper_2;

const {
  greek: {
    beta, betaCrfx, Delta,
    rho, rhoCrfx,
    sigma, sigmaCrfx,
  },
} = mathml.SPECIAL;

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
  b0Est: msub(betaCrfx, mn(0)),
  b1Est: msub(betaCrfx, mn(1)),
  colXY: msub(rho, mrow(mi`x`, mi`y`)),
  colXYEst: msub(rhoCrfx, mrow(mi`x`, mi`y`)),
  stddevX: msub(sigma, mi`x`),
  stddevXEst: msub(sigmaCrfx, mi`x`),
  stddevY: msub(sigma, mi`y`),
  stddevYEst: msub(sigmaCrfx, mi`y`),
};

const {
  eqId, eq, add, mul3, minusSqP,
  div, minus, minusP, add3,
} = mathmlHelper;

/** @param {E.Item} a @param {E.Item} b */
const mul2 = (a, b) => mrow(a, b);

/** @param {...E.Item} body */
const E = (...body) => call('E', frag([...body]))

/** @param {E.Item} a @param {E.Item} b */
const Covar = (a, b) => call('Covar', a, b)

const summaise = sum.attr({ max: mi`n`, inc: mrow(mi`i`, mo`=`, mn(0)) })();


export const normality = doc.figure(
  mathml2.math.attr({ style: 'font-size: 16px' })(
    rows(
      mrow(
        mi`u`, mspace(4), mo`∼`, mspace(4),
        call('Normal', mrow(
          mn(0), mo`,`, mspace(4),
          msup(SPECIAL.greek.sigma, mn(2))
        ))
      ),
      mrow(
        call(
          'E',
          mrow(
            mi`u`, mspace(4), mo`|`, mspace(4),
            msub(mi`x`, mn(1)), mo`,`, mspace(4),
            SPECIAL.ellipse.h2, mo`,`, mspace(4),
            msub(mi`x`, mi`k`)
          )
        ),
        mspace(4), mo`=`, mspace(4),
        call('E', mi`u`),
        mspace(4), mo`=`, mspace(4),
        mn(0)
      ),
      mrow(
        call(
          'Var',
          mrow(
            mi`u`, mspace(4), mo`|`, mspace(4),
            msub(mi`x`, mn(1)), mo`,`, mspace(4),
            SPECIAL.ellipse.h2, mo`,`, mspace(4),
            msub(mi`x`, mi`k`)
          )
        ),
        mspace(4), mo`=`, mspace(4),
        call('Var', mi`u`),
        mspace(4), mo`=`, mspace(4),
        msup(SPECIAL.greek.sigma, mn(2))
      ),
    )
  ),
  doc.figcaption`MLR 6 Normality Assumption`,
);

export const samplingDistribution = doc.figure(
  mathml2.math.attr({ style: 'font-size: 14px' })(
    rows(
      mrow(
        msub(SPECIAL.greek.circumflex.beta, mi`j`),
        mspace(4), mo`∼`, mspace(4),
        call(
          'Normal',
          mrow(
            msub(mi`β`, mi`j`),
            mo`,`, mspace(4),
            call('Var', msub(SPECIAL.greek.circumflex.beta, mi`j`))
          )
        )
      ),
      mrow(mspace(8)),
      mrow(
        frac(
          [
            mrow(
              msub(SPECIAL.greek.circumflex.beta, mi`j`),
              mspace(4), mo`−`, mspace(4),
              msub(mi`β`, mi`j`)
            )
          ],
          [
            msqrt(call('Var', msub(SPECIAL.greek.circumflex.beta, mi`j`)))
          ]
        ),
        mspace(4), mo`∼`, mspace(4),
        call('Normal', mrow(mn(0), mo`,`, mspace(4), mn(1)))
      ),
      mrow(mspace(8)),
    )
  ),
  doc.figcaption`Nrm Sampling Dist under MLR1-6`,
);

export const classicalLinearModel = doc.figure(
  mathml2.math.attr({ style: 'font-size: 14px' })(
    rows(
      mrow(
        mi`y`, mspace(4), mo`|`, mspace(4), mi`x`,
        mspace(4), mo`∼`, mspace(4),
        call('Normal', mrow(
          msub(mi`β`, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(mi`β`, mn(2)), msub(mi`x`, mn(2))),
          mspace(4), mo`+`, mspace(4),
          SPECIAL.ellipse.h2,
          mspace(4), mo`+`, mspace(4),
          mul2(msub(mi`β`, mi`k`), msub(mi`x`, mi`k`)),
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
          paren([
            msub(mi`x`, mn(1)), mo`,`, mspace(8),
            SPECIAL.ellipse.h, mo`,`, mspace(8),
            msub(mi`x`, mi`k`),
          ]),
        ),
      ),
    ),
  ),
  doc.figcaption`Summarising the Classical Linear Model (CLM)`,
);

export const tDistributionOfEstimators = doc.figure(
  mathml2.math(
    table([
      [
        mi`A`,
        mrow(
          msub(SPECIAL.greek.circumflex.beta, mi`j`),
          mspace(4), mo`∼`, mspace(4),
          mrow(
            mi`Normal`,
            ['mo', '['],
            msub(mi`β`, mi`j`),
            mo`,`, mspace(4),
            call('Var', msub(SPECIAL.greek.circumflex.beta, mi`j`)),
            ['mo', ']']
          )
        )
      ],
      [
        mi`B`,
        mrow(
          frac(
            [
              mrow(
                msub(SPECIAL.greek.circumflex.beta, mi`j`),
                mspace(4), mo`−`, mspace(4),
                msub(mi`β`, mi`j`)
              )
            ],
            [
              call('sd', msub(SPECIAL.greek.circumflex.beta, mi`j`))
            ]
          ),
          mspace(4), mo`∼`, mspace(4),
          call('Normal', mrow(mn(0), mo`,`, mspace(4), mn(1)))
        )
      ]
    ])
  ),
  doc.figcaption`Classical Linear Model (CLM) assumptions 1 through 6 — showing Normal Sampling Distribution`,
);

export const degreesOfFreedom = doc.figure(
  mathml2.math(
    mrow(
      frac(
        [
          mrow(
            msub(SPECIAL.greek.circumflex.beta, mi`j`),
            mspace(4), mo`−`, mspace(4),
            msub(mi`β`, mi`j`)
          )
        ],
        [
          call('se', msub(SPECIAL.greek.circumflex.beta, mi`j`))
        ]
      ),
      mspace(4), mo`∼`, mspace(4),
      msub(mi`t`, mrow(mi`n`, mspace(2), mo`−`, mspace(2), mi`k`, mspace(2), mo`−`, mspace(2), mn(1))),
      mspace(4), mo`=`, mspace(4),
      msub(mi`t`, mi`df`)
    )
  ),
  doc.figcaption.attr({ style: 'font-size: 8px' }).of(
    'Theorem for ', doc.b`degrees of freedom`,
    ' — the t-statistic for β̂', doc.br(),
    'follows a t-distribution with n−k−1 degrees of freedom.'
  ),
);

export const nullHypothesisOfBetaJ = doc.figure(
  mathml2.math(
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
 * @param {(m: typeof mathml2) => E.Item} param
 * @param {{ null: string, alt: string }} cons
 * @param {(m: typeof mathml2) => E.Item} thres
 * @param {E.Item} title
 * @param {{ test: 'one-sided' | 'two-sided' }} op
 */
export const hypothSet = (param, cons, thres, title, op) => doc.figure(
  mathml2.math(
    rows(
      munder(
        table([
          [mrow(msub(mi`H`, mn(0)), mo`:`), mrow(param(mathml2), mo.of(cons.null), thres(mathml2))],
          [mrow(msub(mi`H`, mn(1)), mo`:`), mrow(param(mathml2), mo.of(cons.alt), thres(mathml2))],
        ], { columnalign: 'right left' }),
        munder(mspace(0), mtext`Hypothesis'`),
      ),
      mspace(8),
      mrow(
        munder(
          mrow(
            op.test === 'one-sided' ? mrow(
              multiscripts(param(mathml2), { sup: [mi`t`, undefined] }),
              mspace(4), mo.of(cons.alt),
              mspace(4), mi`c`,
            ) : mrow(
              mo`|`, mi`c`, mo`|`,
              mspace(4), mo`<`, mspace(4),
              multiscripts(param(mathml2), { sup: [mi`t`, undefined] }),
            ),
          ),
          munder(mspace(0), mtext`H₀ rejection rule`),
        ),
        mspace(32),
        munder(
          mrow(
            op.test === 'one-sided' ? mrow(
              multiscripts(param(mathml2), { sup: [mi`t`, undefined] }),
              mspace(8), mo.of(cons.null),
              mspace(8), mi`c`,
            ) : mrow(
              mo`|`, mi`c`, mo`|`,
              mspace(4), mo`>`, mspace(4),
              multiscripts(param(mathml2), { sup: [mi`t`, undefined] }),
            ),
          ),
          munder(mspace(0), mtext`H₁ rejection rule`),
        ),
      ),
    ),
  ),
  doc.figcaption.of(title),
);

export const tStatisticForBJ = doc.figure(
  mathml2.math(
    eqId(
      msub(mi`t`, msub(SPECIAL.greek.circumflex.beta, mi`j`)),
      mathml.frac(
        [msub(SPECIAL.greek.circumflex.beta, mi`j`)],
        [mathml.call('se', msub(SPECIAL.greek.circumflex.beta, mi`j`))],
      ),
      mo`.`,
    ),
  ),
  doc.figcaption`t-statistic for β̂ⱼ`
);

export const signficantLevel = doc.figure(
  mathml2.math(
    mrow(
      SPECIAL.greek.alpha,
      mspace(4),
      mo`=`,
      mspace(4),
      call(
        'P',
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

export const criticalValue = doc.figure(
  mathml2.math(
    table([
      [
        msub(mi`c`, mi`lower`),
        mo`=`,
        mrow(
          inv(mi`CDF`),
          paren([
            frac([SPECIAL.greek.alpha], [mn(2)]),
            mo`;`,
            mspace(4),
            mi`df`,
          ]),
        ),
      ],
      [
        msub(mi`c`, mi`upper`),
        mo`=`,
        mrow(
          inv(mi`CDF`),
          paren([
            minus(mn(1), frac([SPECIAL.greek.alpha], [mn(2)])),
            mo`;`,
            mspace(4),
            mi`df`,
          ]),
        ),
      ],
    ], { columnalign: 'right center left' }),
  ),
  doc.figcaption`Critical Value`,
);

export const pValue = doc.figure(
  mathml2.math(eq(mtext`P-Value`, call('P', mrow(
    abs(mi`T`),
    mspace(2), mo`>`,
    mspace(2), abs(mi`t`),
  )))),
  doc.figcaption`The value of a P-Value`,
);

export const tStatisticGeneral = doc.figure(
  mathml2.math(
  ),
  doc.figcaption`General t-statistic`
)

export const ci95 = doc.figure(
  mathml2.math(
    table([
      [
        msub(SPECIAL.greek.circumflex.beta, mi`j`),
        mo`±`,
        mul2(
          mrow(mi`c`, mspace(4)),
          call('se', msub(SPECIAL.greek.circumflex.beta, mi`j`))
        ),
      ],

      [
        msub(mi`β̲`, mi`j`),
        mo`≡`,
        minus(
          msub(SPECIAL.greek.circumflex.beta, mi`j`),
          mul2(
            mrow(mi`c`, mspace(4)),
            call('se', msub(SPECIAL.greek.circumflex.beta, mi`j`))
          )
        ),
      ],

      [
        msub(mi`β̄`, mi`j`),
        mo`≡`,
        add(
          msub(SPECIAL.greek.circumflex.beta, mi`j`),
          mul2(
            mrow(mi`c`, mspace(4)),
            call('se', msub(SPECIAL.greek.circumflex.beta, mi`j`))
          )
        ),
      ],
    ], { columnalign: 'right center left' }),
  ),
  doc.figcaption`95 confidence interval`
);

export const exampleOfMultiParaHypothesis = {
  set: doc.figure(
    mathml2.math(
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
          frac(
            [
              minus(
                msub(SPECIAL.greek.circumflex.beta, mn(1)),
                msub(SPECIAL.greek.circumflex.beta, mn(2))
              ),
            ],
            [
              call(
                'se',
                minus(
                  msub(SPECIAL.greek.circumflex.beta, mn(1)),
                  msub(SPECIAL.greek.circumflex.beta, mn(2))
                )
              ),
            ]
          ),
        ),
      ),
    ),
    doc.figcaption`Multi parameter hypothesises`,
  ),
  rearranged: doc.figure(
    mathml2.math(
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
  constraint: doc.figure(
    mathml2.math(
      eq(
        call(
          'Var',
          minus(
            msub(SPECIAL.greek.circumflex.beta, mn(1)),
            msub(SPECIAL.greek.circumflex.beta, mn(2))
          )
        ),
        add(
          call('Var', msub(SPECIAL.greek.circumflex.beta, mn(1))),
          minus(
            call('Var', msub(SPECIAL.greek.circumflex.beta, mn(2))),
            mul2(
              mrow(mn(2), mspace(4)),
              call(
                'Cov',
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
  seConstraint: doc.figure(
    mathml2.math(
      eq(
        call(
          'se',
          minus(
            msub(SPECIAL.greek.circumflex.beta, mn(1)),
            msub(SPECIAL.greek.circumflex.beta, mn(2))
          )
        ),
        msup(
          paren([
            minus(
              add(
                msup(
                  mrow(
                    mo`[`,
                    call('se', msub(SPECIAL.greek.circumflex.beta, mn(1))),
                    mo`]`,
                  ),
                  mn(2)
                ),
                msup(
                  mrow(
                    mo`[`,
                    call('se', msub(SPECIAL.greek.circumflex.beta, mn(2))),
                    mo`]`,
                  ),
                  mn(2)
                ),
              ),
              mul2(mn(2), msub(mi`s`, mrow(mn(1), mn(2))))
            ),
          ]),
          frac([mn(1)], [mn(2)])
        )
      ),
    ),
    doc.figcaption`standard error of β̂₁ − β̂₂`
  ),
  matrixP1: doc.figure(
    mathml2.math(
      table([
        [
          SPECIAL.greek.circumflex.beta,
          mo`=`,
          mul2(
            inv(
              paren([ mul2( msup(mi`X`, mi`⊤`), mi`X` ) ])
            ),
            mul2( msup(mi`X`, mi`⊤`), mi`y` )
          )
        ],
        [
          call('Var', SPECIAL.greek.circumflex.beta),
          mo`=`,
          mul2(
            msup(SPECIAL.greek.circumflex.sigma, mn(2)),
            inv( paren([ mul2( msup(mi`X`, mi`⊤`), mi`X` ) ]) )
          )
        ],
        [
          msup(SPECIAL.greek.circumflex.sigma, mn(2)),
          mo`=`,
          eq(
            frac([mi`SSR`], [mrow(minus(mi`n`, mi`k`))]),
            mul2(
              paren([
                summaise,
                msup(msub(mi`û`, mi`i`), mn(2)),
              ]),
              inv(paren([minus(mi`n`, mi`k`)])),
            ),
          ),
        ],
      ], { columnalign: 'right center left' }),
    ),
    doc.figcaption`Solve for s Part 1`,
  ),
  matrixP2: doc.figure(
    mathml2.math(
      table([
        [
          mi`V`,
          mo`=`,
          call('Var', SPECIAL.greek.circumflex.beta),
          mo`=`,
          mul2(
            msup(SPECIAL.greek.circumflex.sigma, mn(2)),
            inv( paren([ mul2( msup(mi`X`, mi`⊤`), mi`X` ) ]) )
          ),
        ],
        [
          msub(mi`s`, mn(12)),
          mo`=`,
          call(
            'Cov',
            mrow(
              msub(SPECIAL.greek.circumflex.beta, mn(1)),
              mo`,`,
              mspace(4),
              msub(SPECIAL.greek.circumflex.beta, mn(2)),
            )
          ),
          mo`=`,
          mul2(
            msup(SPECIAL.greek.circumflex.sigma, mn(2)),
            msub(
              inv( paren([ mul2( msup(mi`X`, mi`⊤`), mi`X` ) ]) ),
              mn(12)
            )
          ),
        ],
      ], { columnalign: 'right center left center left' }),
    ),
    doc.figcaption`Solve for s Part 2`
  )
};

export const aliasOf2Params = {
  alias: doc.figure(
	  mathml2.math(
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
	null: doc.figure(
	  mathml2.math(
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
	alt: doc.figure(
	  mathml2.math(
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
	tStat: doc.figure(
	  mathml2.math(
	    mrow(
	      mi`t`,
	      mspace(4),
	      mo`=`,
	      mspace(4),
	      frac(
	        [msub(mi`𝜃̂`, mn(1))],
	        [call('se', msub(mi`𝜃̂`, mn(1)))]
	      ),
	    ),
	  ),
	  doc.figcaption`t-statistic for θ̂₁`
	),
	plugAlias: doc.figure(
		mathml2.math(
	    table([
	      [
	        call('log', mi`y`),
	        mo`=`,
	        add3(
	          msub(SPECIAL.greek.beta, mn(0)),
	          mul2(
	            paren([
	              add(
	                msub(SPECIAL.greek.theta, mn(1)),
	                msub(SPECIAL.greek.beta, mn(2))
	              ),
	            ]),
	            msub(mi`x`, mn(1)),
	          ),
	          add3(
	            mul2(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mn(2))),
	            mul2(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(3))),
	            mi`u`
	          )
	        ),
	      ],

	      [
	        mspace(0),
	        mo`=`,
	        add3(
	          msub(SPECIAL.greek.beta, mn(0)),
	          mul2(msub(SPECIAL.greek.theta, mn(1)), msub(mi`x`, mn(1))),
	          add3(
	            mul2(
                msub(SPECIAL.greek.beta, mn(2)),
                paren([add(msub(mi`x`, mn(1)), msub(mi`x`, mn(2)))]),
              ),
	            mul2(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(3))),
	            mi`u`
	          )
	        ),
	      ],

        [
          mspace(0),
          mo`=`,
          add3(
            msub(SPECIAL.greek.beta, mn(0)),
            mul2(msub(SPECIAL.greek.theta, mn(1)), msub(mi`x`, mn(1))),
            add3(
              mul2(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mrow(mn(1),mo`+`,mn(2)))),
              mul2(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(3))),
              mi`u`
            )
          ),
        ],
	    ], { columnalign: 'right center left' }),
	  ),
	  doc.figcaption`plug alias into population model`
	),
  solvedModel: doc.figure(
    mathml2.math(
      eq(
        call('log', mi`y`),
        add3(
          msub(SPECIAL.greek.beta, mn(0)),
          mul2(msub(SPECIAL.greek.theta, mn(1)), msub(mi`x`, mn(1))),
          add3(
            mul2(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mrow(mn(1),mo`+`,mn(2)))),
            mul2(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(3))),
            mi`u`
          )
        )
      ),
    ),
    doc.figcaption`solved model`
  ),
  ci95: doc.figure(
    mathml2.math(
      mrow(
        msub(mi`𝜃̂`, mn(1)),
        mspace(4),
        mo`±`,
        mspace(4),
        mul2(
          mrow(mn(1.96), mspace(8)),
          call('se', msub(mi`𝜃̂`, mn(1)))
        ),
      ),
    ),
    doc.figcaption`95% ci`
  ),
};

export const jointHypothesisTest = doc.figure(
  mathml2.math(
    table([
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
    ], { columnalign: 'left' }),
  ),
  doc.figcaption`
    Joint hypothesis test for ${doc.br()}
    𝛽 3 to 5 have no effect when ${doc.br()}
    controlling for 𝛽 1 and 2.
  `
);

export const fStat = doc.figure(
  mathml2.math.attr({ style: 'font-size: 14px' })(
    table([
      [mi`F`, mo`=`, frac(
          [
            div(minusP(
              msub(mi`SSR`, mi`r`),
              msub(mi`SSR`, mi`ur`)
            ), mi`q`),
          ],
          [
            div(
              msub(mi`SSR`, mi`ur`),
              paren([mi`n`, mspace(4), mo`-`, mspace(4), mi`k`, mspace(4), mo`-`, mspace(4), mn(1)]),
            ),
          ]
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
    ], { columnalign: 'right center left center left' }),
  ),
  doc.figcaption`F-statistic`
);

export const fStatDistribution = doc.figure(
  mathml2.math(
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

export const fStatInTermsOfRSq = doc.figure(
  mathml2.math.attr({ style: 'font-size: 10px' })(
    eq(
      eq(
        mi`F`,
        frac(
          [
            div(
              paren([
                minus(
                  msup(msub(mi`R`, mi`ur`), mn(2)),
                  msup(msub(mi`R`, mi`r`), mn(2))
                ),
              ]),
              mi`q`,
            ),
          ],
          [
            div(
              paren([
                minus(
                  mn(1),
                  msup(msub(mi`R`, mi`ur`), mn(2))
                ),
              ]),
              paren([mi`n`, mspace(4), mo`-`, mspace(4), mi`k`, mspace(4), mo`-`, mspace(4), mn(1)]),
            ),
          ]
        ),
      ),
      frac(
        [
          div(
            paren([
              minus(
                msup(msub(mi`R`, mi`ur`), mn(2)),
                msup(msub(mi`R`, mi`r`), mn(2))
              ),
            ]),
            mi`q`,
          )
        ],
        [
          mul2(
            minus(
              mn(1),
              msup(msub(mi`R`, mi`ur`), mn(2))
            ),
            msub(mi`df`, mi`ur`)
          ),
        ]
      ),
    ),
  ),
  doc.figcaption`F-statistic expressed using R² values for restricted and unrestricted models`
);

export const pValues = doc.figure(
  mathml2.math(
    eq(
      mtext`p-value`,
      call(
        'P',
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
  restricted: doc.figure(
    mathml2.math(
      eq(
        mi`y`,
        add3(
          msub(SPECIAL.greek.beta, mn(0)),
          mi`x₁`,
          mi`u`
        )
      )
    ),
    doc.figcaption`General Linear Restrictions: restricted`
  ),
  unrestricted: doc.figure(
    mathml2.math(
      eq(
        mi`y`,
        add3(
          msub(SPECIAL.greek.beta, mn(0)),
          mul2(msub(SPECIAL.greek.beta, mn(1)), msub(mi`x`, mn(1))),
          add3(
            mul2(msub(SPECIAL.greek.beta, mn(2)), msub(mi`x`, mn(2))),
            mul2(msub(SPECIAL.greek.beta, mn(3)), msub(mi`x`, mn(3))),
            add(
              mul2(msub(SPECIAL.greek.beta, mn(4)), msub(mi`x`, mn(4))),
              mi`u`
            ),
          )
        )
      )
    ),
    doc.figcaption`General Linear Restrictions: unrestricted`
  ),
  null: doc.figure(
    mathml2.math(
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


