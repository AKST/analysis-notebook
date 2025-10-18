
/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { responsiveGridAutoRow, twoColumns, twoThree, container } = prelude.layout;
const { clsRef, infobox, ulLight, ulLightSm, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

const LINKS = {
  wiki: {
    islmCurve: doc.a({ href: 'https://en.wikipedia.org/wiki/IS–LM_model' }),
    pih: doc.a({ href: 'https://en.wikipedia.org/wiki/Permanent_income_hypothesis' }),
    lch: doc.a({ href: 'https://en.wikipedia.org/wiki/Life-cycle_hypothesis' }),
  },
};

const vars = {
  a: doc.b`ā`,
  ac: doc.b`ā${doc.sub`c`}`,
  ag: doc.b`ā${doc.sub`g`}`,
  ax: doc.b`ā${doc.sub`ex`}`,
  am: doc.b`ā${doc.sub`im`}`,
  ai: doc.b`ā${doc.sub`i`}`,
  Rt: doc.b`R${doc.sub`t`}`,
  r: doc.b`r̄`,
  Yt: doc.b`Y${doc.sub`t`}`,
  YtPotn: doc.b`Ȳ${doc.sub`t`}`,
  YtFluc: doc.b`Ỹ${doc.sub`t`}`,
  b: doc.b`b̄`,
};

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page, slide }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 9, page }) : undefined,
    lec: slide != null ? ({ id: [5, 'M'], slide }) : undefined,
  }, item)
);

/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => (
  createDoc(() => container(
    todo({}, `for "${label.trim()}"`),
  ))
);

export const header = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'The Shortrun', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W5, Lecture 2']],
      ]],
    ),
    infobox('Resources', [
      ulLight([
        doc.span`Chapter 11 of the textbook`,
        LINKS.wiki.islmCurve`IS-LM Model`,
      ])
    ]),
  ),
));

export const intro = createDoc(() => container(
  ref({ page: 287 }, doc.h2`Introduction`),
  dashbox(
    mathml.moneyTransmission,
    doc.small`
      The IS Curve is one of 2 curves in the ${doc.b`IS-LM Model`}.
      The I stands for investment and the S standds for savings. It
      exists to model interest rates, which has important implications
      for all sorts of facets of society. What an increase in the real
      interest rate means, the cost of borrowing captial for businesses
      and households goes up. Consumers respond borrow less for new
      housing, firms respond by reducing their purchases of machines
      and buildings. A reduction in investment leads to firms producing
      less.
    `,
  ),
));

export const settingUpTheEconomony = createDoc(() => container(
  ref({ page: 288 }, doc.h2`Setting up the Economy`),
  dashbox(
    responsiveGridAutoRow([
      mathml.gdpExpenditure.output,
      mathml.gdpExpenditure.consumption,
    ], { columns: { desktop: 'auto auto' } }),
    responsiveGridAutoRow([
      mathml.gdpExpenditure.government,
      mathml.gdpExpenditure.exports,
      mathml.gdpExpenditure.imports,
      mathml.gdpExpenditure.investment,
    ], { columns: { desktop: 'auto auto auto auto' } }),
    doc.small`
      Above are the accounting identities of a simple
      4 sector economy (consumption, investment, government,
      and the foreign sector), using these as a foundation
      as we build towards the IS curve. Most of these are
      fairly simpliar it is mostly the Investment that is
      slightly different here.
    `,
  ),
  ref({ page: 289 }, doc.h3`Consumption and Friends`),
  dashbox(
    doc.small`
      Note in this model is Ȳₜ is exogenous not endogenous
      as opposed to previous instances where this model
      has been introduced. In our shortrun model we use
      output as solved by our long run model.
    `,
    ulLightSm([
      doc.span`Why is ${vars.ac} constant?${ulLight([
        doc.span`Note there is no time subscript`,
        doc.span`For our purposes it'll be 2/3 in most cases`,
        doc.span`
          The economic justification for this is, consumption
          is a constant fraction of potential output.
        `,
        doc.span`
          One implication of this is, because potential output
          is smooth, consumption is also smooth.
        `,
        doc.span`
          During a recession consumers may keep their consumption
          steady drawing on their savings. This behaviour is known
          as the ${doc.b`permanent income hypothesis`}.
        `,
      ])}`,
      doc.span`Why are the rest of multipliers constant?${ulLight([
        doc.span`This the simplest assumption we can make that still deliver a reasonable model.`,
        doc.span`They all have a similar economic justifications which we may or may not explore.`
      ])}`,
    ]),
  ),
  ref({ page: 289 }, doc.h3`The Investment Equation`),
  dashbox(
    ulLightSm([
      doc.span`About ${vars.ai}?${ulLight([
        doc.span`
          This is similar to the other coefficents, and reflects the
          long-run fraction of potenial output that goes into investment.
          But it is not the only contributor to investment.
        `,
      ])}`,
      doc.span`About ${vars.Rt}?${ulLight([
        doc.span`This is the real interest rate`,
        doc.span`This is the rate at which firms are willing to borrow`,
      ])}`,
      doc.span`About ${vars.r}?${ulLight([
        doc.span`This is the marginal rate of captial`,
        doc.span`
          This is the amount of additional ouput a firm can
          produce by investing one more unit of capital.
        `,
        doc.span`
          We take this as an exogenous parameter, and
          like ${vars.Yt} it is also determined by the
          long run model.
        `,
        doc.span`
          We don't include a time subscript here as
          it is constant along a balnaced growth path.
        `,
      ])}`,
      doc.span`What is ${vars.b}?${ulLight([
        doc.span`This is roughly sensitivity to investment`,
        doc.span`
          A high value for b̄ means that small differences
          between the interest rate and marginal product
          of capital lead to big changes in investment.
        `,
      ])}`,
    ]),
    ref({ page:  291 }, doc.h4`Some implications`),
    ulLightSm([
      doc.span`
        If the marginal product of capital is low relative to
        the real interest rate, then firms are better off saving their
        retained earnings in the financial market.
      `,
      doc.span`
        If the marginal product of capital is high relative to the real
        interest rate, then firms would find it profitable to borrow at
        the real interest rate and invest the proceeds in capital,
        ${doc.b`leading to a rise in investment`}.
      `,
      doc.span`
        In the long run, the real interest rate ${doc.b`must`}
        equal the marginal product of capital. This is what
        was observed in the long run modell: firms rent capital
        until the marginal product of capital is equal to the
        interest rate.
      `,
      doc.span`
        In the short run these differ, which is explained by
        the fact new factories taketime to be built and brought
        online, along with any new machines with all their setup.
      `,
      doc.span`
        When ${vars.Rt} is equal to ${vars.r} in the long run,
        investment portion of potenial output is ${vars.ai}.
      `,
    ]),
    doc.small`
      Technically our initial interactions with ${vars.Rt}
      suggest it is exogenous but this will change in later
      sections.
    `,
  ),
));

export const derivingTheIsCurve = createDoc(() => container(
  ref({ page: 292 }, doc.h2`Deriving the IS Curve`),
  dashbox(
    responsiveGridAutoRow([
      mathml.outputDecomposition.a,
      mathml.outputDecomposition.b,
    ], { columns: { desktop: 'auto auto' } }),
    doc.small`
      Before we can derive the relationship between output and
      interest rates, we ${doc.b`start`} by dividing the output (in
      the expenditure accounting identities / national accounts format).
      ${doc.b`Then`} we substitute our five equations for the different
      sectors into the equation.
    `,
    responsiveGridAutoRow([
      mathml.outputDecomposition.c,
      mathml.outputDecomposition.d,
    ], { columns: { desktop: 'auto auto' } }),
    doc.small`
      Noting the identity relation for ${vars.YtFluc}, we
      subtract 1 from bothsides and get equation below
      (after adding the different multipliers for a).
    `,
    mathml.outputGap,
    doc.small`
      If you note from looking at the above equation if
      there is an increase in the value of ${vars.Rt},
      ${vars.b} will have a large multipler, since it
      subtracts from the final value, the resulting
      ${vars.YtFluc} is smaller. ${doc.i`This is consistent with
      the idea that increases in the real interest lead
      to decreases in short term output`}.
    `,
    doc.small`
      Additionally the various different a's with their
      subscripts actually add up to 1 when ${vars.Yt} is
      at ${vars.YtPotn}. So in the long run ${vars.a} add
      up to 1.
    `,
  ),
));

export const usingTheIsCurve = createDoc(() => container(
  // Fairly simple given the Y is x and R is y
  todo({}, 'PLOT IS CURVE'),
  ref({ page: 292 }, doc.h2`Using the IS Curve`),
  dashbox(
    doc.small`
      Given the above we can now plot the curve. Note while
      it tends to be more natural to put outputs on the
      vertical axis, the convention in economics is to put
      the price on the Y axis (just like in supply and demand).
    `,
    container(
      ref({ page: 294 }, doc.h3`The Effect of a Change in the Interest rate`),
      mathml.outputGap,
      doc.small`
        If you want to move the output flucation along
        the curve, what you need to do is increase the
        real interst rate, and you see output move along
        the curve while preserving the output gap relation.
      `,
    ),
    container(
      ref({ page: 294 }, doc.h3`An Aggregate Demand Shock`),
      doc.small`
        Say businesses increase their investments due to a
        new technology fad, this would increase ${vars.ai}
        which will mean the curve itself will move.
      `,
    ),
    container(
      ref({ page: 294 }, doc.h3`A Shock to Potential Output`),
      doc.small`
        Shocks to potenial output, such as a loss of capital
        in terms of infrastructure after a natural distaster
        do not move the curve, actual output would also
        decrease as well.
      `,
    ),
  ),
));

export const microfoundations = createDoc(() => container(
  ref({ page: 298 }, doc.h2`Microfoundations of the IS Curve`),
  dashbox(
    doc.small`
      An important principle to bear in mind in this
      discussion is that aggregation tends to average
      out departures from the model that occur at the
      individual level.
    `,
    container(
      ref({ page: 228 }, doc.h3`Consumption`),
      doc.small`
        There are a set of theories that explain the consumer
        behaviour in this model, two of which being:
      `,
      doc.ul.attr({ className: 'no-item-padding' }).of(
        doc.li.of(doc.small`${LINKS.wiki.pih`Permanent-Income Hypothesis`} developed by Milton Friedman`),
        doc.li.of(doc.small`${LINKS.wiki.lch`Life-Cycle Hypothesis`} developed by Franco Modigliani`),
      ),
      doc.small`
        Both theories have a theme of people prefer predictable
        routine over large flucations in consumptions. Like 1
        bowl of ice one week a day as opposed to 7 all at once at
        the start of the week. This results in a smooth consumption
        path. You would find the same result in applying the theory
        of ${doc.b`diminshing marginal utility`}.
      `,
      twoColumns(
        container(
          doc.h4`The Permanent-income Hypothesis`,
          doc.small`
            The application of this thinking within the PIH leds to
            a conclusion that people wil base their consumption on
            an average of their income over time rather than on their
            current income. E.g. if someone goes unpaid leave they will
            likely continue spending as normal. This an also be extended
            to people within unemployment as well, or those who engage
            in season work.
          `,
        ),
        container(
          doc.h4`The Life Cycle model of consumption`,
          doc.small`
            In this hypothesis the applicaiton of the same thinking
            is extended to a consumers lifetime. It suggests that
            consumption is based on average lifetime income rather
            than on income at any given age. When someone is in school
            their income is typically higher than their income in many
            cases living off their parents. ${doc.b`As their income
            rises, their consumption rises slower`}.
          `,
        ),
      ),
    ),
    container(
      ref({ page: 301 }, doc.h3`Multiplier Effects`),
      mathml.consumptionShare,
      mathml.ISCurve,
      todo({}, 'content'),
    ),
    container(
      ref({ page: 303 }, doc.h3`Investment`),
      mathml.investmentLevel,
      todo({}, 'content'),
    ),
    container(
      ref({ page: 303 }, doc.h3`Government purchases`),
      todo({}, 'content'),
    ),
    container(
      ref({ page: 309 }, doc.h3`Net Exports`),
      todo({}, 'content'),
    ),
  ),
));

export const conclusion = createDoc(() => container(
  ref({ page: 309 }, doc.h2`Conclusion`),
  dashbox(
    todo({}, ''),
  ),
));
