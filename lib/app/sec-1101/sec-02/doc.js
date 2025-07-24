/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import {
  doc,
  colorHex,
} from '../../prelude.js';
import * as common from '../common/components.js';
import { fontsize, container } from '../common/layout.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';
export { createStyle } from './style.js';

/**
 * @type {Widget<any, State, Config>}
 */
export const intro = {
    meta: { kind: 'document' },
    render: (_ctx, _state) => container(
      ['h1', 'Supply Curve'],
      ['div', { className: 'c2 twoThree' }, [
        container(
          ['h2', 'Marginal Cost'],
          doc.p(`
            In economics we tend to think at the
            margin. In practise this means inrespective
            of sunk costs, if you could produce one of
            2 goods, to think at the margins would be
            to decide producing one more of either good
            based on an evaluation of the cost/benefit of
            producing an additional good of either kind.
          `),
        ),
        common.infobox('Reservation Price', [
          doc.p(`
            The marginal cost is also know as
            the resevation price, in that it is
            the lowest price someone (within the
            model) is willing to accept in
            exchange for each a quantity of a
            given good they produce.
          `),
        ]),
      ]],
      ['h3', 'Modelling discrete costs'],
      doc.p(`
        This section here isn't too important, but I
        wanted to document some thoughts on modelling.
      `),
      ['div', { className: 'c2' }, [
        container(
          ['h4', 'Cumulative Cost'],
          doc.p(`
            This function takes x and returns
            a cumulative cost (y) to produce
            x number of goods.
          `),
          fontsize(mathml.marginalCost(), 24),
          ['h4', 'Time to Output'],
          doc.p(`
            This function takes an amount of
            time (y) and returns the number
            of goods that can be produced.
          `),
          fontsize(mathml.timeToOutput(), 20),
        ),
        container(
          ['h4', 'Vectors'],
          doc.p(`
            To produce either function you
            need either cumulative costs or
            marginal costs. If you have one
            of them you can compute the other.
          `),
          mathml.vectorDefs(),
        ),
      ]],
    ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const example = {
  meta: { kind: 'document' },
  render: (_ctx, state) => {
    if (state.examples == null) return undefined;
    const { apple, fish } = state.examples;
    return container(
      ['h3', 'An Example'],
      ['p', [
        'Here we can see the marginal cost and profit for ',
        doc.font({ color: colorHex(fish.color) }, 'Fish'), ' and ',
        doc.font({ color: colorHex(apple.color) }, 'Apples'), '.',
      ]],
      ['div', { className: 'c2 center' }, [
        tables.margins(apple.table, fish.table, {
          cost: 'Time',
          unit: 'Apples',
        }),
        tables.margins(fish.table, apple.table, {
          cost: 'Time',
          unit: 'Fish',
        }),
      ]]
    );
  },
};

/**
 * @type {Widget<any, State, Config>}
 */
export const quantity = {
  meta: { kind: 'document' },
  render: () => container(
    ['h3', 'Quantity Produced?'],
    doc.p(`
      Referring back to the concept of the reservation
      price, a producer will only produce goods as long
      as the return is above (or at) their marginal cost.
    `)
  )
};

/**
 * @type {Widget<any, State, Config>}
 */
export const kindsOfCosts = {
  meta: { kind: 'document' },
  render: (_ctx, state, cfg) => container(
    ['div', { className: 'c2 twoThree' }, [
      container(
        ['h3', 'Different kinds of Costs'],
        doc.dl([
          ['Fixed Cost', `
            Costs associated with fixed facotrs of
            production, do not vary with the quantity
            produced (machinery, rent, etc).
          `],
          ['Sunk costs', `
            Costs that, once paid, cannot be recovered.
            All sunk costs are fixed.
          `],
          ['Variable costs', `
            costs associated with variable factors of
            production, will vary wit the quantity
            produced (materials, variable labour, etc).
          `],
        ]),
        ['h3', 'Other Terms'],
        doc.dl([
          ['Fixed Factor of Production', `
            If a factor of production is fixed,
            then the cost associated with it does
            not vary with the quantity produced.
          `],
          ['Variable Factor of Production', `
            If a factor of production is variable,
            then the cost associated with it tends
            to vary with the number of units produced
          `],
        ]),
      ),
      container(
        common.infobox('Cost Benefit Principle', [
          doc.p(`
            If the marginal benefit (MB) of taking an
            action is greater of equal to the marginal
            cost (MC) of taking the action, you should
            do it.
          `),
          ['span', { className: 'cbp' }, [
            mathml.costBenefitPrinciple(),
          ]],
        ]),
        common.infobox('Law of Supply', [
          doc.p(`
            There is a tendency to offer more of a certain
            good of service when the price of that good or
            service increases.
          `),
        ]),
        common.infobox('Economic Surplus', [
          doc.p(`
            The difference between the marginal benefit
            and the marginal cost of taking an action.
          `),
        ]),
      ),
    ]],
    ['h2', 'Supply Curve of a Firm'],
    doc.p(`
      Referring back to the concept of the reservation
      price, a producer will only produce goods as long
      as the return is above (or at) their marginal cost.
    `),
    state.firm && tables.firmSupplyCurve(
      cfg.firm.fixedCost,
      state.firm,
    ),
  )
};

/**
 * @type {Widget<any, State, Config>}
 */
export const elascity = {
  meta: { kind: 'document' },
  render: (_ctx, state, cfg) => container(
    ['h2', 'Timeframe for a firm'],
    ['div', { className: 'c2' }, [
      doc.dl([
        ['Short run', `
          In the short run you've already paid your
          fixed costs. To continue operating, you
          want to at least cover your variable costs.
        `],
        ['Long run', `
          In the long run, you need to be profitable.
          You don't want to open a new business/renew
          your fixed constracts unless you can cover
          all your costs.
        `],
      ]),
      container(
        doc.dl([
          ['Short run shut down condition', `
            The Entrepreneur should shut down
            production if Profit < -FC
            (of Price < min AVC).
          `],
          ['Long run shut down condition', `
            The Entrepreneur should exit the industry
            if Profit < 0 (of Price < min ATC).
          `],
        ]),
        state.firm && tables.shutdownConditions(
          cfg.firm.fixedCost,
          state.firm,
        ),
      ),
    ]],
    doc.p(`
      If a firm mets all operating conditions
      then they should should operate where
      MB = MC to choose optimal Quantity to
      maximise profit.
    `),
    // ['div', { className: 'bigMath' }, [
    //   mathml.optimalNumberOfWorkers(),
    // ]],
    ['div', { className: 'c2 twoThree' }, [
      container(
        ['h2', 'Elasticity of Supply'],
        doc.p('Here are some determinants of elasticity of supply'),
        doc.dl([
          ['Availablity of raw materials', `
              A greater availablity of resources contributes
              to greater elasticity. For example, when a
              market has a sudden surge in demand, a scarcity
              of resources would be prevented from supplying
              in response to the demand for that good.
          `],
          ['Factory Mobility', `
              Mobility of production factors is the ease at
              which the factors of production can be diverted
              to produce different goods. Greater mobility
              contributes to greater elasticity.
          `],
          ['Inventory/Excess Capacity', `
              The greater the excess inventory more easily
              supply can respond to an increase demand.
              Those with less inventory relative to their
              competitors will run out of stock before their
              competitors.
          `],
          ['Time Horizon', `
              The more time time producers have to adjust
              their production plans the more elastic
              their suppy will be.
          `],
        ]),
      ),
      container(
        common.infobox('Elasticity Formular', [
          container(
            ['p', [
              'Elasticity is ',
              ['a', {
                href: 'https://en.wikipedia.org/wiki/Functional_dependency',
              }, 'functionally dependent'],
              ` on Price and quanity, as it
              is simply a measurement of their
              relationship and how they change
              to one another. You cannot take it
              and calculate Price of quantity.
              But the moment you have Price of
              Quantity you have the other and
              elasticity. This is called a
              second order property, it
              describes how the system behaves.`,
            ]],

            ['h3', 'Different ways to compute'],
            ['div', { className: 'elasticity' }, [
              mathml.elasticity()
            ]],
            ['p', 'This is point elasticity'],
          ),
        ]),
        ['span', { className: 'elasticity-table' }, [
          tables.elasticityConditions(),
        ]],
      ),
    ]],
    state.firm && tables.elasicityTable(state.firm),
    ['quote', [
      'Note: Price here is the Marginal cost at ',
      'the given quantity, not the market price ',
      'specified earlier.'
    ]],
  ),
};
