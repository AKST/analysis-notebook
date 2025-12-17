/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { responsiveGridAutoRow, twoColumns, twoThree, container } from '@prelude-uni/layout.js';
import { text, clsRef, infobox, dashbox, noteOn, note, todo } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const LINKS = {
  gaussMarkovTheorem: text.a({ href: 'https://en.wikipedia.org/wiki/Gauss–Markov_theorem' }),
  methodOfMoments: text.a({ href: 'https://en.wikipedia.org/wiki/Method_of_moments_(statistics)' }),
  frischWaughLovell: text.a({ href: 'https://en.wikipedia.org/wiki/Frisch–Waugh–Lovell_theorem' }),
  papers: {
    randomEffectsModels: text.a({ href: 'https://www.jstor.org/stable/2529876' }),
  },
  yt: {
    mixedEffects: text.a({ href: 'https://www.youtube.com/watch?v=MOyjGnjAols' }),
    logitModels: text.a({ href: 'https://www.youtube.com/watch?v=iQNRzHKjFw0' }),
  },
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
  rSquaredJ: infobox({ title: 'R²j' }).of(
    doc.p`R²j is the R² of the following regression`,
    doc.quote`Xj = ⍺₀ + ⍺₁X₁ + ... + αₖXₖ + V`,
    doc.p`
      When R²j is high, it brings very
      little information, this is
      Multicollinearity.
    `,
  ),
};

/**
 * @param {'even-2' | '2/3'} kind
 * @param {E.Item[]} left
 * @param {E.Item[]} right
 */
const columns = (kind, left, right) => (
  (kind === 'even-2' ? twoColumns : twoThree)(
    container(...left),
    container(...right),
  )
);

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
      doc.h1.of('Multi Linear Regression', doc.br(),
        doc.small({ style: 'color: #aaaaff' }).t`ECON2206, W2-W3, Lecture 1`
      ),
    ),
    infobox({ title: 'Resources' }).of(
      text.ul(
        doc.li`Chapter 3 of the textbook`,
        doc.li.of(LINKS.gaussMarkovTheorem.t`Gauss Marko Theorem`),
        doc.li.of(LINKS.frischWaughLovell.t`Frisch–Waugh–Lovell theorem`),
      ),
    ),
  ),
));

const vars = {
  y: doc.b`y`,
  u: doc.b`u`,
  x1: doc.b`x${doc.sub`1`}`,
  x2: doc.b`x${doc.sub`2`}`,
  xk: doc.b`x${doc.sub`k`}`,
  xj: doc.b`x${doc.sub`j`}`,
  b0: doc.b`β${doc.sub`1`}`,
  b1: doc.b`β${doc.sub`1`}`,
  b2: doc.b`β${doc.sub`2`}`,
  bk: doc.b`β${doc.sub`k`}`,
  RJ: doc.b`R${doc.sub`j`}${doc.sup`2`}`,
  R2: doc.b`R${doc.sup`2`}`,
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
      doc.p`
        The main drawback in using a single variable in a linear
        regression, is it is difficult to draw ${doc.b`ceterix paribus`}
        conclusions about how ${doc.b`x`} affects ${doc.b`y`}.
        Assumption SLR.4 requires that all other factors affecting y
        are uncorrelated with x, which is seldom the case. Here in
        lies the motivation for use multi linear regression as we
        can begin to control for additional variables.
      `,
    ),
    infobox({ title: 'SLR.4' }).of(
      doc.p`
        SLR.4 is the zero conditional mean assumption,
        which is roughly ${doc.b`E(u|x) = 0`}.
      `,
    ),
  ),
  doc.p`
    ${doc.u`Given all Gauss Markov assumptions hold`}, as we add more
    variables to a model we can explain more of the variation of ${doc.b`y`}.
    Another advantage of multiple regression analysis is the ability to
    express many more functional relationships between more of its variables.
  `,
  twoColumns(
    container(
      doc.h4`Income Example`,
      mathml.createFigure('M1: Effects on Wage', 'wage', ['educ']),
      doc.p`
        Say we start out with the above model, while we have some
        positive correlation between wage and education there seems
        to be some massive variation. Because of this we decide to
        control for more factors.
      `,
      mathml.createFigure('M2: Effect of experience on Wage', 'wage', ['educ', 'exper']),
      doc.p`
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
      doc.p`
        Here we have a simple model for the average
        student score. Where ${vars.x1} is the random variable
        for school expenditure. But we can update this to
        control for the average family income at the school like so
      `,
      mathml.createFigure('M2: Effect of Avg Income on score', 'avgscore', ['expend', 'avginc']),
      doc.p`
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
      text.ul(
        doc.li`${vars.b0} is the intercept`,
        doc.li`${vars.b1} is change in ${vars.y} with respect to ${vars.x1}`,
        doc.li`${vars.b2} is change in ${vars.y} with respect to ${vars.x2}`,
      ),
    ),
    doc.p`
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
        doc.p`
          Similar to how logarithmic relations can be
          expressed in a linear regression, now with multiple
          variables you can also express quadratic functions well.
          This is fine as it is ${doc.b`linear in parameters`}.
          However ${doc.b`one drawback`} of this is we no longer
          have a meaningful interpretation of ${vars.b1} in isolation.
        `,
      ),
      infobox({ title: 'Key Assumption' }).of(
        mathml.size2MLR.assumption,
        doc.p`
          This implies that other factors affecting
          y are not related to x1 or x2
        `,
      ),
    ),
    doc.p`
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
      infobox({ title: 'K convention' }).of(doc.p`k often denotes the number independent vars.`),
    ),
    doc.p`
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
      doc.p`
        This is fairly similar to the conditional mean assumption
        from SLR and the key assumption we made above with 2
        independent variables, but here is a more general form
        of the conditional mean assumption for ${doc.b`k`}
        independent variables.
      `,
      mathml.size2MLR.assumption,
    ),
    doc.p`
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
      doc.p`
        Alot of what applies here to models with 2 variables
        will apply to a model with any number (${doc.b`k`})
        of variables.
      `,
      mathml.size2MLR.estimate,
    ),
    mathml.size2MLR.ols,
    ref({ page: 71 }, doc.h4`First Order Conditions`),
    doc.p`
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
    doc.p`
      The above involves K + 1 linear equations with k +
      unknown coefficients. This is called the
      ${doc.b`First Order Conditions`}. This can be
      obtained by the ${LINKS.methodOfMoments.t`Method of moments`}.
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
    doc.p`
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
      doc.p`These don't really change really`,
    ),
    container(
      ref({ page: 79 }, doc.h4`Regression through origin`),
      mathml.sizeKMLR.throughOrigin,
      doc.p`
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
      doc.p`
        I'mma be real, no clue what the go with this is or
        why it matters. See ${
          LINKS.frischWaughLovell.t`Frisch–Waugh–Lovell theorem`
        } for more info I guess.
      `,
      todo({}, 'Figure out why this is relevant'),
    ),
    container(
      ref({ page: 75 }, doc.h4`Comparing SLR & MLR Regressor Est`),
      mathml.compareSLRAndMLR,
      doc.p`
        Test by running a model with and without a variable.
      `,
      text.ul(
        doc.li`If the partial effect on ŷ is 0, then β̂₂ is 0`,
        doc.li`If x₁ and x₂ are uncorrelated then δ̂₁ is 0`,
      ),
      doc.quote`
        The value of this will be more apparent when we're looking
        into omitted variable bias.
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
        doc.p`This is more less the same thing in SLR.`,
      ),
      container(
        ref({ page: 80 }, doc.h4`Random Sampling`),
        doc.p`This is more less the same thing in SLR.`,
      ),
    ),
    twoColumns(
      container(
        ref({ page: 80 }, doc.h4`No Perfect Colinearity`),
        doc.p`
          This means, of the mean independent variables
          there should not be a linear relationship between
          any 2 or more independent variable. This isn't to
          say there can't be any correlation the independent
          variables, they just cannot be perfectly correlated.
        `,
        doc.quote.of(doc.p`
          This can happen when one variable is just
          a multiple of another variable.
        `),
      ),
      container(
        ref({ page: 82 }, doc.h4`Zero Conditional Mean`),
        mathml.assumptions.mlr4,
        doc.p`
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
      doc.p`
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
  doc.p`
    The long and short of this is, it doesn't matter and you're fine if you
    have irrelevant variables, ultimately they end up with a coefficient of
    zero and will have no effect.
  `,
  clsRef({ lec: { id: [3, 'M'], slide: 12 } }, todo({}, 'document the role of MLR 3')),
  container(
    clsRef({ lec: { id: [3, 'M'],  slide: 8 } }, doc.h4`Explaination`),
    text.ul(
      doc.li`Say you make a model ${text.ul(
        doc.li.of(doc.b`Y = θ0 + θ1*X1 + θ2*X2 + θ3*X3 + V`),
      )}`,
      doc.li`Say the True model is ${text.ul(
        doc.li.of(doc.b`Y = B0 + B1*X1 + B2*X2 + U`),
      )}`,
      doc.li`At the very least there won't be a bias${text.ul(
        doc.li`E(U|X1,X2) = 0 => E(V|X1,X2,X3)`,
        doc.li`X3 is irrelevant: θ3 = 0`,
      )}`,
    ),
  ),
));

export const expectedOLSEstimatorsOmittedVariableBias = createDoc(() => dashbox(
  clsRef({ book: { page: 84, chapter: 3}, lec: { id: [3, 'M'], slide: 3 } }, doc.h3`Omitted Variable Bias`),
  twoThree(
    container(
      doc.p`
        Now this is actually a problem, and something we should avoid. It can
        lead to a litany of issues. Some include biased estimators which either
        under estimate or overestimate the effect of the specified regressors
        (especially when there's some level of correlation with the omitted regressor).
      `,
      doc.p`
        The earlier section on ${doc.b`Comparing SLR & MLR regressors
        Estimates`} explain some concepts used in this section (such as
        β̃₁ or δ̃₁).
      `,
    ),
    infobox({ title: 'Nomenclature' }).of(
      doc.p`This is also called:`,
      text.ul(
        doc.li`Excluding a relevant variable`,
        doc.li`underspecifying the model`,
      ),
      doc.p`
        Deriving the Bias caused from an important
        missing variable is called
        ${doc.b`misspecification analysis`}.
      `,
    ),
  ),
  container(
    doc.h4`Determining Bias`,
    responsiveGridAutoRow([
      mathml.size2MLR.regression,
      mathml.size2MLR.missing,
    ], { columns: { desktop: 'auto auto' } }),
    twoThree(
      container(
        doc.p`
          Say the true population model (on the left) has x₁ and
          x₂ but you unknowning omit x² and end up on the model on
          the right. Eventually you find out this was the case and
          recreate your model, but you want to measure how wrong the
          earlier model was, well reusing the SLR/MLR comparison logic
          shown on the right you can solve for δ̃₁.
        `,
        doc.p`
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
    doc.p`
      Measuring Omitted Bias is more difficult the more variables. The
      omission of an important variable will lead to bias in any variable
      it has any meaningful correlation with.
    `,
  ),
));

export const expectedOLSEstimatorsVariance = createDoc(() => container(
  infobox({ title: 'What is J?' }).of(
    doc.p`
      When we see a J subscript it generally referrs to the Jth
      random variable (of a model or dataset). J is choose to
      differiate from I which is typically used to denote an
      observations.
    `,
    doc.p.of(doc.b`In summmary:`),
    text.ul(
      doc.li`N denotes the size of a sample or population`,
      doc.li`K denotes the number of variables in a dataset or model`,
      doc.li`I subscript denotes observation, e.g. observation № I out N`,
      doc.li`J subscript denotes variables, e.g. variable № J out K`,
    ),
  ),
  dashbox(
    clsRef({ book: { chapter: 3, page: 88 }, lec: { id: [3, 'M'], slide: 14 } }, doc.h3`Variance of OLS Estimators`),
    twoColumns(
      container(
        doc.h4`Homoskedasticity`,
        mathml.assumptions.mlr5,
        doc.p`
          Homoskedasticity is present when the variance for expected value for
          the error term does not change with any of the independent variables.
        `,
      ),
      container(
        doc.h4`Other MLR assumptions`,
        mathml.assumptions.mlr1234,
        doc.p`Reminder of other MLR assumptions.`,
      ),
    ),
    container(
      container(
        doc.h3`Sampling Variance of estimators`,
        doc.p`
          When MLR 1, 2, 3, 4, 5 hold the variance of the
          sampling estimators should resemble something
          like this.
        `,
        mathml.samplingVarianceOfEstimators,
      ),
      clsRef({ lec: { id: [3, 'M'], slide: 15 } }, noteOn('Var(βᵢ)')(
        'decreases with SSTᵢ',
      )),
      clsRef({ book: { chapter: 3, page: 89 }, lec: { id: [3, 'M'], slide: 16 } }, doc.h3`Multicollinearity`),
      mathml.samplingVarianceOfEstimators,
      twoColumns(
        container(
          doc.h4`The Error Variance, σ${doc.sup`2`}`,
          doc.p`
            From the above equation ${doc.b`a large σ²`} means ${doc.b`larger sampling variances`}
            for the OLS Estimators. Which ${doc.b`put another way means more noise`}.
          `,
          doc.p`
            ${doc.b`Note`}, because σ² is a population feature it has nothing to do with
            the sample size. ${doc.b`It is an unknown component`}.
          `,
        ),
        container(
          doc.h4`Total Sample Variance in , x${doc.sub`j`}, SST${doc.sub`j`}`,
          doc.p`
            Inversely from the same equation we can derive the idea
            that the larger the ${doc.b`SST${doc.b`j`}`} the smaller
            the variance. I mean take any fraction leave the
            nominator as is and increase the denominator and watch
            the resulting value decrease. However ${doc.b`we want to
            the variance to be as large as possible`}.
          `,
          doc.p`
            The one way we can ensure this is as large as possible is
            by increasing the size of the sample.
          `,
        ),
      ),
      container(
        doc.h4`The linear relationship amoung the independent variables , R${doc.sub`j`}${doc.sup`2`}`,
        twoThree(
          container(
            text.ul(
              doc.li`Obtaining ${vars.RJ}, ${text.ul(
                doc.li`Given a model explain y from K independent variables`,
                doc.li`Create a new model to explain the Jth independent variable using the remaining variables`,
                doc.li`Compute the ${vars.R2} for that model`,
                doc.li`${vars.RJ} does not appear in SLR, due to need for additional variables`,
              )}`,
              doc.li`Understanding ${vars.RJ}, ${text.ul(
                doc.li`Given a model explain y from 2 independent variables`,
                doc.li`Compute the R₂² (${vars.RJ} of x₂), with this regression:${text.ul(
                  doc.li`x₂ = β₀ + β₁x₁ + u`,
                )}`,
                doc.li`A value of R₂² close to 1 means:${text.ul(
                  doc.li`Most of the variance in x₂ is explained by x₁`,
                  doc.li`x₂ and x₁ are highly correlated.`,
                )}`,
                doc.li`As R₂² gets closer to 1 Var(β̂₂) gets larger:${text.ul(
                  doc.li`This suggests a high degree of linearity between x₁ and x₂`,
                  doc.li`This describes multicollinearity`,
                )}`,
              )}`,
            ),
            doc.p`
              Note a case where R₂² gets close to 1, ${doc.b`is not a violation of MLR 1`}
            `,
          ),
          INFOBOX.rSquaredJ,
        ),
        doc.p`
          Multicolinearity is clearly an observable trait and it can be a
          problem but it doesn't violate ${doc.b`NONE`} of our assumptions.
          While the extent of the problem is difficult to define all other
          things being equal it is better to have less correlation between
          x${doc.b`j`}
        `,
        dashbox(doc.details.of(
          doc.summary`Thought bubble — multicolinearity subtraction`,
          doc.br(),
          container(
            doc.p`
              I wonder if there is a practise where variables with high multicolinearity get
              trimmed by the portion of their value explainable by other variables (leaving
              the residual) and using that as a parameter in the model. I guess in order to
              do that you would need to be fairly confindent in the this multicolinearity
              relationship, as you'd be:
            `,
            text.ul(
              doc.li`estimating (predicted y) values`,
              doc.li`based on an estimate (coefficent on the residual)`,
              doc.li`derived from an estimation (xⱼ residual)`,
              doc.li`derived from estimations (estimated xⱼ)`,
              doc.li`from an estimation (estimated coefficent for the model to explain xⱼ with the other independent variables)`,
            ),
            doc.p`
              This sounds like alot of assumptions based on
              the accuracy of the estimates. But it would look
              like this:
            `,
            mathml.thoughtExperiment,
            doc.hr(),
            doc.p`
              Note all of this done to cancel out multicolinearity while
              retaining the portion of xⱼ that explains y. However if most
              or all values of xⱼ end up being 0 maybe it should be omitted
              from the model.
            `,
            doc.hr(),
            doc.p`
              What if instead of subtracting the fitted value
              we replace x₂ with a function call x₂ which returns
              a probability density function and the regression
              that returning a probability density function (or
              distribution of values). Let me explain.
            `,
            doc.quote.of(doc.p`
              ŷ :: (x₁, x₂, ..., xₖ) -> Pdf
            `),
            doc.p`
              I don't know I just feel like it could be cool to
              handle probability density functions like numbers
              compose them, etc, etc.
            `,
          ),
        )),
      ),
    ),
    container(
      ref({ page: 92 }, doc.h4`Variance inflation factor (VIF)`),
      responsiveGridAutoRow([
        mathml.varianceBiasComparison.vif,
        mathml.varianceBiasComparison.var,
      ], { columns: { desktop: 'auto auto' } }),
      todo({}, 'write about this and explain its utility'),
    ),
  ),
));

export const varianceInMisspecifedModels = createDoc(() => dashbox(
  container(
    ref({ page: 92 }, doc.h3`Variance in Misspecfied Models`),
    doc.p`
      ${doc.b`How do you decide between omitting or including a variable?`}
      Ultimately it's a trade off between bias and variance. Say we have
      a population model, an exhaustive model and a model that omitts
      a variable. And we are trying to decide if we should include or
      omit this other variable.
    `,
    responsiveGridAutoRow([
      mathml.size2MLR.regression,
      mathml.size2MLR.estimate,
      mathml.size2MLR.missing,
    ], { columns: { desktop: 'auto auto auto' } }),
    doc.p`
      If bias was the only criteria we were selecting model by
      well we'd go with the exhaustive model, however we will
      weigh up the cost of inclusion when there's high multicolinearity
      and compare by variance.
    `,
    responsiveGridAutoRow([
      mathml.varianceBiasComparison.var,
      mathml.varianceBiasComparison.biasBeta1,
    ], { columns: { desktop: 'auto auto' } }),
    text.ul(
      doc.li`When β₂ = 0, β̃₁ and β̂₁ are both is unbiased and Var(β̃₁) < Var(β̂₁) ${text.ul(
        doc.li`In this case β̃₁ is preferable`,
      )}`,
      doc.li`When β₂ ≠ 0, β̃₁ is biased, β̂₁ is unbiased and Var(β̃₁) < Var(β̂₁) ${text.ul(
        doc.li`Resolving this scenario is less obvious`,
        doc.li`However as the sample size grows ${text.ul(
          doc.li`The bias in β̃₁ does not shrink, nor does it really follow any pattern`,
          doc.li`However both Var(β̃₁) and Var(β̂₁) will converge to zero`,
          doc.li`The size of error term will increase`,
        )}`,
      )}`,
    ),
  ),
));

export const estimatingStandardErrorOfOLSEstimators = createDoc(() => dashbox(
  container(
    ref({ page: 94 }, doc.h3`Estimating σ²: Standard Errors of the OLS Estimators`),
    responsiveGridAutoRow([
      mathml.standardError.estimateStdDevivation,
      mathml.standardError.se,
    ], { columns: { desktop: 'auto auto' } }),
    doc.p`
      These standard errors are only valid if there is
      no presense of heteroskedasticity.
    `,
  ),
));

export const efficiencyOfOLS = createDoc(() => dashbox(
  container(
    doc.h2`Efficiency of OLS: The Gauss-Markov Theorem`,
    todo({}, 'reread textbook'),
  ),
));

export const other = createDoc(() => dashbox(
  doc.h2`Other`,
  container(
    clsRef({ lec: { id: [3, 'M'], slide: 13 } }, doc.h4`Exogenous And Endogenous Variables`),
    note(
      doc.li`Exogenous: ${text.ul(
        doc.li`These are characterised by uncorrelatled variables`,
        doc.li`Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) = 0`,
      )}`,
      doc.li`Endogenous: ${text.ul(
        doc.li`These are characterised by correlated variables E(U|X0...Xn) = 0`,
        doc.li`Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) ≠ 0`,
      )}`,
    ),
  ),
  container(
    clsRef({ lec: { id: [3, 'M'], slide: 13 } }, doc.h4`Endogenous Vs Exogenous`),
    note(
      doc.li`Exogenous${text.ul(
        doc.li`These are characterised by uncorrelatled variables`,
        doc.li`Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) = 0`,
      )}`,
      doc.li`Endogenous${text.ul(
        doc.li`These are characterised by correlated variables E(U|X0...Xn) = 0`,
        doc.li`Where Z is the variable E(U|X0...Xn) = E(Z|X0...Xn) ≠ 0`,
      )}`,
    ),
  ),
));

export const beyondTheScope = createDoc(() => dashbox(
  doc.h2`Beyond the Scope of all this`,
  doc.p`
    For my own sake I am want to document a few things.
  `,
  columns('even-2', [
    doc.h3`Logit Models`,
    doc.p`You can ${LINKS.yt.logitModels.t`watch a video on this here`}.`,
    doc.h4`Why its useful`,
    doc.p`
      It seems to be useful for modeling the probabiliy of a
      categorical dependent variable. In this video includes
      the odds of a car being sold.
    `,
    mathml.beyondTheScope.logitModel,
  ], [
    doc.h3`Rnd-Eff Models for Longitudinal Data`,
    doc.p`
      You can ${LINKS.yt.mixedEffects.t`watch a video on this here`}, and read
      a paper on its applications ${LINKS.papers.randomEffectsModels.t`here`}.
    `,
    doc.h4`Why its useful`,
    doc.p`
      The example given in the video explains a scenario where patients in
      a trial are unlikely to end up having their appointments scheduled for
      the same time and this model helps control for this irregularity.
    `,
    mathml.beyondTheScope.randomEffectsModelForLongitudinalData,
  ]),
));
