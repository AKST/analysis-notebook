/**
 * @import { E, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
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
export const header = {
  meta: { kind: 'document' },
  render: () => container(
    ['h1', 'Market Power and Monopolies'],
    ['p', [`
      In previous sections, we made certain assumptions about
      how the supply side of the market would behave. These
      assumptions described `, doc.b('perfect competition'), `.
      Monolopies on the other hand break many of those
      assumptions, and the market enters a state called `,
      doc.b('imperfect competition'), '.',
    ]],
    twoColumns(
      container(
        ['h4', 'Perfect Competition Assumptions'],
        ['ul', { className: 'no-item-padding' }, [
          ['li', 'Consumers & producers are price-takers.'],
          ['li', 'Homogenous goods.'],
          ['li', 'No externalities.'],
          ['li', 'Goods are excludable and rival.'],
          ['li', 'Full information.'],
          ['li', 'Free entry and exit.'],
        ]],
        doc.p(`
          As soon as one of these assumptions are violated,
          the market is no longer in perfect
          competition.
        `),
      ),
      container(
        ['h4', 'Pure Monopoly'],
        ['p', 'Monopolies break the following assumptions'],
        ['ul', { className: 'no-item-padding' }, [
          ['li', 'Consumers & producers are price-takers.'],
          ['li', 'Homogenous goods.'],
          ['li', 'Free entry and exit.'],
        ]],
        doc.p(`
           If the above 3 assumptions are violated we are
           dealing with a monopoly. The other 3 can hold
           if above 3 break dealing with a monopoly.
        `),
      ),
    ),
    ['hr'],
    doc.p(
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
    ['h2', 'Additional Vocab'],
    twoColumns(
      doc.dl([
        ['Price-setter/marker', 'When a firm has the ability to set its own prices'],
        ['Market Power', 'When a firm has the ability to be a price-setter'],
        ['Monopoly', `
          A market structure in which there is only one firm in the market.
          The demand curve the monopoly firm faces will be that of the
          entire market.
        `],
      ]),
      doc.dl([
        ['Monopolisitic Competition', [`
          A market with a large number of firms, each producing
          slightly differentiated goods. Such as `, doc.b('restraurants'), `,
          and `, doc.b('clothing brands'), `.
        `]],
        ['Oligopolistic Competition', [`
          A market with a small number of firms selling goods
          that are close substitutes. Think `, doc.b(`internet/cell
          service providers`), `, `, doc.b('Australian grocery stores'), `.
        `]],
      ]),
    ),
    twoColumns(
      container(
        ['h4', 'Increasing returns to scale'],
        ['p', 'TODO - economies of scale'],
      ),
      container(
        ['h4', 'Natural Monopoly'],
        ['p', 'TODO'],
      ),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const touchingOnPerjectCompetition = {
  meta: { kind: 'document' },
  render: () => container(
    ['h2', 'Reminder about Perfect competition'],
    doc.p('TODO'),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const originsOfMonopolies = {
  meta: { kind: 'document' },
  render: () => container(
    ['h2', 'Sources of Market power'],
    doc.p(`
      For the most part, monopolise are a result of
      some kind of `, doc.b('Barrier to entry'), `
      for producers to partipate in the market.
    `),
    twoColumns(
      doc.dl([
        ['Control over scarce resource', 'TODO'],
        ['Government created barriers to entry', 'TODO'],
      ]),
      doc.dl([
        ['Increasing returns to scale', [
          container(
            doc.p('TODO - economies of scale'),
          )
        ]],
        ['Network economies', 'TODO'],
      ]),
    )
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const costBenefitPrinciple = {
  meta: { kind: 'document' },
  render: () => container(
    ['h2', 'Cost benefit Principle RE: Monopolies'],
    doc.p('TODO'),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const profitMaximisingForMonopolies = {
  meta: { kind: 'document' },
  render: () => container(
    twoThree(
      container(
        ['h3', 'Monopoly, Profit Maximising'],
        doc.p('TODO - elaborate on difference in behaviour'),
        doc.p('TODO - produces quantity where MR = MC'),
        doc.p('TODO - price will be along the demadn curve'),
        doc.p('TODO - acknowledge the trade off between price and quantity'),
      ),
      infobox('Profit Maximisation', [
        container(
          doc.p('TODO'),
          docTodo({}, 'show marginal revenue'),
          docTodo({}, 'explain how Qm is at MR = MC'),
        ),
      ]),
    ),
    twoColumns(
      container(
        doc.p(`
          TODO - mention shortcut where marginal revenue is
          twice as steep as marginal cost
        `),
      ),
      docTodo({}, 'infobox for marginal revenue'),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const revenueTradeOff = {
  meta: { kind: 'document' },
  render: () => container(
    ['h2', 'Revenue Trade off'],
    ['p', ['TODO - describe revenue trade off']],
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
