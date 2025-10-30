/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
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
    book: page != null ? ({ chapter: 14, page }) : undefined,
    lec: slide != null ? ({ id: [9, 'W'], slide }) : undefined,
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
        'Advanced Panel Data Methods', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W9, Lecture 2']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
    ),
  ),
));

export const fixedEffectsEstimation = createDoc(() => container(
  ref({ page: 463 }, doc.h2`Fixed Effects Estimation`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 466 }, doc.h4`The Dummy Variable Regression`),
        note(),
        ref({ page: 467 }, doc.h4`Fixed Effects or First Differencing?`),
        note(),
        ref({ page: 468 }, doc.h4`Fixed Effects with Unbalanced Panels`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const randomEffectsModels = createDoc(() => container(
  ref({ page: 469 }, doc.h2`Random Effects Models`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 473 }, doc.h4`Random Effects or Pooled OLS?`),
        note(),
        ref({ page: 473 }, doc.h4`Random Effects or Fixed Effects?`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const correlatedRandomEffectsApproach = createDoc(() => container(
  ref({ page: 474 }, doc.h2`The Correlated Random Effects Approach`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 476 }, doc.h4`Unbalanced Panels`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const generalPolicyAnalysis = createDoc(() => container(
  ref({ page: 477 }, doc.h2`General Policy Analysis with Panel Data`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 478 }, doc.h4`Advanced Considerations with Policy Analysis`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const applyingPanelDataMethods = createDoc(() => container(
  ref({ page: 480 }, doc.h2`Applying Panel Data Methods to Other Data Structures`),
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
