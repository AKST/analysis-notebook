/**
 * @import { E, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import { dashbox, infobox } from '../common/components.js';
import { container, twoColumns, twoThree } from '../common/layout.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const IMAGES = {
  /** @type {E.Item} */
  losersFromTrade: ['figure', {
    style: 'width: 199px; margin: 0;',
  }, [
    doc.image({
      src: './assets/econ/trade-losers.gif',
      height: '188px',
      style: `
        margin-bottom: 8px;
        border: outset 4px grey;
      `,
    }),
    ['figcaption', [doc.small`Chris Richarson out of context`]]
  ]],
};

/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
const ul = (...items) => ['ul', {
  className: 'list-with-padded-items',
  style: 'padding-left: 16px',
}, items.map(p => ['li', [p]])];


/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    twoThree(
      container(
        ['h1', 'International Trade'],
        ['h4', 'Vocabulary Lighting Round'],
        dashbox(
          ul(
            doc.small`${doc.b`Domestic Price`}: The equilibrium
              price that would occur in a country if no international
              trade was allowed.
            `,
            doc.small`${doc.b`World Price`}:
              The equilibrium price on the international market.
            `,
            doc.small`${doc.b`Small open economy`}:
              An economy that participates in the international
              market, but its production (or consumption) is small
              enough compared to the rest of the world that its
              supply (or demand) does not affect the world price.
            `,
            doc.small`${doc.b`Closed economy/autarky`}:
              An economy that does not engate in international trade.
            `,
            doc.small`${doc.b`Gains from Trade`}:
              The difference in surplus after an economy opens to trade.
            `,
          ),
        ),
      ),
      container(
        infobox('Legend', [container(
          doc.p(`
            Here are some symbols used through out this topic.
          `),
          ['span', { style: 'font-size: 18px' }, [mathml.definitions()]],
        )]),
        infobox('Market Conditions', [container(
          doc.p(['span', { style: 'font-size: 18px' }, [
            mathml.importingCondition(),
          ]], `
            When an economies domestic price is greater
            than the world price it becomes an importer.
          `),
          doc.p(['span', { style: 'font-size: 18px' }, [
            mathml.exportingCondition(),
          ]], `
            When an economies domestic price is lower
            than the world price it becomes an exporter.
          `),
        )]),
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
      ['div', { className: 'tradeLosers' }, [
        container(
          ['h2', 'Winners and Losers of Trade'],
          doc.p(`
            Opening the economy leads to a Pareto efficient
            outcome, however it is not necessarily the case
            that opening the economy is a pareto improving
            transaction, as one side of the economy will either
            produce or consume less units, and will have a lower
            surplus after opening up to trade. But the overall
            surplus will increase.
          `),
        ),
        IMAGES.losersFromTrade,
      ]],
    ),
    dashbox(
      ['h2', 'Benefits of Trade'],
      twoColumns(
        ul(
          doc.small`Consumers have a ${doc.b`wider varity of goods`}.`,
          doc.small`
            Producers can take advantage of ${doc.b`economies of scale`}
            as they have access to larger markets.
          `,
        ),
        ul(
          doc.small`
            Domestic monopolies/oligopolies face increases competition
            from international producers which may
            ${doc.b`decrease their market power`}.
          `,
          doc.small`Increased flow of ${doc.b`ideas and technology`}.`,
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
    ['hr'],
    dashbox(
      ['h2', 'Trade Restrictions'],
      doc.p(`
        Import trade restrictions often exist to perserve
        domestic industry when the world price is below the
        domestic price (prior to opening to trade). Two of
        the options that exist are tariffs and quotas.
      `),
      twoColumns(
        container(
          ['h3', 'Tariffs'],
          doc.small`
            Tariffs generate Government revenue, by taxing
            the adding the size of the tax to the world price,
            which adds to government surplus. A tariff increases
            the price of the good for consumers by the size of
            the tariff.
          `,
          ['h4', 'How Tariffs respond to Price changes'],
          doc.small`
            As the world price changes, the quantity produced and the
            price paid by consumers scale relative to the change without
            the tariff. See this by adjusting the world price knob on
            the right hand side.
          `,
        ),
        container(
          ['h3', 'Quotas'],
          doc.small`
            A quota is a restriction on the quantity of items
            allowed. This doesn't explictly generate government
            revenue, but allows for quota rents or importer
            bonuses ot be collected by importers (which could
            also be the government).
          `,
          ['h4', 'How Quota respond to Price changes'],
          doc.small`
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
      ['h4', 'Tariff Changes'],
      tariff && base && freeTrade && (
        tables.tradeDelta('Tarriff Changes', base, freeTrade, tariff)
      ),
    );

    const quotaE = container(
      ['h4', 'Quota Changes'],
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

