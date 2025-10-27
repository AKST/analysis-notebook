
/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { responsiveGridAutoRow, twoThree, twoColumns, container } = prelude.layout;
const { text, clsRef, infobox, dashbox, todo, note } = prelude.components;
const { createDoc } = prelude.util;

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

/**
 * @type {Record<string, E.Item>}
 */
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
    twoThree(
      container(
        doc.p`Reminder this is how we define homoskedasticity`,
        text.ul(
          doc.li`Is it necessary to derive unbiased or consistent OLS esimators?${text.ul(
            doc.li`${doc.b`No`}. Provided samples are sufficiently large`,
          )}`,
          doc.li`Is it necessary when deriving variance for OLS esimators?.${text.ul(
            doc.li.of(doc.b`Yes`, '.'),
          )}`,
        ),
      ),
      container(
        mathml.homoskedasticity,
        mathml.unbiasedEstimatorUnderMlr5,
      ),
    ),
  ),
));

export const consequencesOfHeteroskedasticity = createDoc(() => container(
  ref({ page: 262 }, doc.h2`Consequences of Heteroskedasticity for OLS`),
  dashbox(
    twoThree(
      container(
        note(
          'The biggest problem is ',
        ),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const robustInference = createDoc(() => container(
  ref({ page: 263 }, doc.h2`Heteroskedasticity-Robust Inference after OLS Estimation`),
  dashbox(
    twoThree(
      container(
        note(
          'Hetetroskedastic-robust standard errors',
          doc.quote({ style: 'color: white' })`
            Here is how you run in STATA${doc.br()}
            ${doc.code`reg wage educ, robost`}
          `,
        ),
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
