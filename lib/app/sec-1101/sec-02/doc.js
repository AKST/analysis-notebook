/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import * as prelude from '../prelude.js';
import {
  doc,
  colorHex,
} from '../../prelude.js';

const { infobox } = prelude.components;
const common = prelude.components;
const { text } = prelude.components;
const { twoThree, fontsize, container } = prelude.layout;
import * as mathml from './mathml.js';
import * as tables from './tables.js';
export { createStyle } from './style.js';

const LINKS = {
  funcDep: doc.a({ href: 'https://en.wikipedia.org/wiki/Functional_dependency' }),
};

/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => ({
  meta: { kind: 'document' },
  render: () => container(
    common.todo({}, `for "${label.trim()}" graphic`),
  ),
});

/**
 * @type {Widget<any, State, Config>}
 */
export const intro = {
    meta: { kind: 'document' },
    render: (_ctx, _state) => container(
      doc.h1`Supply Curve`,
      ['div', { className: 'c2 twoThree' }, [
        container(
          doc.h2`Marginal Cost`,
          doc.p`
            In economics we tend to think at the
            margin. In practise this means inrespective
            of sunk costs, if you could produce one of
            2 goods, to think at the margins would be
            to decide producing one more of either good
            based on an evaluation of the cost/benefit of
            producing an additional good of either kind.
          `,
        ),
        infobox({ title: 'Reservation Price' })(
          doc.p`
            The marginal cost is also know as
            the resevation price, in that it is
            the lowest price someone (within the
            model) is willing to accept in
            exchange for each a quantity of a
            given good they produce.
          `,
        ),
      ]],
      doc.h3`Modelling discrete costs`,
      doc.p`
        This section here isn't too important, but I
        wanted to document some thoughts on modelling.
      `,
      ['div', { className: 'c2' }, [
        container(
          doc.h4`Cumulative Cost`,
          doc.p`
            This function takes x and returns
            a cumulative cost (y) to produce
            x number of goods.
          `,
          fontsize(mathml.marginalCost(), 24),
          doc.h4`Time to Output`,
          doc.p`
            This function takes an amount of
            time (y) and returns the number
            of goods that can be produced.
          `,
          fontsize(mathml.timeToOutput(), 20),
        ),
        container(
          doc.h4`Vectors`,
          doc.p`
            To produce either function you
            need either cumulative costs or
            marginal costs. If you have one
            of them you can compute the other.
          `,
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
      doc.h3`An Example`,
      text.p.l`
        Here we can see the marginal cost and profit for
        ${doc.font({ color: colorHex(fish.color) })`Fish`} and,
        ${doc.font({ color: colorHex(apple.color) })`Apples`}.
      `,
      ['div', { className: 'c2 center' }, [
        tables.margins(fish.table, apple.table, {
          cost: 'Hours',
          unit: 'Fish',
        }),
        tables.margins(apple.table, fish.table, {
          cost: 'Hours',
          unit: 'Apples',
        }),
      ]],
      ['div', { className: 'relevance-disclaimer' }, [
        ['div', { className: 'relevance-disclaimer-2' }, [
          doc.p`${doc.b`Note`}:
            These charts below are some what arbitrary.
            They were mostly added with the intent of seeing
            these values change in relation to one another.
          `,
        ]],
      ]],
    );
  },
};

/**
 * @type {Widget<any, State, Config>}
 */
export const quantity = {
  meta: { kind: 'document' },
  render: () => container(
    doc.h3`Quantity Produced?`,
    doc.p`
      Referring back to the concept of the reservation
      price, a producer will only produce goods as long
      as the return is above (or at) their marginal cost.
    `
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
        doc.h3`Different kinds of Costs`,
        doc.dl(
          doc.dt`Fixed Cost`,
          doc.dd`
            Costs associated with fixed facotrs of
            production, do not vary with the quantity
            produced (machinery, rent, etc).
          `,
          doc.dt`Sunk costs`,
          doc.dd`
            Costs that, once paid, cannot be recovered.
            All sunk costs are fixed.
          `,
          doc.dt`Variable costs`,
          doc.dd`
            costs associated with variable factors of
            production, will vary wit the quantity
            produced (materials, variable labour, etc).
          `,
        ),
        doc.h3`Other Terms`,
        doc.dl(
          doc.dt`Fixed Factor of Production`,
          doc.dd`
            If a factor of production is fixed,
            then the cost associated with it does
            not vary with the quantity produced.
          `,
          doc.dt`Variable Factor of Production`,
          doc.dd`
            If a factor of production is variable,
            then the cost associated with it tends
            to vary with the number of units produced
          `,
        ),
      ),
      container(
        infobox({ title: 'Cost Benefit Principle' })(
          text.p.m`
            If the marginal benefit (MB) of taking an
            action is greater of equal to the marginal
            cost (MC) of taking the action, you should
            do it.
          `,
          doc.br(),
          ['span', { className: 'cbp' }, [
            mathml.costBenefitPrinciple(),
          ]],
        ),
        infobox({ title: 'Law of Supply' })(
          text.p.m`
            There is a tendency to offer more of a certain
            good of service when the price of that good or
            service increases.
          `,
        ),
        infobox({ title: 'Economic Surplus' })(
          text.p.m`
            The difference between the marginal benefit
            and the marginal cost of taking an action.
          `,
        ),
      ),
    ]],
    doc.h2`Supply Curve of a Firm`,
    doc.p`
      Referring back to the concept of the reservation
      price, a producer will only produce goods as long
      as the return is above (or at) their marginal cost.
    `,
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
  render: (_ctx, state, cfg) => common.dashbox(
    doc.h2`Timeframe for a firm`,
    ['div', { className: 'c2' }, [
      doc.dl(
        doc.dt`Short run`,
        doc.dd.of(
          doc.p`
            In the short run you've already paid your
            fixed costs. To continue operating, you
            want to at least cover your variable costs.
          `, ['br'], doc.quote`
            At least one factor is fixed.
          `,
        ),
        doc.dt`Long run`,
        doc.dd.of(
          doc.p`
            In the long run, you need to be profitable.
            You don't want to open a new business/renew
            your fixed constracts unless you can cover
            all your costs.
          `, ['br'], doc.quote`
            At least one factor is fixed.
          `,
        ),
      ),
      container(
        doc.dl(
          doc.dt`Short run shut down condition`,
          doc.dd`
            The Entrepreneur should shut down
            production if Profit < -FC
            (of Price < min AVC).
          `,
          doc.dt`Long run shut down condition`,
          doc.dd`
            The Entrepreneur should exit the industry
            if Profit < 0 (of Price < min ATC).
          `,
        ),
        state.firm && tables.shutdownConditions(
          cfg.firm.fixedCost,
          state.firm,
        ),
      ),
    ]],
    doc.p`
      If a firm mets all operating conditions
      then they should should operate where
      ${doc.b`MB = MC`} to choose optimal Quantity to
      maximise profit.
    `,
    ['div', { className: 'c2 twoThree' }, [
      container(
        doc.h2`Elasticity of Supply`,
        doc.p`Here are some determinants of elasticity of supply`,
        doc.dl(
          doc.dt`Availablity of raw materials`,
          doc.dd`
              A greater availablity of resources contributes
              to greater elasticity. For example, when a
              market has a sudden surge in demand, a scarcity
              of resources would be prevented from supplying
              in response to the demand for that good.
          `,
          doc.dt`Factory Mobility`,
          doc.dd`
              Mobility of production factors is the ease at
              which the factors of production can be diverted
              to produce different goods. Greater mobility
              contributes to greater elasticity.
          `,
          doc.dt`Inventory/Excess Capacity`,
          doc.dd`
              The greater the excess inventory more easily
              supply can respond to an increase demand.
              Those with less inventory relative to their
              competitors will run out of stock before their
              competitors.
          `,
          doc.dt`Time Horizon`,
          doc.dd`
              The more time time producers have to adjust
              their production plans the more elastic
              their suppy will be.
          `,
        ),
      ),
      container(
        infobox({ title: 'Elasticity Formular' })(
          container(
            text.p.m`
              Elasticity is ${LINKS.funcDep`functionally dependent`}
              on Price and quanity, as it is simply a measurement of
              their relationship and how they change
              to one another. You cannot take it
              and calculate Price of quantity.
              But the moment you have Price of
              Quantity you have the other and
              elasticity. This is called a
              second order property, it
              describes how the system behaves.
            `,

            doc.h3`Different ways to compute`,
            ['div', { className: 'elasticity' }, [
              mathml.elasticity()
            ]],
            text.p.m`This is point elasticity`,
          ),
        ),
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

/**
 * @type {Widget<any, State, Config>}
 */
export const deriveAtcAndAvcFromMC = {
  meta: { kind: 'document' },
  render: (_ctx, state, cfg) => common.dashbox(
    doc.h2`Partial ATC and AVC from MC`,
    twoThree(
      container(
        doc.p`
          While more information is need to get a firms precise
          ATC and AVC, you can get a partial form of the ATC &
          AVC by integrating the supply / MC curve.
        `,
        doc.h3`Why would that be useful?`,
        doc.p`
          Well if you want to simulate the supply side of the
          market it gives you some structure in how to approach
          it if you're working backwards from the MC. If you have
          statistical information about the distribution of the
          unknown values then you could also simulate that as well.
          Assuming a normal distribution is unwise but for a simple
          simulation it is fine to illustrate the value of such a
          system.
        `,
      ),
      infobox({ title: 'Derive Parital ATC & AVC' })(
        ['div', { style: 'font-size: 14px' }, [
          mathml.mcToAtcAndAvc(),
        ]],
      ),
    ),
  ),
};
