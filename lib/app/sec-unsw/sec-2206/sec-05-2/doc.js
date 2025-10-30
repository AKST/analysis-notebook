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
          The method
        `,
        ref({ page: 267 }, doc.h4`Computing Heteroskedasticity-Robust LM Tests`),
        note(),
      ),
      doc.dl(
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
