/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml, mathml2, doc } from '../../prelude.js';
import { components, mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const {
  call, n, sup, sub, sum, subsup,
  paren, space, over, frac,
  SPECIAL, inv, table, sqrt,
} = mathml;

const { mi, mo, mtext, mrow } = mathml2;
const { rows, annotationOver, annotationUnder } = mathmlHelper_2;
const { todo } = components;

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
  minus, minusP, add3,
} = mathmlHelper;

/** @param {E.Item} a @param {E.Item} b */
const mul2 = (a, b) => mrow(a, b);

/** @param {...E.Item} body */
const E = (...body) => call('E', frag([...body]))

/** @param {E.Item} a @param {E.Item} b */
const Covar = (a, b) => call('Covar', a, b)

const summaise = sum(mi`n`, mrow(mi`i`, mo`=`, n(0)));

export const concequenceOfOmittedVariableBias = doc.figure(
  todo({}, 'See Slide 3'),
  doc.figcaption`Concequences of Omitted Variable Bias`,
);

export const residuals = doc.figure(
  mathml2.math(
    eq(
      sub(vars.u, mi`i`),
      minus(
        sub(mi`y`, mi`i`),
        sub(mi`ŷ`, mi`i`)
      )
    )
  ),
  doc.figcaption`Residuals`,
);

/**
 * @param {string} name
 * @param {string} y
 * @param {string[]} xs
 * @param {{ yLog?: boolean }} [options]
 */
export const createFigure = (name, y, xs, options = {}) => doc.figure(
  mathml2.math(
    mrow(
      annotationUnder.attr({ label: mtext.of(y) })((
        options.yLog ? mrow(call('log', mi`y`)) : mi`y`
      )),
      space(4), mo`=`, space(4),
      sub(mi`β`, n(0)),
      space(4), mo`+`, space(4),
      ...xs.flatMap((x, index) => [
        sub(mi`β`, n(index + 1)),
        annotationUnder.attr({ label: mtext.of(x) })(sub(mi`x`, n(index + 1))),
        space(4), mo`+`, space(4)
      ]),
      mi`u`,
    )
  ),
  doc.figcaption`${name}`,
);

export const quadraticExpressionInMLR = {
  regression: doc.figure(
    mathml2.math(
      eq(
        mi`y`,
        add3(
          sub(mi`β`, n(0)),
          mrow(sub(mi`β`, n(1)), sub(mi`x`, n(1))),
          add(
            mrow(sub(mi`β`, n(2)), sup(sub(mi`x`, n(1)), n(2))),
            mi`u`
          ),
        ),
      )
    ),
    doc.figcaption`Quadratic Equation`,
  ),
  relation: doc.figure(
    mathml2.math(
      frac(
        [mrow(SPECIAL.greek.delta, mi`y`)],
        [mrow(SPECIAL.greek.delta, sub(mi`x`, n(1)))]
      ),
      mrow(
        space(4), mo`≈`, space(4),
        sub(mi`β`, n(1)),
        space(4), mo`+`, space(4),
        n(2), sub(mi`β`, n(2)), sub(mi`x`, n(1))
      )
    ),
    doc.figcaption`Interpreting coefficent in quadratic equation MLRs`,
  ),
};

export const size2MLR = {
  ols: doc.figure(
    mathml2.math(
      rows(
        mrow(
          mo`{`, space(2),
          paren([
            sub(mi`x`, mrow(mi`i`, n(1))), mo`,`, space(4),
            sub(mi`x`, mrow(mi`i`, n(2))), mo`,`, space(4),
            sub(mi`y`, mi`i`)
          ]),
          space(6), mo`:`, space(6),
          mi`i`, space(4), mo`=`, space(4),
          n(1), mo`,`, space(4),
          n(2), mo`,`, space(4),
          SPECIAL.ellipse.h2, space(4), mo`,`, space(4),
          mi`n`, space(2), mo`}`
        ),

        mrow(
          sum(mi`n`, mrow(mi`i`, space(4), mo`=`, space(4), n(1))),
          space(8),
          sup(paren([
            sub(mi`y`, mi`i`), space(4), mo`-`, space(4),
            sub(SPECIAL.greek.circumflex.beta, n(0)), space(4), mo`-`, space(4),
            mrow(
              sub(SPECIAL.greek.circumflex.beta, n(1)),
              sub(mi`x`, mrow(mi`i`, n(1)))
            ),
            space(4), mo`-`, space(4),
            mrow(
              sub(SPECIAL.greek.circumflex.beta, n(2)),
              sub(mi`x`, mrow(mi`i`, n(2)))
            )
          ]), n(2))
        )
      )
    ),
    doc.figcaption`OLS for 2 Regressors`,
  ),
  regression: doc.figure(
    mathml2.math(
      eq(
        mi`y`,
        add(
          add3(
            sub(mi`β`, n(0)),
            mul2(sub(mi`β`, n(1)), sub(mi`x`, n(1))),
            mul2(sub(mi`β`, n(2)), sub(mi`x`, n(2)))
          ),
          mi`u`
        ),
      )
    ),
    doc.figcaption`general MLR with 2 independent vars`,
  ),
  estimate: doc.figure(
    mathml2.math(
      eq(
        mi`𝑦̂`,
        add3(
          sub(mathml.SPECIAL.greek.circumflex.beta, n(0)),
          mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(1)), sub(mi`x`, n(1))),
          mul2(sub(mathml.SPECIAL.greek.circumflex.beta, n(2)), sub(mi`x`, n(2)))
        )
      )
    ),
    doc.figcaption`Estimated Model with 2 regressors`,
  ),
  missing: doc.figure(
    mathml2.math(
      eq(
        mi`ỹ`,
        add(
          sub(mi`𝛽̃`, n(0)),
          mul2(sub(mi`𝛽̃`, n(1)), sub(mi`x`, n(1)))
        )
      )
    ),
    doc.figcaption`Modeling with missing variable`,
  ),
  assumption: doc.figure(
    mathml2.math(
      eq(
        call(
          'E',
          mrow(
            mi`u`, space(4), mo`|`, space(4),
            sub(mi`x`, n(1)), mo`,`, space(4),
            sub(mi`x`, n(2))
          )
        ),
        n(0)
      )
    ),
    doc.figcaption`other factors affecting y do not affect x1 or x2`
  ),
  partialEffect: doc.figure(
    mathml2.math(
      eq(
        mrow(
          SPECIAL.greek.delta,
          mi`ŷ`
        ),
        add(
          mul2(
            sub(SPECIAL.greek.circumflex.beta, n(1)),
            mul2(SPECIAL.greek.delta, sub(mi`x`, n(1)))
          ),
          mul2(
            sub(SPECIAL.greek.circumflex.beta, n(2)),
            mul2(SPECIAL.greek.delta, sub(mi`x`, n(2)))
          )
        )
      )
    ),
    doc.figcaption`Ceteris Paribus interpretation`,
  ),
};

export const sizeKMLR = {
  regression: doc.figure(
    mathml2.math(
      eq(
        mi`y`,
        mrow(
          sub(mi`β`, n(0)), space(4), mo`+`, space(4),
          sub(mi`β`, n(1)), sub(mi`x`, n(1)), space(4), mo`+`, space(4),
          sub(mi`β`, n(2)), sub(mi`x`, n(2)), space(4), mo`+`, space(4),
          sub(mi`β`, n(3)), sub(mi`x`, n(3)), space(4), mo`+`, space(4),
          SPECIAL.ellipse.h2, space(4), mo`+`, space(4),
          sub(mi`β`, mi`k`), sub(mi`x`, mi`k`), space(4), mo`+`, space(4),
          mi`u`
        )
      )
    ),
    doc.figcaption`General MLR`,
  ),
  estimate: doc.figure(
    mathml2.math(
      eq(
        mi`𝑦̂`,
        mrow(
          sub(mi`𝛽̂`, n(0)), space(4), mo`+`, space(4),
          sub(mi`𝛽̂`, n(1)), sub(mi`x`, n(1)), space(4), mo`+`, space(4),
          sub(mi`𝛽̂`, n(2)), sub(mi`x`, n(2)), space(4), mo`+`, space(4),
          SPECIAL.ellipse.h2, space(4), mo`+`, space(4),
          sub(mi`𝛽̂`, mi`k`), sub(mi`x`, mi`k`), space(4)
        )
      )
    ),
    doc.figcaption`Estimated Model with K regressors`,
  ),
  assumption: doc.figure(
    mathml2.math(
      eq(
        call(
          'E',
          mrow(
            mi`u`, space(4), mo`|`, space(4),
            sub(mi`x`, n(1)), mo`,`, space(4),
            sub(mi`x`, n(2)), mo`,`, space(4),
            SPECIAL.ellipse.h2, mo`,`, space(4),
            sub(mi`x`, mi`k`)
          )
        ),
        n(0)
      )
    ),
    doc.figcaption`Conditional expectation assumption`,
  ),
  ols: () => {
    const inner = paren([
      sub(mi`y`, mi`i`), space(4), mo`-`, space(4),
      sub(SPECIAL.greek.circumflex.beta, n(0)), space(4), mo`-`, space(4),
      mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), sub(mi`x`, mrow(mi`i`, n(1)))),
      space(4), mo`-`, space(4),
      SPECIAL.ellipse.h2, space(4), mo`-`, space(4),
      mul2(sub(SPECIAL.greek.circumflex.beta, mi`k`), sub(mi`x`, mrow(mi`i`, mi`k`))),
    ]);

    /** @param {E.Item} body */
    const sigma = (body) =>
      mrow(
        sum(mi`n`, mrow(mi`i`, mo`=`, n(1))),
        body
      );

    return doc.figure(
      mathml2.math(
        table([
          [sigma(inner), mo`=`, n(0) ],
          [sigma(mul2(sub(mi`x`, mrow(mi`i`, n(1))), inner)), mo`=`, n(0) ],
          [sigma(mul2(sub(mi`x`, mrow(mi`i`, n(2))), inner)), mo`=`, n(0) ],
          [SPECIAL.ellipse.v, space(4), space(4) ],
          [sigma(mul2(sub(mi`x`, mrow(mi`i`, mi`k`)), inner)), mo`=`, n(0) ],
        ], { columnalign: 'right center left' })
      ),
      doc.figcaption`OLS Constraint for K regressors`,
    );
  },
  partialEffect: doc.figure(
    mathml2.math(
      eq(
        mrow(SPECIAL.greek.delta, mi`ŷ`),
        mrow(
          mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), mul2(SPECIAL.greek.delta, sub(mi`x`, n(1)))),
          space(4), mo`+`, space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(2)), mul2(SPECIAL.greek.delta, sub(mi`x`, n(2)))),
          space(4), mo`+`, space(4),
          SPECIAL.ellipse.h2,
          space(4), mo`+`, space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, mi`k`), mul2(SPECIAL.greek.delta, sub(mi`x`, mi`k`)))
        )
      )
    ),
    doc.figcaption`Ceteris Paribus interpretation`
  ),
  fitted: doc.figure(
    mathml2.math(
      eq(
        sub(mi`ŷ`, mi`i`),
        mrow(
          sub(SPECIAL.greek.circumflex.beta, n(0)),
          space(4), mo`+`, space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), sub(mi`x`, mrow(mi`i`, n(1)))),
          space(4), mo`+`, space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(2)), sub(mi`x`, mrow(mi`i`, n(2)))),
          space(4), mo`+`, space(4),
          SPECIAL.ellipse.h2,
          space(4), mo`+`, space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, mi`k`), sub(mi`x`, mrow(mi`i`, mi`k`)))
        )
      )
    ),
    doc.figcaption`Fitted values`,
  ),
  throughOrigin: doc.figure(
    mathml2.math(
      eq(
        mi`ỹ`,
        mrow(
          mul2(sub(mi`𝛽̃`, n(1)), sub(mi`x`, n(1))),
          space(4), mo`+`, space(4),
          mul2(sub(mi`𝛽̃`, n(2)), sub(mi`x`, n(2))),
          space(4), mo`+`, space(4),
          SPECIAL.ellipse.h2,
          space(4), mo`+`, space(4),
          mul2(sub(mi`𝛽̃`, mi`k`), sub(mi`x`, mi`k`))
        )
      )
    ),
    doc.figcaption`Regressoin through the origin`,
  ),
};

export const assumptions = {
  mlr4: doc.figure(
    mathml2.math(
      eq(
        call(
          'E',
          mrow(
            mi`u`, space(4), mo`|`, space(4),
            sub(mi`x`, n(1)), space(4), mo`,`, space(4),
            sub(mi`x`, n(2)), space(4), mo`,`, space(4),
            SPECIAL.ellipse.h2, space(4), mo`,`, space(4),
            sub(mi`x`, mi`k`)
          )
        ),
        n(0)
      )
    ),
    doc.figcaption`Zero Conditional Mean`,
  ),
  mlr5: doc.figure(
    mathml2.math(
      eq(
        call(
          'Var',
          mrow(
            mi`u`, space(4), mo`|`, space(4),
            sub(mi`x`, n(1)), mo`,`, space(4),
            SPECIAL.ellipse.h2, mo`,`, space(4),
            sub(mi`x`, mi`k`)
          )
        ),
        sup(SPECIAL.greek.sigma, n(2))
      )
    ),
    doc.figcaption`Homoskedasticity`,
  ),
  mlr1234: doc.figure(
    mathml2.math.attr({ style: 'font-size: 12px' })(
      eq(
        call('E', mrow(mi`y`, space(4), mo`|`, space(4), mi`x`)),
        mrow(
          sub(mi`β`, n(0)),
          space(4), mo`+`, space(4),
          mul2(sub(mi`β`, n(1)), sub(mi`x`, n(1))),
          space(4), mo`+`, space(4),
          mul2(sub(mi`β`, n(2)), sub(mi`x`, n(2))),
          space(4), mo`+`, space(4),
          SPECIAL.ellipse.h2,
          space(4), mo`+`, space(4),
          mul2(sub(mi`β`, mi`k`), sub(mi`x`, mi`k`))
        )
      )
    ),
    doc.figcaption`MLR 1, 2, 3, 4`,
  ),
};

export const unbiasedness = {
  theorum3_1: doc.figure(
    mathml2.math(
      eq(
        call('E', sub(SPECIAL.greek.circumflex.beta, mi`j`)),
        mrow(
          sub(mi`β`, mi`j`),
          mo`,`, space(4),
          mi`j`, space(4), mo`=`, space(4),
          n(0), mo`,`, space(4),
          n(1), mo`,`, space(4),
          SPECIAL.ellipse.h2, mo`,`, space(4),
          mi`k`
        )
      )
    ),
    doc.figcaption`Unbiasedness of OLS`,
  ),
  unbiasedExpansion: doc.figure(
    mathml2.math(
      table([
        [
          call('E', sub(mi`𝛽̃`, n(1))),
          mo`=`,
          call(
            'E',
            mrow(
              sub(SPECIAL.greek.circumflex.beta, n(1)),
              space(4), mo`+`, space(4),
              mul2(
                sub(SPECIAL.greek.circumflex.beta, n(2)),
                sub(mi`𝛿̃`, n(1))
              )
            )
          ),
        ],
        [
          mathml.space(0),
          mo`=`,
          mrow(
            call('E', sub(SPECIAL.greek.circumflex.beta, n(1))),
            space(4), mo`+`, space(4),
            mul2(
              call('E', sub(SPECIAL.greek.circumflex.beta, n(2))),
              sub(mi`𝛿̃`, n(1))
            )
          ),
        ],
        [
          mathml.space(0),
          mo`=`,
          mrow(
            sub(mi`𝛽`, n(1)),
            space(4), mo`+`, space(4),
            mul2(
              sub(mi`𝛽`, n(2)),
              sub(mi`𝛿̃`, n(1))
            )
          ),
        ],
      ], { columnalign: 'right center left' })
    ),
    doc.figcaption`Solving for E(𝛽̃₁)`,
  ),
  omittedVariableBias: doc.figure(
    mathml2.math(
      eq(
        call('Bias', sub(mi`𝛽̃`, n(1))),
        mrow(
          call('E', sub(mi`𝛽̃`, n(1))),
          space(4), mo`−`, space(4),
          sub(mi`𝛽`, n(1)),
          space(4), mo`=`, space(4),
          mul2(
            sub(mi`𝛽`, n(2)),
            sub(mi`𝛿̃`, n(1))
          )
        )
      )
    ),
    doc.figcaption`Bias of Omitted Variable`,
  ),
};

export const partiallingOut = doc.figure(
  mathml2.math.attr({ style: 'font-size: 12px' })(
    eq(
      sub(SPECIAL.greek.circumflex.beta, n(1)),
      mrow(
        paren([
          mrow(
            sum(mi`n`, mrow(mi`i`, mo`=`, n(1))),
            mul2(
              sub(mi`r̂`, mrow(mi`i`, n(1))),
              sub(mi`y`, mi`i`)
            )
          )
        ]),
        space(4), mo`÷`, space(4),
        paren([
          mrow(
            sum(mi`n`, mrow(mi`i`, mo`=`, n(1))),
            sup(
              sub(mi`r̂`, mrow(mi`i`, n(1))),
              n(2)
            )
          )
        ])
      )
    )
  ),
  doc.figcaption`A "Partialling out" Interpretation of multiple regression`,
);

export const compareSLRAndMLR = doc.figure(
  mathml2.math(
    mathml.table([
      [
        mi`ỹ`,
        mo`=`,
        mrow(
          sub(mi`𝛽̃`, n(0)),
          space(4), mo`+`, space(4),
          mul2(sub(mi`𝛽̃`, n(1)), sub(mi`x̃`, n(1)))
        )
      ],
      [
        mi`ŷ`,
        mo`=`,
        mrow(
          sub(SPECIAL.greek.circumflex.beta, n(0)),
          space(4), mo`+`, space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), sub(mi`x`, n(1))),
          space(4), mo`+`, space(4),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(2)), sub(mi`x`, n(2)))
        )
      ],
      [
        sub(mi`𝛽̃`, n(1)),
        mo`=`,
        mrow(
          sub(SPECIAL.greek.circumflex.beta, n(1)),
          space(4), mo`+`, space(4),
          mul2(
            sub(SPECIAL.greek.circumflex.beta, n(2)),
            sub(mi`𝛿̃`, n(1))
          )
        )
      ]
    ], { columnalign: 'right center left' })
  ),
  doc.figcaption`Comparing SLR and MLR Estimates`,
);

export const samplingVarianceOfEstimators = doc.figure(
  mathml2.math(
    eq(
      call('Var', sub(SPECIAL.greek.circumflex.beta, mi`j`)),
      frac(
        [ sup(SPECIAL.greek.sigma, n(2)) ],
        [
          mul2(
            sub(mi`SST`, mi`j`),
            paren([
              n(1), space(4), mo`−`, space(4),
              sup(sub(mi`R`, mi`j`), n(2))
            ])
          )
        ]
      )
    )
  ),
  doc.figcaption`Sampling Variances of The OLS Slope Estimators`,
);

export const beyondTheScope = {
  logitModel: doc.figure(
    mathml2.math(
      eq(
        call(
          'ln',
          frac(
            [sub(mi`P`, mi`i`)],
            [mrow(n(1), space(4), mo`−`, space(4), sub(mi`P`, mi`i`))]
          )
        ),
        mrow(
          sub(mi`β`, n(0)),
          space(4), mo`+`, space(4),
          mul2(sub(mi`β`, n(1)), sub(mi`x`, mrow(mi`i`, n(1)))),
          space(4), mo`+`, space(4),
          sub(mi`ε`, mi`i`)
        )
      )
    ),
    doc.figcaption`Example Logit Model`,
  ),
  randomEffectsModelForLongitudinalData: doc.figure(
    mathml2.math(
      eq(
        sub(mi`y`, mrow(mi`i`, mi`j`)),
        mrow(
          sub(mi`β`, n(0)),
          space(4), mo`+`, space(4),
          mul2(sub(mi`β`, n(1)), sub(mi`x`, mrow(mi`i`, mi`j`))),
          space(4), mo`+`, space(4),
          sub(mi`b`, mi`i`),
          space(4), mo`+`, space(4),
          sub(mi`ε`, mrow(mi`i`, mi`j`))
        )
      )
    ),
    doc.figcaption`Random Effects For Longitudinal Data`,
  ),
};

export const thoughtExperiment = doc.figure(
  mathml2.math(
    mathml.table([
      [
        sub(mi`ŷ`, mi`i`),
        mo`=`,
        add3(
          sub(SPECIAL.greek.circumflex.beta, n(0)),
          mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), sub(mi`x`, mi`1i`)),
          add(
            mul2(sub(SPECIAL.greek.circumflex.beta, n(2)), sub(mi`x`, mi`2i`)),
            sub(mi`û`, mi`i`)
          ),
        ),
      ],
      [
        sub(mi`x̂`, mi`2i`),
        mo`=`,
        add3(
          sub(SPECIAL.greek.circumflex.beta, sub(n(0), n(2))),
          mul2(sub(SPECIAL.greek.circumflex.beta, sub(n(1), n(2))), sub(mi`x`, mi`1i`)),
          sub(mi`ê`, mrow(mi`i`, n(2))),
        ),
      ],
      [
        sub(mi`ŷ`, mrow(mi`i`, sub(mi`x`, n(2)))),
        mo`=`,
        add3(
          sub(SPECIAL.greek.beta, mrow(n(0), sub(mi`x`, n(2)))),
          mul2(sub(SPECIAL.greek.beta, mrow(n(1), sub(mi`x`, n(2)))), sub(mi`x`, mi`1i`)),
          add(
            mul2(
              sub(SPECIAL.greek.beta, mrow(mi`i`, n(2))),
              annotationOver.attr({
                label: sub(mi`ê`, mrow(mi`i`, sub(mi`x`, n(2))))
              })(paren([minus(sub(mi`x`, mi`2i`), sub(mi`x̂`, mi`2i`))])),
            ),
            sub(mi`û`, mrow(mi`i`, sub(mi`x`, n(2))))
          ),
        ),
      ],
    ], { columnalign: 'right center left' })
  ),
  doc.figcaption`Fitted value subtraction.`
);

export const varianceBiasComparison = {
  vif: doc.figure(
    mathml2.math(
      eq(
        sub(mi`VIF`, mi`j`),
        frac(
          [n(1)],
          [paren([n(1), space(4), mo`-`, space(4), sup(sub(mi`R`, mi`j`), n(2))])]
        )
      )
    ),
    doc.figcaption`Variance Inflation Factor`
  ),
  var: doc.figure(
    mathml2.math(
      eq(
        eq(
          call('Var', sub(SPECIAL.greek.circumflex.beta, mi`j`)),
          mul2(
            frac(
              [sup(SPECIAL.greek.sigma, n(2))],
              [sub(mi`SST`, mi`j`)]
            ),
            sub(mi`VIF`, mi`j`)
          )
        ),
        frac(
          [sup(SPECIAL.greek.sigma, n(2))],
          [sub(mi`SST`, mi`j`), paren([n(1), space(4), mo`-`, space(4), sup(sub(mi`R`, mi`j`), n(2))])]
        )
      )
    ),
    doc.figcaption`Variance of β̂ⱼ expressed using VIFⱼ.`
  ),
  biasBeta1: doc.figure(
    mathml2.math(
      eq(
        call('Var', sub(mi`𝛽̃`, n(1))),
        frac([sup(mi`𝜎`, n(2))], [sub(mi`SST`, n(1))])
      )
    ),
    doc.figcaption`Variance of 𝛽̃₁ (biased 𝛽̂₁)`,
  ),
};

export const standardError = {
  estimateStdDevivation: doc.figure(
    mathml2.math(
      mathml.table([
        [
          sub(mi`û`, mi`i`),
          mo`=`,
          mrow(
            sub(mi`y`, mi`i`),
            space(4), mo`-`, space(4), sub(SPECIAL.greek.circumflex.beta, n(0)),
            space(4), mo`-`, space(4), mul2(sub(SPECIAL.greek.circumflex.beta, n(1)), sub(mi`x`, mrow(mi`i`, n(1)))),
            space(4), mo`-`, space(4), mul2(sub(SPECIAL.greek.circumflex.beta, n(2)), sub(mi`x`, mrow(mi`i`, n(2)))),
            space(4), SPECIAL.ellipse.h2,
            space(4), mo`-`, space(4), mul2(sub(SPECIAL.greek.circumflex.beta, mi`k`), sub(mi`x`, mrow(mi`i`, mi`k`))),
            space(4), mo`.`
          ),
        ],

        [
          sup(SPECIAL.greek.circumflex.sigma, n(2)),
          mo`=`,
          eq(
            frac(
              [
                paren([
                  mrow(
                    sum(mi`n`, mrow(mi`i`, space(4), mo`=`, space(4), n(1))),
                    space(6),
                    sup(sub(mi`û`, mi`i`), n(2))
                  )
                ]),
              ],
              [
                mrow(mi`n`, space(4), mo`-`, space(4), mi`k`, space(4), mo`-`, space(4), n(1)),
              ],
            ),
            mrow(
              frac(
                [mi`SSR`],
                [mrow(mi`n`, space(4), mo`-`, space(4), mi`k`, space(4), mo`-`, space(4), n(1))]
              ),
              space(4), mo`.`
            )
          ),
        ],
      ])
    ),
    doc.figcaption`estimating unbiased standard of 𝜎²`
  ),
  se: doc.figure(
    mathml2.math(
      mathml.table([
        [
          mathml.call('sd', sub(mi`x`, mi`j`)),
          mo`=`,
          annotationOver.attr({
            label: mtext`standard deviation`,
          })(
            sqrt(
              mul3(
                inv(mi`n`),
                mathml.sum(
                  mi`n`,
                  mrow(
                    mi`i`,
                    space(2),
                    mo`=`,
                    space(2),
                    n(1),
                  )
                ),
                sup(
                  paren([
                    minus(
                      sub(mi`x`, mrow(mi`i`, mi`j`)),
                      sub(mi`x̄`, mi`j`)
                    ),
                  ]),
                  n(2)
                )
              )
            )
          ),
        ],
        [
          call('se', sub(SPECIAL.greek.circumflex.beta, mi`j`)),
          mo`=`,
          frac(
            [SPECIAL.greek.circumflex.sigma],
            [
              mul3(
                sqrt(mi`n`),
                call('sd', sub(mi`x`, mi`j`)),
                sqrt(minus(n(1), sup(sub(mi`R`, mi`j`), n(2))))
              ),
            ]
          ),
        ],
      ])
    ),
    doc.figcaption`
      standard deviation and its relation ${doc.br()}
      to the unbiased standard error of 𝜎²
    `,
  )
};
