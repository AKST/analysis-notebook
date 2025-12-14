/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { twoColumns, twoThree, container } from '@prelude-uni/layout.js';
import { text, clsRef, infobox, dashbox, note, todo } from '@prelude-uni/components.js';
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
    book: page != null ? ({ chapter: 15, page }) : undefined,
    lec: slide != null ? ({ id: [10, 'M'], slide }) : undefined,
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
        'Instrumental Variables Estimation and Two-Stage Least Squares', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W10, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' }).of(
      doc.p`See here for resources relating to the lesson`,
    ),
  ),
));

export const motivationOmittedVariables = createDoc(() => container(
  ref({ page: 496 }, doc.h2`Motivation: Omitted Variables in a Simple Regression Model`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 500 }, doc.h4`Statistical Inference with the IV Estimator`),
        note(),
        ref({ page: 503 }, doc.h4`Properties of IV with a Poor Instrumental Variable`),
        note(),
        ref({ page: 505 }, doc.h4`Computing R-Squared after IV Estimation`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const ivEstimationMultipleRegression = createDoc(() => container(
  ref({ page: 505 }, doc.h2`IV Estimation of the Multiple Regression Model`),
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

export const twoStageLeastSquares = createDoc(() => container(
  ref({ page: 509 }, doc.h2`Two-Stage Least Squares`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 509 }, doc.h4`A Single Endogenous Explanatory Variable`),
        note(),
        ref({ page: 511 }, doc.h4`Multicollinearity and 2SLS`),
        note(),
        ref({ page: 512 }, doc.h4`Detecting Weak Instruments`),
        note(),
        ref({ page: 513 }, doc.h4`Multiple Endogenous Explanatory Variables`),
        note(),
        ref({ page: 513 }, doc.h4`Testing Multiple Hypotheses after 2SLS Estimation`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const ivSolutionsErrorsInVariables = createDoc(() => container(
  ref({ page: 514 }, doc.h2`IV Solutions to Errors-in-Variables Problems`),
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

export const testingEndogeneityOveridentifying = createDoc(() => container(
  ref({ page: 515 }, doc.h2`Testing for Endogeneity and Testing Overidentifying Restrictions`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 515 }, doc.h4`Testing for Endogeneity`),
        note(),
        ref({ page: 516 }, doc.h4`Testing Overidentification Restrictions`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const twoSlsHeteroskedasticity = createDoc(() => container(
  ref({ page: 518 }, doc.h2`2SLS with Heteroskedasticity`),
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

export const applying2slsTimeSeries = createDoc(() => container(
  ref({ page: 519 }, doc.h2`Applying 2SLS to Time Series Equations`),
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

export const applying2slsPooledPanel = createDoc(() => container(
  ref({ page: 521 }, doc.h2`Applying 2SLS to Pooled Cross Sections and Panel Data`),
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
