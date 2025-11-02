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
    white1980: text.a({ href: 'https://www.jstor.org/stable/1912934' }),
    huber1967: text.a({ href: 'https://projecteuclid.org/proceedings/berkeley-symposium-on-mathematical-statistics-and-probability/proceedings-of-the-fifth-berkeley-symposium-on-mathematical-statistics-and/Chapter/The-behavior-of-maximum-likelihood-estimates-under-nonstandard-conditions/bsmsp/1200512988' }),
    eicker1967: text.a({ href: 'https://projecteuclid.org/proceedings/berkeley-symposium-on-mathematical-statistics-and-probability/Proceedings-of-the-Fifth-Berkeley-Symposium-on-Mathematical-Statistics-and/Chapter/Limit-theorems-for-regressions-with-unequal-and-dependent-errors/bsmsp/1200512981' }),
    white1985: text.a({ href: 'https://www.sciencedirect.com/science/article/abs/pii/0304407685901587' }),
  },
  wiki: {
    convergenceTest: text.a({ href: 'https://en.wikipedia.org/wiki/Convergence_tests' }),
    rateOfConvergence: text.a({ href: 'https://en.wikipedia.org/wiki/Rate_of_convergence' }),
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
        note(),
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
        note(),
        ref({ page: 271 }, doc.h4`The White Test for Heteroskedasticity`),
        note(),
      ),
      doc.dl(
      ),
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
