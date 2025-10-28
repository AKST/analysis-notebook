/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
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
    book: page != null ? ({ chapter: 9, page }) : undefined,
    lec: slide != null ? ({ id: [7, 'M'], slide }) : undefined,
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
        'More on Specification and Data Issues', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W7, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
    ),
  ),
));

export const functionalFormMisspecification = createDoc(() => container(
  ref({ page: 295 }, doc.h2`Functional Form Misspecification`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 297 }, doc.h4`RESET as a General Test for Functional Form Misspecification`),
        note(),
        ref({ page: 298 }, doc.h4`Tests against Nonnested Alternatives`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const usingProxyVariables = createDoc(() => container(
  ref({ page: 299 }, doc.h2`Using Proxy Variables for Unobserved Explanatory Variables`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 303 }, doc.h4`Using Lagged Dependent Variables as Proxy Variables`),
        note(),
        ref({ page: 304 }, doc.h4`A Different Slant on Multiple Regression`),
        note(),
        ref({ page: 305 }, doc.h4`Potential Outcomes and Proxy Variables`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const modelsWithRandomSlopes = createDoc(() => container(
  ref({ page: 306 }, doc.h2`Models with Random Slopes`),
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

export const olsUnderMeasurementError = createDoc(() => container(
  ref({ page: 308 }, doc.h2`Properties of OLS under Measurement Error`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 308 }, doc.h4`Measurement Error in the Dependent Variable`),
        note(),
        ref({ page: 310 }, doc.h4`Measurement Error in an Explanatory Variable`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const missingDataAndOutliers = createDoc(() => container(
  ref({ page: 313 }, doc.h2`Missing Data, Nonrandom Samples, and Outlying Observations`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 313 }, doc.h4`Missing Data`),
        note(),
        ref({ page: 315 }, doc.h4`Nonrandom Samples`),
        note(),
        ref({ page: 317 }, doc.h4`Outliers and Influential Observations`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const leastAbsoluteDeviations = createDoc(() => container(
  ref({ page: 321 }, doc.h2`Least Absolute Deviations Estimation`),
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
