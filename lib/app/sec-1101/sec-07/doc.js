/**
 * @import { E, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { table, doc } from '../../prelude.js';
import { dashbox, todo as docTodo, infobox } from '../common/components.js';
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
}, items.map(p => ['li', [p]])];

/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: () => container(
    dashbox(
      ['h1', 'Market Power and Monopolies'],
      doc.small(`
        In previous sections, we made certain assumptions about
        how the supply side of the market would behave. These
        assumptions described `, doc.b('perfect competition'), `.
        Monolopies on the other hand break many of those
        assumptions, and the market enters a state called `,
        doc.b('imperfect competition'), '.',
      ),
      twoColumns(
        container(
          ['h4', 'Perfect Competition Assumptions'],
          doc.small(['ul', { className: 'no-item-padding' }, [
            ['li', 'Consumers & producers are price-takers.'],
            ['li', 'Homogenous goods.'],
            ['li', 'No externalities.'],
            ['li', 'Goods are excludable and rival.'],
            ['li', 'Full information.'],
            ['li', 'Free entry and exit.'],
          ]]),
          doc.small(`
            As soon as one of these assumptions are violated,
            the market is no longer in perfect
            competition.
          `),
        ),
        container(
          ['h4', 'Pure Monopoly'],
          doc.small('Monopolies break the following assumptions'),
          doc.small(['ul', { className: 'no-item-padding' }, [
            ['li', 'Consumers & producers are price-takers.'],
            ['li', 'Homogenous goods.'],
            ['li', 'Free entry and exit.'],
          ]]),
          doc.small(`
             If the above 3 assumptions are violated we are
             dealing with a monopoly. The other 3 can hold
             if above 3 break dealing with a monopoly.
          `),
        ),
      ),
      ['hr'],
      doc.small(
        'In a monopoly, while consumers are still ',
        doc.b('price takers'), ` the sole producer is not.
        Given the monopolist is one providing the good or
        service, it is unique and therefore it is not
        a `, doc.b('homogenous good'), `. The uniqueness
        of the product is also what enables the monopolist
        to raise the price of that good without losing all
        their business. Lastly it's the case that there is
        no longer "`, doc.b('Free entry and exit'), `" which
        means new competition can no longer enter the market
        to challenge encumbants when they raise the price.`
      ),
    ),
    dashbox(
      ['h2', 'Additional Vocab'],
      twoColumns(
        doc.dl([
          ['Price-setter/marker', [doc.small('When a firm has the ability to set its own prices')]],
          ['Market Power', [doc.small('When a firm has the ability to be a price-setter')]],
          ['Monopoly', [doc.small(`
            A market structure in which there is only one firm in the market.
            The demand curve the monopoly firm faces will be that of the
            entire market.
          `)]],
        ]),
        doc.dl([
          ['Monopolisitic Competition', [doc.small(`
            A market with a large number of firms, each producing
            slightly differentiated goods. Such as `, doc.b('restraurants'), `,
            and `, doc.b('clothing brands'), `.
          `)]],
          ['Oligopolistic Competition', [doc.small(`
            A market with a small number of firms selling goods
            that are close substitutes. Think `, doc.b(`internet/cell
            service providers`), `, `, doc.b('Australian grocery stores'), `.
          `)]],
        ]),
      ),
      twoColumns(
        container(
          ['h4', 'Increasing returns to scale'],
          doc.small(`
             When the average cost of production
             decreases as the numebr of units increases.
             A single firm producting 10,000 units can
             do it cheaper than 100 companies producing
             100 units each. Think `, doc.b('mining'), `,
             `, doc.b('infrastructure'), `, `,
             doc.b('pharmaceuticals'), '.',
          ),
        ),
        container(
          ['h4', 'Natural Monopoly'],
          doc.small(`
             A monopoly that occurs because it experinces
             increasing returns to scale. (see `,
             doc.b('average cost pricing'), `.
          `),
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
    ['h2', 'Sources of Market power'],
    doc.small(`
      For the most part, monopolise are a result of
      some kind of `, doc.b('Barrier to entry'), `
      for producers to partipate in the market.
    `),
    twoColumns(
      doc.dl([
        ['Control over scarce resource', [
          doc.small('oil, diamonds, trade routes')
        ]],
        ['Government created barriers to entry', [
          doc.small('parents, copyright'),
        ]],
      ]),
      doc.dl([
        ['Increasing returns to scale', [
          doc.small('economies of scale, such as utilties'),
        ]],
        ['Network economies', [
          doc.small('iMessage, Facebook'),
        ]],
      ]),
    )
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const costBenefitPrinciple = {
  meta: { kind: 'document' },
  render: () => dashbox(
    ['h2', 'Cost benefit Principle RE: Monopolies'],
    doc.small(`
      While in perfect competition a firm will
      produce up to the point at which `,
      doc.b('Market Price ≥ Marginal Cost'), ` where
      as monopolist will produce each unit up to the
      point at which `,
      doc.b('Marginal Revenue ≥ Marginal Cost'), '.',
    ),
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
        ['h3', 'Monopoly, Profit Maximising'],
        doc.small(`
          Unlike in perfect competition, where the supply side
          is made up of many firms, in a monopoly it is a single
          firm. The implications of this is, they can charge a
          higher price without losing customers to competitors
          charging their marginal cost as their sale price. For
          that reason they will:
        `),
        ul(
          doc.small('Produce ', doc.b('Qm where MR = MC')),
          doc.small('Price ', doc.b('Pm along the demand curve at Qm')),
        ),
        doc.small(`
          To sell more units, the monopolists will need to lower
          their price. They will lower (or raise) their price
          until they're maximising their revenue. Again they are
          only afforded this luxury because they are they entire
          supply side of the market.
        `),
        mathml.marginalRevenue(),
      ),
      infobox('Profit Maximisation', [
        container(
          doc.p('Solve for marginal revenue'),
          ['div', { className: 'container', style: 'font-size: 14px' }, [
            mathml.calcMarginalRevenue(),
          ]],
          doc.p('Solve for profit Maximising Quantity'),
          ['div', { className: 'container', style: 'font-size: 14px' }, [
            mathml.profitMaximisingQuantity(),
          ]],
          doc.p('Monopolist Price'),
          ['div', { className: 'container', style: 'font-size: 14px' }, [
            mathml.monopolistPrice(),
          ]],
        ),
      ]),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const deadWeightLoss = {
  meta: { kind: 'document' },
  render: (ctx, {
    exampleB: { deadWeightLoss } = {},
  }) => dashbox(
    twoThree(
      ['h3', 'Dead Weight Loss'],
      deadWeightLoss && table(['Dead Weight Loss'], [
        [deadWeightLoss.size.toFixed(2)],
      ]),
    ),
    doc.small(`
      A consequence of the nature in how monopolies price is
      the dead weight loss resulting from the fact there are
      overall fewer units being produced by the monopoly.
      A big part of this is due to a `, doc.b('Revenue Trade off'), `.
      If they want to sell additional units they need to lower
      their price for all consumers.
    `),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const monopolyData = {
  meta: { kind: 'document' },
  render: () => container(
    doc.quote(docTodo({}, `
      Table showing "fixed cost", "variable cost",
      "total Cost", "marginal cost", "price",
      "total revenue", "marginal revenue",
    `)),
    doc.p('TODO - Highlight positive economic profit'),
    twoColumns(
      container(
        doc.p('TODO - highlight dead weight loss'),
        doc.p('TODO - highlight socially optimum'),
      ),
      docTodo({}, 'Show surplus'),
    ),
  ),
};


/**
 * @type {Widget<any, State, Config>}
 */
export const monopolyRegulation = {
  meta: { kind: 'document' },
  render: () => container(
    ['h1', 'Monopoly Regulation'],
    doc.p(`
      Unlike perfect competition where government
      interferance creates deadweight loss. By default
      Monopolies have dead weight loss due to the nature
      in which they charge at the highest price where their
      marginal revenue remains. In this case deadweight loss
      can be minimised with government interferance.
    `),
    twoColumns(
      container(
        ['h4', 'Competition Law'],
        doc.p('Regulations intended to foster market competition'),
      ),
      container(
        ['h4', 'Average Cost Pricing'],
        doc.p(`
          Government forces monopoly to set the price and
          quantity at the intersection of the ATC curve and
          demand curve. If the government were to force
          price to set at marginal cost the firm may regulate
          the firm out of existence.
        `),
        doc.p(`
          Average Cost Pricing, is still allocatively
          inefficient and there is still dead weight loss.
          But it's a compromise outcome.
        `)
      ),
    ),
    doc.quote(docTodo({}, 'math of Profit = Q * (P - ATC)')),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const priceDiscrimination = {
  meta: { kind: 'document' },
  render: () => container(
    ['h2', 'Price Discrimination'],
    ['h3', 'First Degree Price Discrimination'],
    // charging the reservation price
    doc.quote(docTodo({}, 'Explain 1st degree price discrimination')),
    doc.p('TODO - show math for TR'),
    ['h3', 'Second Degree Price Discrimination'],
    // think iPhone 10 vs iPhone SE
    doc.quote(docTodo({}, 'Explain 2nd degree price discrimination')),
    ['h3', 'Third Degree Price Discrimination'],
    // firm categorises the market
    // and splits them into sub markets
    doc.p('TODO - Explain 3rd degree price discrimination'),
    doc.p('TODO - table showing 3rd degree price discrimination'),
    doc.quote(docTodo({}, 'Example of seperate markets')),
  ),
};
