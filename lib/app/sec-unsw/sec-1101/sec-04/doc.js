/**
 * @import { E, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import { doc } from '@app/prelude.js';
import { readmore, dashbox, todo, infobox, defineTerm, text } from '@prelude-uni/components.js';
import { container, twoThree, twoColumns } from '@prelude-uni/layout.js';
import * as tables from './tables.js';
import * as mathml from './mathml.js';

const TERMS = {
  equilibrium: defineTerm({
    word: 'Equilibrium',
    source: { wiki: 'https://en.wiktionary.org/wiki/equilibrium' },
    meaning: [
      ['The condition of a system in which competing influences are balanced, resulting in no net change.'],
      ['The state of a reaction in which the rates of the forward and reverse reactions are the same.'],
    ],
    etymology: { origin: ['latin'] },
    pronunciation: {
      accent: 'rp',
      syntax: '/ɛkwɪˈlɪbɹɪəm/',
    },
  }),
  surplus: defineTerm({
    word: 'Surplus',
    source: { wiki: 'https://en.wiktionary.org/wiki/surplus' },
    meaning: [
      ['That which remains when use or need is satisfied, or when a limit is reached; excess; overplus; overage.'],
    ],
    etymology: { origin: ['middle english', 'middle french'] },
    pronunciation: {
      accent: 'rp',
      syntax: '/ˈsɜːpləs/',
    },
  }),
};

const LINKS = {
  privateGood: text.a.attr({ href: 'https://en.wikipedia.org/wiki/Private_good' }),
};

const IMAGES = {
  pareto: doc.img({
    src: './assets/econ/pareto.png',
    height: '144px',
    style: 'float: right; margin-left: 8px',
  }),
  paretoImprovingTransaction: doc.img({
    src: './assets/econ/pareto-improving-transaction.png',
    height: '120px',
    style: 'float: left; margin-right: 8px;',
  }),
  smith: doc.img({
    src: './assets/econ/adam-smith.png',
    height: '138px',
    className: 'adamSmith',
  }),
  rationing: doc.img({
    src: './assets/econ/rationing-2.png',
    height: '130px',
    style: 'float: left; margin-right: 8px;',
    title: 'Child collecting WW2 rations',
  }),
  competition: doc.img({
    src: './assets/econ/perfect-competition.png',
    height: '107px',
    style: 'float: left; margin-right: 8px;',
    title: 'Joey Chestnut 17 times winning hot dog eatting world champion',
  }),
  privateGoods: doc.img({
    src: './assets/econ/private-goods.png',
    height: '107px',
    style: 'float: left; margin-right: 8px;',
    title: 'Cheese',
  }),
};

const INFOBOXES = {
  pareto: infobox({ title: 'Paret-who?' })(
    ['div', {}, [
      IMAGES.pareto,
      text.p.m`
        The term Pareto Efficency comes from the
        italian engineer ${['a', {
          href: 'https://en.wikipedia.org/wiki/Vilfredo_Pareto',
        }, ['Vilfredo Pareto']]} he came up with
        the concept of Pareto Efficency also called
        Pareto-optimality'
      `,
    ]],
  )
};

/**
 * @type {Widget<any, State, Config>}
 */
export const intro = {
  meta: { kind: 'document' },
  render: () => container(
    twoThree(
      container(
        doc.h1`Equilibrium`,
        doc.h4`Definition Lightning round`,
        ['div', { classList: ['container', 'dashbox'] }, [
          ['ul', {
            className: 'list-with-padded-items',
            style: 'padding-left: 16px',
          }, [
            doc.p`
              ${doc.b`Market equilibrium`} is the state
              where the supply and demand curvers intersect,
              this represents the market price and quantity.
            `,
            doc.p`
              ${doc.b`Consumer Surplus`} the difference
              between the what a BUYER is was willing to pay
              (reservation price) and what they actually had
              to pay (effective or market price).
            `,
            doc.p`
              ${doc.b`Producer Surplus`} is more or less the
              same thing as consumer surplus but in relation to
              the difference the SELLERs was willing to pay
              and what they actually had to pay.
            `,
            doc.p`
              ${doc.b`Total Surplus`} basically producer
              surplus and consumer surplus combined, as well as
              government revenue. In ${doc.b`Perfect Competition`}
              The surplus is maximised when the market is trading at
              the equilibrium.
            `,
            doc.p`
              ${doc.b`Pareto Efficiency`}, a situation in which it
              is impossible to make any indivisual better off,
              without making at least one indivisual worse off.
            `,
            doc.p`
              ${doc.b`Consumer Reservation Price`}, the highest
              price a consumer is willing to pay for a unit.
            `,
            doc.p`
              ${doc.b`Producer Reservation Price`}, the lowest
              price a producer is willing to sell a unit.
            `,
          ].map(p => text.li.m.of(p))],
        ]],
      ),
      container(
        TERMS.equilibrium,
        /*
         * Show supply & price intersecting
         */
        todo({}, 'headless app of market equilibrium'),
        TERMS.surplus,
        INFOBOXES.pareto,
      )
    ),
    ['div', [
      container(
        readmore({
          summary: ['Invisible Hand Principle'],
          image: IMAGES.smith,
          details: [
            text.p.l`
              The ${doc.b`Invisible Hand Principle`},
              states that each indivisual agents efforts to
              maximise their gains will be generally
              benefitical for society optimal allocation of
              resources. ${doc.b`Perfectly competitive`}
              markets reach this socially optimial outcome
              without government intervention.
              In the long run, firms will be pushed to produce
              at their lowest possible average total cost.
            `,
          ],
        }),
        readmore({
          summary: ['In perfect competition'],
          image: IMAGES.competition,
          details: [
            text.p.l`
              In a perfect competitive market, the market
              equilibrium is Pareteo Efficiency. It is
              impossible to construct a Pareto improving
              transaction.
            `,
          ],
        }),
        readmore({
          summary: ['Rationing Rule'],
          image: IMAGES.rationing,
          details: [
            text.p.l`
              Buyers who value the good more will be the
              first to buy it.
            `,
          ],
        }),
        readmore({
          summary: ['Pareto Improving Transactions'],
          image: IMAGES.paretoImprovingTransaction,
          details: [text.p.l`
            A transaction is pareto improving if at least
            one party is better off and no party is made
            worse off as a result. Pareto Improving
            Transactions are only possible when if the
            market is not already pareto efficient.
          `],
        }),
      ),
    ]],
    ['hr'],
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const subjectPerfectCompetition = {
  meta: { kind: 'document' },
  render: () => container(
    twoThree(
      container(
        doc.h2`Perfect competition`,
        ['details', {}, [
          ['summary', {}, 'Private Goods'],
          ['br'],
          IMAGES.privateGoods,
          container(
            text.p.l`
              Goods are private, which means if I want a $4
              coffee, and you also want a $4 coffee, there is
              collective demand for 2 coffees at $4.
              [${LINKS.privateGood`read more`}]
            `,
          ),
        ]],
        doc.h3`Devivations from Equilibrium`,
        text.p.l`
          When the ${doc.b`quantity demand`} and
          ${doc.b`quantity supplied`} are not the
          same. The market will operate at the lower quantity.
        `,
        doc.ul.of(
          text.li.l`A ${doc.b`Price ABOVE Equilbrium`}, will result in ${doc.b`excessive SUPPLY`} with an insufficent number of buyers.`,
          text.li.l`A ${doc.b`Price BELOW Equilbrium`}, will result in ${doc.b`excessive DEMAND`} and a shortage of goods.`,
        ),
        todo({ height: 128 }, 'SHOW EXCESS SUPPLY AND DEMAND'),
        doc.h3`Curve Shifts`,
      ),
      container(
        doc.h3`Perfect Competition Assumptions`,
        doc.dl(
          doc.dt`Goods are excludable and Rival`,
          doc.dd.of(doc.p`
            Excludable goods are goods only
            consumable by the purchaser, and
            rivalious means comsumptions reduces
            the remaining number of goods.
          `),
          doc.dt`Partipants are Price Takers`,
          doc.dd.of(doc.p`
            Buyers and Sellers are price takers, buyers
            asking for lower prices won't find one, and
            sellers selling at a higher price won't sell.
          `),
          doc.dt`Homogenous goods`,
          doc.dd.of(doc.p`
            All sellers are selling the same thing,
            so buyers have no reason to pay different
            prices to different sellers.
          `),
          doc.dt`Free Entry and exit`,
          doc.dd.of(doc.p`
            Producers can enter and exit the market
            as they please. If it's profitable they
            can paritipate, if not they can exit.
          `),
          doc.dt`No Externalities`,
          doc.dd.of(doc.p`

          `),
          doc.dt`Full Information`,
          doc.dd.of(doc.p`

          `),
        ),
      ),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const introAggregateSupplyAndDemand = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    ['hr'],
    twoThree(
      container(
        doc.h1`Aggregate Supply & Demand`,
        doc.h2`Horizontal Summation`,
        text.p.l`
          Below are some examples of aggregated
          supply and demand curves via horizontal
          summisation.
        `,
        tables.tableOfCurves(state),
      ),
      infobox({ title: "Horizontal Summation" })(
        ['div', { className: 'horizontal-summary-math' }, [
          mathml.horizontalSummation(),
        ]],
      ),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const continiousSurplus = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    tables.surplus(state),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const discrete = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    doc.h2`Stack Reservation Price`,
    text.p.l`
      Another option is to stack reservation prices, of
      ethier curve on top of one another. You can calculate
      equilibrium like so:
    `,
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const discreteSurplus = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    tables.surplusDiscrete(state),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const findingEquilibrium = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    doc.h2`Finding Equilibrium`,
    text.p.l`
      Often looking at your curves on a chart is
      the simplest way of finding your prices, but
      maybe all you have is a bunch of numbers
      for reserve prices (a discrete curve), or
      an algebric expression for the supply and
      demand curve (a continuious curve).
    `,
    twoColumns(
      dashbox(
        doc.h4`Continuous Curves`,
        mathml.supplyDemandCurvesContinuious(),
        text.p.l`
          At Equilibrium, Supply & Demand Price
          are equal so you can solve for quantity
          by creating a new equation where the left
          hand sides of each equation equal each other
          and then solve for Q to get equilibrium
          quantity, then plug that back into either
          Supply or Demand price to get equilibrium.
        `,
        mathml.equilibriumContinuious(),
      ),
      dashbox(
        doc.h4`Discrete Curves`,
        mathml.supplyDemandCurvesDiscrete(),
        text.p.l`
          Discrete Curves are more finicky, and
          as there aren' in between points, and
          are likely better computed with a computer
          with a larger set of prices. But generally
          he's how you'd get the equilibrium.
        `,
        mathml.equilibriumDiscrete(),
      ),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const longRunEquilibrium = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    doc.h1`Longrun Equilibrium`,
    todo({ leadingText: 'SHOW' }, `
      Have an example of Longrun Equilibrium where
      demand ends up being perfectly elastic and
      the marginal cost ended up demand curve. Also
      simulate a number of firms in the market.
    `)
  ),
};
