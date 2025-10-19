/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml, mathml2, doc } from '../../prelude.js';
import { components, mathmlHelper, mathmlHelper_2 } from '../prelude.js';
export { createFigure as createMLR, sizeKMLR as mlrExamples } from '../sec-02-1/mathml.js';

const {
  call, n, sup, sub, sum, subsup, table,
  paren, space, over, frac,
  SPECIAL, inv, sqrt, under, multiscripts, abs,
} = mathml;

const { mi, mo, mtext, mrow } = mathml2;
const { rows } = mathmlHelper_2;

const {
  greek: {
    beta, betaCrfx, Delta,
    rho, rhoCrfx,
    sigma, sigmaCrfx,
  },
} = mathml.SPECIAL;

const vars = {
  y: mi`y`,
  yi: sub(mi`y`, mi`i`),
  yEst: mi`ŷ`,
  yEstI: sub(mi`ŷ`, mi`i`),
  ysm: mi`ȳ`,
  u: mi`u`,
  ui: sub(mi`u`, mi`i`),
  uEst: mi`û`,
  uEstI: sub(mi`û`, mi`i`),
  x: mi`x`,
  xi: sub(mi`x`, mi`i`),
  xsm: mi`x̄`,

  b0: sub(beta, n(0)),
  b1: sub(beta, n(1)),
  b0Est: sub(betaCrfx, n(0)),
  b1Est: sub(betaCrfx, n(1)),
  colXY: sub(rho, mrow(mi`x`, mi`y`)),
  colXYEst: sub(rhoCrfx, mrow(mi`x`, mi`y`)),
  stddevX: sub(sigma, mi`x`),
  stddevXEst: sub(sigmaCrfx, mi`x`),
  stddevY: sub(sigma, mi`y`),
  stddevYEst: sub(sigmaCrfx, mi`y`),
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

const summaise = sum(mi`n`, mrow(mi`i`, mo`=`, n(0)));


export const normality = doc.figure(
  mathml2.math.attr({ style: 'font-size: 16px' })(
    rows(
      mrow(
        mi`u`, space(4), mo`∼`, space(4),
        call('Normal', mrow(
          n(0), mo`,`, space(4),
          sup(SPECIAL.greek.sigma, n(2))
        ))
      ),
      mrow(
        call(
          'E',
          mrow(
            mi`u`, space(4), mo`|`, space(4),
            sub(mi`x`, n(1)), mo`,`, space(4),
            SPECIAL.ellipse.h2, mo`,`, space(4),
            sub(mi`x`, mi`k`)
          )
        ),
        space(4), mo`=`, space(4),
        call('E', mi`u`),
        space(4), mo`=`, space(4),
        n(0)
      ),
      mrow(
        call(
          'Var',
          mrow(
            mi`u`, space(4), mo`|`, space(4),
            sub(mi`x`, n(1)), mo`,`, space(4),
            SPECIAL.ellipse.h2, mo`,`, space(4),
            sub(mi`x`, mi`k`)
          )
        ),
        space(4), mo`=`, space(4),
        call('Var', mi`u`),
        space(4), mo`=`, space(4),
        sup(SPECIAL.greek.sigma, n(2))
      ),
    )
  ),
  doc.figcaption`MLR 6 Normality Assumption`,
);

export const samplingDistribution = doc.figure(
  mathml2.math.attr({ style: 'font-size: 14px' })(
    rows(
      mrow(
        sub(SPECIAL.greek.circumflex.beta, mi`j`),
        space(4), mo`∼`, space(4),
        call(
          'Normal',
          mrow(
            sub(mi`β`, mi`j`),
            mo`,`, space(4),
            call('Var', sub(SPECIAL.greek.circumflex.beta, mi`j`))
          )
        )
      ),
      mrow(space(8)),
      mrow(
        frac(
          [
            mrow(
              sub(SPECIAL.greek.circumflex.beta, mi`j`),
              space(4), mo`−`, space(4),
              sub(mi`β`, mi`j`)
            )
          ],
          [
            sqrt(call('Var', sub(SPECIAL.greek.circumflex.beta, mi`j`)))
          ]
        ),
        space(4), mo`∼`, space(4),
        call('Normal', mrow(n(0), mo`,`, space(4), n(1)))
      ),
      mrow(space(8)),
    )
  ),
  doc.figcaption`Nrm Sampling Dist under MLR1-6`,
);

export const classicalLinearModel = doc.figure(
  mathml2.math.attr({ style: 'font-size: 14px' })(
    rows(
      mrow(
        mi`y`, space(4), mo`|`, space(4), mi`x`,
        space(4), mo`∼`, space(4),
        call('Normal', mrow(
          sub(mi`β`, n(0)),
          space(4), mo`+`, space(4),
          mul2(sub(mi`β`, n(1)), sub(mi`x`, n(1))),
          space(4), mo`+`, space(4),
          mul2(sub(mi`β`, n(2)), sub(mi`x`, n(2))),
          space(4), mo`+`, space(4),
          SPECIAL.ellipse.h2,
          space(4), mo`+`, space(4),
          mul2(sub(mi`β`, mi`k`), sub(mi`x`, mi`k`)),
          mo`,`, space(4),
          sup(SPECIAL.greek.sigma, n(2))
        ))
      ),
      mrow(),
      mrow(
        mi`x`, space(8),
        mtext`is short for`,
        space(8),
        mrow(
          paren([
            sub(mi`x`, n(1)), mo`,`, space(8),
            SPECIAL.ellipse.h, mo`,`, space(8),
            sub(mi`x`, mi`k`),
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
          sub(SPECIAL.greek.circumflex.beta, mi`j`),
          space(4), mo`∼`, space(4),
          mrow(
            mi`Normal`,
            ['mo', '['],
            sub(mi`β`, mi`j`),
            mo`,`, space(4),
            call('Var', sub(SPECIAL.greek.circumflex.beta, mi`j`)),
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
                sub(SPECIAL.greek.circumflex.beta, mi`j`),
                space(4), mo`−`, space(4),
                sub(mi`β`, mi`j`)
              )
            ],
            [
              call('sd', sub(SPECIAL.greek.circumflex.beta, mi`j`))
            ]
          ),
          space(4), mo`∼`, space(4),
          call('Normal', mrow(n(0), mo`,`, space(4), n(1)))
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
            sub(SPECIAL.greek.circumflex.beta, mi`j`),
            space(4), mo`−`, space(4),
            sub(mi`β`, mi`j`)
          )
        ],
        [
          call('se', sub(SPECIAL.greek.circumflex.beta, mi`j`))
        ]
      ),
      space(4), mo`∼`, space(4),
      sub(mi`t`, mrow(mi`n`, space(2), mo`−`, space(2), mi`k`, space(2), mo`−`, space(2), n(1))),
      space(4), mo`=`, space(4),
      sub(mi`t`, mi`df`)
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
      sub(mi`H`, n(0)),
      mo`:`, space(4),
      sub(mi`β`, mi`j`),
      space(4), mo`=`, space(4),
      n(0)
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
      under(
        table([
          [mrow(sub(mi`H`, n(0)), mo`:`), mrow(param(mathml2), mo.of(cons.null), thres(mathml2))],
          [mrow(sub(mi`H`, n(1)), mo`:`), mrow(param(mathml2), mo.of(cons.alt), thres(mathml2))],
        ], { columnalign: 'right left' }),
        under(space(0), mtext`Hypothesis'`),
      ),
      space(8),
      mrow(
        under(
          mrow(
            op.test === 'one-sided' ? mrow(
              multiscripts(param(mathml2), { sup: [mi`t`, undefined] }),
              space(4), mo.of(cons.alt),
              space(4), mi`c`,
            ) : mrow(
              mo`|`, mi`c`, mo`|`,
              space(4), mo`<`, space(4),
              multiscripts(param(mathml2), { sup: [mi`t`, undefined] }),
            ),
          ),
          under(space(0), mtext`H₀ rejection rule`),
        ),
        space(32),
        under(
          mrow(
            op.test === 'one-sided' ? mrow(
              multiscripts(param(mathml2), { sup: [mi`t`, undefined] }),
              space(8), mo.of(cons.null),
              space(8), mi`c`,
            ) : mrow(
              mo`|`, mi`c`, mo`|`,
              space(4), mo`>`, space(4),
              multiscripts(param(mathml2), { sup: [mi`t`, undefined] }),
            ),
          ),
          under(space(0), mtext`H₁ rejection rule`),
        ),
      ),
    ),
  ),
  doc.figcaption.of(title),
);

export const tStatisticForBJ = doc.figure(
  mathml2.math(
    eqId(
      sub(mi`t`, sub(SPECIAL.greek.circumflex.beta, mi`j`)),
      mathml.frac(
        [sub(SPECIAL.greek.circumflex.beta, mi`j`)],
        [mathml.call('se', sub(SPECIAL.greek.circumflex.beta, mi`j`))],
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
      space(4),
      mo`=`,
      space(4),
      call(
        'P',
        mrow(
          mtext`Type 1 Error`,
          space(4),
          mo`|`,
          space(4),
          sub(mi`H`, n(0)),
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
        sub(mi`c`, mi`lower`),
        mo`=`,
        mrow(
          inv(mi`CDF`),
          paren([
            frac([SPECIAL.greek.alpha], [n(2)]),
            mo`;`,
            space(4),
            mi`df`,
          ]),
        ),
      ],
      [
        sub(mi`c`, mi`upper`),
        mo`=`,
        mrow(
          inv(mi`CDF`),
          paren([
            minus(n(1), frac([SPECIAL.greek.alpha], [n(2)])),
            mo`;`,
            space(4),
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
    space(2), mo`>`,
    space(2), abs(mi`t`),
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
        sub(SPECIAL.greek.circumflex.beta, mi`j`),
        mo`±`,
        mul2(
          mrow(mi`c`, space(4)),
          call('se', sub(SPECIAL.greek.circumflex.beta, mi`j`))
        ),
      ],

      [
        sub(mi`β̲`, mi`j`),
        mo`≡`,
        minus(
          sub(SPECIAL.greek.circumflex.beta, mi`j`),
          mul2(
            mrow(mi`c`, space(4)),
            call('se', sub(SPECIAL.greek.circumflex.beta, mi`j`))
          )
        ),
      ],

      [
        sub(mi`β̄`, mi`j`),
        mo`≡`,
        add(
          sub(SPECIAL.greek.circumflex.beta, mi`j`),
          mul2(
            mrow(mi`c`, space(4)),
            call('se', sub(SPECIAL.greek.circumflex.beta, mi`j`))
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
          sub(mi`H`, n(0)),
          mo`:`,
          space(4),
          eq(
            sub(SPECIAL.greek.beta, n(1)),
            sub(SPECIAL.greek.beta, n(2))
          ),
        ),
        mrow(),

        mrow(
          sub(mi`H`, n(1)),
          mo`:`,
          space(4),
          mrow(
            sub(SPECIAL.greek.beta, n(1)),
            space(4),
            mo`<`,
            space(4),
            sub(SPECIAL.greek.beta, n(2)),
          ),
        ),

        mrow(),

        mrow(
          mi`t`,
          space(4),
          mo`=`,
          space(4),
          frac(
            [
              minus(
                sub(SPECIAL.greek.circumflex.beta, n(1)),
                sub(SPECIAL.greek.circumflex.beta, n(2))
              ),
            ],
            [
              call(
                'se',
                minus(
                  sub(SPECIAL.greek.circumflex.beta, n(1)),
                  sub(SPECIAL.greek.circumflex.beta, n(2))
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
          sub(mi`H`, n(0)),
          mo`:`,
          space(4),
          eq(
            minus(
              sub(SPECIAL.greek.beta, n(1)),
              sub(SPECIAL.greek.beta, n(2))
            ),
            n(0)
          ),
        ),

        // Row 2: H₁: β₁ − β₂ < 0
        mrow(
          sub(mi`H`, n(1)),
          mo`:`,
          space(4),
          mrow(
            minus(
              sub(SPECIAL.greek.beta, n(1)),
              sub(SPECIAL.greek.beta, n(2))
            ),
            space(4),
            mo`<`,
            space(4),
            n(0),
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
            sub(SPECIAL.greek.circumflex.beta, n(1)),
            sub(SPECIAL.greek.circumflex.beta, n(2))
          )
        ),
        add(
          call('Var', sub(SPECIAL.greek.circumflex.beta, n(1))),
          minus(
            call('Var', sub(SPECIAL.greek.circumflex.beta, n(2))),
            mul2(
              mrow(n(2), space(4)),
              call(
                'Cov',
                sub(SPECIAL.greek.circumflex.beta, n(1)),
                sub(SPECIAL.greek.circumflex.beta, n(2))
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
            sub(SPECIAL.greek.circumflex.beta, n(1)),
            sub(SPECIAL.greek.circumflex.beta, n(2))
          )
        ),
        sup(
          paren([
            minus(
              add(
                sup(
                  mrow(
                    mo`[`,
                    call('se', sub(SPECIAL.greek.circumflex.beta, n(1))),
                    mo`]`,
                  ),
                  n(2)
                ),
                sup(
                  mrow(
                    mo`[`,
                    call('se', sub(SPECIAL.greek.circumflex.beta, n(2))),
                    mo`]`,
                  ),
                  n(2)
                ),
              ),
              mul2(n(2), sub(mi`s`, mrow(n(1), n(2))))
            ),
          ]),
          frac([n(1)], [n(2)])
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
              paren([ mul2( sup(mi`X`, mi`⊤`), mi`X` ) ])
            ),
            mul2( sup(mi`X`, mi`⊤`), mi`y` )
          )
        ],
        [
          call('Var', SPECIAL.greek.circumflex.beta),
          mo`=`,
          mul2(
            sup(SPECIAL.greek.circumflex.sigma, n(2)),
            inv( paren([ mul2( sup(mi`X`, mi`⊤`), mi`X` ) ]) )
          )
        ],
        [
          sup(SPECIAL.greek.circumflex.sigma, n(2)),
          mo`=`,
          eq(
            frac([mi`SSR`], [mrow(minus(mi`n`, mi`k`))]),
            mul2(
              paren([
                sum(mi`n`, mrow(mi`i`, mo`=`, n(1))),
                sup(sub(mi`û`, mi`i`), n(2)),
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
            sup(SPECIAL.greek.circumflex.sigma, n(2)),
            inv( paren([ mul2( sup(mi`X`, mi`⊤`), mi`X` ) ]) )
          ),
        ],
        [
          sub(mi`s`, n(12)),
          mo`=`,
          call(
            'Cov',
            mrow(
              sub(SPECIAL.greek.circumflex.beta, n(1)),
              mo`,`,
              space(4),
              sub(SPECIAL.greek.circumflex.beta, n(2)),
            )
          ),
          mo`=`,
          mul2(
            sup(SPECIAL.greek.circumflex.sigma, n(2)),
            sub(
              inv( paren([ mul2( sup(mi`X`, mi`⊤`), mi`X` ) ]) ),
              n(12)
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
	      sub(SPECIAL.greek.theta, n(1)),
	      minus(
	        sub(SPECIAL.greek.beta, n(1)),
	        sub(SPECIAL.greek.beta, n(2))
	      )
	    ),
	  ),
	  doc.figcaption`parameter definition θ₁`
	),
	null: doc.figure(
	  mathml2.math(
	    mrow(
	      sub(mi`H`, n(0)),
	      mo`:`,
	      space(4),
	      eq(
	        sub(SPECIAL.greek.theta, n(1)),
	        n(0)
	      ),
	    ),
	  ),
	  doc.figcaption`null hypothesis`
	),
	alt: doc.figure(
	  mathml2.math(
	    mrow(
	      sub(mi`H`, n(1)),
	      mo`:`,
	      space(4),
	      mrow(
	        sub(SPECIAL.greek.theta, n(1)),
	        space(4),
	        mo`<`,
	        space(4),
	        n(0),
	      ),
	    ),
	  ),
	  doc.figcaption`alternative hypothesis`
	),
	tStat: doc.figure(
	  mathml2.math(
	    mrow(
	      mi`t`,
	      space(4),
	      mo`=`,
	      space(4),
	      frac(
	        [sub(mi`𝜃̂`, n(1))],
	        [call('se', sub(mi`𝜃̂`, n(1)))]
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
	          sub(SPECIAL.greek.beta, n(0)),
	          mul2(
	            paren([
	              add(
	                sub(SPECIAL.greek.theta, n(1)),
	                sub(SPECIAL.greek.beta, n(2))
	              ),
	            ]),
	            sub(mi`x`, n(1)),
	          ),
	          add3(
	            mul2(sub(SPECIAL.greek.beta, n(2)), sub(mi`x`, n(2))),
	            mul2(sub(SPECIAL.greek.beta, n(3)), sub(mi`x`, n(3))),
	            mi`u`
	          )
	        ),
	      ],

	      [
	        space(0),
	        mo`=`,
	        add3(
	          sub(SPECIAL.greek.beta, n(0)),
	          mul2(sub(SPECIAL.greek.theta, n(1)), sub(mi`x`, n(1))),
	          add3(
	            mul2(
                sub(SPECIAL.greek.beta, n(2)),
                paren([add(sub(mi`x`, n(1)), sub(mi`x`, n(2)))]),
              ),
	            mul2(sub(SPECIAL.greek.beta, n(3)), sub(mi`x`, n(3))),
	            mi`u`
	          )
	        ),
	      ],

        [
          space(0),
          mo`=`,
          add3(
            sub(SPECIAL.greek.beta, n(0)),
            mul2(sub(SPECIAL.greek.theta, n(1)), sub(mi`x`, n(1))),
            add3(
              mul2(sub(SPECIAL.greek.beta, n(2)), sub(mi`x`, mrow(n(1),mo`+`,n(2)))),
              mul2(sub(SPECIAL.greek.beta, n(3)), sub(mi`x`, n(3))),
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
          sub(SPECIAL.greek.beta, n(0)),
          mul2(sub(SPECIAL.greek.theta, n(1)), sub(mi`x`, n(1))),
          add3(
            mul2(sub(SPECIAL.greek.beta, n(2)), sub(mi`x`, mrow(n(1),mo`+`,n(2)))),
            mul2(sub(SPECIAL.greek.beta, n(3)), sub(mi`x`, n(3))),
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
        sub(mi`𝜃̂`, n(1)),
        space(4),
        mo`±`,
        space(4),
        mul2(
          mrow(n(1.96), space(8)),
          call('se', sub(mi`𝜃̂`, n(1)))
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
        sub(mi`H`, n(0)),
        mo`:`,
        space(4),
        eq(sub(SPECIAL.greek.beta, n(3)), n(0)),
        mo`,`,
        space(4),
        eq(sub(SPECIAL.greek.beta, n(4)), n(0)),
        mo`,`,
        space(4),
        eq(sub(SPECIAL.greek.beta, n(5)), n(0)),
      )],

      [mrow()],

      [mrow(
        sub(mi`H`, n(1)),
        mo`:`,
        space(4),
        sub(mi`H`, n(0)),
        space(4),
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
              sub(mi`SSR`, mi`r`),
              sub(mi`SSR`, mi`ur`)
            ), mi`q`),
          ],
          [
            div(
              sub(mi`SSR`, mi`ur`),
              paren([mi`n`, space(4), mo`-`, space(4), mi`k`, space(4), mo`-`, space(4), n(1)]),
            ),
          ]
      ), space(0), space(0)],

      [space(0)],
      [space(0)],

      [mi`q`,
        mo`=`,
        mtext`numerator degrees of freedom`,
        mo`=`,
        minus(
          sub(mi`df`, mi`r`),
          sub(mi`df`, mi`ur`)
        ),
      ],

      [
        minus(mi`n`, minus(mi`k`, n(1))),
        mo`=`,
        mtext`denominator degrees of freedom`,
        mo`=`,
        sub(mi`df`, mi`ur`),
      ],
    ], { columnalign: 'right center left center left' }),
  ),
  doc.figcaption`F-statistic`
);

export const fStatDistribution = doc.figure(
  mathml2.math(
    mrow(
      mi`F`,
      space(4),
      mo`∼`,
      space(4),
      sub(
        mi`F`,
        mrow(
          mi`q`,
          mo`,`,
          space(4),
          minus(
            mi`n`,
            add(mi`k`, n(1))
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
                  sup(sub(mi`R`, mi`ur`), n(2)),
                  sup(sub(mi`R`, mi`r`), n(2))
                ),
              ]),
              mi`q`,
            ),
          ],
          [
            div(
              paren([
                minus(
                  n(1),
                  sup(sub(mi`R`, mi`ur`), n(2))
                ),
              ]),
              paren([mi`n`, space(4), mo`-`, space(4), mi`k`, space(4), mo`-`, space(4), n(1)]),
            ),
          ]
        ),
      ),
      frac(
        [
          div(
            paren([
              minus(
                sup(sub(mi`R`, mi`ur`), n(2)),
                sup(sub(mi`R`, mi`r`), n(2))
              ),
            ]),
            mi`q`,
          )
        ],
        [
          mul2(
            minus(
              n(1),
              sup(sub(mi`R`, mi`ur`), n(2))
            ),
            sub(mi`df`, mi`ur`)
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
          space(4),
          mo`>`,
          space(4),
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
          sub(SPECIAL.greek.beta, n(0)),
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
          sub(SPECIAL.greek.beta, n(0)),
          mul2(sub(SPECIAL.greek.beta, n(1)), sub(mi`x`, n(1))),
          add3(
            mul2(sub(SPECIAL.greek.beta, n(2)), sub(mi`x`, n(2))),
            mul2(sub(SPECIAL.greek.beta, n(3)), sub(mi`x`, n(3))),
            add(
              mul2(sub(SPECIAL.greek.beta, n(4)), sub(mi`x`, n(4))),
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
        sub(mi`H`, n(0)),
        mo`:`,
        space(4),
        eq(sub(SPECIAL.greek.beta, n(1)), n(1)),
        mo`,`,
        space(4),
        eq(sub(SPECIAL.greek.beta, n(2)), n(0)),
        mo`,`,
        space(4),
        eq(sub(SPECIAL.greek.beta, n(3)), n(0)),
        mo`,`,
        space(4),
        eq(sub(SPECIAL.greek.beta, n(4)), n(0))
      )
    ),
    doc.figcaption`Null hypothesis`
  ),
};


