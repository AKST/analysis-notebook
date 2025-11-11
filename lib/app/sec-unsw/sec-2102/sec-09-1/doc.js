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
    book: page != null ? ({ chapter: 19, page }) : undefined,
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
        'International Trade', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W9, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' })(
      doc.p`Chapter 19 of the textbook`,
    ),
  ),
));

export const dummy = createDoc(() => dashbox(
  doc.h2`blah`,
  todo({}, 'content'),
));

export const introduction = createDoc(() => container(
  ref({ page: 533 }, doc.h2`Introduction`),
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

export const basicFactsTrade = createDoc(() => container(
  ref({ page: 534 }, doc.h2`Some Basic Facts about Trade`),
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

export const basicReasonTrade = createDoc(() => container(
  ref({ page: 536 }, doc.h2`A Basic Reason for Trade`),
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

export const tradeAcrossTime = createDoc(() => container(
  ref({ page: 537 }, doc.h2`Trade across Time`),
  dashbox(
    twoThree(
      container(
        tables.wheatHarvests,
        mathml.nationalAccountingImplications,
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const tradeWithProduction = createDoc(() => container(
  ref({ page: 539 }, doc.h2`Trade with Production`),
  dashbox(
    twoThree(
      container(
        tables.northSouthSetup,
        note(),
        ref({ page: 540 }, doc.h4`Autarky`),
        tables.northSouthAutarky,
        note(),
        ref({ page: 542 }, doc.h4`Free Trade`),
        tables.northSouthFreeTrade,
        note(),
        ref({ page: 543 }, doc.h4`Lessons from the Apple: Computer Example`),
        note(),
      ),
      doc.dl(
        doc.dt`Absolute Advantage`,
        doc.dd`When an economy is more productive at all acts of production`,
        doc.dt`Comparative Advantage`,
        doc.dd`Refer to micro 1.`,
        doc.dt`Autarky`,
        doc.dd`A closed economy.`,
      ),
    ),
  ),
));

export const tradeInInputs = createDoc(() => container(
  ref({ page: 544 }, doc.h2`Trade in Inputs`),
  dashbox(
    twoThree(
      container(
        tables.northSouthFreeMigration,
        note(),
        ref({ page: 545 }, doc.h4`Moving Capital versus Moving Labor`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const costsOfTrade = createDoc(() => container(
  ref({ page: 546 }, doc.h2`The Costs of Trade`),
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

export const tradeDeficitForeignDebt = createDoc(() => container(
  ref({ page: 549 }, doc.h2`The Trade Deficit and Foreign Debt`),
  dashbox(
    twoThree(
      container(
        note(),
        ref({ page: 549 }, doc.h4`Trade and Growth around the World`),
        note(),
        ref({ page: 550 }, doc.h4`The Twin Deficits`),
        mathml.savingIdentity,
        mathml.nationalIncomeIdentity,
        note(),
        ref({ page: 552 }, doc.h4`Net Foreign Assets and Foreign Debt`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));
