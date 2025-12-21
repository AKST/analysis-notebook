/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { responsiveGridAutoRow, twoThree, twoColumns, container } from '@prelude-uni/layout.js';
import { text, clsRef, infobox, dashbox, todo, note } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page, slide }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 8, page }) : undefined,
    lec: slide != null ? ({ id: [6, 'M'], slide }) : undefined,
  }, item)
);

const LINKS = {
  paper: {
    pagan1979: text.a({ href: 'https://www.jstor.org/stable/1911963' }),
    white1980: text.a({ href: 'https://www.jstor.org/stable/1912934' }),
    huber1967: text.a({ href: 'https://projecteuclid.org/proceedings/berkeley-symposium-on-mathematical-statistics-and-probability/proceedings-of-the-fifth-berkeley-symposium-on-mathematical-statistics-and/Chapter/The-behavior-of-maximum-likelihood-estimates-under-nonstandard-conditions/bsmsp/1200512988' }),
    eicker1967: text.a({ href: 'https://projecteuclid.org/proceedings/berkeley-symposium-on-mathematical-statistics-and-probability/Proceedings-of-the-Fifth-Berkeley-Symposium-on-Mathematical-Statistics-and/Chapter/Limit-theorems-for-regressions-with-unequal-and-dependent-errors/bsmsp/1200512981' }),
    koenker1981: text.a({ href: 'https://www.jstor.org/stable/1912528' }),
    white1985: text.a({ href: 'https://www.sciencedirect.com/science/article/abs/pii/0304407685901587' }),
  },
  wiki: {
    convergenceTest: text.a({ href: 'https://en.wikipedia.org/wiki/Convergence_tests' }),
    rateOfConvergence: text.a({ href: 'https://en.wikipedia.org/wiki/Rate_of_convergence' }),
    /*
     * A test you can do to test for heteroskadascity
     */
    breuschPaganTest: text.a({ href: 'https://en.wikipedia.org/wiki/Breusch–Pagan_test' }),
  },
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
      doc.h1`
        Introduction to Heteroskedasticity${doc.br()}
        ${doc.small({ style: 'color: #aaaaff' }).t`ECON2206, W5, Lecture 2`}
      `,
    ),
    infobox({ title: 'Resources' }).c(
      doc.p`Chapter 8 of the text book`,
      text.ul(
        doc.li.c(LINKS.wiki.breuschPaganTest.t`Breush Pagan Test`),
      ),
    ),
  ),
  doc.h2`Introduction`,
  dashbox(
    doc.p`Reminder this is how we define homoskedasticity and variance under MLR 5`,
    twoColumns(mathml.homoskedasticity, mathml.unbiasedEstimatorUnderMlr5),
  ),
));

export const consequencesOfHeteroskedasticity = createDoc(() => container(
  ref({ page: 262 }, doc.h2`Consequences of Heteroskedasticity for OLS`),
  dashbox(
    twoColumns(
      container(
        doc.h4`✅ Okay with Heteroskedasticity`,
        text.ul(
          doc.li`${text.b`SSR/n`} consistently estimates ${text.b`σ${doc.sub`u`}${doc.sup`2`}`}`,
          doc.li`${text.b`SST/n`} consistently estimates ${text.b`σ${doc.sub`y`}${doc.sup`2`}`}`,
          doc.li`
            ${text.b`OLS estimators`} will continue to be consistent and unbias
            provided the sample size is sufficiently large.
          `,
          doc.li`
            ${text.b`R²`} and ${text.b`R̄²`} will continue to be consistent estimators of
            the population R².
          `,
        ),
      ),
      container(
        doc.h4`❌ Not okay with Heteroskedasticity`,
        text.ul(
          doc.li`${text.b`Var(β̂ⱼ)`}, due to biased estimator.`,
          doc.li`${text.b`SE(β̂ⱼ)`}, because we can't estimate ${text.b`Var(β̂ⱼ)`}`,
          doc.li`Therefore we can't perform${text.ul({ style: '--fontsize-body-m: 10px' }).c(
            doc.li`${text.b.c(text.b`T tests`)}${text.ul(
              doc.li`Our t distributions will not be t distributions.`,
            )}`,
            doc.li`${text.b.c(text.b`F tests`)}${text.ul(
              doc.li`Our F distributions will not be F distributions.`,
            )}`,
            doc.li`${text.b.c(text.b`LM statistic`)}${text.ul(
              doc.li`We won't have asympototic χ² distribution.`,
            )}`,
          )}`,
        ),
      ),
    ),
    twoThree(
      container(
        doc.p`
          The ${text.b`Gauss-Markov Theorem`} says that OLS is
          the best linear unbiased estimators, relies on the
          homoskedasticity assumption. If ${text.b`Var(x|u)`}
          is not constant then OLS is no longer ${text.b`BLUE`}.
          Nor is OLS ${text.b`asymptotically efficient`}.
        `,
      ),
      doc.dl(
        doc.dt`BLUE`,
        doc.dd`Best Linear unbiased Estimators`,
      ),
    ),
    doc.p`
      With large enough sample sizes it might not be too
      important to obtain an efficient estimator. That
      said not all is lost, there are methods to allow us
      to continue performing asymptotically valid tests.
    `,
  ),
));

export const robustInference = createDoc(() => container(
  ref({ page: 263 }, doc.h2`Heteroskedasticity-Robust Inference after OLS Estimation`),
  dashbox(
    doc.blockquote`
      Run the following in STATA for robust standard errors ${(
        text.b.c(text.i`reg wage educ, robost`)
      )}.
    `,
    twoThree(
      container(
        doc.p`
          In the last 2 decades a variety of methods have been developed to
          allow used use of OLS in the presense of ${text.b`Heteroskedasticity
          of unknown form`}s.

          We call these methods ${text.b`Heteroskedasticity-robust`} prodecures,
          and they allow ust ot obtain an estimate of the standard error, which
          we'll call the
          ${text.b.c(text.b`Heteroskedasticity-robust standard error`)} (HRSE).
          Effectively what this means is we can continue to use our previous
          methods once we swap out the the standard error for the HRSE. Including:
        `,
        text.ul(
          doc.li`F Statitic for the F Test`,
          doc.li`t statitic for the t test`,
          doc.li`LM statistic for ${doc.font({ color: 'red' }).t`unknown todo`}`,
        ),
        doc.h4`Deriving Heteroskedastic Robost SE`,
        mathml.heteroskedasticRobostSENotes.exampleModel,
        doc.p`
          The definition of the Heteroskedastic Robost places
          emphasis on the use of residuals, so its worth taking
          note to the ${text.b`i`} subscript in the model above.
          Also note this definition of variance:
        `,
        mathml.heteroskedasticRobostSENotes.varianceUnderHeteroskedasticity,
        doc.p`
          Note the ${text.b`i`} subscript on ${text.b`σ²`}, also note the
          definition of the estimator does not change.
        `,
        mathml.heteroskedasticRobostSENotes.estimateBeta1,
        doc.p`
          What will have to change is our estimation of variance of
          β̂₁ (for reasons explained on the right). We will swap σ² for
          σᵢ².
        `,
        mathml.heteroskedasticRobostSENotes.withHetro.slr,
        doc.p`
          And for multiple regresssion we swap out SST${doc.sub`x`}
          for SSR${doc.sub`j`}.
        `,
        mathml.heteroskedasticRobostSENotes.withHetro.mlr,
        doc.p`
          The details of all this are expanded upon within the
          ${LINKS.paper.white1980.t`1980 paper by white`}. But from
          here we can start constructing 95 CI's and T statistics,
          because now we have a ${text.b.c(text.b`Heteroskedastic
          Robust Standard Error`)}.
        `,
        mathml.heteroskedasticRobostSENotes.hetroRobustSE,
        doc.h4`Why ever use the Normal Standard Error?`,
        doc.p`
          With the Heteroskadacsticity Robust Standard Error, you
          might ask your self why bother with the default standard
          error. The reason why is because it's not justifiable
          until the sample size is sufficiently large.
        `,
        doc.p`
          This is evident when you look at a t test for a smaller
          sample size, the smaller the sample the larger the
          difference in distributions of a robust t distribution
          verse a normal t distribution.
        `,
        doc.h4`Chow Test`,
        doc.p`
          Given the Sum of Squared residuals form of the F
          statistic is not valid undrer heteroskedascity
          care must be taken in computing a Chow test.
        `,
        doc.p`
          What we do instead is include a dummy variable
          to distinguish between each group along with
          interactions betweeen that dummy variable and all
          other explanatory variable.
        `,
        ref({ page: 267 }, doc.h3`Heteroskedasticity-Robust LM Tests`),
        doc.p`In Summary:`,
        text.ol({ itemSpace: 'sparse' }).c(
          doc.li`Obtain the residuals ũ from the restricted model.`,
          doc.li`
            Regress each of the independent varibales excluded under
            the null on all of the included indendent variables, this
            leads to a set of residuals (r̃₁, r̃₂, ..., r̃${doc.sub`q`}).
          `,
          doc.li`Find the product of each r̃ⱼ and ũ (for all obsevations)`,
          doc.li`
            Run the regression of 1 on r̃₁ũ, r̃₂ũ ..., r̃${doc.sub`q`}ũ
            without an intercept. The heteroskedasticity-robust LM
            statistic is ${doc.u`(n - SSR₁)`}, where SSR₁ is just
            the SSR from the final regression. Under H₀, LM is
            distributed approximately as χ${doc.sub`q`}².
          `,
        ),
        doc.p`
          Once the robust LM statistic is obtained, the rejection
          rule and computation of p-values are the same as for the
          usual LM statistic
        `,
      ),
      container(
        doc.dl(
          doc.dt`Heteroskedasticity-robust SE`,
          doc.dd`
            A form of the standard error which produces robust standard errors in
            the presense of heteroskedasticity.
          `,
        ),
        infobox({ title: 'Reading List' }).c(
          text.ul(
            doc.li.c(LINKS.paper.white1980.t`White 1980`),
            doc.li.c(LINKS.paper.huber1967.t`Huber 1967`),
            doc.li.c(LINKS.paper.eicker1967.t`Eicker 1967`),
            doc.li.c(LINKS.paper.white1985.t`MacKinnon and White 1985`),
          ),
        ),
        infobox({ title: 'Convergence' }).c(
           doc.p`Read later`,
           text.ul(
            doc.li.c(LINKS.wiki.convergenceTest.t`Convergence Test`),
            doc.li.c(LINKS.wiki.rateOfConvergence.t`Rate of Convergence`),
          ),
        ),
        doc.h4`Problems with earlier Std Variance`,
        doc.div({ className: 'container', style: '--fontsize-body-m: 10px' }).c(
          mathml.heteroskedasticRobostSENotes.withHomo.general,
          doc.p`
            The problem with this formular arise from
            the nature of SST, which is defined as:
          `,
          mathml.heteroskedasticRobostSENotes.withHomo.sumOfSquares,
          doc.p`
            The reason it's a problem is it assumes uniform variance
            across all values of x, which is no longer the the case
            under hetro skadasticity.
          `,
        ),
        doc.div({ className: 'container', style: '--fontsize-body-m: 10px' }).c(
          doc.h4`Convergence Property of Var(β̂₁)`,
          mathml.heteroskedasticRobostSENotes.withHetro.convergence,
        ),
        doc.div({ className: 'container', style: '--fontsize-body-m: 10px' }).c(
          doc.h4`What is r̂ᵢⱼ?`,
          mathml.heteroskedasticRobostSENotes.withHetro.expr,
        ),
        infobox({ title: 'HRSE DF correction' }).c(
          doc.p`
            Sometimes before applying the square root in
            the HRSE the estimated variance is multiplied by
            the following:
          `,
          mathml.heteroskedasticRobostSENotes.correction,
        ),
        infobox({ title: 'SSRⱼ' }).c(
          mathml.heteroskedasticRobostSENotes.ssrj,
          doc.p`
            SSTⱼ is just sum of squares of xⱼ and Rⱼ²
            is the R² from regressing xⱼ on all other
            explainatory variables.
          `,
        ),
        infobox({ title: 'MultiColinearity in HRSE' }).c(
          doc.p`
            It's notable that MultiColinearity can cause
            the standard errors to explode under when
            computed with HRSE's.
          `,
        ),
        doc.dl(
          doc.dt`Wald statistic`,
          doc.dd`
            Heteroskedastic robust F statistic.
          `,
          doc.dt`Heteroskedastic-Robust LM Test`,
          doc.dd`
            A test which can test multiple exclusion restrictions
            in the presense of heteroskedasticity.
          `,
        ),
      ),
    ),
  ),
));

export const testingHeteroskedasticity = createDoc(() => container(
  ref({ page: 269 }, doc.h2`Testing for Heteroskedasticity`),
  dashbox(
    twoThree(
      container(
        doc.blockquote`
          This section describes tests for detecting Heteroskedasticity.
        `,
        doc.p`
          There's a need to explictly test and confirm the presense
          of heteroskedasticity. When you you report standard errors, when
          you report robust standard errors, there'll be an expectation to
          comment on whether heteroskedasticity is present or any analysis
          was undertaken. ${text.b`Secondly, OLS estimators are no longer
          the BLUE estimators`}. However when the nature of heteroskadascity
          is known it's possible to obtain better estimators than the ones
          provided by OLS.
        `,
      ),
      container(
        infobox({ title: "Exam note" }).c(doc.p`It is expected to be perform this from memory in the exam.`),
        infobox({ title: "Distribution of u²/σ²" }).c(
          doc.p`
            Apparently when u is normally distributed
            u²/σ² as a distribution of χ².
          `,
        ),
      ),
    ),
    container(
      doc.h4`Assembling a Test`,
      doc.p`
        Our test for heteroskedasticity starts with the constraint our model
        needs to hold in order for it to be homoskedastic (MLR 5), as this
        will be the basis of our null hypothesis. Naturally our alternative
        hypothesis is that our model exhibts heteroskedaticity, and like with
        alternative tests we can not accept the alternative
        hypothesis only reject the null hypothesis.
      `,
      doc.blockquote`We assume all other MLR assumptions to hold`,
      mathml.testingForHeteroskedasticity.hypothesis.null,
      doc.p`What does this mean in practise?`,
      text.ol(
        doc.li`
          Given all other assumptions hold the two above are equilivant, which
          is more than a fun piece of trivia as we use this constraint to test
          for the presence of heteroskedacity.
        `,
        doc.li`
          To test for a violation of the homoskedasticity assumption, we
          must test whether ${text.b`u${doc.sup`2`}`} is related to
          any of the explanatory variables.
        `,
      ),
      mathml.testingForHeteroskedasticity.model.uSquare,
      mathml.testingForHeteroskedasticity.model.uSquareEst,
      twoColumns(
        doc.p`
          Number 2 (from the earlier list) can be tested by running a
          regression on the following and checking if any of the estimator
          coefficents are something other than 0. More formually:
        `,
        mathml.testingForHeteroskedasticity.hypothesis.nullUSquare,
      ),
      twoThree(
        container(
          mathml.testingForHeteroskedasticity.definition.rSquaredResidualSquare,
          doc.p`
            Under our null hypothesis we can assume ${text.b`v`} is
            independent of all the other explanatory variables. We
            can test these assumptions using either a F or LM
            statistic for overal signficance of the independent
            variables in explaning ${text.b`u${doc.sup`2`}`}.
          `,
        ),
        infobox({ title: 'Koenker (1981)' }).c(
          doc.p`
            ${LINKS.paper.koenker1981.t`Koenker (1981)`} suggests
            the form shown below for for the lm statistic. Although
            in the original ${LINKS.paper.pagan1979.t`Breusch and
            Pagan 1979 paper`} suggest normally distributing the
            errors. The former is generally preferred and is more
            widely applicable.
          `,
        ),
      ),
      twoColumns(
        mathml.testingForHeteroskedasticity.lm.breucshPagan,
        mathml.testingForHeteroskedasticity.fStat.breucshPagan,
      ),
      twoThree(
        container(
          doc.p`
            We can produce either LM or F statistics based on the
            R squared from regressing our residual estimator model.
            To produce the LM statistic just times that same
            R squared by the size of the sample.
          `,
          text.ul(
            doc.li`
              To test the null hypothesis with the F statistic, just
              keep in mind the F statistic under the null hypothesis
              should have a F(k, n-k-1) distribution.
            `,
            doc.li`
              And to test with the LM statistic, we just need to keep
              in mind that under the null hypothesis LM is distributed
              asymptotically as ${text.b`χₖ²`}.
            `,
          ),
        ),
        infobox({ title: 'Testing specfic Variables' }).c(
          doc.p`
            If we want to test a handful of the independent
            variables instead of each and everyone of the
            variables from the model, this is doable. We
            instead compose our Axuiliary regression from
            those specific variables instead, and repeat
            the tests (adjusting the degrees of freedom
            to the number of variables we're testing).
          `,
        ),
      ),
      doc.p`
        If the P value is sufficently small we can reject the
        null hypothesis.
      `,
    ),
    twoThree(
      container(
        ref({ page: 271 }, doc.h4`The White Test for Heteroskedasticity`),
        doc.p`
          The ${LINKS.paper.white1980.t`white`} test, takes a different approach
          and its based on the fact there is a weaker assumption that
          can be swapped out for the one used in Breucsh Pagan test.
          That being ${text.b`u²`} is uncorrelated with all the
          independent variables (${text.b`xⱼ`}), their squares
          (${text.b`xⱼ²`}) and their cross product (which we'll call
          our auxillary model).
        `,
        mathml.white1980.models,
        doc.blockquote`Our null hypothesis is all the coefficients are 0.`,
        doc.p`
          Above is only a case when we have 3 independent variables,
          however this quickly gets out of hand and risks exhausting
          degrees of freedom. Forunately there is a simpler version
          of this same Auxiliary Model (which works for any number
          of random variables), written like so:
        `,
        mathml.white1980.simplified,
        container(
          doc.blockquote`Note above we are using fitted values`,
          doc.p`
            Our Null hypothesis is this, and we can use either a
            F or LM statitic to test it.
          `,
        ),
        mathml.white1980.null,
        doc.blockquote`
          One important note, even when testing for heteroskedascity
          we must still maintain and uphold MLR assumption 1 through
          to 4.
        `,
      ),
      container(
        doc.dl(
          doc.dt`Auxiliary Model`,
          doc.dd`
            This is not offical terminology, its just
            a means to refer to the model we create in
            addition to the actual model for the sake
            of carrying out these tests or other
            objectives. It's effectively a means to
            an ends and exists for the duration of
            pursuing that ends (like running a test).
          `,
        ),
        infobox({ title: 'White test Summary' }).c(
          text.ol(
            doc.li`Estimate the model by OLS.`,
            doc.li`Obtain û and ŷ from the OLS.`,
            doc.li`Comptued OLS û² and ŷ².`,
            doc.li`Run the Auxillary model.`,
            doc.li`Keep the R² as R${doc.sub`û²`}².`,
            doc.li`Either${text.ol(
              doc.li`An F statistic${text.ul(
                doc.li`Let df of F${doc.sub`s, n - 3`}`,
              )}`,
              doc.li`LM statistic${text.ul(
                doc.li`Get P value using χ² dist`,
              )}`,
            )}`,
          ),
        ),
      ),
    ),
  ),
));

export const weightedLeastSquares = createDoc(() => container(
  ref({ page: 273 }, doc.h2`Weighted Least Squares Estimation`),
  dashbox(
    twoThree(
      container(
        doc.p`
          While using Heteroskedasticity-Robust standard errors
          help us ignore heteroskedasticity when we understand
          the functional form and nature of heteroskedasticity
          within our model. We can get more efficient estimators
          using ${text.b`weighted least squares`}. Using WLS will
          also mean new ${text.b`t`} and ${text.b`F`} statistics
          which have their respective ${text.b`t/F distribution`}.
        `,
        ref({ page: 273 }, doc.h3`The Heteroskedasticity Is Known up to a Multiplicative Constant`),
        mathml.wls.variance.populationRandomDraw,
        doc.p`
          When talking about the form of heteroskedasticity we typically
          expresss it with syntax like ${text.b`h(x)`}, which is some
          function on the relevant explanatory variable. So if that
          explanatory variable is income then your variance could be
          written like ${text.b`σ² · income`}. In practise that means:
        `,
        text.ul(
          doc.li.c(text.b`The error is proportional to the level of income`, '.'),
          doc.li.c(text.b`As income increases, the variance increases`, '.'),
          doc.li.c(text.b`The Standard Deviation of û is conditional on income`, '.'),
        ),
        mathml.wls.variance.solveForResidualVariance,
        doc.p`
          We can solve for our a transformed variation of the
          model which satisifies all the MLR assumptions.
        `,
        mathml.wls.model.solve,
        doc.p`
          Our transformed model now satisifies all 5 Gauss Markov
          assumptions. The estimators produced are actually a
          variant of ${text.b`Generalised Least Squares`}, and they
          are the best linear unbiased estimators of the βⱼ and
          are more efficient than esimators produced under OLS.
        `,
        text.ul(
          doc.li`We can now create Standard Errors`,
          doc.li`We can now create t statistics`,
          doc.li`We can now create F statistics`,
          doc.li`etc`,
        ),
        doc.h4`Computing WLS`,
        mathml.wls.constraints.original,
        doc.p`
          Mathematically, the WLS estimators are the values of
          the bⱼ that make as small as possible. Bringing the
          square root of 1/hᵢ inside the squared residual shows
          that the weighted sum of squared residuals is identical
          to the sum of squared residuals in the transformed
          variables:
        `,
        mathml.wls.constraints.transformed,
        doc.p`How to think about weighting`,
        text.ul(
          doc.li`
            In WLS Observations are weighted by inverse sqrt hᵢ
          `,
          doc.li`
            OLS is a special case where all observations are
            given the same weight.
          `,
        ),
        doc.p`
          As you can imagine F statistics are computed from the
          weighted R². However the weighted R² is not particuarlly
          useful as a goodness of fit measure. ${text.b`Because it
          effectively measures explained variation in yᵢ* rather
          than yᵢ`} (remember we've also weighted our fitted
          values).
        `,
        todo({}, 'explain why last few pages of chapter which explian why ppl just use OLS'),
      ),
      container(
        infobox({ title: "variance under heteroskedascity" }).c(
          mathml.wls.variance.residual,
          doc.p`
            Because variance must be positive, so much the
            return value of our function h.
          `,
        ),
        doc.dl(
          doc.dt`WLS`,
          doc.dd`Weight Least Squares Estimation`,
          doc.dt`Interpreting h(x)`,
          doc.dd`
            The variance of the error is propotional
            to the level of ${text.b`x`}.
          `,
          doc.dt`GLS`,
          doc.dd`Generalised Least Squares`,
        ),
        infobox({ title: 'When to use WLS' }).c(
          doc.p`
            If you know there's heteroskedascity and the
            functional form it takes then you can use it.
            In these cases WLS is more efficient than OLS.
          `,
        ),
        infobox({ title: "WLS, Weighted by what?" }).c(
          doc.p`
            The name comes from the the fact that βⱼ*
            minimizes the weighted sum of squared residuals
            where each squared residual is weighted by 1/hᵢ
          `,
        ),
        doc.dl(
          doc.dt`Weighted SSR`,
          doc.dd`Weighted Sum of Square Residuals`,
          doc.dt`Weighted R²`,
          doc.dd`
            Weight R Squared computed from weighted SSR.
          `,
          doc.dt`(FGLS) estimator`,
          doc.dd`
            Feasible GLS estimator, sometimes called estimated GLS, or EGLS.
          `,
        ),
        infobox({ title: "WLS/FGLS different signs to OLS" }).c(
          doc.p`
            If OLS and WLS produce statistically significant
            estimates that differ in sign—for example, the OLS
            price elasticity is positive and significant, while the
            WLS price elasticity is negative and significant
            or the difference in magnitudes of the estimates is
            practically large, we should be suspicious.
            ${text.b`Typically, this indicates that one of the
            other Gauss-Markov assumptions is false`}, in
            particular the zero conditional mean assumption
            on the error.
          `,
        ),
        infobox({ title: "Functional form misspecification" }).c(
          doc.p`
            For WLS to be consistent for the βⱼ, it is not
            enough for u to be uncorrelated with each xⱼ. We need
            the stronger assumption MLR.4 in the linear model
            MLR.1. Therefore, a significant difference between
            OLS and WLS can indicate a functional form
            misspecification in E(y|x)
          `,
        ),
      ),
    ),
    container(
      ref({ page: 278 }, doc.h3`The Heteroskedasticity Function Must Be Estimated: Feasible GLS`),
      doc.p`
        In many case the exact form of heteroskedasicity is not known
        and is not obvious. Nevertheless, in many cases we can model
        the ${text.b`h`} and use the data to estimate the unknown parameters
        in this model.
      `,
      doc.p`
        One way to model heteroskedasicity it to assume it takes this form.
      `,
      mathml.fgls.assumption,
      doc.p`
        When testing for heteroskedasticity using the Breusch-Pagan test,
        we assumed that heteroskedasticity was a linear function of the xⱼ.
        Linear alternatives are fine when testing for heteroskedasticity, but
        they can be problematic when correcting for heteroskedasticity using
        weighted least squares. We have encountered the reason for this problem
        before: linear models do not ensure that predicted values are positive,
        and our estimated variances must be positive in order to perform WLS.
      `,
      doc.p`
        If the parameters δⱼ were known, then we would just apply WLS, as in
        the previous subsection. This is not very realistic. It is better to
        use the data to estimate these parameters, and then to use these
        estimates to construct weights. To estimate δⱼ, we will transform this
        equation into a linear form that, with slight modification, can be
        estimated by OLS.
      `,
      mathml.fgls.linearForm,
      doc.p`
        Assume "v"'s mean (for some reason) is equal to unity (conditional
        on all independent variables). But if we assume v is independent
        (for some reason) we can write the second line. e has a zero mean
        and is independent of x; the intercept in this equation is different
        from δ₀ (this is not important in implementing WLS). The dependent
        variable is the log of the squared error, and because it satisifies
        the Gauss-Markov assumptions, we can get unbiased estimators of δⱼ
        using OLS.
      `,
      twoColumns(
        doc.p`
          Ultimatel what we want from this regression is the fitted values
          which we'll call ${text.b`ĝᵢ`}, from here we can simply estimate
          ĥᵢ as:
        `,
        mathml.fgls.estimate,
      ),
      doc.p`
        From here we can attempt WLS. Having to estimate hi using the same
        data means that the FGLS estimator is no longer unbiased. Nevertheless,
        the FGLS estimator is consistent and asymptotically more efficient
        than OLS. We use the FGLS estimates in place of the OLS estimates
        because the FGLS estimators are more efficient and have associated
        test statistics with the usual t and F distributions, at least in
        large samples If for any reason we have doubts about the variance,
        ${text.b`we can always just use heteroskedasticity-robust standard
        errors`} and test statistics in the transformed equation.
      `,
      twoColumns(
        doc.p`
          Another option of estimating ĝᵢ is to instead use
          the fitted value ŷ and its square ŷ² in a
          regression like so:
        `,
        mathml.fgls.alternative,
      ),
      ref({ page: 281 }, doc.h3`What If the Assumed Heteroskedasticity Function Is Wrong?`),
      doc.p`
        What happens if our variance function is misspecified? Well
        provided MLR 4 holds, we don't need to worry too much about
        a misspecified h(x) introducing bias or inconsistency in our
        estimators. Provided the conditional mean assumption holds
        any function of h(x) is uncorrelated with u and by extention
        the weighted error is uncorrelated with our weighted regressors
        (at least if h(x) is positive). ${text.b`This is why, we can
        take large differences between the OLS and WLS estimators as
        indicative of functional form misspecification`}.
      `,
      doc.p`
        What are the concequences of using WLS with a misspecified
        variance function? One is that the usual WLS standard errors
        and test statistics, computed under the assumption that
        Var(y, x) = σ²h(x), are no longer valid, even in large samples.
        If this assumption is false, the standard errors (and any
        statistics obtain using the standard errors) are not valid.
      `,
      doc.p`
        Thankfully there is a simple fix, ${text.b`just as we can obtain
        standard errors for the OLS estimates that are robust to arbitrary
        heteroskedasticity, we can obtain standard errors for WLS that
        allow the variance function to be arbitrarily misspecified`}.
      `,
      doc.p`
        Even if we use flexible forms of variance functions, there is
        no guarantee that we have the correct model. Therefore, it is
        always a good idea to compute fully robust standard errors and
        test statistics after WLS estimation.
      `,
      doc.p`
        A modern criticism of WLS is that if the variance function is
        misspecified, it is not guaranteed to be more efficient than OLS.
        However, this techinically correct this critique misses an important
        point. Being in cases of strong heteroskedasticity, it is better to
        use a wrong form of heteroskedasticity and apply WLS than to ignore
        heteroskedasticity altogether and use OLS.
      `,
      ref({ page: 283 }, doc.h3`Prediction and Prediction Intervals with Heteroskedasticity`),
      todo({}, 'write about predictions'),
    ),
  ),
));

export const lpmRevisited = createDoc(() => container(
  ref({ page: 284 }, doc.h2`The Linear Probability Model Revisited`),
  dashbox(
    doc.p`
      Firstly don't waste your time on this, if you're going to use
      a Linear probabily model at all, firstly don't waste your time
      on using WLS just use OLS (if at all). Secondly there are
      significantly better models to use than either WLS or OLS.
    `,
  ),
));
