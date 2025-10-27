/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { clsRef, infobox_2, dashbox, note, todo } = prelude.components;
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
    infobox_2({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
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
        note(),
        ref({ page: 540 }, doc.h4`Autarky`),
        note(),
        ref({ page: 542 }, doc.h4`Free Trade`),
        note(),
        ref({ page: 543 }, doc.h4`Lessons from the Apple: Computer Example`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));

export const tradeInInputs = createDoc(() => container(
  ref({ page: 544 }, doc.h2`Trade in Inputs`),
  dashbox(
    twoThree(
      container(
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
        note(),
        ref({ page: 552 }, doc.h4`Net Foreign Assets and Foreign Debt`),
        note(),
      ),
      doc.dl(
      ),
    ),
  ),
));
