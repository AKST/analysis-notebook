/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { twoColumns, twoThree, container } from '@prelude-uni/layout.js';
import { clsRef, infobox, dashbox, note, todo } from '@prelude-uni/components.js';
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
    book: page != null ? ({ chapter: 18, page }) : undefined,
    lec: slide != null ? ({ id: [8, 'W'], slide }) : undefined,
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
        'Government Spending', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W8, Lecture 1']],
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
  ref({ page: 509 }, doc.h2`Introduction`),
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

export const governmentSpendingRevenue = createDoc(() => container(
  ref({ page: 509 }, doc.h2`U.S. Government Spending and Revenue`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 510 }, doc.h4`Spending and Revenue over Time`),
        note(),
        ref({ page: 511 }, doc.h4`The Debt-GDP Ratio`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const internationalEvidence = createDoc(() => container(
  ref({ page: 513 }, doc.h2`International Evidence on Spending and Debt`),
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

export const budgetConstraint = createDoc(() => container(
  ref({ page: 514 }, doc.h2`The Government Budget Constraint`),
  dashbox(
    twoThree(
      container(
        note(),
        mathml.govtBudgetConstraint,
        mathml.bondsEvolution,
        ref({ page: 515 }, doc.h4`The Intertemporal Budget Constraint`),
        mathml.intertemporalBudgetConstraint,
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const governmentBorrowing = createDoc(() => container(
  ref({ page: 517 }, doc.h2`How Much Can the Government Borrow?`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 517 }, doc.h4`Economic Growth and the Debt-GDP Ratio`),
        note(),
        ref({ page: 518 }, doc.h4`High Inflation and Default`),
        note(),
        ref({ page: 519 }, doc.h4`Generational Accounting`),
        note(),
        ref({ page: 519 }, doc.h4`Deficits and Investment`),
        mathml.nationalIncomeIdentity,
        mathml.savingIdentity,
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const fiscalProblem = createDoc(() => container(
  ref({ page: 521 }, doc.h2`The Fiscal Problem of the Twenty-First Century`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 522 }, doc.h4`The Problem`),
        note(),
        ref({ page: 525 }, doc.h4`Possible Solutions`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const extras = createDoc(() => container(
  ref({ page: 527 }, doc.h2`Conclusion`),
  dashbox(
    todo({}, 'explain monetary ways to decrease debt'),
    todo({}, 'explain fiscal ways to decrease debt'),
    note(
      doc.li`Describe funciton for govtment budget balance`,
    ),
    doc.h4`Government Budget Constraint at period t`,
    mathml.intertemporalDebtEvolution,
  ),
));
