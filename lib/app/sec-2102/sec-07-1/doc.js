
/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';
import { vars as isCurveVars } from '../sec-05-2/doc.js';

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
    book: page != null ? ({ chapter: 16, page }) : undefined,
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
        'Consumption', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W7, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
    ),
  ),
));

export const dummy = createDoc(() => dashbox(
  doc.h2`blah`,
  todo({}, 'content'),
));

export const introduction = createDoc(() => container(
  ref({ page: 461 }, doc.h2`Introduction`),
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

export const neoclassicalModel = createDoc(() => container(
  ref({ page: 461 }, doc.h2`The Neoclassical Consumption Model`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 461 }, doc.h4`The Intertemporal Budget Constraint`),
        note(),
        ref({ page: 462 }, doc.h4`Utility`),
        note(),
        ref({ page: 463 }, doc.h4`Choosing Consumption to Maximize Utility`),
        note(),
        ref({ page: 465 }, doc.h4`Solving the Euler Equation: Log Utility`),
        note(),
        ref({ page: 466 }, doc.h4`Solving for c_today and c_future: Log Utility and β = 1`),
        note(),
        ref({ page: 467 }, doc.h4`The Effect of a Rise in R on Consumption`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const lessonsFromModel = createDoc(() => container(
  ref({ page: 467 }, doc.h2`Lessons from the Neoclassical Model`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 467 }, doc.h4`The Permanent-Income Hypothesis`),
        note(),
        ref({ page: 469 }, doc.h4`Ricardian Equivalence`),
        note(),
        ref({ page: 469 }, doc.h4`Borrowing Constraints`),
        note(),
        ref({ page: 470 }, doc.h4`Consumption as a Random Walk`),
        note(),
        ref({ page: 471 }, doc.h4`Precautionary Saving`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const empiricalEvidence = createDoc(() => container(
  ref({ page: 472 }, doc.h2`Empirical Evidence on Consumption`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 472 }, doc.h4`Evidence from Individual Households`),
        note(),
        ref({ page: 474 }, doc.h4`Aggregate Evidence`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));
