/**
 * @import { E, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import { dashbox, todo, readmore, infobox } from '../common/components.js';
import { container, twoColumns, twoThree } from '../common/layout.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';


/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => ({
  meta: { kind: 'document' },
  render: () => container(
    todo({}, `for "${label.trim()}" graphic`),
  ),
});

const IMAGES = {
  imperfectMarkets: doc.image({
    src: './assets/econ/imperfect-markets.png',
    height: '120px',
    style: 'float: left; margin-right: 16px;',
  }),
  survivorship: doc.image({
    src: './assets/econ/survivorship-bias.png',
    height: '120px',
    style: 'float: left; margin-right: 16px;',
  }),
  taxWedge: doc.image({
    src: './assets/econ/tax-wedge.png',
    height: '107px',
    style: 'float: left; margin-right: 16px;',
  }),
  /** @type {E.Item} */
  ipartFounder: ['figure', {
    style: 'width: 165px; float: left; margin: 0; margin-right: 16px;',
  }, [
    doc.image({
      src: './assets/econ/ipart-founder.png',
      height: '161px',
    }),
    ['figcaption', ['"Tom Parry" IPART Founder']]
  ]],
};

const READMORE = {
  taxesAndSubsidiesAsWedges: readmore({
    summary: ['Taxes and Subsidy as Wedge'],
    details: [
      doc.small`${IMAGES.taxWedge}
        Taxes and subsidies being the same thing isn't just a metaphor for
        understanding taxes, but something significantly simplifies modeling
        taxes and subsides. For example, when computing equilibrium handling
        taxes and subsidies requires no special treatment when they are
        represented as the same variables (Transfers = Taxes - Subsidies).
      `,
      doc.small`
        So when you model a market, and you have a positive transfer (tax),
        you'll seee a divide form between the supply and demand surplus,
        aka ${doc.b`a wedge`}. When you have a negative transfer (subsidy)
        you'll see the opposite occur, instead you'll see the surpluses overlap.
      `,
      doc.small`
        Note this is some what Contingent on how you model taxes, it isn't
        uncommon to simply move the supply curve, though the graph takes on a
        different meaning.
      `,
    ],
  }),
  modellingTaxesAndSubsidies: readmore({
    summary: ['Correctly modelling Taxes and Subsides'],
    details: [
      doc.small`
        It is entirely possible I've modelled taxes and subsides
        unconventionally here. Many examples I've seen of modelling
        taxes has involved incrementing the intercept of the tax.
        Whereas here I haven't done that, I've instead placed a wedge
        between the surplus of the two curves.
        I guess I found this easier to show where dead weightloss is.
      `,
    ],
  }),
  whenMarketsAreNotPerfectlyCompetitive: readmore({
    summary: ['When markets are not perfectly competitive'],
    details: [
      doc.small`${IMAGES.imperfectMarkets}
        The moment any of the assumptions of perject competition
        are violated you no longer have perfect competition.
        Monopolies are one of the most apparent examples (explained
        in more detail later), who for example violate several of
        those assumptions, including buyer and sellers are
        ${doc.b`price takers`} as well as ${doc.b`free exit and entry`}
        as well as ${doc.b`homonogenous goods`}.
      `,
    ],
  }),
  priceControlsInNSW: readmore({
    summary: ['Price Ceilings in NSW'],
    details: [
      doc.small`${IMAGES.ipartFounder}
        In NSW, prices for some goods are regulated by IPART.
        This is for a number of things, such as council rates,
        Water rates, fares for services like Sydney Trains or
        Sydney Ferries. Even for prices between different
        Government institutions such as the price the valuer
        General can charge councils to access land value
        information for indivisual lots.
      `,
    ],
  }),
};

const INFOBOX = {
  effiencyVsEquity: infobox('Effiency Vs Equity', [
    doc.p(`
      While government intervention reduces overall effiency, this may
      be a preferable outcome in terms of equity.
    `),
    ['br'],
    doc.p(`
      Sometimes a market is viewed as pedatoral and a society may actually
      prefer it to be less effient. However most examples of this tend to
      be examples of markets with externalities (which is often the source
      a desire by the public for government intervention).
    `),
  ]),
  adValoremTax: infobox('Ad Valorem Tax', [
    doc.p(`
      Ad Valorem taxes are percentage based
      taxes, these taxes are a percentage of
      the value of the price. Examples include
      stamp duty, GST and land value tax.
      Ad valorem Subsidies do exist as well.
    `),
  ]),
};


/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: (_ctx, _state) => container(
    ['h1', 'Government Intervention'],
    twoThree(
      container(
        doc.p(`
          Whenever governments intervenes in `, doc.b`perfectly competitive`, `
          markets, both producers and consumers are worse off. Note, `,
          doc.b`perfectly competitive`, ` is an important qualitifier.
        `),
        doc.p(`
          Not all markets are perfectly competitive, very few in reality are, but
          many (but not all) are close enough for much of this to generally hold.
          Regardless, before asserting policy reform in the form of market
          liberalisation it is worth examining is the market question `,
          doc.b`perfectly competitive`, '.',
        ),
        READMORE.whenMarketsAreNotPerfectlyCompetitive,
      ),
      INFOBOX.effiencyVsEquity,
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const priceControls = {
  meta: { kind: 'document' },
  render: (_ctx, _state) => container(
    ['h2', 'Price Controls, Anchors, and Limits'],
    doc.p(`
      Firstly, before price ceilings and floors can have an
      impact they need to be binging. For price ceilings
      this means it is below the market price, and for floors
      it means it is above the equilibrium. Otherwise they
      will have no effect.
    `),
    twoColumns(
      container(
        ['h4', 'Price Ceiling, Excess demand'],
        doc.p(`
          A price ceiling is a maximum allowable price
          for goods in a given market. Some examples include,
          Road Toll prices, Council Rates, Water Rates, or
          Rent Controls.
        `),
        readmore({
          summary: ['Producer Implications'],
          details: [
            doc.small`
              While the price is effectively lowered this tends
              to reduce the overall quantity. In context of a
              shortage suppliers have no incentive to increase
              output, it is very likely they are already producing
              up to a point at which - if it were any higher their
              marginal costs would exceed their ability to repay them.
            `,
            doc.small`
              There is also less incentive to take on debt to increase
              production capacity as the market price would make repaying
              difficult.
            `,
          ],
        }),
        readmore({
          summary: ['Consumer Implications'],
          details: [
            doc.small`${IMAGES.survivorship}
              When a Price ceiling is binding, all the surplus
              under the equilibrium price and above the price ceiling
              that would have otherwise gone to the producer will go
              to the consumer. So are consumers always better off?
              It depends. One criticism of rent controls follows that
              it actualy subsidises incumbants, more generally price
              ceilings only really benefit those who manage to end up
              accessing the good.
            `,
            doc.small`
              An example of this is water rates, in that it benefits
              those with a water connection but it makes it harder for
              water utilities to grow inline with growth of demand. This
              cost either gets be passed on to new homebuyers or the
              water utility company may just refuse to provide additional
              connections.
            `,
          ],
        }),
      ),
      container(
        ['h4', 'Price Floor, Excess supply'],
        doc.p(`
          A price floor is a minimum allowable price for
          goods (or services) in a given market. Some examples
          include minimum wages, or support for farms.
        `),
        readmore({
          summary: ['Producer Implications'],
          details: [
            doc.small`
              This is fairly similar to the consumer implications
              for price ceilings, in that there are fewer
              opportunities to sell.
            `,
          ],
        }),
      ),
    ),
    READMORE.priceControlsInNSW,
    ['h3', 'Deadweight loss'],
    doc.p(`
      While price controls change can increase and decrease the overall
      portion which goes to consumers or producers, overall sum will
      be reduced regardless. The area lost is called `, doc.b`Deadweight loss`,
      `, we use the same term when refering to a reduction in overall surplus
      in a number of scenarios, including taxes, as well as any devations from
      equilibrium we see in imperfect markets such as monopolies.
    `),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const taxesAndSubsidies = {
  meta: { kind: 'document' },
  render: (_ctx, _state) => container(
    ['hr'],
    twoThree(
      container(
        ['h2', 'Unit Taxes and Subsidies'],
        doc.p(`
          Taxes and subsidies are kind of the same thing,
          in same way addition and subtract are the same thing
          but stress different directions. It's probably more
          correct they exist on the same continuum in the same
          way negative numbers and positive numbers do.
          A negative tax is just a subsidy and a negative subsidy
          is just a tax. A positive tax is a negative subsidy and
          positive subsidy is a negative tax. All functions of tax
          are the inverse of a subsidy in respect to market activity
          and government cost.
        `),
        READMORE.modellingTaxesAndSubsidies,
        READMORE.taxesAndSubsidiesAsWedges,
        ['h3', 'Difference between taxes on Supply and Demand'],
        doc.p(
          'In ', doc.b`perfect competition`, ` with no other
          Government intervention, it actually doesn't matter.
          However, if you have a price floor or ceilling it will
          make a difference, but we are not talking about
          that here.
        `),
      ),
      container(
        infobox("Constraint solving Equilibrium", [
          ['div', { className: 'equilibrium-equation' }, [
            mathml.solveForEqulibriumWithWedge(),
          ]],
        ]),
        INFOBOX.adValoremTax,
      ),
    ),
    twoColumns(
      dashbox(
        ['h3', 'Tax Burden'],
        doc.small`
          While who pays the tax doesn't matter, it won't always be
          the case that everyone pays it equally (which has nothing
          to do with who pays). This is called ${doc.b`Tax burden`}.
        `,
        mathml.curveExample(),
        doc.small`
          As a general rule, the tax burden is greatest held by the side
          is the more elastic portion of the market, or which ever
          curve has the steepest slope.
        `,
        ['h4', ['Subsidy ', ['s', 'Burden'], ' ', ['em', 'Beneficiary']]],
        doc.small`
          Similarly, when there's a subsidy which ever of the two
          curves is the steepest (or elastic) will reap the
          greatest benefit of the subsidy.
        `,
        ['h4', 'Computing Burden'],
        mathml.taxBurden(),
      ),
      dashbox(
        ['h3', 'Price after Tax'],
        doc.small`
          The difference in price paid by consumers, won't be the
          size of the tax. If both curves have an identical
          magnitude for their slope, the difference will be ½ the
          size of the tax and it will be split evenly. But when it's
          not? The difference will be the size of the tax TIMES
          the size of their portion of the burden.
        `,
        ['h3', 'Quantity after tax'],
        doc.small`
          Elasicity and the slope of the curves of the market will largely
          determine how many units will remain in the market after the
          introduction of a tax. Inelastic markets (steep curves) lose
          fewer units than elasitic markets (flatter curves).
          They also generate more ${doc.b`Government Revenue`}.
        `,
        ['h4', 'Computing the New Equilibrium'],
        mathml.newEquilibrium(),
      ),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const taxBurdenTable = {
  meta: { kind: 'document' },
  render: (_ctx, { base, demand, supply, tax, subsidy }) => container(
    doc.p('Demand burden and Subsidy benefit are split identically'),
    twoColumns(
      base && tax && tables.taxBurden(demand, supply, base, tax),
      base && subsidy && tables.surplusBenefit(demand, supply, base, subsidy),
    ),
  ),
};
