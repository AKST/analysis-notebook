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
    book: page != null ? ({ chapter: 18, page }) : undefined,
    lec: slide != null ? ({ id: [10, 'F'], slide }) : undefined,
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
        'Advanced Time Series Topics', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W10, Lecture 4']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
    ),
  ),
));

export const infiniteDistributedLag = createDoc(() => container(
  ref({ page: 605 }, doc.h2`Infinite Distributed Lag Models`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 607 }, doc.h4`The Geometric (or Koyck) Distributed Lag Model`),
        note(),
        ref({ page: 608 }, doc.h4`Rational Distributed Lag Models`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const testingUnitRoots = createDoc(() => container(
  ref({ page: 610 }, doc.h2`Testing for Unit Roots`),
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

export const spuriousRegression = createDoc(() => container(
  ref({ page: 614 }, doc.h2`Spurious Regression`),
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

export const cointegrationErrorCorrection = createDoc(() => container(
  ref({ page: 616 }, doc.h2`Cointegration and Error Correction Models`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 616 }, doc.h4`Cointegration`),
        note(),
        ref({ page: 620 }, doc.h4`Error Correction Models`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const forecasting = createDoc(() => container(
  ref({ page: 622 }, doc.h2`Forecasting`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 623 }, doc.h4`Types of Regression Models Used for Forecasting`),
        note(),
        ref({ page: 624 }, doc.h4`One-Step-Ahead Forecasting`),
        note(),
        ref({ page: 627 }, doc.h4`Comparing One-Step-Ahead Forecasts`),
        note(),
        ref({ page: 628 }, doc.h4`Multiple-Step-Ahead Forecasts`),
        note(),
        ref({ page: 631 }, doc.h4`Forecasting Trending, Seasonal, and Integrated Processes`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));
