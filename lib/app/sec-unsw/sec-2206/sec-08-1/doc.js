/**
 * @import { E, DocumentWidget, Widget } from '../../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { text, clsRef, infobox, dashbox, note, todo } = prelude.components;
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
    book: page != null ? ({ chapter: 10, page }) : undefined,
    lec: slide != null ? ({ id: [8, 'M'], slide }) : undefined,
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
        'Basic Regression Analysis with Time Series Data', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W8, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
    ),
  ),
));

export const natureOfTimeSeriesData = createDoc(() => container(
  ref({ page: 334 }, doc.h2`The Nature of Time Series Data`),
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

export const examplesOfTimeSeriesModels = createDoc(() => container(
  ref({ page: 335 }, doc.h2`Examples of Time Series Regression Models`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 336 }, doc.h4`Static Models`),
        note(),
        ref({ page: 336 }, doc.h4`Finite Distributed Lag Models`),
        note(),
        ref({ page: 338 }, doc.h4`A Convention about the Time Index`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const finiteSamplePropertiesOLS = createDoc(() => container(
  ref({ page: 339 }, doc.h2`Finite Sample Properties of OLS under Classical Assumptions`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 339 }, doc.h4`Unbiasedness of OLS`),
        note(),
        ref({ page: 342 }, doc.h4`The Variances of the OLS Estimators and the Gauss-Markov Theorem`),
        note(),
        ref({ page: 344 }, doc.h4`Inference under the Classical Linear Model Assumptions`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const functionalFormDummyVariables = createDoc(() => container(
  ref({ page: 345 }, doc.h2`Functional Form, Dummy Variables, and Index Numbers`),
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

export const trendsAndSeasonality = createDoc(() => container(
  ref({ page: 351 }, doc.h2`Trends and Seasonality`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 351 }, doc.h4`Characterizing Trending Time Series`),
        note(),
        ref({ page: 354 }, doc.h4`Using Trending Variables in Regression Analysis`),
        note(),
        ref({ page: 356 }, doc.h4`A Detrending Interpretation of Regressions with a Time Trend`),
        note(),
        ref({ page: 357 }, doc.h4`Computing R-Squared When the Dependent Variable Is Trending`),
        note(),
        ref({ page: 358 }, doc.h4`Seasonality`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));
