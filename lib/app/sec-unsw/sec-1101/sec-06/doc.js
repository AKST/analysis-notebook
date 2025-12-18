/**
 * @import { E, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { dashbox, infobox, text } from '@prelude-uni/components.js';
import { container, twoColumns, twoThree } from '@prelude-uni/layout.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const IMAGES = {
  /** @type {E.Item} */
  losersFromTrade: doc.figure({
    style: 'width: 199px; margin: 0;',
  }).of(
    doc.img({
      src: './assets/econ/trade-losers.gif',
      height: 188,
      style: `
        margin-bottom: 8px;
        border: outset 4px grey;
      `,
    }),
    doc.figcaption`Chris Richarson out of context`,
  ),
};

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
const ul = (...items) => doc.ul({
  className: 'list-with-padded-items',
  style: 'padding-left: 16px',
}).of(...items.map(p => text.li.l.of(p)));


/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    twoThree(
      container(
        doc.h1`International Trade`,
        doc.h4`Vocabulary Lighting Round`,
        dashbox(
          ul(
            doc.p`${text.b`Domestic Price`}: The equilibrium
              price that would occur in a country if no international
              trade was allowed.
            `,
            doc.p`${text.b`World Price`}:
              The equilibrium price on the international market.
            `,
            doc.p`${text.b`Small open economy`}:
              An economy that participates in the international
              market, but its production (or consumption) is small
              enough compared to the rest of the world that its
              supply (or demand) does not affect the world price.
            `,
            doc.p`${text.b`Closed economy/autarky`}:
              An economy that does not engate in international trade.
            `,
            doc.p`${text.b`Gains from Trade`}:
              The difference in surplus after an economy opens to trade.
            `,
          ),
        ),
      ),
      container(
        infobox({ title: 'Legend' }).of(container(
          text.p.m`
            Here are some symbols used through out this topic.
          `,
          doc.span({ style: 'font-size: 18px' }).of(mathml.definitions()),
        )),
        infobox({ title: 'Market Conditions' }).of(container(
          text.p.m`${doc.span({ style: 'font-size: 18px' }).of(
            mathml.importingCondition(),
          )}
            When an economies domestic price is greater
            than the world price it becomes an importer.
          `,
          text.p.m`${doc.span({ style: 'font-size: 18px' }).of(
            mathml.exportingCondition(),
          )}
            When an economies domestic price is lower
            than the world price it becomes an exporter.
          `,
        )),
      ),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const onTrade = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    dashbox(
      doc.div({ className: 'tradeLosers' }).of(
        container(
          doc.h2`Winners and Losers of Trade`,
          doc.p`
            Opening the economy leads to a Pareto efficient
            outcome, however it is not necessarily the case
            that opening the economy is a pareto improving
            transaction, as one side of the economy will either
            produce or consume less units, and will have a lower
            surplus after opening up to trade. But the overall
            surplus will increase.
          `,
        ),
        IMAGES.losersFromTrade,
      ),
    ),
    dashbox(
      doc.h2`Benefits of Trade`,
      twoColumns(
        ul(
          doc.p`Consumers have a ${text.b`wider varity of goods`}.`,
          doc.p`
            Producers can take advantage of ${text.b`economies of scale`}
            as they have access to larger markets.
          `,
        ),
        ul(
          doc.p`
            Domestic monopolies/oligopolies face increases competition
            from international producers which may
            ${text.b`decrease their market power`}.
          `,
          doc.p`Increased flow of ${text.b`ideas and technology`}.`,
        ),
      ),
    ),
  ),
};


/**
 * @type {Widget<any, State, Config>}
 */
export const tradeRestrictionsGenerally = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    doc.hr(),
    dashbox(
      doc.h2`Trade Restrictions`,
      text.p.l`
        Import trade restrictions often exist to perserve
        domestic industry when the world price is below the
        domestic price (prior to opening to trade). Two of
        the options that exist are tariffs and quotas.
      `,
      twoColumns(
        container(
          doc.h3`Tariffs`,
          doc.p`
            Tariffs generate Government revenue, by taxing
            the adding the size of the tax to the world price,
            which adds to government surplus. A tariff increases
            the price of the good for consumers by the size of
            the tariff.
          `,
          doc.h4`How Tariffs respond to Price changes`,
          doc.p`
            As the world price changes, the quantity produced and the
            price paid by consumers scale relative to the change without
            the tariff. See this by adjusting the world price knob on
            the right hand side.
          `,
        ),
        container(
          doc.h3`Quotas`,
          doc.p`
            A quota is a restriction on the quantity of items
            allowed. This doesn't explictly generate government
            revenue, but allows for quota rents or importer
            bonuses ot be collected by importers (which could
            also be the government).
          `,
          doc.h4`How Quota respond to Price changes`,
          doc.p`
            For the most part they don't, with only exception
            that rent earnt by the importer will increase or
            decrease, but the amount paid by the consumer or
            quantity available to consume will not change.
          `,
        ),
      ),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const changeTables = {
  meta: { kind: 'document' },
  render: (_ctx, state) => {
    const { base, freeTrade, quota, tariff } = state.models;

    const tariffE = container(
      doc.h4`Tariff Changes`,
      tariff && base && freeTrade && (
        tables.tradeDelta('Tarriff Changes', base, freeTrade, tariff)
      ),
    );

    const quotaE = container(
      doc.h4`Quota Changes`,
      quota && base && freeTrade && (
        tables.tradeDelta('Quota Changes', base, freeTrade, quota)
      ),
    )

    return container(
      twoColumns(quotaE, tariffE),
      tables.everything(state),
    );
  }
};

