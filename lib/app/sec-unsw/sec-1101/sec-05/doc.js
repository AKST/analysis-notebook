/**
 * @import { E, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { dashbox, todo, readmore, infobox, text } from '@prelude-uni/components.js';
import { container, twoColumns, twoThree } from '@prelude-uni/layout.js';
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
  imperfectMarkets: doc.img.css({
    float: 'left',
    marginRight: '16px',
  }).void({ src: './assets/econ/imperfect-markets.png', height: 120 }),
  survivorship: doc.img.css({
    float: 'left',
    marginRight: '16px',
  }).void({ src: './assets/econ/survivorship-bias.png', height: 120 }),
  taxWedge: doc.img.css({
    float: 'left',
    marginRight: '16px',
  }).void({ src: './assets/econ/tax-wedge.png', height: 107 }),
  /** @type {E.Item} */
  ipartFounder: doc.figure.css({
    width: '165px',
    float: 'left',
    margin: '0',
    marginRight: '16px',
  }).c(
    doc.img({
      src: './assets/econ/ipart-founder.png',
      height: 161,
    }),
    doc.figcaption`"Tom Parry" IPART Founder`
  ),
};

const READMORE = {
  taxesAndSubsidiesAsWedges: readmore({
    summary: ['Taxes and Subsidy as Wedge'],
    details: [
      doc.p`${IMAGES.taxWedge}
        Taxes and subsidies being the same thing isn't just a metaphor for
        understanding taxes, but something significantly simplifies modeling
        taxes and subsides. For example, when computing equilibrium handling
        taxes and subsidies requires no special treatment when they are
        represented as the same variables (Transfers = Taxes - Subsidies).
      `,
      doc.p`
        So when you model a market, and you have a positive transfer (tax),
        you'll seee a divide form between the supply and demand surplus,
        aka ${text.b`a wedge`}. When you have a negative transfer (subsidy)
        you'll see the opposite occur, instead you'll see the surpluses overlap.
      `,
      doc.p`
        Note this is some what Contingent on how you model taxes, it isn't
        uncommon to simply move the supply curve, though the graph takes on a
        different meaning.
      `,
    ],
  }),
  modellingTaxesAndSubsidies: readmore({
    summary: ['Correctly modelling Taxes and Subsides'],
    details: [
      doc.p`
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
      doc.p`${IMAGES.imperfectMarkets}
        The moment any of the assumptions of perject competition
        are violated you no longer have perfect competition.
        Monopolies are one of the most apparent examples (explained
        in more detail later), who for example violate several of
        those assumptions, including buyer and sellers are
        ${text.b`price takers`} as well as ${text.b`free exit and entry`}
        as well as ${text.b`homonogenous goods`}.
      `,
    ],
  }),
  priceControlsInNSW: readmore({
    summary: ['Price Ceilings in NSW'],
    details: [
      doc.p`${IMAGES.ipartFounder}
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
  effiencyVsEquity: infobox({ title: 'Effiency Vs Equity' }).c(
    text.p.m`
      While government intervention reduces overall effiency, this may
      be a preferable outcome in terms of equity.
    `,
    text.p.m`
      Sometimes a market is viewed as pedatoral and a society may actually
      prefer it to be less effient. However most examples of this tend to
      be examples of markets with externalities (which is often the source
      a desire by the public for government intervention).
    `,
  ),
  adValoremTax: infobox({ title: 'Ad Valorem Tax' }).c(
    text.p.m`
      Ad Valorem taxes are percentage based
      taxes, these taxes are a percentage of
      the value of the price. Examples include
      stamp duty, GST and land value tax.
      Ad valorem Subsidies do exist as well.
    `,
  ),
};


/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: (_ctx, _state) => container(
    doc.h1`Government Intervention`,
    twoThree(
      container(
        text.p.l`
          Whenever governments intervenes in ${text.b`perfectly competitive`}
          markets, both producers and consumers are worse off. Note,
          ${text.b`perfectly competitive`} is an important qualitifier.
        `,
        text.p.l`
          Not all markets are perfectly competitive, very few in reality are, but
          many (but not all) are close enough for much of this to generally hold.
          Regardless, before asserting policy reform in the form of market
          liberalisation it is worth examining is the market question
          ${text.b`perfectly competitive`}.
        `,
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
    doc.h2`Price Controls, Anchors, and Limits`,
    text.p.l`
      Firstly, before price ceilings and floors can have an
      impact they need to be binging. For price ceilings
      this means it is below the market price, and for floors
      it means it is above the equilibrium. Otherwise they
      will have no effect.
    `,
    twoColumns(
      container(
        doc.h4`Price Ceiling, Excess demand`,
        text.p.l`
          A price ceiling is a maximum allowable price
          for goods in a given market. Some examples include,
          Road Toll prices, Council Rates, Water Rates, or
          Rent Controls.
        `,
        readmore({
          summary: ['Producer Implications'],
          details: [
            doc.p`
              While the price is effectively lowered this tends
              to reduce the overall quantity. In context of a
              shortage suppliers have no incentive to increase
              output, it is very likely they are already producing
              up to a point at which - if it were any higher their
              marginal costs would exceed their ability to repay them.
            `,
            doc.p`
              There is also less incentive to take on debt to increase
              production capacity as the market price would make repaying
              difficult.
            `,
          ],
        }),
        readmore({
          summary: ['Consumer Implications'],
          details: [
            doc.p`${IMAGES.survivorship}
              When a Price ceiling is binding, all the surplus
              under the equilibrium price and above the price ceiling
              that would have otherwise gone to the producer will go
              to the consumer. So are consumers always better off?
              It depends. One criticism of rent controls follows that
              it actualy subsidises incumbants, more generally price
              ceilings only really benefit those who manage to end up
              accessing the good.
            `,
            doc.p`
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
        doc.h4`Price Floor, Excess supply`,
        text.p.l`
          A price floor is a minimum allowable price for
          goods (or services) in a given market. Some examples
          include minimum wages, or support for farms.
        `,
        readmore({
          summary: ['Producer Implications'],
          details: [
            doc.p`
              This is fairly similar to the consumer implications
              for price ceilings, in that there are fewer
              opportunities to sell.
            `,
          ],
        }),
      ),
    ),
    READMORE.priceControlsInNSW,
    doc.h3`Deadweight loss`,
    text.p.l`
      While price controls change can increase and decrease the overall
      portion which goes to consumers or producers, overall sum will
      be reduced regardless. The area lost is called ${text.b`Deadweight loss`},
      we use the same term when refering to a reduction in overall surplus
      in a number of scenarios, including taxes, as well as any devations from
      equilibrium we see in imperfect markets such as monopolies.
    `,
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const taxesAndSubsidies = {
  meta: { kind: 'document' },
  render: (_ctx, _state) => container(
    doc.hr(),
    twoThree(
      container(
        doc.h2`Unit Taxes and Subsidies`,
        text.p.l`
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
        `,
        READMORE.modellingTaxesAndSubsidies,
        READMORE.taxesAndSubsidiesAsWedges,
        doc.h3`Difference between taxes on Supply and Demand`,
        text.p.l`
          In ${text.b`perfect competition`} with no other
          Government intervention, it actually doesn't matter.
          However, if you have a price floor or ceilling it will
          make a difference, but we are not talking about
          that here.
        `,
      ),
      container(
        infobox({ title: "Constraint solving Equilibrium" }).c(
          doc.div({ className: 'equilibrium-equation' }).c(
            mathml.solveForEqulibriumWithWedge(),
          ),
        ),
        INFOBOX.adValoremTax,
      ),
    ),
    twoColumns(
      dashbox(
        doc.h3`Tax Burden`,
        doc.p`
          While who pays the tax doesn't matter, it won't always be
          the case that everyone pays it equally (which has nothing
          to do with who pays). This is called ${text.b`Tax burden`}.
        `,
        mathml.curveExample(),
        doc.p`
          As a general rule, the tax burden is greatest held by the side
          is the more elastic portion of the market, or which ever
          curve has the steepest slope.
        `,
        doc.h4`Subsidy ${doc.s`Burden`} ${text.i`Beneficiary`}`,
        doc.p`
          Similarly, when there's a subsidy which ever of the two
          curves is the steepest (or elastic) will reap the
          greatest benefit of the subsidy.
        `,
        doc.h4`Computing Burden`,
        mathml.taxBurden(),
      ),
      dashbox(
        doc.h3`Price after Tax`,
        doc.p`
          The difference in price paid by consumers, won't be the
          size of the tax. If both curves have an identical
          magnitude for their slope, the difference will be ½ the
          size of the tax and it will be split evenly. But when it's
          not? The difference will be the size of the tax TIMES
          the size of their portion of the burden.
        `,
        doc.h3`Quantity after tax`,
        doc.p`
          Elasicity and the slope of the curves of the market will largely
          determine how many units will remain in the market after the
          introduction of a tax. Inelastic markets (steep curves) lose
          fewer units than elasitic markets (flatter curves).
          They also generate more ${text.b`Government Revenue`}.
        `,
        doc.h4`Computing the New Equilibrium`,
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
    text.p.l`Demand burden and Subsidy benefit are split identically`,
    twoColumns(
      base && tax && tables.taxBurden(demand, supply, base, tax),
      base && subsidy && tables.surplusBenefit(demand, supply, base, subsidy),
    ),
  ),
};
