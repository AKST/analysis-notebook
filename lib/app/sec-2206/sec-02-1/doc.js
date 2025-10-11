/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { responsiveGridAutoRow, twoColumns, twoThree, container } = prelude.layout;
const {
  clsRef, infobox, ulLight,
  dashbox, noteOn, note, todo,
} = prelude.components;
const { createDoc } = prelude.util;

const LINKS = {
  gaussMarkovTheorem: doc.a({ href: 'https://en.wikipedia.org/wiki/Gauss–Markov_theorem' }),
  methodOfMoments: doc.a({ href: 'https://en.wikipedia.org/wiki/Method_of_moments_(statistics)' }),
  frischWaughLovell: doc.a({ href: 'https://en.wikipedia.org/wiki/Frisch–Waugh–Lovell_theorem' }),
};

/**
 * @param {{
 *   page?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 3, page }) : undefined,
  }, item)
);

/**
 * @type {Record<string, E.Item>}
 */
const INFOBOX = {
  rSquaredJ: infobox('R²j', [container(
    doc.p`R²j is the R² of the following regression`,
    doc.quote`Xj = ⍺₀ + ⍺₁X₁ + ... + 𝛼ₖXₖ + V`,
    doc.p`
      When R²j is high, it brings very
      little information, this is
      Multicollinearity.
    `,
  )]),
};

/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => (
  createDoc(() => container(
    todo({}, `for "${label.trim()}"`),
  ))
);

export const intro = createDoc(() => container(
  twoThree(
    container(
      doc.h1.of('Multi Linear Regression', doc.br(), (
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W2-W3, Lecture 1']]
      )),
    ),
    infobox('Resources', [
      ulLight([
        'Chapter 3 of the textbook',
        LINKS.gaussMarkovTheorem`Gauss Marko Theorem`,
        LINKS.frischWaughLovell`Frisch–Waugh–Lovell theorem`,
      ]),
    ]),
  ),
));

const vars = {
  y: doc.b`y`,
  u: doc.b`u`,
  x1: doc.b`x${doc.sub`1`}`,
  x2: doc.b`x${doc.sub`2`}`,
  xk: doc.b`x${doc.sub`k`}`,
  b0: doc.b`β${doc.sub`1`}`,
  b1: doc.b`β${doc.sub`1`}`,
  b2: doc.b`β${doc.sub`2`}`,
  bk: doc.b`β${doc.sub`k`}`,
  est: {
    y: doc.b`ŷ`,
    x1: doc.b`x̂${doc.sub`1`}`,
    x2: doc.b`x̂${doc.sub`2`}`,
    xk: doc.b`x̂${doc.sub`k`}`,
    b0: doc.b`β̂${doc.sub`1`}`,
    b1: doc.b`β̂${doc.sub`1`}`,
    b2: doc.b`β̂${doc.sub`2`}`,
    bk: doc.b`β̂${doc.sub`k`}`,
    rj: doc.b`r̂${doc.sub`i1`}`,
  },
};

export const motivationForMultiRegression = createDoc(() => dashbox(
  doc.h2`Motivation for Multiple Regression`,
  twoThree(
    container(
      doc.small`
        The main drawback in using a single variable in a linear
        regression, is it is difficult to draw ${doc.b`ceterix paribus`}
        conclusions about how ${doc.b`x`} affects ${doc.b`y`}.
        Assumption SLR.4 requires that all other factors affecting y
        are uncorrelated with x, which is seldom the case. Here in
        lies the motivation for use multi linear regression as we
        can begin to control for additional variables.
      `,
    ),
    infobox('SLR.4', [
      doc.p`
        SLR.4 is the zero conditional mean assumption,
        which is roughly ${doc.b`E(u|x) = 0`}.
      `,
    ]),
  ),
  doc.small`
    ${doc.u`Given all Gauss Markov assumptions hold`}, as we add more
    variables to a model we can explain more of the variation of ${doc.b`y`}.
    Another advantage of multiple regression analysis is the ability to
    express many more functional relationships between more of its variables.
  `,
  twoColumns(
    container(
      doc.h4`Income Example`,
      mathml.createFigure('M1: Effects on Wage', 'wage', ['educ']),
      doc.small`
        Say we start out with the above model, while we have some
        positive correlation between wage and education there seems
        to be some massive variation. Because of this we decide to
        control for more factors.
      `,
      mathml.createFigure('M2: Effect of experience on Wage', 'wage', ['educ', 'exper']),
      doc.small`
        With this new model, we have taken exper out of the u,
        and we should expect some change in value of the
        coefficient. Given the all the Gauss-Marko assumptions
        hold we will see a uniform decrease in the size of the
        residuals.
      `,
    ),
    container(
      doc.h4`Avg Student Score Example`,
      mathml.createFigure('M1: School expenditure on score', 'avgscore', ['expend']),
      doc.small`
        Here we have a simple model for the average
        student score. Where ${vars.x1} is the random variable
        for school expenditure. But we can update this to
        control for the average family income at the school like so
      `,
      mathml.createFigure('M2: Effect of Avg Income on score', 'avgscore', ['expend', 'avginc']),
      doc.small`
        Similar to the income example, we should see a reduction in the
        size of the residual for all observations now that we are
        seperately controlling for average income.
      `,
    ),
  ),
  container(
    doc.h4`General form of model`,
    twoThree(
      container(
        mathml.size2MLR.regression,
      ),
      doc.small.of(ulLight([
        doc.span`${vars.b0} is the intercept`,
        doc.span`${vars.b1} is change in ${vars.y} with respect to ${vars.x1}`,
        doc.span`${vars.b2} is change in ${vars.y} with respect to ${vars.x2}`,
      ])),
    ),
    doc.small`
      Above is the general form, which you could have probably have
      guessed from the above examples. ${doc.b`One neat thing`}
      about this form is you can isolate the change in ${vars.y} to
      the different coeffients. Given you have an exhaustive model
      this is fairly compelling.
    `,
  ),
  container(
    twoThree(
      container(
        ref({ page: 68 }, doc.h4`Expressing a quadratic function in MLR`),
        mathml.quadraticExpressionInMLR.regression,
        doc.small`
          Similar to how logarithmic relations can be
          expressed in a linear regression, now with multiple
          variables you can also express quadratic functions well.
          This is fine as it is ${doc.b`linear in parameters`}.
          However ${doc.b`one drawback`} of this is we no longer
          have a meaningful interpretation of ${vars.b1} in isolation.
        `,
      ),
      infobox('Key Assumption', [
        mathml.size2MLR.assumption,
        doc.p`
          This implies that other factors affecting
          y are not related to x1 or x2
        `,
      ]),
    ),
    doc.small`
      Note the right hand side outlines a key assumption on how
      ${vars.x1} and ${vars.x2} as independent variables relate
      to ${vars.u}. It basically says if there are other variables
      that affect y, it will not flucation over different values of
      the values ${vars.x1} and ${vars.x2}
    `,
    mathml.quadraticExpressionInMLR.relation,
  ),
  container(
    twoThree(
      container(
        ref({ page: 69 }, doc.h4`General MLR Form`),
        mathml.sizeKMLR.regression,
      ),
      infobox('K convention', [doc.p`k often denotes the number independent vars.`]),
    ),
    doc.small`
      Despite adding additional parameters, several things
      don't change. ${vars.u} is still the error term or
      disturbance, ${vars.y} is still the dependent variable,
      the various x's on the right side are still independent
      variables. That said it no longer makes sense to
      speak of any single coefficient in terms of being a slope.
      Although altogether they can be called the
      ${doc.b`OLS slopes`} (or OLS Slope estimates).
    `,
    twoThree(
      doc.small`
        This is fairly similar to the conditional mean assumption
        from SLR and the key assumption we made above with 2
        independent variables, but here is a more general form
        of the conditional mean assumption for ${doc.b`k`}
        independent variables.
      `,
      mathml.size2MLR.assumption,
    ),
    doc.small`
      To be explict this just means the average value of ${vars.u}
      should be ${doc.b`0`}. Which implies the error term is not
      contingent on any set of independent variables.
    `,
  ),
));

export const mechanicsOfOLS = createDoc(() => dashbox(
  ref({ page: 70 }, doc.h2`Mechanics and interpretations of OLS`),
  container(
    twoThree(
      doc.small`
        Alot of what applies here to models with 2 variables
        will apply to a model with any number (${doc.b`k`})
        of variables.
      `,
      mathml.size2MLR.estimate,
    ),
    mathml.size2MLR.ols,
    ref({ page: 71 }, doc.h4`First Order Conditions`),
    doc.small`
      Estimating the coefficients can be solved by
      multivariable calculus, but in practise you'll get
      a computer to solve this (but the methodology is
      based in multi variable calculus). You basically
      need a set of values for ${vars.est.b0},
      ${vars.est.b1}, ${vars.est.b2}, ..., ${vars.est.bk},
      that holds the ${doc.b`k`} regressors for the
      below linear constraints.
    `,
    mathml.sizeKMLR.ols(),
    doc.small`
      The above involves K + 1 linear equations with k +
      unknown coefficients. This is called the
      ${doc.b`First Order Conditions`}. This can be
      obtained by the ${LINKS.methodOfMoments`Method of moments`}.
      You can solve this by hand if you'd like but I would probably
      use a computed.
    `,
  ),
  container(
    ref({ page: 71 }, doc.h3`Interpreting OLS Regression Equations`),
    responsiveGridAutoRow([
      mathml.sizeKMLR.estimate,
      mathml.sizeKMLR.partialEffect,
    ], { columns: { desktop: 'auto auto' } }),
    doc.small`
      The Ceteris Paribus interpretation just shows the
      relationship that exists between the rate of change
      of ${vars.est.y} with respect to any of its regressors.
      From here it is quite straight forward to model the
      impact of changing any of the indivisual regressors.
    `,
    container(
      ref({ page: 74 }, doc.h4`OLS Fitted Value and Residuals`),
      responsiveGridAutoRow([
        mathml.sizeKMLR.fitted,
        mathml.residuals,
      ], { columns: { desktop: 'auto auto' } }),
    ),
    container(
      ref({ page: 76 }, doc.h4`Goodness of fit and R²`),
      doc.small`These don't really change really`,
    ),
    container(
      ref({ page: 79 }, doc.h4`Regression through origin`),
      mathml.sizeKMLR.throughOrigin,
      doc.small`
        If for whatever reason the ${vars.b0} is 0 then this
        is typically how'd you represent that. So when any of
        the regressors are zero when then the predicted value
        would be zero.
      `,
    ),
  ),
  twoColumns(
    container(
      ref({ page: 75 }, doc.h4`"Partialling Out" Interpretation`),
      mathml.partiallingOut,
      doc.small`
        I'mma be real, no clue what the go with this is or
        why it matters. See ${
          LINKS.frischWaughLovell`Frisch–Waugh–Lovell theorem`
        } for more info I guess.
      `,
      todo({}, 'Figure out why this is relevant'),
    ),
    container(
      ref({ page: 75 }, doc.h4`Comparing SLR & MLR Regressor Est`),
      mathml.compareSLRAndMLR,
      doc.small`
        Test by running a model with and without a variable.
      `,
      doc.small.of(ulLight([
        doc.span`If the partial effect on ŷ is 0, then 𝛽̂₂ is 0`,
        doc.span`If x₁ and x₂ are uncorrelated then 𝛿̂₁ is 0`,
      ])),
      doc.quote.of(doc.small`
        The value of this will be more apparent when we're looking
        into omitted variable bias.
      `),
    ),
  ),
));

export const expectedOLSEstimators = createDoc(() => dashbox(
  ref({ page: 79 }, doc.h2`Expected Values of OLS Estimators`),
  container(
    doc.h3`MLR Assumptions`,
    twoColumns(
      container(
        ref({ page: 80 }, doc.h4`Linear in parameters`),
        doc.small`This is more less the same thing in SLR.`,
      ),
      container(
        ref({ page: 80 }, doc.h4`Random Sampling`),
        doc.small`This is more less the same thing in SLR.`,
      ),
    ),
    twoColumns(
      container(
        ref({ page: 80 }, doc.h4`No Perfect Colinearity`),
        doc.small`
          This means, of the mean independent variables
          there should not be a linear relationship between
          any 2 or more independent variable. This isn't to
          say there can't be any correlation the independent
          variables, they just cannot be perfectly correlated.
        `,
        doc.quote.of(doc.small`
          This can happen when one variable is just
          a multiple of another variable.
        `),
      ),
      container(
        ref({ page: 82 }, doc.h4`Zero Conditional Mean`),
        mathml.assumptions.mlr4,
        doc.small`
          One scenario this can fail is where there any of
          the regressors doesn't have a linear relationship
          with y. One such example is when there's a
          quadratic relationship and the model includes only
          one of the 2 variables (the linear and squared one).
        `,
        mathml.quadraticExpressionInMLR.regression,
      ),
    ),
    container(
      ref({ page: 88 }, doc.h4`Homoskedacity`),
      mathml.assumptions.mlr5,
      doc.small`
        In order to have Homoskedacity the variance of the
        error rate needs to be uniform over the range of
        values for each regressor.
      `,
    ),
  ),
  doc.hr(),
  responsiveGridAutoRow([
    mathml.assumptions.mlr1234,
    mathml.unbiasedness.theorum3_1,
  ], { columns: { desktop: 'auto auto' } }),
));

export const expectedOLSEstimatorsIrrelevantVars = createDoc(() => dashbox(
  ref({ page: 83  }, doc.h3`Irrelevant Variables in a regression Model`),
  doc.small`
    The long and short of this is, it doesn't matter and you're fine if you
    have irrelevant variables, ultimately they end up with a coefficient of
    zero and will have no effect.
  `,
  clsRef({ lec: { id: [3, 'M'], slide: 12 } }, todo({}, 'document the role of MLR 3')),
  container(
    clsRef({ lec: { id: [3, 'M'],  slide: 8 } }, doc.h4`Explaination`),
    doc.small.of(ulLight([
      doc.span`Say you make a model ${ulLight([
        doc.b`Y = θ0 + θ1*X1 + θ2*X2 + θ3*X3 + V`
      ])}`,
      doc.span`Say the True model is ${ulLight([
        doc.b`Y = B0 + B1*X1 + B2*X2 + U`
      ])}`,
      doc.span`At the very least there won't be a bias${ulLight([
        'E(U|X1,X2) = 0 => E(V|X1,X2,X3)',
        'X3 is irrelevant: θ3 = 0',
      ])}`,
    ])),
  ),
));

export const expectedOLSEstimatorsOmittedVariableBias = createDoc(() => dashbox(
  clsRef({ book: { page: 84, chapter: 3}, lec: { id: [3, 'M'], slide: 3 } }, doc.h3`Omitted Variable Bias`),
  twoThree(
    container(
      doc.small`
        Now this is actually a problem, and something we should avoid. It can
        lead to a litany of issues. Some include biased estimators which either
        under estimate or overestimate the effect of the specified regressors
        (especially when there's some level of correlation with the omitted regressor).
      `,
      doc.small`
        The earlier section on ${doc.b`Comparing SLR & MLR regressors
        Estimates`} explain some concepts used in this section (such as
        𝛽̃₁ or 𝛿̃₁).
      `,
    ),
    infobox('Nomenclature', [container(
      doc.p`This is also called:`,
      ulLight([
        doc.li`Excluding a relevant variable`,
        doc.li`underspecifying the model`,
      ]),
      doc.p`
        Deriving the Bias caused from an important
        missing variable is called
        ${doc.b`misspecification analysis`}.
      `,
    )]),
  ),
  container(
    doc.h4`Determining Bias`,
    responsiveGridAutoRow([
      mathml.size2MLR.regression,
      mathml.size2MLR.missing,
    ], { columns: { desktop: 'auto auto' } }),
    twoThree(
      container(
        doc.small`
          Say the true population model (on the left) has x₁ and
          x₂ but you unknowning omit x² and end up on the model on
          the right. Eventually you find out this was the case and
          recreate your model, but you want to measure how wrong the
          earlier model was, well reusing the SLR/MLR comparison logic
          shown on the right you can solve for 𝛿̃₁.
        `,
        doc.small`
          A summary below is provided to decern the effect of the bias.
        `,
        tables.bias,
      ),
      container(
        mathml.compareSLRAndMLR,
        mathml.unbiasedness.unbiasedExpansion,
      ),
    ),
    mathml.unbiasedness.omittedVariableBias,
    ref({ page: 87 }, doc.h4`Omitted Variable Bias more general case`),
    doc.small`
      Measuring Omitted Bias is more difficult the more variables. The
      omission of an important variable will lead to bias in any variable
      it has any meaningful correlation with.
    `,
  ),
));

export const expectedOLSEstimatorsVariance = createDoc(() => dashbox(
  clsRef({ book: { chapter: 3, page: 88 }, lec: { id: [3, 'M'], slide: 14 } }, doc.h3`Variance of OLS Estimators`),
  twoColumns(
    container(
      doc.h4`Homoskedasticity`,
      mathml.assumptions.mlr5,
      doc.small`
        Homoskedasticity is present when the variance for expected value for
        the error term does not change with any of the independent variables.
      `,
    ),
    container(
      doc.h4`Other MLR assumptions`,
      mathml.assumptions.mlr1234,
      doc.small`Reminder of other MLR assumptions.`,
    ),
  ),
  twoThree(
    container(
      doc.h4`Sampling Variance of estimators`,
      doc.small`
        When MLR 1, 2, 3, 4, 5 hold the variance of the
        sampling estimators should resemble something
        like this.
      `,
      mathml.samplingVarianceOfEstimators,
    ),
    INFOBOX.rSquaredJ,
  ),
  clsRef({ lec: { id: [3, 'M'], slide: 15 } }, noteOn('Var(βᵢ)')(
    'increase in 𝜎² suggests noise',
    'decreases with SSTᵢ',
  )),
  clsRef({ book: { chapter: 3, page: 89 }, lec: { id: [3, 'M'], slide: 16 } }, doc.h3`Multicollinearity`),
  doc.h4`The Error Variance, 𝜎${doc.sup`2`}`,
  todo({}, 'reread textbook'),
  doc.h4`Total Sample Variance in , x${doc.sub`j`}, SST${doc.sub`j`}`,
  todo({}, 'reread textbook'),
  doc.h4`The linear relationship amoung the independent variables , R${doc.sub`j`}${doc.sup`2`}`,
  todo({}, 'reread textbook'),
  doc.h3`Variance in Misspecfied Models`,
  todo({}, 'reread textbook'),
  doc.h3`Estimating 𝜎²: Standard Errors of the OLS Estimators`,
  todo({}, 'reread textbook'),
  doc.h2`Efficiency of OLS: The Gauss-Markov Theorem`,
  todo({}, 'reread textbook'),
));

export const other = createDoc(() => dashbox(
  doc.h2`Other`,
  container(
    clsRef({ lec: { id: [3, 'M'], slide: 13 } }, doc.h4`Exogenous And Endogenous Variables`),
    note(
      doc.span`Exogenous: ${ulLight([
        'These are characterised by uncorrelatled variables',
        'Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) = 0',
      ])}`,
      doc.span`Endogenous: ${ulLight([
        'These are characterised by correlated variables E(U|X0...Xn) = 0',
        'Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) ≠ 0',
      ])}`,
    ),
  ),
  container(
    clsRef({ lec: { id: [3, 'M'], slide: 13 } }, doc.h4`Endogenous Vs Exogenous`),
    note(
      doc.span`Exogenous${ulLight([
        'These are characterised by uncorrelatled variables',
        'Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) = 0',
      ])}`,
      doc.span`Endogenous${ulLight([
        'These are characterised by correlated variables E(U|X0...Xn) = 0',
        'Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) ≠ 0',
      ])}`,
    ),
  ),
));
