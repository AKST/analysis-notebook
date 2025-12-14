/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { frag, mathml, doc } from '@app/prelude.js';
import { text, todo } from '@prelude-uni/components.js';
import { SPECIAL as S, rows, annotationOver, annotationUnder, sum, call, inv, parensA, table, op } from '@prelude-uni/mathml.js';

const { mi, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, mspace, mfrac } = mathml;
const { eqId, eq, add, minus, mul } = op;

const { greek: { beta, rho, sigma, ...greek } } = S;

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

/**
 * @template {Function} F
 * @param {{ of: F }} helper
 * @returns {(...params: Parameters<F>) => ReturnType<F>}
 */
const bindOf = (helper) => {
  return helper.of.bind(helper);
};

const Normal = bindOf(call.attr({ fn: mtext`Normal` }))
const Bias = bindOf(call.attr({ fn: mtext`Bias` }))
const Log = bindOf(call.attr({ fn: mtext`log` }))
const Cov = bindOf(call.attr({ fn: mtext`Cov` }))
const Var = bindOf(call.attr({ fn: mtext`Var` }))
const Ln = bindOf(call.attr({ fn: mtext`ln` }))
const Se = bindOf(call.attr({ fn: mtext`Se` }))
const Sd = bindOf(call.attr({ fn: mtext`Sd` }))

/** @param {...E.Item} body */
const E = (...body) => call.attr({ fn: 'E' }).of(frag([...body]))

const summaise = sum.attr({ max: mi`n`, inc: mrow(mi`i`, mo`=`, mn(0)) }).of();

export const concequenceOfOmittedVariableBias = text.figure(
  todo({}, 'See Slide 3'),
  doc.figcaption`Concequences of Omitted Variable Bias`,
);

export const residuals = text.figure(
  mathml.math(
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
export const createFigure = (name, y, xs, options = {}) => text.figure(
  mathml.math(
    mrow(
      annotationUnder.attr({ label: mtext.of(y) }).of((
        options.yLog ? Log(mi`y`) : mi`y`
      )),
      mspace(4), mo`=`, mspace(4),
      msub(mi`β`, mn(0)),
      mspace(4), mo`+`, mspace(4),
      ...xs.flatMap((x, index) => [
        msub(mi`β`, mn(index + 1)),
        annotationUnder.attr({ label: mtext.of(x) }).of(msub(mi`x`, mn(index + 1))),
        mspace(4), mo`+`, mspace(4)
      ]),
      mi`u`,
    )
  ),
  doc.figcaption`${name}`,
);

export const quadraticExpressionInMLR = {
  regression: text.figure(
    mathml.math(
      eq(
        mi`y`,
        add(
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
  relation: text.figure(
    mathml.math(
      mrow(
        mfrac(
          mrow(greek.Delta, mi`y`),
          mrow(greek.Delta, msub(mi`x`, mn(1)))
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
  ols: text.figure(
    mathml.math(
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
          S.ellipse.h2, mspace(4), mo`,`, mspace(4),
          mi`n`, mspace(2), mo`}`
        ),

        mrow(
          summaise,
          mspace(8),
          msup(parensA(
            msub(mi`y`, mi`i`), mspace(4), mo`-`, mspace(4),
            msub(greek.circumflex.beta, mn(0)), mspace(4), mo`-`, mspace(4),
            mrow(
              msub(greek.circumflex.beta, mn(1)),
              msub(mi`x`, mrow(mi`i`, mn(1)))
            ),
            mspace(4), mo`-`, mspace(4),
            mrow(
              msub(greek.circumflex.beta, mn(2)),
              msub(mi`x`, mrow(mi`i`, mn(2)))
            )
          ), mn(2))
        )
      )
    ),
    doc.figcaption`OLS for 2 Regressors`,
  ),
  regression: text.figure(
    mathml.math(
      eq(
        mi`y`,
        add(
          add(
            msub(mi`β`, mn(0)),
            mul(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
            mul(msub(mi`β`, mn(2)), msub(mi`x`, mn(2)))
          ),
          mi`u`
        ),
      )
    ),
    doc.figcaption`general MLR with 2 independent vars`,
  ),
  estimate: text.figure(
    mathml.math(
      eq(
        mi`𝑦̂`,
        add(
          msub(greek.circumflex.beta, mn(0)),
          mul(msub(greek.circumflex.beta, mn(1)), msub(mi`x`, mn(1))),
          mul(msub(greek.circumflex.beta, mn(2)), msub(mi`x`, mn(2)))
        )
      )
    ),
    doc.figcaption`Estimated Model with 2 regressors`,
  ),
  missing: text.figure(
    mathml.math(
      eq(
        mi`ỹ`,
        add(
          msub(mi`β̃`, mn(0)),
          mul(msub(mi`β̃`, mn(1)), msub(mi`x`, mn(1)))
        )
      )
    ),
    doc.figcaption`Modeling with missing variable`,
  ),
  assumption: text.figure(
    mathml.math(
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
  partialEffect: text.figure(
    mathml.math(
      eq(
        mrow(
          greek.Delta,
          mi`ŷ`
        ),
        add(
          mul(
            msub(greek.circumflex.beta, mn(1)),
            mul(greek.Delta, msub(mi`x`, mn(1)))
          ),
          mul(
            msub(greek.circumflex.beta, mn(2)),
            mul(greek.Delta, msub(mi`x`, mn(2)))
          )
        )
      )
    ),
    doc.figcaption`Ceteris Paribus interpretation`,
  ),
};

export const sizeKMLR = {
  regression: text.figure(
    mathml.math(
      eq(
        mi`y`,
        mrow(
          msub(mi`β`, mn(0)), mspace(4), mo`+`, mspace(4),
          msub(mi`β`, mn(1)), msub(mi`x`, mn(1)), mspace(4), mo`+`, mspace(4),
          msub(mi`β`, mn(2)), msub(mi`x`, mn(2)), mspace(4), mo`+`, mspace(4),
          msub(mi`β`, mn(3)), msub(mi`x`, mn(3)), mspace(4), mo`+`, mspace(4),
          S.ellipse.h2, mspace(4), mo`+`, mspace(4),
          msub(mi`β`, mi`k`), msub(mi`x`, mi`k`), mspace(4), mo`+`, mspace(4),
          mi`u`
        )
      )
    ),
    doc.figcaption`General MLR`,
  ),
  estimate: text.figure(
    mathml.math(
      eq(
        mi`𝑦̂`,
        mrow(
          msub(mi`β̂`, mn(0)), mspace(4), mo`+`, mspace(4),
          msub(mi`β̂`, mn(1)), msub(mi`x`, mn(1)), mspace(4), mo`+`, mspace(4),
          msub(mi`β̂`, mn(2)), msub(mi`x`, mn(2)), mspace(4), mo`+`, mspace(4),
          S.ellipse.h2, mspace(4), mo`+`, mspace(4),
          msub(mi`β̂`, mi`k`), msub(mi`x`, mi`k`), mspace(4)
        )
      )
    ),
    doc.figcaption`Estimated Model with K regressors`,
  ),
  assumption: text.figure(
    mathml.math(
      eq(
        E(
          mrow(
            mi`u`, mspace(4), mo`|`, mspace(4),
            msub(mi`x`, mn(1)), mo`,`, mspace(4),
            msub(mi`x`, mn(2)), mo`,`, mspace(4),
            S.ellipse.h2, mo`,`, mspace(4),
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
      msub(S.greek.circumflex.beta, mn(0)), mspace(4), mo`-`, mspace(4),
      mul(msub(S.greek.circumflex.beta, mn(1)), msub(mi`x`, mrow(mi`i`, mn(1)))),
      mspace(4), mo`-`, mspace(4),
      S.ellipse.h2, mspace(4), mo`-`, mspace(4),
      mul(msub(S.greek.circumflex.beta, mi`k`), msub(mi`x`, mrow(mi`i`, mi`k`))),
    );

    /** @param {E.Item} body */
    const sigma = (body) =>
      mrow(
        summaise,
        body
      );

    return text.figure(
      mathml.math(
        table.attr({ columnalign: 'right center left' }).of(
          [sigma(inner), mo`=`, mn(0) ],
          [sigma(mul(msub(mi`x`, mrow(mi`i`, mn(1))), inner)), mo`=`, mn(0) ],
          [sigma(mul(msub(mi`x`, mrow(mi`i`, mn(2))), inner)), mo`=`, mn(0) ],
          [S.ellipse.v, mspace(4), mspace(4) ],
          [sigma(mul(msub(mi`x`, mrow(mi`i`, mi`k`)), inner)), mo`=`, mn(0) ],
        )
      ),
      doc.figcaption`OLS Constraint for K regressors`,
    );
  },
  partialEffect: text.figure(
    mathml.math(
      eq(
        mrow(S.greek.Delta, mi`ŷ`),
        mrow(
          mul(msub(greek.circumflex.beta, mn(1)), mul(greek.Delta, msub(mi`x`, mn(1)))),
          mspace(4), mo`+`, mspace(4),
          mul(msub(greek.circumflex.beta, mn(2)), mul(greek.Delta, msub(mi`x`, mn(2)))),
          mspace(4), mo`+`, mspace(4),
          S.ellipse.h2,
          mspace(4), mo`+`, mspace(4),
          mul(msub(greek.circumflex.beta, mi`k`), mul(greek.Delta, msub(mi`x`, mi`k`)))
        )
      )
    ),
    doc.figcaption`Ceteris Paribus interpretation`
  ),
  fitted: text.figure(
    mathml.math(
      eq(
        msub(mi`ŷ`, mi`i`),
        mrow(
          msub(greek.circumflex.beta, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul(msub(greek.circumflex.beta, mn(1)), msub(mi`x`, mrow(mi`i`, mn(1)))),
          mspace(4), mo`+`, mspace(4),
          mul(msub(greek.circumflex.beta, mn(2)), msub(mi`x`, mrow(mi`i`, mn(2)))),
          mspace(4), mo`+`, mspace(4),
          S.ellipse.h2,
          mspace(4), mo`+`, mspace(4),
          mul(msub(greek.circumflex.beta, mi`k`), msub(mi`x`, mrow(mi`i`, mi`k`)))
        )
      )
    ),
    doc.figcaption`Fitted values`,
  ),
  throughOrigin: text.figure(
    mathml.math(
      eq(
        mi`ỹ`,
        mrow(
          mul(msub(mi`β̃`, mn(1)), msub(mi`x`, mn(1))),
          mspace(4), mo`+`, mspace(4),
          mul(msub(mi`β̃`, mn(2)), msub(mi`x`, mn(2))),
          mspace(4), mo`+`, mspace(4),
          S.ellipse.h2,
          mspace(4), mo`+`, mspace(4),
          mul(msub(mi`β̃`, mi`k`), msub(mi`x`, mi`k`))
        )
      )
    ),
    doc.figcaption`Regressoin through the origin`,
  ),
};

export const assumptions = {
  mlr4: text.figure(
    mathml.math(
      eq(
        E(
          mrow(
            mi`u`, mspace(4), mo`|`, mspace(4),
            msub(mi`x`, mn(1)), mspace(4), mo`,`, mspace(4),
            msub(mi`x`, mn(2)), mspace(4), mo`,`, mspace(4),
            S.ellipse.h2, mspace(4), mo`,`, mspace(4),
            msub(mi`x`, mi`k`)
          )
        ),
        mn(0)
      )
    ),
    doc.figcaption`Zero Conditional Mean`,
  ),
  mlr5: text.figure(
    mathml.math(
      eq(
        Var(
          mrow(
            mi`u`, mspace(4), mo`|`, mspace(4),
            msub(mi`x`, mn(1)), mo`,`, mspace(4),
            S.ellipse.h2, mo`,`, mspace(4),
            msub(mi`x`, mi`k`)
          )
        ),
        msup(S.greek.sigma, mn(2))
      )
    ),
    doc.figcaption`Homoskedasticity`,
  ),
  mlr1234: text.figure(
    mathml.math.attr({ style: 'font-size: 12px' }).of(
      eq(
        E(mrow(mi`y`, mspace(4), mo`|`, mspace(4), mi`x`)),
        mrow(
          msub(mi`β`, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul(msub(mi`β`, mn(1)), msub(mi`x`, mn(1))),
          mspace(4), mo`+`, mspace(4),
          mul(msub(mi`β`, mn(2)), msub(mi`x`, mn(2))),
          mspace(4), mo`+`, mspace(4),
          S.ellipse.h2,
          mspace(4), mo`+`, mspace(4),
          mul(msub(mi`β`, mi`k`), msub(mi`x`, mi`k`))
        )
      )
    ),
    doc.figcaption`MLR 1, 2, 3, 4`,
  ),
};

export const unbiasedness = {
  theorum3_1: text.figure(
    mathml.math(
      eq(
        E(msub(greek.circumflex.beta, mi`j`)),
        mrow(
          msub(mi`β`, mi`j`),
          mo`,`, mspace(4),
          mi`j`, mspace(4), mo`=`, mspace(4),
          mn(0), mo`,`, mspace(4),
          mn(1), mo`,`, mspace(4),
          S.ellipse.h2, mo`,`, mspace(4),
          mi`k`
        )
      )
    ),
    doc.figcaption`Unbiasedness of OLS`,
  ),
  unbiasedExpansion: text.figure(
    mathml.math(
      table.attr({ columnalign: 'right center left' }).of(
        [
          E(msub(mi`β̃`, mn(1))),
          mo`=`,
          E(
            mrow(
              msub(greek.circumflex.beta, mn(1)),
              mspace(4), mo`+`, mspace(4),
              mul(
                msub(greek.circumflex.beta, mn(2)),
                msub(mi`δ̃`, mn(1))
              )
            )
          ),
        ],
        [
          mspace(0),
          mo`=`,
          mrow(
            E(msub(greek.circumflex.beta, mn(1))),
            mspace(4), mo`+`, mspace(4),
            mul(
              E(msub(greek.circumflex.beta, mn(2))),
              msub(mi`δ̃`, mn(1))
            )
          ),
        ],
        [
          mspace(0),
          mo`=`,
          mrow(
            msub(mi`β`, mn(1)),
            mspace(4), mo`+`, mspace(4),
            mul(
              msub(mi`β`, mn(2)),
              msub(mi`δ̃`, mn(1))
            )
          ),
        ],
      )
    ),
    doc.figcaption`Solving for E(β̃₁)`,
  ),
  omittedVariableBias: text.figure(
    mathml.math(
      eq(
        Bias(msub(mi`β̃`, mn(1))),
        mrow(
          E(msub(mi`β̃`, mn(1))),
          mspace(4), mo`−`, mspace(4),
          msub(mi`β`, mn(1)),
          mspace(4), mo`=`, mspace(4),
          mul(
            msub(mi`β`, mn(2)),
            msub(mi`δ̃`, mn(1))
          )
        )
      )
    ),
    doc.figcaption`Bias of Omitted Variable`,
  ),
};

export const partiallingOut = text.figure(
  mathml.math.attr({ style: 'font-size: 12px' }).of(
    eq(
      msub(greek.circumflex.beta, mn(1)),
      mrow(
        parensA(
          mrow(
            summaise,
            mul(
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

export const compareSLRAndMLR = text.figure(
  mathml.math(
    table.attr({ columnalign: 'right center left' }).of(
      [
        mi`ỹ`,
        mo`=`,
        mrow(
          msub(mi`β̃`, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul(msub(mi`β̃`, mn(1)), msub(mi`x̃`, mn(1)))
        )
      ],
      [
        mi`ŷ`,
        mo`=`,
        mrow(
          msub(greek.circumflex.beta, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul(msub(greek.circumflex.beta, mn(1)), msub(mi`x`, mn(1))),
          mspace(4), mo`+`, mspace(4),
          mul(msub(greek.circumflex.beta, mn(2)), msub(mi`x`, mn(2)))
        )
      ],
      [
        msub(mi`β̃`, mn(1)),
        mo`=`,
        mrow(
          msub(greek.circumflex.beta, mn(1)),
          mspace(4), mo`+`, mspace(4),
          mul(
            msub(greek.circumflex.beta, mn(2)),
            msub(mi`δ̃`, mn(1))
          )
        )
      ]
    )
  ),
  doc.figcaption`Comparing SLR and MLR Estimates`,
);

export const samplingVarianceOfEstimators = text.figure(
  mathml.math(
    eq(
      Var(msub(greek.circumflex.beta, mi`j`)),
      mfrac(
        msup(sigma, mn(2)),
        mul(
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
  logitModel: text.figure(
    mathml.math(
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
          mul(msub(mi`β`, mn(1)), msub(mi`x`, mrow(mi`i`, mn(1)))),
          mspace(4), mo`+`, mspace(4),
          msub(mi`ε`, mi`i`)
        )
      )
    ),
    doc.figcaption`Example Logit Model`,
  ),
  randomEffectsModelForLongitudinalData: text.figure(
    mathml.math(
      eq(
        msub(mi`y`, mrow(mi`i`, mi`j`)),
        mrow(
          msub(mi`β`, mn(0)),
          mspace(4), mo`+`, mspace(4),
          mul(msub(mi`β`, mn(1)), msub(mi`x`, mrow(mi`i`, mi`j`))),
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

export const thoughtExperiment = text.figure(
  mathml.math(
    table.attr({ columnalign: 'right center left' }).of(
      [
        msub(mi`ŷ`, mi`i`),
        mo`=`,
        add(
          msub(greek.circumflex.beta, mn(0)),
          mul(msub(greek.circumflex.beta, mn(1)), msub(mi`x`, mi`1i`)),
          add(
            mul(msub(greek.circumflex.beta, mn(2)), msub(mi`x`, mi`2i`)),
            msub(mi`û`, mi`i`)
          ),
        ),
      ],
      [
        msub(mi`x̂`, mi`2i`),
        mo`=`,
        add(
          msub(greek.circumflex.beta, msub(mn(0), mn(2))),
          mul(msub(greek.circumflex.beta, msub(mn(1), mn(2))), msub(mi`x`, mi`1i`)),
          msub(mi`ê`, mrow(mi`i`, mn(2))),
        ),
      ],
      [
        msub(mi`ŷ`, mrow(mi`i`, msub(mi`x`, mn(2)))),
        mo`=`,
        add(
          msub(beta, mrow(mn(0), msub(mi`x`, mn(2)))),
          mul(msub(beta, mrow(mn(1), msub(mi`x`, mn(2)))), msub(mi`x`, mi`1i`)),
          add(
            mul(
              msub(beta, mrow(mi`i`, mn(2))),
              annotationOver.attr({
                label: msub(mi`ê`, mrow(mi`i`, msub(mi`x`, mn(2))))
              }).of(parensA(minus(msub(mi`x`, mi`2i`), msub(mi`x̂`, mi`2i`)))),
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
  vif: text.figure(
    mathml.math(
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
  var: text.figure(
    mathml.math(
      eq(
        eq(
          Var(msub(greek.circumflex.beta, mi`j`)),
          mul(
            mfrac(
              msup(sigma, mn(2)),
              msub(mi`SST`, mi`j`)
            ),
            msub(mi`VIF`, mi`j`)
          )
        ),
        mfrac(
          msup(sigma, mn(2)),
          mrow(msub(mi`SST`, mi`j`), parensA(mn(1), mspace(4), mo`-`, mspace(4), msup(msub(mi`R`, mi`j`), mn(2))))
        )
      )
    ),
    doc.figcaption`Variance of β̂ⱼ expressed using VIFⱼ.`
  ),
  biasBeta1: text.figure(
    mathml.math(
      eq(
        Var(msub(mi`β̃`, mn(1))),
        mfrac(msup(mi`σ`, mn(2)), msub(mi`SST`, mn(1)))
      )
    ),
    doc.figcaption`Variance of β̃₁ (biased β̂₁)`,
  ),
};

export const standardError = {
  estimateStdDevivation: text.figure(
    mathml.math(
      table(
        [
          msub(mi`û`, mi`i`),
          mo`=`,
          mrow(
            msub(mi`y`, mi`i`),
            mspace(4), mo`-`, mspace(4), msub(greek.circumflex.beta, mn(0)),
            mspace(4), mo`-`, mspace(4), mul(msub(greek.circumflex.beta, mn(1)), msub(mi`x`, mrow(mi`i`, mn(1)))),
            mspace(4), mo`-`, mspace(4), mul(msub(greek.circumflex.beta, mn(2)), msub(mi`x`, mrow(mi`i`, mn(2)))),
            mspace(4), S.ellipse.h2,
            mspace(4), mo`-`, mspace(4), mul(msub(greek.circumflex.beta, mi`k`), msub(mi`x`, mrow(mi`i`, mi`k`))),
            mspace(4), mo`.`
          ),
        ],

        [
          msup(greek.circumflex.sigma, mn(2)),
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
    doc.figcaption`estimating unbiased standard of σ²`
  ),
  se: text.figure(
    mathml.math(
      table(
        [
          Sd(msub(mi`x`, mi`j`)),
          mo`=`,
          annotationOver.attr({
            label: mtext`standard deviation`,
          }).of(
            msqrt(
              mul(
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
          Se(msub(greek.circumflex.beta, mi`j`)),
          mo`=`,
          mfrac(
            greek.circumflex.sigma,
            mul(
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
      to the unbiased standard error of σ²
    `,
  )
};
