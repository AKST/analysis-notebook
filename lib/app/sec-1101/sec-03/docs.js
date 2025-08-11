/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import { infobox, todo } from '../common/components.js';
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

/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    ['h1', 'Demand Curve'],
    doc.p(`
      Similar to how the producers decisions on how many
      units they ought to produce is made at the margins,
      when consumer are weighing the number of units they
      want to consume, they will make this decision at the
      margins.
    `),
    ['h2', 'Marginal Utility'],
    twoThree(
      doc.p(`
        In economics we often describe this value in terms of
        utility, and almost always within a certain time frame,
        as utility will vary over different time spans. Water is
        a good example of this, in that you the value or utility
        you get from your first glass of water decreases with
        each glass.

        100 glasses in a hour would have a significantly
        different demand curve compared with 100 glasses over a week.
      `),
      infobox('Decreasing marginal utility', [
        doc.p(`
          Decreasing marginal utilty implies that
          the utility from consuming an extra unit
          of a given good decrease with the number of
          units that have been previously consumed.
        `),
      ]),
    ),
    doc.p(`
      We call this `, doc.b('Utils per unit of time'), ` often with
      a specific unit of time given its significance.
    `),
    twoColumns(
      doc.dl([
        ['Quantity Demanded', [`
          In the above table the point at which the demand for
          Muffins drops below the demand for Donuts is the `,
          doc.b('Quantity Demanded'), ` for muffins.
        `]],
        // technically its defined as "the quantity consumed
        // reducing following an increase in its price, or
        // a increase in consumpution when its price decreases.
        ['Substitution Effect', [`
          When the price of muffins increases to the point at
          which its MU/$ for quantity demanded drops below
          the marginal utilty for first donut, that is called
          the `, doc.b('Substitution effect'), `. This is almost
          always stronger than the income effect.
        `]],
      ]),
      doc.dl([
        ['Income Effect', [`
          The `, doc.b('Income Effect'), ` is when the demand
          for a `, doc.b('normal good'), ` increases as income
          increases, and demand for an `, doc.b('Inferior good'),`
          decreases.
        `]],
        ['Law of Demand', [doc.p(`
          In general, price and quantity tend to move in opposite
          directions. When a price increases the quantity demanded
          decreases, and when the price decreases the quantity
          demanded increases. This is why the demand curve slops down.
        `, '[', ['a', { href: 'https://en.wikipedia.org/wiki/Law_of_demand' }, [
            'Link'
        ]], ']')]],
      ]),
    ),
    doc.p(`
      Below are two tables showing the marginal utility for 2 goods.
    `),
    state.utility && tables.utilityTables(state.utility, {
      marginalUtilPer$: true,
    }),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const kindsOfgoods = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    state.utility && tables.choiceOfGood(state.utility),
    twoColumns(
      container(
        ['h3', 'Substitutes'],
        doc.p(`
          Two goods (A & B) are substitutes when an increase
          in the price of one (A) results in an increase in
          quantity demanded for the other (B).
        `),
      ),
      container(
        ['h3', 'Complements'],
        doc.p(`
          Two goods (A & B) are substitutes when an decrease
          in the price of one (A) results in an increase in
          quantity demanded for the other (B).
        `),
      ),
    ),
    doc.p(`
      Given how the demand curve for Muffin changes in response
      to donuts and vice versa, it sounds like these two goods
      are substitutes.
    `),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const reservationPrice = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    ['hr'],
    twoThree(
      container(
        ['h2', 'Reservation Price'],
        doc.p(`
          The `, doc.b('reservation price'), ` is also the vertical
          interpretation of the demand curve, in that it's the price
          you end up after taking a given quantity and seeing which
          price intercepts with it on the demand curve.
        `),
        doc.p(`
          In short its the maximum price the consume is willing to pay
          for that quantity of goods.
        `),
      ),
      infobox('Reservation Price', [
        container(
          doc.p(`
            Not really covered in this course
            but marginal the reservation price
            is actually computed with the
            marginal utility of income.
          `),
          ['div', { className: 'math-mrs' }, [
            mathml.reservationPrice(),
          ]],
        ),
      ])
    ),
    twoThree(
      doc.p(`
        Given the only use of money was donuts and muffins
        you would calculuate the the Resevation price of
        muffins like so (shown in the table as well).
      `),
       mathml.reservationPriceCourse(),
    ),
    state.utility && tables.utilityTables(state.utility, {
      reservationPrice: true,
    }),
    doc.quote(`
      Note: the reserve price for a good is its demand curve.
      Also note how changing the price of muffins does not change the
      curve, but changing the price of donuts does. That is the
      substitution effect in action.
    `),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const relativeValue = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    ['h3', 'Relative Value'],
    doc.quote(`
      This isn't all that relevant to the content,
      but this shows what happens when repeat
      computing the reserve price for the other good.
    `),
    twoThree(
      container(
        doc.p(`
          I'm admittedly not sure what a meaningful interpretation
          of the increasing curve below. From what I understand
          reservation price is actually computed with the marginal
          utility of income, where as here the below curves are
          showing a relative valuation for either good after consuming
          X number of either good.
        `)
      ),
      infobox('Relative Value', [
        container(
          ['div', { className: 'math-mrs' }, [
            mathml.relativeValue(),
          ]],
        ),
      ]),
    ),
    doc.p(`
      One of the curves will be rising while the other will be
      declining, the rising curve is more a representation of
      how little value they see in consuming the declining good than
      an increase preference for the rising good.
    `),
    state.utility && tables.utilityTables(state.utility, {
      relativeValue: true,
    }),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const curveShifts = {
  meta: { kind: 'document' },
  render: () => container(
    ['h2', 'Curve shifts'],
    doc.p(`
      Here are some reasons why the curve of some
      good would shift to the right.
    `),
    ['ul', { className: 'c2' }, [
      ['li', 'An increase in the price of substitutes'],
      ['li', 'Decrease in the price of complements'],
      ['li', [
        doc.b('Inferior good'), ': an decrease in the income.'
      ]],
      ['li', [
        doc.b('Normal good'), ': an increase in the income.'
      ]],
      ['li', 'An expectation of a price increase.'],
      ['li', 'A positive shift in consumers\' preferences.'],
      ['li', 'Successful marketing campaign'],
      ['li', 'Population Growth.'],
    ]],

  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const elascity = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    ['h2', 'Demand Elascity'],
    twoThree(
      doc.p(`
        Elascity is computed the same way for Demand, but
        it is worth pointing out what changes here is the
        slope of the curve in which elascity is being
        computed on.
     `),
      mathml.elasticity(),
    ),
    twoThree(
      doc.p(`
        Given the different direction of the slope the elascity
        is almost always negative, so if we want to use the rules
        from supply elascity to determine elascity, we just need
        to make sure we use the absolute value, or use a negative sign.
      `),
       tables.elasticityConditions(),
    ),
    doc.p('Futhermore:'),
    ['ul', { className: 'c2' }, [
      ['li', [doc.b('Perfect Elastic'), `:
        When the demand curve is represented by a
        horizontal straight line, meaning quantity
        demanded is infinite, `, doc.b('at a given price'), `
        any price change would eliminate demand.
      `]],
      ['li', [doc.b('Perfect inelastic'), `:
        When the demand curve is represented by a
        vertical straight line, meaning quantity
        demanded is fixed, `, doc.b('at any price'), `.
        A change in price would have no effect on demand.
      `]],
    ]],
    ['h4', 'Determinants of Elascity'],
    twoColumns(
      ['dl', [
        ['dt', 'Avaiablilty of Subtitutes'],
        ['dd', [
          doc.p(`
            The more substitutes, the more elasitic
            the demand for a good or service will be.
            If there are many substitutes, there are
            many substitutes for consumers to turn to
            when there' an increase in price.
          `)
        ]],
        ['dt', 'Definition of a good'],
        ['dd', [
          doc.p(`
            The boarder the definition of a good (or
            service), the lower the elasicity. Take
            Salt for example, if all of salt increased
            in price there would be few alternatives,
            but if one brand of salt increased out all
            the brands, there would be more substitutes.
          `)
        ]],
      ]],
      ['dl', [
        ['dt', 'Income Share'],
        ['dd', [
          doc.p(`
            The higher the share of income to purchase a good
            the more elastic the good will become. Versus goods
            that take up a smaller portion of income, you will
            likely not notice an increase in price.
          `)
        ]],
        ['dt', 'Time Horizon'],
        ['dd', [
          doc.p(`
            The longer the time horizon, the higher the
            elasticity, given there are more time to
            consider alternatives.
          `)
        ]],
      ]],
    ),
    ['h4', 'Point Elascity'],
    doc.p(`
      Below is the point elascity for muffins, where
      the price (P) is the reserve price.
    `),
    state.utility && tables.elasicityTable(state.utility),
  ),
};

