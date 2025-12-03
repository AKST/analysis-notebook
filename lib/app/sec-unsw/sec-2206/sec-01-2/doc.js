/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc, table } from '@app/prelude.js';
import { twoColumns, twoThree, container, responsiveGridAutoRow } from '@prelude-uni/layout.js';
import { text, infobox, dashbox, note, todo } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';


const LINKS = {
  /** @type {E.Item} */
  linearRegressionInStata: ['a', {
    href: 'https://www.princeton.edu/~otorres/Regression101.pdf',
  }, ['Linear Regression in Stata']],
};

const TABLES = {
  terminology: table(['Y', 'X'], [
    ['Dependent variable', 'Independent variable'],
    ['Explained variable', 'Explanatory variable'],
    ['Response variable', 'Control variable'],
    ['Predicted variable', 'Predictor variable'],
    ['Regressand variable', 'Regressor variable'],
  ]),
  logFunctionalForms: twoColumns(
    table(['Model', 'Dependent Var'], [
      ['Level-Level', 'y'],
      ['Level-Log', 'y'],
      ['Log-Level', 'log(y)'],
      ['Log-Log', 'log(y)'],
    ]),
    table(['Independent Var', 'Interpreation of β̂₁'], [
      ['x', 'Δy = β₁ Δx'],
      ['log(x)', 'Δy = (β₁/100) %Δx'],
      ['x', '%Δy = (100β₁) Δx'],
      ['log(x)', '%Δy = β₁ %Δx'],
    ])
  ),
};

const INFOBOX = {
  populationParamaters: infobox({ title: 'Population Parameters' })(
    doc.p`
      β₀ and β₁ of the population are referred to as
      population parameters. They are unknown in
      reality.
    `,
  ),
  noteOnIndexSyntax: infobox({ title: 'Note on Index Syntax' })(
    doc.p`
      While subscript 1 & 0 are used for the coefficents
      of a linear regression, when used on variables it is
      in reference to an observation in a sample. It is
      often generalised as an i, as in ${doc.i`xᵢ`}
      for the x of the postion i where i is a number between
      1 and n (sometimes this can be 0 & n-1).
    `,
    mathml.indexSyntax,
  ),
  propertiesOfSummation: infobox({ title: 'Properties of Summation' })(
    todo({}, 'Write me later'),
  ),
  betaOneIsARandomVariable: infobox({ title: 'β̂₁ is a random variable' })(
    doc.p`
      β̂ᵢ is a random variable, in that each time you
      generate a sample you draw a new value
    `,
  ),
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
      ['h1', [
        'Simple Regression Model', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W1, Lecture 2']],
      ]],
      doc.p`
        To start with analysing cross sectional data we are
        going to look at simple regression models.
      `,
    ),
    infobox({ title: 'Resources' })(
      text.ul(
        doc.li`See chapter 2 of the textbook.`,
        doc.li.of(LINKS.linearRegressionInStata),
      ),
    ),
  ),
));

export const models = createDoc(() => dashbox(
  doc.h2`Modelling and understanding problems`,
  twoColumns(
    container(
      doc.h3`Theoretical Model`,
      doc.p`
        When tackling economic problems or understanding the
        economic nature of a system (an economy, institution,
        industry, etc), or economic characteristic of a system
        and its partipants, it helps to start with an theoretical
        model in which modifications to the system can be thought
        through and quantitied.
      `,
      doc.p`
        In a way its an attempt to explain the nature of the economic
        system in terms of the thing in of itself, and it can be
        expressed in terms of properties that observable and unobservable.
        The problem of measuring these things will come later.
      `,
    ),
    container(
      doc.h3`Economic Models`,
      doc.p`
        This can also be thought of an ${doc.b`Econometric model`}
        and its when we start to concern ourselves with what we can
        and cannot measure. The goal is to map theory to what we can
        observe, and vice versa. Eventually to see where reality relates
        to these models, or if our models are actually representive of
        reality.
      `,
      doc.p`
        Given the focus on what we can measure, we only include
        what we can measure within the model. In a simple
        linear regression model, this is captured in the error term,
        so there are at least some way of accounting for these in
        relative terms to what we can observe. We call these ${
        doc.b`unobservable variables`}.
      `,
    ),
  ),
));

export const linearRegression = createDoc(() => dashbox(
  doc.h2`Linear Regression`,
  doc.h3`Terminology`,
  twoThree(
    container(
      text.figure(mathml.simpleLinearRegresion, doc.figcaption`Simple Linear regression`),
      doc.p`${doc.b`u`}
        is sometimes called the erro term of distubance in
        the relationship, representing factors other than
        x that affect y. You can also simply think of it as ${
        doc.b`unobserved`}.
      `,
    ),
    TABLES.terminology,
  ),
  doc.h3`Population Assumptions and Definitions`,
  twoColumns(
    container(
      doc.h4`Linear Effect of X on Y`,
      text.figure(mathml.xyFunctionalRelationship, doc.figcaption`Linear effect requirement`),
      doc.p`
        Given the above is derived from the regression with β₀, we should
        see a zero change in u with an increase in x, this also means β₁
        is the ${doc.b`slope`} of the relationship between x and y.
      `,
    ),
    container(
      doc.h4`Average value of u`,
      text.figure(mathml.assumeExpectedUToBe0, doc.figcaption`Average u in the population given β₀`),
      doc.p`
        One assumption we need to make before we assume how x and u
        relate to one another is that for our model the average u
        in the population should be zero.
      `,
    ),
  ),
  container(
    doc.h4`Average U does not depent on X`,
    text.figure(mathml.assumeExpectedUDoesNotDependOnX, doc.figcaption`Assume U does not depend on X`),
    doc.p`
      This says that the average ${doc.b`u`} across the
      population determined by x is equal to the average ${doc.b`u`}
      over the population. Put another way, this says that u is ${
      doc.b`mean independent`} of x. Combining this with E(u) = 0,
      we get the zero conditional mean assumption.
    `,
    text.figure(mathml.assumeZeroConditionalMean, doc.figcaption`Zero Conditional mean assumption`),
  ),
  ['hr'],
  container(
    doc.h4`Population regression function (PRF)`,
    responsiveGridAutoRow([
      text.figure(mathml.populationRegressionFunction, doc.figcaption`The PRF`),
      text.figure(mathml.populationRegressionFunctionSimple, doc.figcaption`Also the PRF`),
      INFOBOX.populationParamaters,
    ], {
      columns: {
        desktop: '2fr 2fr 3fr',
      },
    }),
    doc.p`
      The right hand side does not mean, y = [right hand side]. It is
      more accurate to read it as a one input increase in x changes the
      expected value by the amount of β₁. So if you collected all observations
      of Y and X where Y was the same value, you'd see a normal distribution
      for all the values of X where the average value was (Y - β₀) ÷ β₁.
      Given this we can break the regression down into 2 components:
    `,
    text.ul(
      doc.li`${doc.b`Systematic part of y`}: E(y|x) or β₀ + β₁x`,
      doc.li`${doc.b`Unsystematic part of y`}: u, or the part y not explained by x`,
    ),
    doc.p`In reality we will never know the actual PRF in most meaningful cases.`,
  ),
));

export const ordinaryLeastSquaresEstimate = createDoc(() => dashbox(
  doc.h2`Deriving the Ordinary Least Squares Estimates`,
  twoThree(
    container(
      doc.p`
        In order to estimate the β₀ and β₁ for the population we
        need to sample from the population which we can produce
        our estimates as β̂₀ and β̂₁. Given a sample of size ${
        doc.b`n`} each the X, Y & U for each observation is
        specified in the linear regression like so.
      `,
      text.figure(mathml.simpleLinearRegresionSample, doc.figcaption`Sample linear regression`),
      doc.p`
        For each observation uᵢ is the information explaining
        yᵢ not captured in xᵢ. It is also called the ${
        doc.b`error term`}.
      `,
      text.figure(container(
        doc.p`${mathml.jointProbabilityDistributionOfXAndYInPop.p2_12}`,
        doc.p`${mathml.jointProbabilityDistributionOfXAndYInPop.p2_13}`,
      ), doc.figcaption`Joint Probability distribution of x & y with β₀ and β₁`),
      doc.p`
        It is helpful to think of the above of contraints in which we
        can count on solving for the values of β₀ and β₁ for the population.
        However in order to get estimates of the population from a sample
        we use ${doc.b`Sum of first order conditions`}.
      `,
    ),
    container(
      INFOBOX.noteOnIndexSyntax,
      doc.h4`Platonic properties of unobserved`,
      text.figure(mathml.idealProperitesOfUnobserved.p2_10, doc.figcaption`mean unobserved is zero`),
      text.figure(mathml.idealProperitesOfUnobserved.p2_11, doc.figcaption`covariance between u & x is zero`),
    ),
  ),
  doc.h4`Sum of First order condtiions`,
  doc.p`
    Using a method of moment approach we take the above population
    Joint distribution of x and y, assuming the properties of
    unobservables inrespect to x we derive these estimates allowing
    us to constrain our estimations for β₀ and β₁.
  `,
  text.figure(twoColumns(
    mathml.sumOfFirstOrderConditions.a,
    mathml.sumOfFirstOrderConditions.b,
  ), doc.figcaption`Sample counterparts to population above joint probability constraints`),
  twoThree(
    container(
      doc.h4`Estmating β̂₀`,
      doc.p`
        While we still need to know the value of β̂₁ before we can solve
        for β̂₀, using the properties summation we can rewrite the above
        to get the following to estimate β̂₀.
      `,
      text.figure(twoColumns(
        mathml.sumOfFirstOrderConditions.rewrite,
        mathml.sumOfFirstOrderConditions.betaZeroEstimate,
      ), doc.figcaption`Solving for β̂₀ using properties of summation`),
    ),
    INFOBOX.propertiesOfSummation,
  ),
  container(
    doc.h4`Estmating β̂₁`,
    twoThree(
      doc.p`
        And continuing on from below we'll solve for β₁. We start by
        injecting our above definition of ${doc.b`β̂₀`} into the ${
        doc.b`Sum of first order conditions`}, and from there we'll
        seek to isolate β̂₁. The right hand equation (or subsequent) show
        the factoring undertaken before rearrive at our equation for β̂₁.
      `,
      INFOBOX.betaOneIsARandomVariable,
    ),
    twoColumns(
      text.figure(mathml.betaOneEstimation.rearrangingAbove, doc.figcaption`
        Start by plugging β̂₀ into${['br']}
        the Sum of 1st Order Condition
      `),
      text.figure(mathml.betaOneEstimation.alsoNotingThat, doc.figcaption`
        Before isolating for β̂₁ note${['br']}
        how these can be rearranged
      `),
    ),
    doc.p`
      Given the sum of (x${['sub', 'i']}-x̄)² is greater than zero we
      compute β̂₁ as shown, which can be further simplifed to be σ̂${
      ['sub', 'y']} divided by σ̂${['sub', 'x']} times ρ̂${
      ['sub', 'xy']} which is the correlation (Noting that σ̂ is the
      sample standard deviation and ρ̂ is the sample correlation).
    `,
    responsiveGridAutoRow([
      text.figure(mathml.betaOneEstimation.assumption, doc.figcaption`Given`),
      text.figure(mathml.betaOneEstimation.betaOneOLS, doc.figcaption`Estimating β̂₁, the OLS slope`),
      text.figure(mathml.betaOneEstimation.betaOneOLSSimplied, doc.figcaption`Simpified β̂₁`),
      text.figure(mathml.betaOneEstimation.populationBetaOneOLSSimplied, doc.figcaption`Population β₁`),
    ], {
      columns: {
        desktop: 'auto auto auto auto',
      },
    }),
  ),
  container(
    doc.h4`Sample Regression Function, Fitted values and residuals`,
    doc.p`
      Using β̂₀ with β̂₁ times xᵢ we can get ŷᵢ which is the
      ${doc.b`fitted value`} of y, and the difference between
      the observed yᵢ and its fitted value ŷᵢ is called the
      ${doc.b`residual`} as ûᵢ. Note this is actually different
      from the error term or unobserved.
    `,
    responsiveGridAutoRow([
      text.figure(mathml.fittedValueOfYi, doc.figcaption`Fitted value of ŷᵢ`),
      text.figure(mathml.fittedValueResiduals, doc.figcaption`Computing residual ûᵢ`),
      text.figure(mathml.sampleRegressionFunction, doc.figcaption`Sample Regression Function`),
    ], {
      columns: {
        desktop: '1fr auto 1fr',
      },
    }),
    doc.p`
      We've estimated our coefficents β̂₀ and β̂₁ so that the average ûᵢ
      is 0, and you can see that if you start back at the Sum of
      First Order conditions where the right hand side is 0 and the
      residuals are omitted from the left hand side. At least that's
      how I understand it (there may be more formal ways of
      demostrating that).
    `,
  ),
  container(
    doc.h4`SST, SSE, SSR and Goodness of Fit`,
    doc.p`
      To measure ${doc.b`goodness of fit`} we'll first define
      a few more concepts which we will use to compute ${doc.b`R²`}
      which is a way for assessing the overall fit of the data. They
      have been defined down below:
    `,
    responsiveGridAutoRow([
      text.figure(mathml.sumOfSquares.sst, doc.figcaption`Total Sum of Squares`),
      text.figure(mathml.sumOfSquares.sse, doc.figcaption`Explained Sum of Squares`),
      text.figure(mathml.sumOfSquares.ssr, doc.figcaption`Residual Sum of Squares`),
    ], {
      columns: {
        desktop: 'auto auto auto',
      },
    }),
    doc.p`
      They all related to each other like as shown on the left, and
      you can use them like so compute the R-Squared which is sometimes
      called the Coefficient of determination. It is a measure of the
      portion of variance captured by the model.
    `,
    responsiveGridAutoRow([
      text.figure(mathml.sumOfSquares.relation, doc.figcaption`Sum of Squares constraint`),
      text.figure(mathml.rSquared, doc.figcaption`R Squared`),
    ], {
      columns: {
        desktop: 'auto auto',
      },
    }),
    text.figure(mathml.rSquareFull, doc.figcaption`R Square Expanded`),
  ),
  container(
    doc.h4`What is Ordinary Least Squares really?`,
    doc.p`
      To be honest, I am still wrapping my head around
      this, but for the best answer I can give is, it
      solves for β̂₀ and β̂₁ so that you have the smallest
      value possible.
    `,
    text.figure(
      mathml.whatIsOrdinaryLeastSquares,
      doc.figcaption`Minimisation constraint`,
    ),
  )
));

export const functionalFormsInvolvingLogs = createDoc(() => container(
  dashbox(
    doc.h2`Functional Forms Involving Logs`,
    doc.p`
      Linear regression is linear in the sense it is linear in
      parameters (unforunately I don't know what that means), and
      more simply that can be put there is a linear relation between
      the either side of the regression. This isn't to say you can't
      represent nonlinear relations.
    `,
    doc.p`
      If you have a relation between the logarithm of your
      dependent variable with independent variable or vice versa
      you can simply create a new variable for that logarithm
      and use it in computing your coefficents. Same goes for
      exponents or anything else of that nature. See the table
      below for some names of common functional forms.
    `,
    text.ul(
      doc.li`log level is sometimes called semi-elasticity`,
      doc.li`log log is the elasticity of y with respect to x`,
      doc.li`However I am unsure if there are other names for the rest`,
    ),
  ),
  TABLES.logFunctionalForms,
));

export const assumptionsOfUnbiasednessInOLS = createDoc(() => dashbox(
  container(
    doc.h2`Assumptions of Unbiasednesss of OLS`,
    doc.p`
      These are also called the ${doc.b`Gauss Markov Assumptions`}
      they can vary between multiple linear regression. But in order
      for the model to be unbiased these assumptions must be true.
      You can also think of these as a check list to evaluate the
      biasness of a model.
    `,
  ),
  twoColumns(
    container(
      doc.h4`SLR 1 - Linear in Parameters`,
      doc.p`
        Within population model the dependent variable y
        is related to the independent variable in a linear
        fashion.
      `,
    ),
    container(
      doc.h4`SLR 2 - Random Sampling`,
      doc.p`We have a random sample of the population.`,
    ),
  ),
  twoColumns(
    container(
      doc.h4`SLR 3 - Sample Variation`,
      doc.p`Within the sample, there is more than one value for a variable`,
      text.figure(mathml.slrAssumptions.slr3, doc.figcaption`SLR 3`),
    ),
    container(
      doc.h4`SLR 4 - Zero Conditional Mean`,
      doc.p`The error has an expected value of zero for any given explanatory variable`,
      text.figure(mathml.slrAssumptions.slr4, doc.figcaption`SLR 4`),
    ),
  ),
  container(
    doc.h4`SLR 5 - Homoskedasticity`,
    doc.p`
      The error u has the same variance given any value of
      the explanatory variable. Meaning at any point along
      the line of best fit variance is identical for the
      error rate.
    `,
    text.figure(mathml.slrAssumptions.slr5, doc.figcaption`SLR 5`),
  ),
  container(
    doc.h3`Theorum for unbiassness of the OLS`,
    todo({}, 'READ page 43'),
  ),
  container(
    doc.h3`Analysis of Simple Linear Regression`,
    todo({}, 'Explain how this is useful and important'),
    twoColumns(
      text.figure(mathml.simpleLinearRegressionAnalysis.varB1EstA, doc.figcaption`Constraint A, Sampling variance of estimators`),
      text.figure(mathml.simpleLinearRegressionAnalysis.varB1EstB, doc.figcaption`Constraint B, Sampling variance of estimators`),
    ),
    text.figure(
      mathml.simpleLinearRegressionAnalysis.varB1EstC,
      doc.figcaption`Given the above assumptions this should hold`,
    ),
  ),
));

export const summary = createDoc(() => dashbox(
  doc.h2`Conclusion`,
  doc.p`main points are...`,
  note(
    'Population regression',
    'Sample regression',
    'Estimation',
    'Fitted values',
    'Regression risduals',
    'Understand why estimated parameteres are (ex-ante) random variables',
  ),
));
