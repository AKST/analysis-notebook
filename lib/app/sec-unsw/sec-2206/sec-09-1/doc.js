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
    book: page != null ? ({ chapter: 13, page }) : undefined,
    lec: slide != null ? ({ id: [9, 'M'], slide }) : undefined,
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
        'Pooling Cross Sections across Time: Simple Panel Data Methods', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W9, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
    ),
  ),
));

export const poolingIndependentCrossSections = createDoc(() => container(
  ref({ page: 427 }, doc.h2`Pooling Independent Cross Sections across Time`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 431 }, doc.h4`The Chow Test for Structural Change across Time`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const policyAnalysisPooledCrossSections = createDoc(() => container(
  ref({ page: 431 }, doc.h2`Policy Analysis with Pooled Cross Sections`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 436 }, doc.h4`Adding an Additional Control Group`),
        note(),
        ref({ page: 437 }, doc.h4`A General Framework for Policy Analysis with Pooled Cross Sections`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const twoPeriodPanelDataAnalysis = createDoc(() => container(
  ref({ page: 439 }, doc.h2`Two-Period Panel Data Analysis`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 444 }, doc.h4`Organizing Panel Data`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const policyAnalysisTwoPeriodPanelData = createDoc(() => container(
  ref({ page: 444 }, doc.h2`Policy Analysis with Two-Period Panel Data`),
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

export const differencingMoreThanTwoTimePeriods = createDoc(() => container(
  ref({ page: 447 }, doc.h2`Differencing with More Than Two Time Periods`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 451 }, doc.h4`Potential Pitfalls in First Differencing Panel Data`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));
