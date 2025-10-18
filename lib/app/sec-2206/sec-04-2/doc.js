/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container, responsiveGridAutoRow } = prelude.layout;
const { text, clsRef, infobox, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
};

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const w4Ref = ({ slide, page }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 6, page }) : undefined,
    lec: slide != null ? ({ id: [4, 'Th'], slide }) : undefined,
  }, item)
);

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const w5Ref = ({ slide, page }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 6, page }) : undefined,
    lec: slide != null ? ({ id: [5, 'Tu'], slide }) : undefined,
  }, item)
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
      doc.h1.of('Multiple Regression Analysis: Further Issues', doc.br(), (
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W4']]
      )),
    ),
    infobox('Resources', [
      text.ul.compact.of(
        doc.li`Chapter 6`,
      )
    ]),
  ),
));

export const dataScaling = createDoc(() => container(
  w4Ref({ page: 181 }, doc.h2`Effects of Data Scaling on OLS Statistics`),
  dashbox(
    doc.p`
      Data Scaling is the process of scaling dependent of independent
      variables on standard errors, t statistic, F statistics, and
      confindence intervals. Data scaling largely occurs for cosmetic
      purposes like a coefficient having fewer trailing zeros, without
      chaning the the measured effects.
    `,
  ),
  w4Ref({ page: 184 }, doc.h3`Beta Coefficients`),
  dashbox(
    doc.p`
      Sometimes, it is useful to obtain regression results when all
      variables involved, the dependent as well as all the independent
      variables, have been standardized. A variable is standardized in
      the sample by subtracting off its mean and dividing by its
      standard deviation (${doc.b`z score`}). This is known as
      ${doc.b`standardized coefficients`} or ${doc.b`beta coefficients`}.
    `,
    doc.p`
      The interesting thing with this is the regression coefficients
      now tell you what the effect of one standard deviations from the
      mean has on the dependent variable. This inteperation places all
      variables on equal footing and shows which variable is a more
      significant determinant.
    `,
    doc.p`
      However the largeest coefficnt doesn't tell you what is the most important coefficent.
    `,
  ),
));

export const moreOnFunctionalForm = createDoc(() => container(
  w4Ref({ page: 186 }, doc.h2`More on Functional Form`),
  dashbox(
    w4Ref({ page: 186 }, doc.h3`Logarithms`),
    mathml.functionalForms.log,
    doc.p`
      Above is a rough interpretation of how to interpret a
      log model when controlling of either the a logged
      variable or nonlogged variable. One limiation of
      using log is you can get extreme values for zero
      of negative values. Especailly when y can be zero,
      in such cases it is acceptable to use log(y+1).
    `,
    w4Ref({ page: 188 }, doc.h3`Quadaratics`),
    responsiveGridAutoRow([
      mathml.functionalForms.quadratic,
      mathml.functionalForms.quadraticTurningPoint,
    ], { columns: { desktop: 'auto auto' } }),
    doc.p`
      One motivation for using quadratic form is for modelling
      a deminishing effect. There is nothing stopping you from
      combining quadratics and logarithms.
    `,
    mathml.functionalForms.logQuadratic,
    w4Ref({ page: 186 }, doc.h3`Interaction Terms`),
    doc.p`Here's an example of an interaction term and it's marginal effects`,
    mathml.functionalForms.interactions,
    doc.p`
      Here is an example of a reparameterised model to show partial effects.
      Caution should be exercised before performing something like this, you'd
      likely want to make sure you have the population mean or a solid estimate
      reinforced with sufficiently tested hypothesises to justify the estimate.
    `,
    mathml.functionalForms.partialEffect,
    w4Ref({ page: 186 }, doc.h3`Partial Average Effects`),
    mathml.functionalForms.ape,
    todo({}, 'explain the motivation and outcome of this'),
  ),
));

export const moreOnGoodnessOfFit = createDoc(() => container(
  w5Ref({ page: 195 }, doc.h2`More on Goodness-of-Fit and Selection of Regressors`),
  dashbox(
    note(
      doc.span`Adjusted R Squared${text.ul.compact.of(
        doc.li`Can be negative`,
      )}`,
    ),
    todo({}, 'content'),
  ),
));

export const predictionAndResidualAnalysis = createDoc(() => container(
  w5Ref({ page: 201 }, doc.h2`Prediction and Residual Analysis`),
  dashbox(
    todo({}, 'content'),
  ),
));
