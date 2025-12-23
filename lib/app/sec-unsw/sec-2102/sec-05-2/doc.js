
/**
 * @import { E, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { responsiveGridAutoRow, twoColumns, twoThree, container } from '@prelude-uni/layout.js';
import { clsRef, infobox, text, dashbox, todo } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';

const LINKS = {
  wiki: {
    islmCurve: text.a({ href: 'https://en.wikipedia.org/wiki/IS–LM_model' }),
    pih: text.a({ href: 'https://en.wikipedia.org/wiki/Permanent_income_hypothesis' }),
    lch: text.a({ href: 'https://en.wikipedia.org/wiki/Life-cycle_hypothesis' }),
  },
  jstor: {
    consumersReactingToChangesInIncome: text.a({ href: 'https://www.jstor.org/stable/3132183' }),
    investmentBehaviour: text.a({ href: 'https://www.jstor.org/stable/1812110' }),
  },
};

export const vars = {
  a: text.b`ā`,
  ac: text.b`ā${doc.sub`c`}`,
  ag: text.b`ā${doc.sub`g`}`,
  ax: text.b`ā${doc.sub`ex`}`,
  am: text.b`ā${doc.sub`im`}`,
  ai: text.b`ā${doc.sub`i`}`,
  Rt: text.b`R${doc.sub`t`}`,
  r: text.b`r̄`,
  Yt: text.b`Y${doc.sub`t`}`,
  YtPotn: text.b`Ȳ${doc.sub`t`}`,
  YtFluc: text.b`Ỹ${doc.sub`t`}`,
  b: text.b`b̄`,
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
      doc.h1`
        IS Curve${doc.br()}
        ${doc.small.css({ color: '#aaaaff' }).t`ECON2102, W5, Lecture 2`}
      `,
    ),
    infobox({ title: 'Resources' }).c(
      text.ul(
        doc.li`Chapter 11 of the textbook`,
        doc.li`${LINKS.wiki.islmCurve.t`IS-LM Model`}`,
      ),
    ),
  ),
));

export const intro = createDoc(() => container(
  ref({ page: 287 }, doc.h2`Introduction`),
  dashbox(
    mathml.moneyTransmission,
    doc.p`
      The IS Curve is one of 2 curves in the ${text.b`IS-LM Model`}.
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
    doc.p`
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
    doc.p`
      Note in this model is Ȳₜ is exogenous not endogenous
      as opposed to previous instances where this model
      has been introduced. In our shortrun model we use
      output as solved by our long run model.
    `,
    text.ul(
      doc.li`Why is ${vars.ac} constant?${text.ul(
        doc.li`Note there is no time subscript`,
        doc.li`For our purposes it'll be 2/3 in most cases`,
        doc.li`
          The economic justification for this is, consumption
          is a constant fraction of potential output.
        `,
        doc.li`
          One implication of this is, because potential output
          is smooth, consumption is also smooth.
        `,
        doc.li`
          During a recession consumers may keep their consumption
          steady drawing on their savings. This behaviour is known
          as the ${text.b`permanent income hypothesis`}.
        `,
      )}`,
      doc.li`Why are the rest of multipliers constant?${text.ul(
        doc.li`This the simplest assumption we can make that still deliver a reasonable model.`,
        doc.li`They all have a similar economic justifications which we may or may not explore.`
      )}`,
    ),
  ),
  ref({ page: 289 }, doc.h3`The Investment Equation`),
  dashbox(
    text.ul(
      doc.li`About ${vars.ai}?${text.ul(
        doc.li`
          This is similar to the other coefficents, and reflects the
          long-run fraction of potenial output that goes into investment.
          But it is not the only contributor to investment.
        `,
      )}`,
      doc.li`About ${vars.Rt}?${text.ul(
        doc.li`This is the real interest rate`,
        doc.li`This is the rate at which firms are willing to borrow`,
      )}`,
      doc.li`About ${vars.r}?${text.ul(
        doc.li`This is the marginal rate of captial`,
        doc.li`
          This is the amount of additional ouput a firm can
          produce by investing one more unit of capital.
        `,
        doc.li`
          We take this as an exogenous parameter, and
          like ${vars.Yt} it is also determined by the
          long run model.
        `,
        doc.li`
          We don't include a time subscript here as
          it is constant along a balnaced growth path.
        `,
      )}`,
      doc.li`What is ${vars.b}?${text.ul(
        doc.li`This is roughly sensitivity to investment`,
        doc.li`
          A high value for b̄ means that small differences
          between the interest rate and marginal product
          of capital lead to big changes in investment.
        `,
      )}`,
    ),
    ref({ page:  291 }, doc.h4`Some implications`),
    text.ul(
      doc.li`
        If the marginal product of capital is low relative to
        the real interest rate, then firms are better off saving their
        retained earnings in the financial market.
      `,
      doc.li`
        If the marginal product of capital is high relative to the real
        interest rate, then firms would find it profitable to borrow at
        the real interest rate and invest the proceeds in capital,
        ${text.b`leading to a rise in investment`}.
      `,
      doc.li`
        In the long run, the real interest rate ${text.b`must`}
        equal the marginal product of capital. This is what
        was observed in the long run modell: firms rent capital
        until the marginal product of capital is equal to the
        interest rate.
      `,
      doc.li`
        In the short run these differ, which is explained by
        the fact new factories taketime to be built and brought
        online, along with any new machines with all their setup.
      `,
      doc.li`
        When ${vars.Rt} is equal to ${vars.r} in the long run,
        investment portion of potenial output is ${vars.ai}.
      `,
    ),
    doc.p`
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
    doc.p`
      Before we can derive the relationship between output and
      interest rates, we ${text.b`start`} by dividing the output (in
      the expenditure accounting identities / national accounts format).
      ${text.b`Then`} we substitute our five equations for the different
      sectors into the equation.
    `,
    responsiveGridAutoRow([
      mathml.outputDecomposition.c,
      mathml.outputDecomposition.d,
    ], { columns: { desktop: 'auto auto' } }),
    doc.p`
      Noting the identity relation for ${vars.YtFluc}, we
      subtract 1 from bothsides and get equation below
      (after adding the different multipliers for a).
    `,
    mathml.outputGap,
    doc.p`
      If you note from looking at the above equation if
      there is an increase in the value of ${vars.Rt},
      ${vars.b} will have a large multipler, since it
      subtracts from the final value, the resulting
      ${vars.YtFluc} is smaller. ${text.i`This is consistent with
      the idea that increases in the real interest lead
      to decreases in short term output`}.
    `,
    doc.p`
      Additionally the various different a's with their
      subscripts actually add up to 1 when ${vars.Yt} is
      at ${vars.YtPotn}. So in the long run ${vars.a} add
      up to 1.
    `,
    doc.h4`Notes from lecture`,
    text.ul(
      doc.li.c('if ', text.b`MPK = r̄ < Rₜ`, text.ul(
        doc.li`Firms should ${text.b`save`}`,
        doc.li`Firms should ${text.b`not invest`} in capital`,
        doc.li`Investment will decline`,
      )),
      doc.li.c('if ', text.b`MPK = r̄ > Rₜ`, text.ul(
        doc.li`Firms should ${text.b`borrow`}`,
        doc.li`Firms should ${text.b`invest`} in capital`,
        doc.li`Investment will increase`,
      )),
    ),
  ),
  todo({}, 'explain why we divide by Y in solving for curve'),
));

export const usingTheIsCurve = createDoc(() => container(
  // Fairly simple given the Y is x and R is y
  ref({ page: 292 }, doc.h2`Using the IS Curve`),
  dashbox(
    doc.p`
      Given the above we can now plot the curve. Note while
      it tends to be more natural to put outputs on the
      vertical axis, the convention in economics is to put
      the price on the Y axis (just like in supply and demand).
    `,
    container(
      ref({ page: 294 }, doc.h3`The Effect of a Change in the Interest rate`),
      mathml.outputGap,
      doc.p`
        If you want to move the output flucation along
        the curve, what you need to do is increase the
        real interst rate, and you see output move along
        the curve while preserving the output gap relation.
      `,
    ),
    container(
      ref({ page: 294 }, doc.h3`An Aggregate Demand Shock`),
      doc.p`
        Say businesses increase their investments due to a
        new technology fad, this would increase ${vars.ai}
        which will mean the curve itself will move.
      `,
    ),
    container(
      ref({ page: 294 }, doc.h3`A Shock to Potential Output`),
      doc.p`
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
    doc.p`
      An important principle to bear in mind in this
      discussion is that aggregation tends to average
      out departures from the model that occur at the
      individual level.
    `,
    container(
      ref({ page: 228 }, doc.h3`Consumption`),
      doc.p`
        There are a set of theories that explain the consumer
        behaviour in this model, two of which being:
      `,
      text.ul(
        doc.li`${LINKS.wiki.pih.t`Permanent-Income Hypothesis`} developed by Milton Friedman`,
        doc.li`${LINKS.wiki.lch.t`Life-Cycle Hypothesis`} developed by Franco Modigliani`,
      ),
      doc.p`
        Both theories have a theme of people prefer predictable
        routine over large flucations in consumptions. Like 1
        bowl of ice one week a day as opposed to 7 all at once at
        the start of the week. This results in a smooth consumption
        path. You would find the same result in applying the theory
        of ${text.b`diminshing marginal utility`}.
      `,
      twoColumns(
        container(
          doc.h4`The Permanent-income Hypothesis`,
          doc.p`
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
          doc.p`
            In this hypothesis the applicaiton of the same thinking
            is extended to a consumers lifetime. It suggests that
            consumption is based on average lifetime income rather
            than on income at any given age. ${text.b`As someones income
            rises, their consumption rises slower`}. As someone retires
            their spending remains constant as they live off their savings
            from earlier in life.
          `,
        ),
      ),
      doc.p`
        Strict interpretations of these hypothesis means potential output
        should also be smoothed, so our simple consumption equation only
        partially incorportes these assumptions from these hypothesises.
        ${text.b`How accurate is it in practise`}? The evidence is mixed.
        See ${LINKS.jstor.consumersReactingToChangesInIncome.t`this study`},
        on consumers behaviour in Alaska with the Permanent oil Fund payouts.
      `,
    ),
    container(
      ref({ page: 301 }, doc.h3`Multiplier Effects`),
      responsiveGridAutoRow([
        mathml.consumptionShare,
        mathml.ISCurve,
      ], { columns: { desktop: 'auto auto' } }),
      doc.p`
        In an effort to simulate aggregate consumption responses
        to temporary changes to income we can modify our
        consumption equation like ${text.b`above`}. This
        phenomenon is called the ${text.b`multiplier`}. ${doc.u`In
        an effort to simulate responses to short term changes`},
        the new term is a multiplier on the ${text.b`output gap`},
        since it's a value between 1 & 0 it is a ${text.b`propotion of
        the output gap`}.
      `,
      doc.blockquote`
        ${text.b`Note`} the implication of this multiplier is
        largely in relation to magnitude. The curve otherwise holds
        the same shape.
      `,
    ),
    container(
      ref({ page: 302 }, doc.h3`Investment`),
      doc.p`There are 2 main determinants of investment at the firm level.`,
      text.ol(
        doc.li`The gap between the real interest rate and the marginal product of capital`,
        doc.li`The second is a firms cash flow (internal resources after paying its dues)`,
      ),
      doc.p`
        In a simple model the return on captial is just the
        marginal product of captial net depreciation (as shown
        with the Solown Model). A richer model may include
        ${text.b`coporate income taxes`}, ${text.b`investment tax
        credits`}, and ${text.b`depreciation allowances`}.
        You can read more ${LINKS.jstor.investmentBehaviour.t`here`}.
      `,
      doc.p`
        A firm with high cash flow will have an easier time financing
        additional investment, while a firm with low cash flow may be
        forced to borrow in financial markets. ${text.b`It is more
        expensive to do the latter generally`} (this is explained by
        agency problems).
      `,
      ref({ page: 303 }, doc.h4`Agency Problems`),
      doc.ul.c(
        doc.li`
          ${text.b`Adverse Selection`}: When a firm knows it may be in
          for a rough time in the coming period, they may want to
          borrow. If the firm does well it can pay all that back,
          if it fails, it can declare bacnkruptcy.
        `,
        doc.li`
          ${text.b`Moral Hazard`}: Alternatively after a firm borrows
          a large sum of moneny it may engage in particularly risky
          investments, again knowing that if investment succeeds the
          firm will make a lot of money, and if they fail, they
          can declare bankruptcy.
        `,
      ),
      doc.p`
        Knowing these problems exist banks exercise caution.
      `,
      mathml.investmentLevel,
      todo({}, 'explain how this version of the function shows cashflow effects'),
    ),
    container(
      ref({ page: 303 }, doc.h3`Government purchases`),
      doc.p`
        Government purchase of goods and services affect shor-run
        economic activity in two ways:
      `,
      text.ol(
        doc.li`As a shock that can function as a source of fluctuations`,
        doc.li`As a policy instrument that can be used to reduce fluctuations`,
      ),
      doc.p`
        Government is an important source of demand in the economy, when
        its portion of consumption in the economy flucates (such as changes
        in military expenditure during wartime) there can be significant
        effects on the economy.
      `,
      doc.p`
        ${text.b`Some Government spending is discretionary`}, and this can
        lead to shocks. For example in Australia, during the periods of
        2022-2025 the Australian federal government undertook funding for
        many infrastructure projects, this is all while the russian ukrain
        war was underway with resources becoming more expensive in part to
        the increasing cost of oil for shipping (as sanctions on Russia
        resulted in an exodus of those resources from the world economy).
        Back in Australia there's a housing crisis, with the government
        outbidding residential developers for labour and able to pay whatever
        cost necessary to fund infrastructure, the private constructor sector
        was crowded out and was unable to respond to increased housing demand
        as it would have otherwise would.
      `,
      doc.h4`Automatic Stablisers`,
      doc.p`
        In Australia this is typically anything indexed by CPI and
        requires no discretionary to action.
      `,
      doc.h4`Implementation Lag`,
      doc.p`
        With the back and forth to get stuff in law, sometimes
        discretionary changes designed stimulate demand may only
        come into play after the shock may have passed.
      `,
      doc.h4`The no-free-lunch principle`,
      doc.p`
        Higher spending today must be paid at some point in
        the future. And may lead to a reduction in spending
        in future that may serve to lower GDP in future
        periods as more is set aside to pay off the debts
        of the past.
      `,
      doc.h4`Ricardian equivalence`,
      doc.p`
        This is the notion that what matters for consumption is
        the present value of what the government takes from
        consumers rather than the specific timing of the taxes.
        In this case, the present value of your lifetime income
        doesn’t depend on whether the government collects the taxes
        this year or next year; it will be lower in either case. So
        consumption should also be lower, perhaps completely offsetting
        the increased government spending.
      `,
    ),
    container(
      ref({ page: 309 }, doc.h3`Net Exports`),
      todo({}, 'content'),
    ),
  ),
));

export const tutorialNotes = createDoc(() => container(
  doc.h2`Tutorial Notes`,
  dashbox(

  ),
));
