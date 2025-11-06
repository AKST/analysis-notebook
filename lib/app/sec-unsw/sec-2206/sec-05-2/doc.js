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
      ['h1', [
        'Introduction to Heteroskedasticity', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W5, Lecture 2']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`Chapter 8 of the text book`,
      text.ul(
        doc.li.of(LINKS.wiki.breuschPaganTest`Breush Pagan Test`),
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
          doc.li`${doc.b`SSR/n`} consistently estimates ${doc.b`𝜎${doc.sub`u`}${doc.sup`2`}`}`,
          doc.li`${doc.b`SST/n`} consistently estimates ${doc.b`𝜎${doc.sub`y`}${doc.sup`2`}`}`,
          doc.li`
            ${doc.b`OLS estimators`} will continue to be consistent and unbias
            provided the sample size is sufficiently large.
          `,
          doc.li`
            ${doc.b`R²`} and ${doc.b`R̄²`} will continue to be consistent estimators of
            the population R².
          `,
        ),
      ),
      container(
        doc.h4`❌ Not okay with Heteroskedasticity`,
        text.ul(
          doc.li`${doc.b`Var(𝛽̂ⱼ)`}, due to biased estimator.`,
          doc.li`${doc.b`SE(𝛽̂ⱼ)`}, because we can't estimate ${doc.b`Var(𝛽̂ⱼ)`}`,
          doc.li`Therefore we can't perform${text.ul({ style: '--fontsize-body-m: 10px' })(
            doc.li`${doc.b.of(doc.b`T tests`)}${text.ul(
              doc.li`Our t distributions will not be t distributions.`,
            )}`,
            doc.li`${doc.b.of(doc.b`F tests`)}${text.ul(
              doc.li`Our F distributions will not be F distributions.`,
            )}`,
            doc.li`${doc.b.of(doc.b`LM statistic`)}${text.ul(
              doc.li`We won't have asympototic 𝜒² distribution.`,
            )}`,
          )}`,
        ),
      ),
    ),
    twoThree(
      container(
        doc.p`
          The ${doc.b`Gauss-Markov Theorem`} says that OLS is
          the best linear unbiased estimators, relies on the
          homoskedasticity assumption. If ${doc.b`Var(x|u)`}
          is not constant then OLS is no longer ${doc.b`BLUE`}.
          Nor is OLS ${doc.b`asymptotically efficient`}.
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
    doc.quote`
      Run the following in STATA for robust standard errors ${(
        doc.b.of(doc.i`reg wage educ, robost`)
      )}.
    `,
    twoThree(
      container(
        doc.p`
          In the last 2 decades a variety of methods have been developed to
          allow used use of OLS in the presense of ${doc.b`Heteroskedasticity
          of unknown form`}s.

          We call these methods ${doc.b`Heteroskedasticity-robust`} prodecures,
          and they allow ust ot obtain an estimate of the standard error, which
          we'll call the
          ${doc.b.of(doc.b`Heteroskedasticity-robust standard error`)} (HRSE).
          Effectively what this means is we can continue to use our previous
          methods once we swap out the the standard error for the HRSE. Including:
        `,
        text.ul(
          doc.li`F Statitic for the F Test`,
          doc.li`t statitic for the t test`,
          doc.li`LM statistic for ${doc.font({ color: 'red' })`unknown todo`}`,
        ),
        doc.h4`Deriving Heteroskedastic Robost SE`,
        mathml.heteroskedasticRobostSENotes.exampleModel,
        doc.p`
          The definition of the Heteroskedastic Robost places
          emphasis on the use of residuals, so its worth taking
          note to the ${doc.b`i`} subscript in the model above.
          Also note this definition of variance:
        `,
        mathml.heteroskedasticRobostSENotes.varianceUnderHeteroskedasticity,
        doc.p`
          Note the ${doc.b`i`} subscript on ${doc.b`𝜎²`}, also note the
          definition of the estimator does not change.
        `,
        mathml.heteroskedasticRobostSENotes.estimateBeta1,
        doc.p`
          What will have to change is our estimation of variance of
          𝛽̂₁ (for reasons explained on the right). We will swap 𝜎² for
          𝜎ᵢ².
        `,
        mathml.heteroskedasticRobostSENotes.withHetro.slr,
        doc.p`
          And for multiple regresssion we swap out SST${doc.sub`x`}
          for SSR${doc.sub`j`}.
        `,
        mathml.heteroskedasticRobostSENotes.withHetro.mlr,
        doc.p`
          The details of all this are expanded upon within the
          ${LINKS.paper.white1980`1980 paper by white`}. But from
          here we can start constructing 95 CI's and T statistics,
          because now we have a ${doc.b.of(doc.b`Heteroskedastic
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
        text.ol({ itemSpace: 'sparse' })(
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
            distributed approximately as 𝜒${doc.sub`q`}².
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
        infobox({ title: 'Reading List' })(
          text.ul(
            doc.li.of(LINKS.paper.white1980`White 1980`),
            doc.li.of(LINKS.paper.huber1967`Huber 1967`),
            doc.li.of(LINKS.paper.eicker1967`Eicker 1967`),
            doc.li.of(LINKS.paper.white1985`MacKinnon and White 1985`),
          ),
        ),
        infobox({ title: 'Convergence' })(
           doc.p`Read later`,
           text.ul(
            doc.li.of(LINKS.wiki.convergenceTest`Convergence Test`),
            doc.li.of(LINKS.wiki.rateOfConvergence`Rate of Convergence`),
          ),
        ),
        doc.h4`Problems with earlier Std Variance`,
        doc.div({ className: 'container', style: '--fontsize-body-m: 10px' }).of(
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
        doc.div({ className: 'container', style: '--fontsize-body-m: 10px' }).of(
          doc.h4`Convergence Property of Var(𝛽̂₁)`,
          mathml.heteroskedasticRobostSENotes.withHetro.convergence,
        ),
        doc.div({ className: 'container', style: '--fontsize-body-m: 10px' }).of(
          doc.h4`What is r̂ᵢⱼ?`,
          mathml.heteroskedasticRobostSENotes.withHetro.expr,
        ),
        infobox({ title: 'HRSE DF correction' }).of(
          doc.p`
            Sometimes before applying the square root in
            the HRSE the estimated variance is multiplied by
            the following:
          `,
          mathml.heteroskedasticRobostSENotes.correction,
        ),
        infobox({ title: 'SSRⱼ' }).of(
          mathml.heteroskedasticRobostSENotes.ssrj,
          doc.p`
            SSTⱼ is just sum of squares of xⱼ and Rⱼ²
            is the R² from regressing xⱼ on all other
            explainatory variables.
          `,
        ),
        infobox({ title: 'MultiColinearity in HRSE' }).of(
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
        doc.quote`
          This section describes tests for detecting Heteroskedasticity.
        `,
        doc.p`
          There's a need to explictly test and confirm the presense
          of heteroskedasticity. When you you report standard errors, when
          you report robust standard errors, there'll be an expectation to
          comment on whether heteroskedasticity is present or any analysis
          was undertaken. ${doc.b`Secondly, OLS estimators are no longer
          the BLUE estimators`}. However when the nature of heteroskadascity
          is known it's possible to obtain better estimators than the ones
          provided by OLS.
        `,
      ),
      container(
        infobox({ title: "Exam note" })(doc.p`It is expected to be perform this from memory in the exam.`),
        infobox({ title: "Distribution of u²/𝜎²" })(
          doc.p`
            Apparently when u is normally distributed
            u²/𝜎² as a distribution of 𝜒².
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
      doc.quote`We assume all other MLR assumptions to hold`,
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
          must test whether ${doc.b`u${doc.sup`2`}`} is related to
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
            Under our null hypothesis we can assume ${doc.b`v`} is
            independent of all the other explanatory variables. We
            can test these assumptions using either a F or LM
            statistic for overal signficance of the independent
            variables in explaning ${doc.b`u${doc.sup`2`}`}.
          `,
        ),
        infobox({ title: 'Koenker (1981)' })(
          doc.p`
            ${LINKS.paper.koenker1981`Koenker (1981)`} suggests
            the form shown below for for the lm statistic. Although
            in the original ${LINKS.paper.pagan1979`Breusch and
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
              asymptotically as ${doc.b`𝜒ₖ²`}.
            `,
          ),
        ),
        infobox({ title: 'Testing specfic Variables' })(
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
    container(
      ref({ page: 271 }, doc.h4`The White Test for Heteroskedasticity`),
      doc.p`
        The ${LINKS.paper.white1980`white`} test, takes a different approach
        and its based on the fact there is a weaker assumption that
        can be swapped out for the one used in Breucsh Pagan test.
        That being ${doc.b`u²`} is uncorrelated with all the
        independent variables (${doc.b`xⱼ`}), their squares
        (${doc.b`xⱼ²`}) and their cross product (which we'll call
        our auxillary model).
      `,
      mathml.white1980.models,
      doc.quote`Our null hypothesis is all the coefficients are 0.`,
      doc.p`
        Above is only a case when we have 3 independent variables,
        however this quickly gets out of hand and risks exhausting
        degrees of freedom. Forunately there is a simpler version
        of this same Auxiliary Model (which works for any number
        of random variables), written like so:
      `,
      mathml.white1980.simplified,
      twoThree(
        container(
          doc.quote`Note above we are using fitted values`,
          doc.p`
            Our Null hypothesis is this, and we can use either a
            F or LM statitic to test it.
          `,
        ),
        mathml.white1980.null,
      ),
      doc.quote`
        One important note, even when testing for heteroskedascity
        we must still maintain and uphold MLR assumption 1 through
        to 4.
      `,
    ),
  ),
));

export const weightedLeastSquares = createDoc(() => container(
  ref({ page: 273 }, doc.h2`Weighted Least Squares Estimation`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 273 }, doc.h4`The Heteroskedasticity Is Known up to a Multiplicative Constant`),
        note(),
        ref({ page: 278 }, doc.h4`The Heteroskedasticity Function Must Be Estimated: Feasible GLS`),
        note(),
        ref({ page: 281 }, doc.h4`What If the Assumed Heteroskedasticity Function Is Wrong?`),
        note(),
        ref({ page: 283 }, doc.h4`Prediction and Prediction Intervals with Heteroskedasticity`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const lpmRevisited = createDoc(() => container(
  ref({ page: 284 }, doc.h2`The Linear Probability Model Revisited`),
  dashbox(
    twoThree(
      container(
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));
