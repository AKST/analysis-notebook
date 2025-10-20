/**
 * @import { E } from '../../prelude-type.ts';
 */

import { frag, mathml, mathml2, doc } from '../../prelude.js';
import { components, mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const { SPECIAL } = mathml;

const { mi, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, mspace, mfrac } = mathml2;
const { rows, annotationOver, annotationUnder, sum, call, inv, parensA, table } = mathmlHelper_2;
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
  minus, minusP, add3,
} = mathmlHelper;

/** @param {E.Item} a @param {E.Item} b */
const mul2 = (a, b) => mrow(a, b);
const Normal = call.attr({ fn: mtext`Normal` })
const Bias = call.attr({ fn: mtext`Bias` })
const Log = call.attr({ fn: mtext`log` })
const Cov = call.attr({ fn: mtext`Cov` })
const Var = call.attr({ fn: mtext`Var` })
const Ln = call.attr({ fn: mtext`ln` })
const Se = call.attr({ fn: mtext`Se` })
const Sd = call.attr({ fn: mtext`Sd` })

/** @param {...E.Item} body */
const E = (...body) => call.attr({ fn: 'E' })(frag([...body]))

const summaise = sum.attr({ max: mi`n`, inc: mrow(mi`i`, mo`=`, mn(0)) })();

export const concequenceOfOmittedVariableBias = doc.figure(
  todo({}, 'See Slide 3'),
  doc.figcaption`Concequences of Omitted Variable Bias`,
);

export const residuals = doc.figure(
  mathml2.math(
    eq(
      msub(vars.u, mi`i`),
      minus(
        msub(mi`y`, mi`i`),
        msub(mi`ŷ`, mi`i`)
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
        options.yLog ? Log(mi`y`) : mi`y`
      )),
      mspace(4), mo`=`, mspace(4),
      msub(mi`β`, mn(0)),
      mspace(4), mo`+`, mspace(4),
      ...xs.flatMap((x, index) => [
        msub(mi`β`, mn(index + 1)),
        annotationUnder.attr({ label: mtext.of(x) })(msub(mi`x`, mn(index + 1))),
        mspace(4), mo`+`, mspace(4)
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
          msub(mi`β`, mn(0)),
          mrow(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
          add(
            mrow(msub(mi`β`, mn(2)), msup(msub(mi`x`, mn(1)), mn(2))),
            mi`u`
          ),
        ),
      )
    ),
    doc.figcaption`Quadratic Equation`,
  ),
  relation: doc.figure(
    mathml2.math(
      mrow(
        mfrac(
          mrow(SPECIAL.greek.delta, mi`y`),
          mrow(SPECIAL.greek.delta, msub(mi`x`, mn(1)))
        ),
        mspace(4), mo`≈`, mspace(4),
        msub(mi`β`, mn(1)),
        mspace(4), mo`+`, mspace(4),
        mn(2), msub(mi`β`, mn(2)), msub(mi`x`, mn(1))
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
          mo`{`, mspace(2),
          parensA(
            msub(mi`x`, mrow(mi`i`, mn(1))), mo`,`, mspace(4),
            msub(mi`x`, mrow(mi`i`, mn(2))), mo`,`, mspace(4),
            msub(mi`y`, mi`i`)
          ),
          mspace(6), mo`:`, mspace(6),
          mi`i`, mspace(4), mo`=`, mspace(4),
          mn(1), mo`,`, mspace(4),
          mn(2), mo`,`, mspace(4),
          SPECIAL.ellipse.h2, mspace(4), mo`,`, mspace(4),
          mi`n`, mspace(2), mo`}`
        ),

        mrow(
          summaise,
          mspace(8),
          msup(parensA(
            msub(mi`y`, mi`i`), mspace(4), mo`-`, mspace(4),
            msub(SPECIAL.greek.circumflex.beta, mn(0)), mspace(4), mo`-`, mspace(4),
            mrow(
              msub(SPECIAL.greek.circumflex.beta, mn(1)),
              msub(mi`x`, mrow(mi`i`, mn(1)))
            ),
            mspace(4), mo`-`, mspace(4),
            mrow(
              msub(SPECIAL.greek.circumflex.beta, mn(2)),
              msub(mi`x`, mrow(mi`i`, mn(2)))
            )
          ), mn(2))
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
            msub(mi`β`, mn(0)),
            mul2(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            mul2(msub(mi`β`, mn(2)), msub(mi`x`, mn(2)))
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
          msub(mathml.SPECIAL.greek.circumflex.beta, mn(0)),
          mul2(msub(mathml.SPECIAL.greek.circumflex.beta, mn(1)), msub(mi`x`, mn(1))),
          mul2(msub(mathml.SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`x`, mn(2)))
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
          msub(mi`𝛽̃`, mn(0)),
          mul2(msub(mi`𝛽̃`, mn(1)), msub(mi`x`, mn(1)))
        )
      )
    ),
    doc.figcaption`Modeling with missing variable`,
  ),
  assumption: doc.figure(
    mathml2.math(
      eq(
        E(
          mrow(
            mi`u`, mspace(4), mo`|`, mspace(4),
            msub(mi`x`, mn(1)), mo`,`, mspace(4),
            msub(mi`x`, mn(2))
          )
        ),
        mn(0)
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
            msub(SPECIAL.greek.circumflex.beta, mn(1)),
            mul2(SPECIAL.greek.delta, msub(mi`x`, mn(1)))
          ),
          mul2(
            msub(SPECIAL.greek.circumflex.beta, mn(2)),
            mul2(SPECIAL.greek.delta, msub(mi`x`, mn(2)))
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
          msub(mi`β`, mn(0)), mspace(4), mo`+`, mspace(4),
          msub(mi`β`, mn(1)), msub(mi`x`, mn(1)), mspace(4), mo`+`, mspace(4),
          msub(mi`β`, mn(2)), msub(mi`x`, mn(2)), mspace(4), mo`+`, mspace(4),
          msub(mi`β`, mn(3)), msub(mi`x`, mn(3)), mspace(4), mo`+`, mspace(4),
          SPECIAL.ellipse.h2, mspace(4), mo`+`, mspace(4),
          msub(mi`β`, mi`k`), msub(mi`x`, mi`k`), mspace(4), mo`+`, mspace(4),
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
          msub(mi`𝛽̂`, mn(0)), mspace(4), mo`+`, mspace(4),
          msub(mi`𝛽̂`, mn(1)), msub(mi`x`, mn(1)), mspace(4), mo`+`, mspace(4),
          msub(mi`𝛽̂`, mn(2)), msub(mi`x`, mn(2)), mspace(4), mo`+`, mspace(4),
          SPECIAL.ellipse.h2, mspace(4), mo`+`, mspace(4),
          msub(mi`𝛽̂`, mi`k`), msub(mi`x`, mi`k`), mspace(4)
        )
      )
    ),
    doc.figcaption`Estimated Model with K regressors`,
  ),
  assumption: doc.figure(
    mathml2.math(
      eq(
        E(
          mrow(
            mi`u`, mspace(4), mo`|`, mspace(4),
            msub(mi`x`, mn(1)), mo`,`, mspace(4),
            msub(mi`x`, mn(2)), mo`,`, mspace(4),
            SPECIAL.ellipse.h2, mo`,`, mspace(4),
            msub(mi`x`, mi`k`)
          )
        ),
        mn(0)
      )
    ),
    doc.figcaption`Conditional expectation assumption`,
  ),
  ols: () => {
    const inner = parensA(
      msub(mi`y`, mi`i`), mspace(4), mo`-`, mspace(4),
      msub(SPECIAL.greek.circumflex.beta, mn(0)), mspace(4), mo`-`, mspace(4),
      mul2(msub(SPECIAL.greek.circumflex.beta, mn(1)), msub(mi`x`, mrow(mi`i`, mn(1)))),
      mspace(4), mo`-`, mspace(4),
      SPECIAL.ellipse.h2, mspace(4), mo`-`, mspace(4),
      mul2(msub(SPECIAL.greek.circumflex.beta, mi`k`), msub(mi`x`, mrow(mi`i`, mi`k`))),
    );

    /** @param {E.Item} body */
    const sigma = (body) =>
      mrow(
        summaise,
        body
      );

    return doc.figure(
      mathml2.math(
        table.attr({ columnalign: 'right center left' })(
          [sigma(inner), mo`=`, mn(0) ],
          [sigma(mul2(msub(mi`x`, mrow(mi`i`, mn(1))), inner)), mo`=`, mn(0) ],
          [sigma(mul2(msub(mi`x`, mrow(mi`i`, mn(2))), inner)), mo`=`, mn(0) ],
          [SPECIAL.ellipse.v, mspace(4), mspace(4) ],
          [sigma(mul2(msub(mi`x`, mrow(mi`i`, mi`k`)), inner)), mo`=`, mn(0) ],
        )
      ),
      doc.figcaption`OLS Constraint for K regressors`,
    );
  },
  partialEffect: doc.figure(
    mathml2.math(
      eq(
        mrow(SPECIAL.greek.delta, mi`ŷ`),
        mrow(
          mul2(msub(SPECIAL.greek.circumflex.beta, mn(1)), mul2(SPECIAL.greek.delta, msub(mi`x`, mn(1)))),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(SPECIAL.greek.circumflex.beta, mn(2)), mul2(SPECIAL.greek.delta, msub(mi`x`, mn(2)))),
          mspace(4), mo`+`, mspace(4),
          SPECIAL.ellipse.h2,
          mspace(4), mo`+`, mspace(4),
          mul2(msub(SPECIAL.greek.circumflex.beta, mi`k`), mul2(SPECIAL.greek.delta, msub(mi`x`, mi`k`)))
        )
      )
    ),
    doc.figcaption`Ceteris Paribus interpretation`
  ),
  fitted: doc.figure(
    mathml2.math(
      eq(
        msub(mi`ŷ`, mi`i`),
        mrow(
          msub(SPECIAL.greek.circumflex.beta, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(SPECIAL.greek.circumflex.beta, mn(1)), msub(mi`x`, mrow(mi`i`, mn(1)))),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`x`, mrow(mi`i`, mn(2)))),
          mspace(4), mo`+`, mspace(4),
          SPECIAL.ellipse.h2,
          mspace(4), mo`+`, mspace(4),
          mul2(msub(SPECIAL.greek.circumflex.beta, mi`k`), msub(mi`x`, mrow(mi`i`, mi`k`)))
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
          mul2(msub(mi`𝛽̃`, mn(1)), msub(mi`x`, mn(1))),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(mi`𝛽̃`, mn(2)), msub(mi`x`, mn(2))),
          mspace(4), mo`+`, mspace(4),
          SPECIAL.ellipse.h2,
          mspace(4), mo`+`, mspace(4),
          mul2(msub(mi`𝛽̃`, mi`k`), msub(mi`x`, mi`k`))
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
        E(
          mrow(
            mi`u`, mspace(4), mo`|`, mspace(4),
            msub(mi`x`, mn(1)), mspace(4), mo`,`, mspace(4),
            msub(mi`x`, mn(2)), mspace(4), mo`,`, mspace(4),
            SPECIAL.ellipse.h2, mspace(4), mo`,`, mspace(4),
            msub(mi`x`, mi`k`)
          )
        ),
        mn(0)
      )
    ),
    doc.figcaption`Zero Conditional Mean`,
  ),
  mlr5: doc.figure(
    mathml2.math(
      eq(
        Var(
          mrow(
            mi`u`, mspace(4), mo`|`, mspace(4),
            msub(mi`x`, mn(1)), mo`,`, mspace(4),
            SPECIAL.ellipse.h2, mo`,`, mspace(4),
            msub(mi`x`, mi`k`)
          )
        ),
        msup(SPECIAL.greek.sigma, mn(2))
      )
    ),
    doc.figcaption`Homoskedasticity`,
  ),
  mlr1234: doc.figure(
    mathml2.math.attr({ style: 'font-size: 12px' })(
      eq(
        E(mrow(mi`y`, mspace(4), mo`|`, mspace(4), mi`x`)),
        mrow(
          msub(mi`β`, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(mi`β`, mn(2)), msub(mi`x`, mn(2))),
          mspace(4), mo`+`, mspace(4),
          SPECIAL.ellipse.h2,
          mspace(4), mo`+`, mspace(4),
          mul2(msub(mi`β`, mi`k`), msub(mi`x`, mi`k`))
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
        E(msub(SPECIAL.greek.circumflex.beta, mi`j`)),
        mrow(
          msub(mi`β`, mi`j`),
          mo`,`, mspace(4),
          mi`j`, mspace(4), mo`=`, mspace(4),
          mn(0), mo`,`, mspace(4),
          mn(1), mo`,`, mspace(4),
          SPECIAL.ellipse.h2, mo`,`, mspace(4),
          mi`k`
        )
      )
    ),
    doc.figcaption`Unbiasedness of OLS`,
  ),
  unbiasedExpansion: doc.figure(
    mathml2.math(
      table.attr({ columnalign: 'right center left' })(
        [
          E(msub(mi`𝛽̃`, mn(1))),
          mo`=`,
          E(
            mrow(
              msub(SPECIAL.greek.circumflex.beta, mn(1)),
              mspace(4), mo`+`, mspace(4),
              mul2(
                msub(SPECIAL.greek.circumflex.beta, mn(2)),
                msub(mi`𝛿̃`, mn(1))
              )
            )
          ),
        ],
        [
          mspace(0),
          mo`=`,
          mrow(
            E(msub(SPECIAL.greek.circumflex.beta, mn(1))),
            mspace(4), mo`+`, mspace(4),
            mul2(
              E(msub(SPECIAL.greek.circumflex.beta, mn(2))),
              msub(mi`𝛿̃`, mn(1))
            )
          ),
        ],
        [
          mspace(0),
          mo`=`,
          mrow(
            msub(mi`𝛽`, mn(1)),
            mspace(4), mo`+`, mspace(4),
            mul2(
              msub(mi`𝛽`, mn(2)),
              msub(mi`𝛿̃`, mn(1))
            )
          ),
        ],
      )
    ),
    doc.figcaption`Solving for E(𝛽̃₁)`,
  ),
  omittedVariableBias: doc.figure(
    mathml2.math(
      eq(
        Bias(msub(mi`𝛽̃`, mn(1))),
        mrow(
          E(msub(mi`𝛽̃`, mn(1))),
          mspace(4), mo`−`, mspace(4),
          msub(mi`𝛽`, mn(1)),
          mspace(4), mo`=`, mspace(4),
          mul2(
            msub(mi`𝛽`, mn(2)),
            msub(mi`𝛿̃`, mn(1))
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
      msub(SPECIAL.greek.circumflex.beta, mn(1)),
      mrow(
        parensA(
          mrow(
            summaise,
            mul2(
              msub(mi`r̂`, mrow(mi`i`, mn(1))),
              msub(mi`y`, mi`i`)
            )
          )
        ),
        mspace(4), mo`÷`, mspace(4),
        parensA(
          mrow(
            summaise,
            msup(
              msub(mi`r̂`, mrow(mi`i`, mn(1))),
              mn(2)
            )
          )
        )
      )
    )
  ),
  doc.figcaption`A "Partialling out" Interpretation of multiple regression`,
);

export const compareSLRAndMLR = doc.figure(
  mathml2.math(
    table.attr({ columnalign: 'right center left' })(
      [
        mi`ỹ`,
        mo`=`,
        mrow(
          msub(mi`𝛽̃`, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(mi`𝛽̃`, mn(1)), msub(mi`x̃`, mn(1)))
        )
      ],
      [
        mi`ŷ`,
        mo`=`,
        mrow(
          msub(SPECIAL.greek.circumflex.beta, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(SPECIAL.greek.circumflex.beta, mn(1)), msub(mi`x`, mn(1))),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`x`, mn(2)))
        )
      ],
      [
        msub(mi`𝛽̃`, mn(1)),
        mo`=`,
        mrow(
          msub(SPECIAL.greek.circumflex.beta, mn(1)),
          mspace(4), mo`+`, mspace(4),
          mul2(
            msub(SPECIAL.greek.circumflex.beta, mn(2)),
            msub(mi`𝛿̃`, mn(1))
          )
        )
      ]
    )
  ),
  doc.figcaption`Comparing SLR and MLR Estimates`,
);

export const samplingVarianceOfEstimators = doc.figure(
  mathml2.math(
    eq(
      Var(msub(SPECIAL.greek.circumflex.beta, mi`j`)),
      mfrac(
        msup(SPECIAL.greek.sigma, mn(2)),
        mul2(
          msub(mi`SST`, mi`j`),
          parensA(
            mn(1), mspace(4), mo`−`, mspace(4),
            msup(msub(mi`R`, mi`j`), mn(2))
          )
        )
      )
    )
  ),
  doc.figcaption`Sampling Variances of The OLS Slope Estimators`,
);

export const beyondTheScope = {
  logitModel: doc.figure(
    mathml2.math(
      eq(
        Ln(
          mfrac(
            msub(mi`P`, mi`i`),
            mrow(mn(1), mspace(4), mo`−`, mspace(4), msub(mi`P`, mi`i`))
          )
        ),
        mrow(
          msub(mi`β`, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(mi`β`, mn(1)), msub(mi`x`, mrow(mi`i`, mn(1)))),
          mspace(4), mo`+`, mspace(4),
          msub(mi`ε`, mi`i`)
        )
      )
    ),
    doc.figcaption`Example Logit Model`,
  ),
  randomEffectsModelForLongitudinalData: doc.figure(
    mathml2.math(
      eq(
        msub(mi`y`, mrow(mi`i`, mi`j`)),
        mrow(
          msub(mi`β`, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul2(msub(mi`β`, mn(1)), msub(mi`x`, mrow(mi`i`, mi`j`))),
          mspace(4), mo`+`, mspace(4),
          msub(mi`b`, mi`i`),
          mspace(4), mo`+`, mspace(4),
          msub(mi`ε`, mrow(mi`i`, mi`j`))
        )
      )
    ),
    doc.figcaption`Random Effects For Longitudinal Data`,
  ),
};

export const thoughtExperiment = doc.figure(
  mathml2.math(
    table.attr({ columnalign: 'right center left' })(
      [
        msub(mi`ŷ`, mi`i`),
        mo`=`,
        add3(
          msub(SPECIAL.greek.circumflex.beta, mn(0)),
          mul2(msub(SPECIAL.greek.circumflex.beta, mn(1)), msub(mi`x`, mi`1i`)),
          add(
            mul2(msub(SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`x`, mi`2i`)),
            msub(mi`û`, mi`i`)
          ),
        ),
      ],
      [
        msub(mi`x̂`, mi`2i`),
        mo`=`,
        add3(
          msub(SPECIAL.greek.circumflex.beta, msub(mn(0), mn(2))),
          mul2(msub(SPECIAL.greek.circumflex.beta, msub(mn(1), mn(2))), msub(mi`x`, mi`1i`)),
          msub(mi`ê`, mrow(mi`i`, mn(2))),
        ),
      ],
      [
        msub(mi`ŷ`, mrow(mi`i`, msub(mi`x`, mn(2)))),
        mo`=`,
        add3(
          msub(SPECIAL.greek.beta, mrow(mn(0), msub(mi`x`, mn(2)))),
          mul2(msub(SPECIAL.greek.beta, mrow(mn(1), msub(mi`x`, mn(2)))), msub(mi`x`, mi`1i`)),
          add(
            mul2(
              msub(SPECIAL.greek.beta, mrow(mi`i`, mn(2))),
              annotationOver.attr({
                label: msub(mi`ê`, mrow(mi`i`, msub(mi`x`, mn(2))))
              })(parensA(minus(msub(mi`x`, mi`2i`), msub(mi`x̂`, mi`2i`)))),
            ),
            msub(mi`û`, mrow(mi`i`, msub(mi`x`, mn(2))))
          ),
        ),
      ],
    )
  ),
  doc.figcaption`Fitted value subtraction.`
);

export const varianceBiasComparison = {
  vif: doc.figure(
    mathml2.math(
      eq(
        msub(mi`VIF`, mi`j`),
        mfrac(
          mn(1),
          parensA(mn(1), mspace(4), mo`-`, mspace(4), msup(msub(mi`R`, mi`j`), mn(2)))
        )
      )
    ),
    doc.figcaption`Variance Inflation Factor`
  ),
  var: doc.figure(
    mathml2.math(
      eq(
        eq(
          Var(msub(SPECIAL.greek.circumflex.beta, mi`j`)),
          mul2(
            mfrac(
              msup(SPECIAL.greek.sigma, mn(2)),
              msub(mi`SST`, mi`j`)
            ),
            msub(mi`VIF`, mi`j`)
          )
        ),
        mfrac(
          msup(SPECIAL.greek.sigma, mn(2)),
          mrow(msub(mi`SST`, mi`j`), parensA(mn(1), mspace(4), mo`-`, mspace(4), msup(msub(mi`R`, mi`j`), mn(2))))
        )
      )
    ),
    doc.figcaption`Variance of β̂ⱼ expressed using VIFⱼ.`
  ),
  biasBeta1: doc.figure(
    mathml2.math(
      eq(
        Var(msub(mi`𝛽̃`, mn(1))),
        mfrac(msup(mi`𝜎`, mn(2)), msub(mi`SST`, mn(1)))
      )
    ),
    doc.figcaption`Variance of 𝛽̃₁ (biased 𝛽̂₁)`,
  ),
};

export const standardError = {
  estimateStdDevivation: doc.figure(
    mathml2.math(
      table(
        [
          msub(mi`û`, mi`i`),
          mo`=`,
          mrow(
            msub(mi`y`, mi`i`),
            mspace(4), mo`-`, mspace(4), msub(SPECIAL.greek.circumflex.beta, mn(0)),
            mspace(4), mo`-`, mspace(4), mul2(msub(SPECIAL.greek.circumflex.beta, mn(1)), msub(mi`x`, mrow(mi`i`, mn(1)))),
            mspace(4), mo`-`, mspace(4), mul2(msub(SPECIAL.greek.circumflex.beta, mn(2)), msub(mi`x`, mrow(mi`i`, mn(2)))),
            mspace(4), SPECIAL.ellipse.h2,
            mspace(4), mo`-`, mspace(4), mul2(msub(SPECIAL.greek.circumflex.beta, mi`k`), msub(mi`x`, mrow(mi`i`, mi`k`))),
            mspace(4), mo`.`
          ),
        ],

        [
          msup(SPECIAL.greek.circumflex.sigma, mn(2)),
          mo`=`,
          eq(
            mfrac(
              parensA(
                mrow(
                  summaise,
                  mspace(6),
                  msup(msub(mi`û`, mi`i`), mn(2))
                )
              ),
              mrow(mi`n`, mspace(4), mo`-`, mspace(4), mi`k`, mspace(4), mo`-`, mspace(4), mn(1))
            ),
            mrow(
              mfrac(
                mi`SSR`,
                mrow(mi`n`, mspace(4), mo`-`, mspace(4), mi`k`, mspace(4), mo`-`, mspace(4), mn(1))
              ),
              mspace(4), mo`.`
            )
          ),
        ],
      )
    ),
    doc.figcaption`estimating unbiased standard of 𝜎²`
  ),
  se: doc.figure(
    mathml2.math(
      table(
        [
          Sd(msub(mi`x`, mi`j`)),
          mo`=`,
          annotationOver.attr({
            label: mtext`standard deviation`,
          })(
            msqrt(
              mul3(
                inv(mi`n`),
                summaise,
                msup(
                  parensA(
                    minus(
                      msub(mi`x`, mrow(mi`i`, mi`j`)),
                      msub(mi`x̄`, mi`j`)
                    ),
                  ),
                  mn(2)
                )
              )
            )
          ),
        ],
        [
          Se(msub(SPECIAL.greek.circumflex.beta, mi`j`)),
          mo`=`,
          mfrac(
            SPECIAL.greek.circumflex.sigma,
            mul3(
              msqrt(mi`n`),
              Sd(msub(mi`x`, mi`j`)),
              msqrt(minus(mn(1), msup(msub(mi`R`, mi`j`), mn(2))))
            )
          ),
        ],
      )
    ),
    doc.figcaption`
      standard deviation and its relation ${doc.br()}
      to the unbiased standard error of 𝜎²
    `,
  )
};
