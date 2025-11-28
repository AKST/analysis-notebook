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

export const introduction = createDoc(() => container(
  ref({ page: 533 }, doc.h2`Introduction`),
  dashbox(
    container(
      doc.p`Generally the following write up will explore the following:`,
      text.ol(
        doc.li`Trade across countries is quite similar to trade across people within a country.`,
        doc.li`While trade deficits are seen issues they can improve welfare.`,
        doc.li`One of the most important concepts in trade theory is comparitive advantage.`,
        doc.li`There's a relationship between trade and free migrations`,
      ),
    ),
    twoColumns(
      container(
        ref({ page: 534 }, doc.h3`Basic Facts on Trade`),
        doc.p`
          In the decades since WW2 trade has dramatically
          increased, this can be measured as changes in the
          portion of GDP. In the US it has gone from 5% of
          GDP in the 1950s to 12-15% in recent times (up to
          2020).
        `,
        doc.h4`Transport costs`,
        doc.p`
          This is in part due to a ${doc.b`reduction in
          transportation and shipping costs`}. Such as
        `,
        text.ul({ itemSpace: 'sparse' })(
          doc.li`
            The average charge per ton in the 1920s was $95
            and in the 1990s became $29.
          `,
          doc.li`
            Revenue per passenger mile fell from 112 cents in
            1930 to 11 cents by 2008.
          `,
          doc.li`
            A three minute phone call from new york to london
            in the 1930s costed $250 to now (2025) costs zero point
            nothing.
          `,
        ),
        doc.h4`Trade Barriers`,
        doc.p`
          Another significant reason for this increase is
          a ${doc.b`reduction of trade barriers`}. Trade
          tariffs and quotas are far less common (as of
          2025)${doc.sup`[1]`}. We can observe this in:
        `,
        text.ul({ itemSpace: 'sparse' })(
          doc.li`
            A reduction in the worldwide average for
            manufacturing tariffs from 14% in the 1960s
            to 4% by the 2000s.
          `,
          doc.li`
            For many countries the import and export share
            of GDP is greater than 20%, such countries include:
            Canada 🇨🇦, Russia 🇷🇺, Germany 🇩🇪, China 🇨🇳,
            France 🇫🇷, etc.
          `,
        ),
        doc.h4`Changes in US trade trends`,
        doc.p`
          In the US you can see a widening of the gap between
          import and exports, or net exports as share of GDP
          (this is called the ${doc.b`the trade balance`}).
          This is actually relatively new compared to what was
          observed between 1950 and 1975 where the US had a
          trade surplus. It exported more goods and imported
          more services. That trends has since reversed as of 1975.
        `,
      ),
      container(
        infobox({ title: 'Trade Balance, closed world economy' })(
          doc.p`
            In thinking about trade and trade deficits, is that
            trade has a balance. When they are being exported
            someone is importing them. While indivisual countries
            are open economies it is helpful to consider the world
            as a closed economy (even if its unclear where it would
            open up trade too).
          `,
          doc.p`A surplus somewhere is a deficit elsewhere.`,
        ),
        ref({ page: 536 }, doc.h3`Reasons for Trade`),
        doc.p`
          When we can think of the world as a closed economy where
          trade may occur between parts of it depending whether thye
          are open or closed, it begins to become more clear why
          earlier trade between many nations is similiar to trade
          within a single nation.
        `,
        doc.p`
          Some parts may consume a lot of a certain good while producing
          very little and vice versa.
        `,
        infobox({ title: 'Trade within Sydney' })(
          doc.p`
            Putting the reasons why this is so aside, there are
            concentrations of certain professions in different
            parts of sydney. In places like Woolahra there is
            an abundance of lawyers while who who consume any
            goods not produced by their residents.
          `,
        ),
        doc.h4`Why do people trade?`,
        doc.p`
          The basic motivation for international trade is the same
          as the motivation for trade within a country: ${doc.b`people
          trade because ${doc.b`they value goods that other people
          produce more at the margin`} than ${doc.i`they value what
          they themselves own`}`}.
        `,
        doc.p`
          International trade is really no different from trade within
          a country, and gains from trade lie at the heart of economics.
        `,
      ),
    ),
  ),
  doc.div({ className: 'footnotes dashbox container' })(
    doc.h6`${doc.span({ className: 'icon' })`⚠️`} Footnotes`,
    text.ol(
      doc.li`
        Obviously within the year of 2025 (when I'm writing this), since the
        election of Donald Trump there is a lot of uncertainty in this space.
      `,
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
