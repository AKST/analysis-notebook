
/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { responsiveGridAutoRow, twoThree, twoColumns, container } from '@prelude-uni/layout.js';
import { text, clsRef, infobox, dashbox, todo, note } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';
import { vars as isCurveVars } from '../sec-05-2/doc.js';

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
      text.ul(
        doc.li`Chapter 16`
      ),
    ),
  ),
));

export const introduction = createDoc(() => container(
  ref({ page: 461 }, doc.h2`Introduction`),
  dashbox(
    note(),
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
        ref({ page: 465 }, doc.h4`Solving Log Utility`),
        note(),
        ref({ page: 466 }, doc.h4`Solving Log Utility at β = 1`),
        note(),
        ref({ page: 467 }, doc.h4`The Effect of a Rise in R on Consumption`),
        note(),
      ),
      doc.dl(
        doc.dt`Intertemporal Budget Constraint`,
        doc.dd`Says that the present discounted value of consumption must equal ${doc.b`total wealth`}`,
        doc.dt`Total Wealth`,
        doc.dd`A combination of ${doc.b`financial wealth`} and ${doc.b`human wealth`}`,
        doc.dt`Financial Wealth`,
        doc.dd`
          This is expressed as ${doc.b`f${doc.sub`today`}`}, and is generally stuff
          such as savings, stock, bonds, and other financial assets.
        `,
        doc.dt`Human Wealth`,
        doc.dd`
          The present discounted value of labour income, also expressed as
          ${doc.b`f${doc.sub`future`}`}.
        `,
        doc.dt`Utility Function`,
        doc.dd`A function form for expressing utility received from consumption.`,
        doc.dt`Utils`,
        doc.dd`Units of Utility, and how utility from consumption is measured.`,
        doc.dt`Deminishing marginal utilities`,
        doc.dd`
          The way in how the next unit of consumptions results in less
          additional utility the unit act of consumption.
        `,
        doc.dt`Substitution effect`,
        doc.dd`TODO`,
        doc.dt`Income effect`,
        doc.dd`TODO`,
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
