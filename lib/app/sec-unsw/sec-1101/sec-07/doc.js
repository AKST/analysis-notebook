/**
 * @import { E, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { frag, doc } from '@app/prelude.js';
import { dashbox, todo as docTodo, infobox, text } from '@prelude-uni/components.js';
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
    docTodo({}, `for "${label.trim()}" graphic`),
  ),
});

/**
 * @type {Widget<any, State, Config>}
 */
export const exampleA = ({
  meta: { kind: 'document' },
  render: (_ctx, state, cfg) => container(
    state.exampleA && tables.firmTable(state.exampleA, cfg.exampleA.fixedCost),
  ),
});


/**
 * @param {...E.Item} items
 * @returns {E.Item}
 */
const ul = (...items) => ['ul', {
  className: 'no-item-padding',
  style: 'padding-left: 16px',
}, items.map(p => text.li.m.of(p))];

/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: () => container(
    dashbox(
      doc.h1`Market Power and Monopolies`,
      doc.p`
        In previous sections, we made certain assumptions about
        how the supply side of the market would behave. These
        assumptions described ${doc.b`perfect competition`}.
        Monolopies on the other hand break many of those
        assumptions, and the market enters a state called ${
        doc.b`imperfect competition`}.
      `,
      twoColumns(
        container(
          doc.h4`Perfect Competition Assumptions`,
          ['ul', { className: 'no-item-padding' }, [
            doc.li`Consumers & producers are price-takers.`,
            doc.li`Homogenous goods.`,
            doc.li`No externalities.`,
            doc.li`Goods are excludable and rival.`,
            doc.li`Full information.`,
            doc.li`Free entry and exit.`,
          ]],
          doc.p`
            As soon as one of these assumptions are violated,
            the market is no longer in perfect
            competition.
          `,
        ),
        container(
          doc.h4`Pure Monopoly`,
          doc.p`Monopolies break the following assumptions`,
          ['ul', { className: 'no-item-padding' }, [
            doc.li`Consumers & producers are price-takers.`,
            doc.li`Homogenous goods.`,
            doc.li`Free entry and exit.`,
          ]],
          doc.p`
             If the above 3 assumptions are violated we are
             dealing with a monopoly. The other 3 can hold
             if above 3 break dealing with a monopoly.
          `,
        ),
      ),
      ['hr'],
      doc.p`
        In a monopoly, while consumers are still ${
        doc.b`price takers`}, the sole producer is not.
        Given the monopolist is one providing the good or
        service, it is unique and therefore it is not
        a ${doc.b`homogenous good`}. The uniqueness
        of the product is also what enables the monopolist
        to raise the price of that good without losing all
        their business. Lastly it's the case that there is
        no longer "${doc.b`Free entry and exit`}" which
        means new competition can no longer enter the market
        to challenge encumbants when they raise the price.
      `,
    ),
    dashbox(
      doc.h2`Additional Vocab`,
      twoColumns(
        doc.dl(
          doc.dt`Price-setter/marker`,
          doc.dd.of(doc.span`When a firm has the ability to set its own prices`),
          doc.dt`Market Power`,
          doc.dd.of(doc.span`When a firm has the ability to be a price-setter`),
          doc.dt`Monopoly`,
          doc.dd.of(doc.span`
            A market structure in which there is only one firm in the market.
            The demand curve the monopoly firm faces will be that of the
            entire market.
          `),
        ),
        doc.dl(
          doc.dt`Monopolisitic Competition`,
          doc.dd.of(doc.span`
            A market with a large number of firms, each producing
            slightly differentiated goods. Such as ${doc.b`restraurants`},
            and ${doc.b`clothing brands`}.
          `),
          doc.dt`Oligopolistic Competition`,
          doc.dd.of(doc.span`
            A market with a small number of firms selling goods
            that are close substitutes. Think ${doc.b`internet/cell
            service providers`}, ${doc.b`Australian grocery stores`}.
          `),
        ),
      ),
      twoColumns(
        container(
          doc.h4`Increasing returns to scale`,
          doc.p`
             When the average cost of production
             decreases as the numebr of units increases.
             A single firm producting 10,000 units can
             do it cheaper than 100 companies producing
             100 units each. Think ${doc.b`mining`},
             ${doc.b`infrastructure`}, ${doc.b`pharmaceuticals`}.
          `,
        ),
        container(
          doc.h4`Natural Monopoly`,
          doc.p`
             A monopoly that occurs because it experinces
             increasing returns to scale. (see ${
             doc.b`average cost pricing`}).
          `,
        ),
      ),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const originsOfMonopolies = {
  meta: { kind: 'document' },
  render: () => dashbox(
    doc.h2`Sources of Market power`,
    doc.p`
      For the most part, monopolise are a result of
      some kind of ${doc.b`Barrier to entry`}
      for producers to partipate in the market.
    `,
    twoColumns(
      doc.dl(
        doc.dt`Control over scarce resource`,
        doc.dd.of(doc.span`oil, diamonds, trade routes`),
        doc.dt`Government created barriers to entry`,
        doc.dd.of(doc.span`parents, copyright`),
      ),
      doc.dl(
        doc.dt`Increasing returns to scale`,
        doc.dd.of(doc.span`economies of scale, such as utilties`),
        doc.dt`Network economies`,
        doc.dd.of(doc.span`iMessage, Facebook`),
      ),
    )
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const costBenefitPrinciple = {
  meta: { kind: 'document' },
  render: () => dashbox(
    doc.h2`Cost benefit Principle RE: Monopolies`,
    doc.p`
      While in perfect competition a firm will
      produce up to the point at which ${
      doc.b`Market Price ≥ Marginal Cost`} where
      as monopolist will produce each unit up to the
      point at which ${
      doc.b`Marginal Revenue ≥ Marginal Cost`}.
    `,
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const profitMaximisingForMonopolies = {
  meta: { kind: 'document' },
  render: () => container(
    twoThree(
      dashbox(
        doc.h3`Monopoly, Profit Maximising`,
        doc.p`
          Unlike in perfect competition, where the supply side
          is made up of many firms, in a monopoly it is a single
          firm. The implications of this is, they can charge a
          higher price without losing customers to competitors
          charging their marginal cost as their sale price. For
          that reason they will:
        `,
        ul(
          doc.p`Produce ${doc.b`Qm where MR = MC`}`,
          doc.p`Price ${doc.b`Pm along the demand curve at Qm`}`,
        ),
        doc.p`
          To sell more units, the monopolists will need to lower
          their price. They will lower (or raise) their price
          until they're maximising their revenue. Again they are
          only afforded this luxury because they are they entire
          supply side of the market.
        `,
        mathml.marginalRevenue(),
      ),
      infobox({ title: 'Profit Maximisation' })(
        container(
          text.p.m`Solve for marginal revenue`,
          ['div', { className: 'container', style: 'font-size: 14px' }, [
            mathml.calcMarginalRevenue(),
          ]],
          text.p.m`Solve for profit Maximising Quantity`,
          ['div', { className: 'container', style: 'font-size: 14px' }, [
            mathml.profitMaximisingQuantity(),
          ]],
          text.p.m`Monopolist Price`,
          ['div', { className: 'container', style: 'font-size: 14px' }, [
            mathml.monopolistPrice(),
          ]],
        ),
      ),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const deadWeightLoss = {
  meta: { kind: 'document' },
  render: (ctx, state) => container(
    doc.quote`
      Note: there is an example on how to create a Average Total
      Cost curve towards the end of section on supply curves.
    `,
    tables.exampleTwoAreas(state),
    dashbox(
      doc.h3`Dead Weight Loss`,
      doc.p`
        A consequence of the nature in how monopolies price is
        the dead weight loss resulting from the fact there are
        overall fewer units being produced by the monopoly.
        A big part of this is due to a ${doc.b`Revenue Trade off`}.
        If they want to sell additional units they need to lower
        their price for all consumers.
      `,
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const monopolyRegulation = {
  meta: { kind: 'document' },
  render: () => dashbox(
    doc.h1`Monopoly Regulation`,
    doc.p`
      Unlike perfect competition where government
      interferance creates deadweight loss. By default
      Monopolies have dead weight loss due to the nature
      in which they charge at the highest price where their
      marginal revenue remains. In this case deadweight loss
      can be minimised with government interferance.
    `,
    doc.p`
      Here are 2 of many of the options when it comes

    `,
    twoColumns(
      container(
        doc.h4`Competition Law`,
        doc.p`
          Regulations intended to foster market competition and
          prevent the formation of monopolies. In the USA there
          are quite notable examples such as AT&T and Standard Oil,
          who were eventually dismantled. In Europe, you may have
          seen companies like Microsoft or Apple end up in the
          international headlines.
        `,
        doc.quote`
          In Australia it is often the ACCC who regulates much
          of this.
        `,
      ),
      container(
        doc.h4`Average Cost Pricing`,
        doc.p`
          Government forces monopoly to set the price and
          quantity at the intersection of the ATC curve and
          demand curve. If the government were to force
          price to set at marginal cost the firm may regulate
          the firm out of existence.
        `,
        doc.p`
          Average Cost Pricing, is still allocatively
          inefficient and there is still dead weight loss.
          But it's a compromise outcome.
        `,
        doc.quote`
          In NSW IPART is institution that regulates much of this,
          or at least the pricing by monopolies in NSW.
        `,
      ),
    ),
    ['hr'],
    mathml.averageCostPricing(),
    doc.quote`
      There are other forms of monopoly pricing regulations,
      however the discussion here will be limited to average
      cost pricing.
    `,
    doc.h3`Avg Cost Pricing or MC Price Ceiling?`,
    doc.p`
      Forcing a firm to use a pricing ceiling at the marginal
      cost, would likely result in negative economic surplus
      likely resulting in a collapse of the industry.

      If you're dealing with a natural monopoly where there
      are high fixed costs and low on going variable costs
      ${doc.b`Average Cost Pricing`} will make more
      sense. While there is still dead weight loss with
      Average Cost pricing, it is less than there would be
      without intervention.
    `,
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const priceDiscrimination = {
  meta: { kind: 'document' },
  render: () => dashbox(
    doc.h1`Price Discrimination`,
    doc.p`
      Price discrimination is a pricing strategy
      in which firms with market power charge
      customers different prices for the same or
      similar products in an atttempt to increase
      profits and capture a larger share of surplus.
    `,
    twoThree(
      container(
        doc.h3`First Degree Price Discrimination (FDPD)`,
        doc.p`
          First degree price discrimination is a situation
          in which a monopolist knows the reservation price
          of each consumer and is able ot charge them that
          exact price. This is largely theoretical.
        `,
        mathml.firstDegreePriceDiscriminationMR(),
      ),
      mathml.firstDegreePriceDiscriminationTR(),
    ),
    doc.h3`Second Degree Price Discrimination (SDPD)`,
    doc.p`
      Unlike FDPD, SDPD actually occurs in the real world.
      It's a situation in which the monopolist charges
      different prices depending on the quantity or the
      quality of products sold. Some examples:
    `,
    ul(
      frag([doc.b`Quantity`, ' — think bulk discounts, buy one get one deals']),
      frag([doc.b`Quality`, ' — think economy vs business class, iPhone 10 vs iPhone SE']),
    ),
    doc.p`SDPD tends to occur on a self selection basis.`,
    doc.h3`Third Degree Price Discrimination (TDPD)`,
    doc.p`
      Also like SDPD, TDPD occurs in the real world. Its a situation
      in which a monopolist charges customers different prices based
      on observable characteristic of the customer.

      For example, a firm may not your reservation price but it may be
      able discern a characteristic about you as a buyer, and will
      infer a price relative based on some assumptions relating to that
      observation based on some generalisations (like being a senior or
      student).
    `,

    doc.quote`
      When you have an unregularated monopoly, total surplus
      tends to be greater when they are performing price
      descrimination, and the those with the lowest williness
      to end up getting to afford the good. This is also the
      case when you have 3rd degree price discrimination.
    `,
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const exampleC = ({
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    ...tables.exampleThreeMarketSegments(state),
  ),
});
