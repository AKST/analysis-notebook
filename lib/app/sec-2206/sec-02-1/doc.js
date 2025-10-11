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
      ref({ page: 1000 }, doc.h4`Homoskedacity`),
    ),
  ),
  doc.hr(),
  mathml.unbiasedness.theorum3_1,
));

export const expectedOLSEstimatorsIrrelevantVars = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'M'],  slide: 8 } }, (
    doc.h3`Irrelevant Variables in a regression Model`
  )),
  note(
    doc.span`Say you make a model ${doc.b`Y = θ0 + θ1*X1 + θ2*X2 + θ3*X3 + V`}`,
    doc.span`Say the True model is ${doc.b`Y = B0 + B1*X1 + B2*X2 + U`}`,
    doc.span`At the very least there won't be a bias${ulLight([
      'E(U|X1,X2) = 0 => E(V|X1,X2,X3)',
      'X3 is irrelevant: θ3 = 0',
    ])}`,
  ),
  twoColumns(
    container(
      clsRef({ lec: { id: [3, 'M'], slide: 11 } }, doc.h4`No Perfect Collinearity`),
      note(
        'See MLR 3, this is an extension of SLR 3',
        'no releation amoung the independent variables',
      ),
    ),
    container(
      clsRef({ lec: { id: [3, 'M'], slide: 12 } }, doc.h4`Zero Conditional mean`),
      note(
        'For this reason it is safe to over specify variables, provide the above isn\'t violated',
      ),
    ),
  ),
  container(
    clsRef({ lec: { id: [3, 'M'], slide: 13 } }, doc.h4`Exogenous And Endogenous Variables`),
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

export const expectedOLSEstimatorsOmittedVariableBias = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'M'], slide: 3 } }, doc.h3`Omitted Variable Bias`),
  note(
    doc.span`Say you make a model ${doc.b`Y = θ0 + θ1*X1 + V`}`,
    doc.span`Say the True model is ${doc.b`Y = B0 + B1*X1 + B2*X2 + U`}`,
    doc.span`As we omitted X2, it would be an omitted variable`,
    doc.span`The omission of this variable will lead to bias in our specified estimators`,
    'If E(X2|X1) ≠ 0 then X2 is related to X1',
    'If B2 ≠ 0: X2 has an effect on Y',
  ),
  mathml.concequenceOfOmittedVariableBias,
  container(
    clsRef({ lec: { id: [3, 'M'], slide: 5 } }, doc.h4`Measuring Correlations between Variables`),
    note(
      'Given X2 = D0 + D1X + W',
      'D1 measures the linear correlation between X2 and X1',
      doc.span`Subsubstitute in the true model${ulLight([
        'Y = B0 + B1*X1 + B2*(D0 + D1*X1 + W) + U',
        'Y = (B0 + B2*D0) + (B1 + B2*D1)*X1 + (B2*W + U)',
      ])}`,
      doc.span`Given ${doc.b`E(θ1) = B1 + B2*D1`}${ulLight([
        'if θ1 is unbias it will be equal to B1',
        'if θ1 is bias it will be equal to B1 + B2*D1',
      ])}`,
      doc.span`positive bias means the estimator overestimates the value${ulLight([
        'E(01) - B1 = B2D1 > 0',
        todo({}, 'example of positive bias'),
      ])}`,
      doc.span`negative bias means the estimator underestimates the value${ulLight([
        'E(01) - B1 = B2D1 < 0',
        todo({}, 'example of negative bias'),
      ])}`,
    ),
    todo({}, 'Show the above in the form of math'),
  ),
));

export const expectedOLSEstimatorsVariance = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'M'], slide: 14 } }, doc.h3`Variance of OLS Estimators`),
  note(),
  clsRef({ lec: { id: [3, 'M'], slide: 15 } }, doc.h4`Components of OLS variance`),
  noteOn('Var(βᵢ)')(
    'increase in 𝜎² suggests noise',
    'decreases with SSTᵢ',
  ),
));

export const expectedOLSEstimatorsMulticollinearity = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'M'], slide: 16 } }, doc.h3`Multicollinearity`),
  twoThree(
    note(
      'This is when explainatory variables are colleralated, and explain themselves',
      'It is difficult to attribute the impact of one variable from the other',
      'Sometimes its better to lump those variables together',
    ),
    INFOBOX.rSquaredJ,
  ),
));
