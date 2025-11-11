/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { infobox, todo, text } from '@prelude-uni/components.js';
import { container, twoColumns, twoThree } from '@prelude-uni/layout.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const LINKS = {
  lawOfDemand: doc.a({ href: 'https://en.wikipedia.org/wiki/Law_of_demand' }),
};

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
    doc.h1`Demand Curve`,
    text.p.l`
      Similar to how the producers decisions on how many
      units they ought to produce is made at the margins,
      when consumer are weighing the number of units they
      want to consume, they will make this decision at the
      margins.
    `,
    doc.h2`Marginal Utility`,
    twoThree(
      text.p.l`
        In economics we often describe this value in terms of
        utility, and almost always within a certain time frame,
        as utility will vary over different time spans. Water is
        a good example of this, in that you the value or utility
        you get from your first glass of water decreases with
        each glass.

        100 glasses in a hour would have a significantly
        different demand curve compared with 100 glasses over a week.
      `,
      infobox({ title: 'Decreasing marginal utility' })(
        text.p.m`
          Decreasing marginal utilty implies that
          the utility from consuming an extra unit
          of a given good decrease with the number of
          units that have been previously consumed.
        `,
      ),
    ),
    text.p.l`
      We call this ${doc.b`Utils per unit of time`} often with
      a specific unit of time given its significance.
    `,
    twoColumns(
      doc.dl(
        doc.dt`Quantity Demanded`,
        doc.dd.of(text.p.l`
          In the above table the point at which the demand for
          Muffins drops below the demand for Donuts is the
          ${doc.b`Quantity Demanded`} for muffins.
        `),
        // technically its defined as "the quantity consumed
        // reducing following an increase in its price, or
        // a increase in consumpution when its price decreases.
        doc.dt`Substitution Effect`,
        doc.dd.of(text.p.l`
          When the price of muffins increases to the point at
          which its MU/$ for quantity demanded drops below
          the marginal utilty for first donut, that is called
          the ${doc.b`Substitution effect`}. This is almost
          always stronger than the income effect.
        `),
      ),
      doc.dl(
        doc.dt`Income Effect`,
        doc.dd.of(text.p.l`
          The ${doc.b`Income Effect`} is when the demand
          for a ${doc.b`normal good`} increases as income
          increases, and demand for an ${doc.b`Inferior good`}
          decreases.
        `),
        doc.dt`Law of Demand`,
        doc.dd.of(text.p.l`
          In general, price and quantity tend to move in opposite
          directions. When a price increases the quantity demanded
          decreases, and when the price decreases the quantity
          demanded increases. This is why the demand curve slops down.
          [${LINKS.lawOfDemand`read more`}]
        `),
      ),
    ),
    text.p.l`
      Below are two tables showing the marginal utility for 2 goods.
    `,
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
        doc.h3`Substitutes`,
        text.p.l`
          Two goods (A & B) are substitutes when an increase
          in the price of one (A) results in an increase in
          quantity demanded for the other (B).
        `,
      ),
      container(
        doc.h3`Complements`,
        text.p.l`
          Two goods (A & B) are substitutes when an decrease
          in the price of one (A) results in an increase in
          quantity demanded for the other (B).
        `,
      ),
    ),
    text.p.l`
      Given how the demand curve for Muffin changes in response
      to donuts and vice versa, it sounds like these two goods
      are substitutes.
    `,
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
        doc.h2`Reservation Price`,
        text.p.l`
          The ${doc.b`reservation price`} is also the vertical
          interpretation of the demand curve, in that it's the price
          you end up after taking a given quantity and seeing which
          price intercepts with it on the demand curve.
        `,
        text.p.l`
          In short its the maximum price the consume is willing to pay
          for that quantity of goods.
        `,
      ),
      infobox({ title: 'Reservation Price' })(
        container(
          text.p.m`
            Not really covered in this course
            but marginal the reservation price
            is actually computed with the
            marginal utility of income.
          `,
          doc.figure(mathml.reservationPrice()),
        ),
      )
    ),
    twoThree(
      text.p.l`
        Given the only use of money was donuts and muffins
        you would calculuate the the Resevation price of
        muffins like so (shown in the table as well).
      `,
       mathml.reservationPriceCourse(),
    ),
    state.utility && tables.utilityTables(state.utility, {
      reservationPrice: true,
    }),
    text.quote.l`
      Note: the reserve price for a good is its demand curve.
      Also note how changing the price of muffins does not change the
      curve, but changing the price of donuts does. That is the
      substitution effect in action.
    `,
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const relativeValue = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    doc.h3`Relative Value`,
    text.quote.l`
      This isn't all that relevant to the content,
      but this shows what happens when repeat
      computing the reserve price for the other good.
    `,
    twoThree(
      container(
        text.p.l`
          I'm admittedly not sure what a meaningful interpretation
          of the increasing curve below. From what I understand
          reservation price is actually computed with the marginal
          utility of income, where as here the below curves are
          showing a relative valuation for either good after consuming
          X number of either good.
        `
      ),
      infobox({ title: 'Relative Value' })(
        container(
          doc.figure(mathml.relativeValue()),
        )
      ),
    ),
    text.p.l`
      One of the curves will be rising while the other will be
      declining, the rising curve is more a representation of
      how little value they see in consuming the declining good than
      an increase preference for the rising good.
    `,
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
    doc.h2`Curve shifts`,
    text.p.l`
      Here are some reasons why the curve of some
      good would shift to the right.
    `,
    ['ul', { className: 'c2' }, [
      doc.li`An increase in the price of substitutes`,
      doc.li`Decrease in the price of complements`,
      ['li', [
        doc.b`Inferior good`, ': an decrease in the income.'
      ]],
      ['li', [
        doc.b`Normal good`, ': an increase in the income.'
      ]],
      doc.li`An expectation of a price increase.`,
      doc.li`A positive shift in consumers' preferences.`,
      doc.li`Successful marketing campaign`,
      doc.li`Population Growth.`,
    ]],

  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const elascity = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    doc.h2`Demand Elascity`,
    twoThree(
      text.p.l`
        Elascity is computed the same way for Demand, but
        it is worth pointing out what changes here is the
        slope of the curve in which elascity is being
        computed on.
     `,
      mathml.elasticity(),
    ),
    twoThree(
      text.p.l`
        Given the different direction of the slope the elascity
        is almost always negative, so if we want to use the rules
        from supply elascity to determine elascity, we just need
        to make sure we use the absolute value, or use a negative sign.
      `,
       tables.elasticityConditions(),
    ),
    text.p.l`Futhermore:`,
    ['ul', { className: 'c2' }, [
      ['li', [doc.b`Perfect Elastic`, `:
        When the demand curve is represented by a
        horizontal straight line, meaning quantity
        demanded is infinite, `, doc.b`at a given price`, `,
        any price change would eliminate demand.
      `]],
      ['li', [doc.b`Perfect inelastic`, `:
        When the demand curve is represented by a
        vertical straight line, meaning quantity
        demanded is fixed, `, doc.b`at any price`, `.
        A change in price would have no effect on demand.
      `]],
    ]],
    doc.h4`Determinants of Elascity`,
    twoColumns(
      ['dl', [
        ['dt', 'Avaiablilty of Subtitutes'],
        ['dd', [
          text.p.l`
            The more substitutes, the more elasitic
            the demand for a good or service will be.
            If there are many substitutes, there are
            many substitutes for consumers to turn to
            when there' an increase in price.
          `
        ]],
        ['dt', 'Definition of a good'],
        ['dd', [
          text.p.l`
            The boarder the definition of a good (or
            service), the lower the elasicity. Take
            Salt for example, if all of salt increased
            in price there would be few alternatives,
            but if one brand of salt increased out all
            the brands, there would be more substitutes.
          `
        ]],
      ]],
      ['dl', [
        ['dt', 'Income Share'],
        ['dd', [
          text.p.l`
            The higher the share of income to purchase a good
            the more elastic the good will become. Versus goods
            that take up a smaller portion of income, you will
            likely not notice an increase in price.
          `
        ]],
        ['dt', 'Time Horizon'],
        ['dd', [
          text.p.l`
            The longer the time horizon, the higher the
            elasticity, given there are more time to
            consider alternatives.
          `
        ]],
      ]],
    ),
    doc.h4`Point Elascity`,
    text.p.l`
      Below is the point elascity for muffins, where
      the price (P) is the reserve price.
    `,
    state.utility && tables.elasicityTable(state.utility),
  ),
};

