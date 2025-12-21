/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { twoColumns, twoThree, container } from '@prelude-uni/layout.js';
import { text, readmore, infobox, dashbox, noteOn, note, todo } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const LINKS = {
  laboursDecliningShareOfIncome: text.a({
    href: 'https://economistsview.typepad.com/economistsview/2012/09/labors-declining-share-of-income-and-rising-inequality.html',
  }),
  wiki: {
    solowSwan: text.a({ href: 'https://en.wikipedia.org/wiki/Solow–Swan_model' }),
    ralphNewton: text.a({ href: 'https://en.wikipedia.org/wiki/Newton%27s_method' }),
  },
  data: {
    worldBank: text.a({
      href: 'https://data.worldbank.org',
    }),
    pennWorldTable: text.a({ href: 'https://www.rug.nl/ggdc/productivity/pwt/' }),
  },
};

const READMORE = {
  labourGrowth: readmore({
    summary: ['Labour Growth'],
    details: [
      doc.p`
        There's actually no reason growth of labour cannot be added to
        the model, however for simplicity sake it has been omitted, and
        assumed it is a constant level of L̄.
      `,
    ],
  }),
  rentalPriceOfCapitalAndWageRate: readmore({
    summary: ['Rental Prices of Captial and Wage Rate'],
    details: [
      doc.p`
        While these haven't been included thus far, they could be.
        However at this stage the focus is on captial accumulation
        dynamics of growth over time. If at any stage we'd like to
        look into them along side these growth dynamics we can always
        reintroduce them back into the model.
      `,
      doc.p`
        That said below we're about to explain an aspect of the model
        that relates to the rental price of captial.
      `,
      noteOn('Review')(
        'Real wage is equal to the marginal product of labour at L̄',
      ),
    ],
  }),
  returnToSavings: readmore({
    summary: ['Returns to Savings'],
    details: [container(
      todo({}, 'Return to savings'),
      note(
        'In Solow model, one unit of investment earns the marignal product of captial',
        'Investment comes from savings',
        'The return to savings / the real interest rate, ieq equal to rental price of capital',
      ),
    )]
  }),
};

/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => (
  createDoc(() => container(
    todo({}, `for "${label.trim()}"`),
  ))
);

export const intro = createDoc(() => container(
  twoThree(
    container(
      doc.h1`
        Macroeconomics 2${doc.br()}
        ${doc.small({ style: 'color: #aaaaff' }).t`ECON2102, W1, Lecture 2`}
      `,
      text.ul(
        doc.li`Focus:`,
        doc.li`Extends production model from earlier`,
        doc.li`Solow-Swan model: theory of captial`,
        doc.li`Key difference, accumulation of capital is endogenous`,
        doc.li`Insights:${text.ul(
          doc.li`Capital accumulation insufficient to generate sustained growth`,
          doc.li`Transition dynamics, how poorer countries catch up`,
        )}`,
      ),
    ),
    infobox({ title: 'Resources' }).c(
      doc.p`See here for resources relating to the lesson`,
      text.ul(
        doc.li`Chapter 5 of the textbook`,
        doc.li.c(LINKS.laboursDecliningShareOfIncome.t`Labor's Declining Share of Income`),
        doc.li.c(LINKS.wiki.solowSwan.t`Wikipedia Solow Swan`),
        doc.li.c(LINKS.data.worldBank.t`World Bank Data`),
        doc.li.c(LINKS.data.pennWorldTable.t`Penn World Table`, ': data for s̄, d̄, Ā, ᾱ'),
      ),
    ),
  ),
));

export const solowSwanGrowthModel = createDoc(() => dashbox(
  doc.h2`Solow Swan Growth Model`,
  twoColumns(
    container(
      doc.h4`Motivation`,
      doc.p`
        To understand Economic growth let alone growth, we need a model
        or framework to model how change occurs over time. One such model
        is the Solow Swan Growth model which we can use to introduce a
        capital growth dynamics to the cobb douglas model.
      `,
      doc.p`
        With that we make one important change to the Cobb douglas model,
        being we now ${text.b`endogenize`} Captial, as Solow Swan
        helps us explain captial growth within our model.
      `,
    ),
    container(
      doc.h4`Applications`,
      doc.p`
        The Solow model is useful for explaining how countries such as
        the Philippines and South Korea diverged over time despite
        having very similar economies sizes at the end of World War 2.
        In the case of the Philippines the population was even better
        educated.
      `,
      doc.p`
        Despite that South Korean growth outpaced the Philippines,
        and South Koreas GDP drawfs that of the Philippines.
      `,
    ),
  ),
  doc.h4`Flow vs Stock`,
  todo({}, 'write something here'),
));

export const modelSetup = createDoc(() => container(
  doc.h2`Model Setup`,
  dashbox(
    twoColumns(
      container(
        text.figure(mathml.temporalOutput, doc.figcaption`Output over time`),
        text.ul(
          doc.li`${text.b`t`}: denotes time`,
          doc.li`Technology is fixed`
        ),
      ),
      container(
        text.figure(mathml.resourceConstraint, doc.figcaption`Resource Constraint`),
        text.ul(
          doc.li`${text.b`C`}: Aggregate Consumption`,
          doc.li`${text.b`I`}: Aggregate Investment`,
        ),
      ),
    ),
    doc.quote`
      Closed economy with no ${text.b`Government`} sector or ${
      text.b`Imports`} or ${text.b`Exports`}.
    `,
    twoColumns(
      container(
        doc.h4`Capital`,
        text.figure(mathml.capitalAccumulation, doc.figcaption`Capital Dynamics`),
        text.ul(
          doc.li`d̄ is rate of depreciation`,
          doc.li`Models Captial dynamics${text.ul(
            doc.li`Investment undertaken during t`,
            doc.li`physical depreciation of stock`,
          )}`,
        ),
        text.figure(mathml.capitalAccumulation2, doc.figcaption`Rewrite capital dynamics`),
        doc.p`
          With this we add capital accumulation dynamics, and in order
          to start change, initial values need to be a assumed for
          capital and investment.
        `,
        text.figure(mathml.initialStock, doc.figcaption`Initial stock`),
      ),
      container(
        doc.h4`Labour`,
        text.figure(mathml.exogenousLabour, doc.figcaption`Exogenous Labour`),
        text.ul(
          doc.li`Labour is assumed to be constant`,
          doc.li`Labour is exogenously determined`,
          doc.li`See note below for Labour growth`,
        ),
        doc.h4`Consumption and Investment`,
        text.figure(mathml.investmentDynamics, doc.figcaption`Investment Dynamics`),
        text.figure(mathml.consumptionDynamics, doc.figcaption`Consumption Dynamics`),
        text.ul(
          doc.li`${text.b`s̄`}: is portion the periods GPD reinvested`,
          doc.li`${text.b`(1 - s̄)`}: is portion the GPD consumed`,
        ),
      ),
    ),
    doc.h4`Deriving consumption`,
    mathml.derivingConsumptionT,
  ),
  twoColumns(
    dashbox(
      doc.h3`Real Interest Rate`,
      mathml.investmentConstraint,
      doc.p`
        So far we've left out the rental rate of capital, whether
        not we factor that in our model, there's one more price
        we need to consider, that being the ${text.b`real interest rate`}.
      `,
      doc.p`
        Turns out this is equal to the ${text.b`rental price of captial`}
        because it ends up being the amount a person can earn by saving one
        unit of output for a year, or equilivantly the amount a person must
        pay to borrow one units of output for a year.
      `,
    ),
    container(
      // that or just break down of what is exogenous or endogenous
      todo({}, 'Table containing complete model'),
      READMORE.labourGrowth,
      READMORE.rentalPriceOfCapitalAndWageRate,
      READMORE.returnToSavings,
    ),
  ),
));

export const solvingTheModel = createDoc(() => dashbox(
  doc.h2`Solving the Model`,
  twoThree(
    container(
      doc.p`
        By solve the model, we mean to figure out the known values
        for the different endogenous variables at a given point in
        time. We can start by reducing the number variables given
        the above relations and constraints.
      `,
      doc.p`
        For example we can
        replace investment with s̄Yₜ and we can then determine Kₜ
        by setting K̄₀ the amount of capital at a given point in
        time and applying the dynamics from that point to any
        point in time which will allow us to get the Kₜ and Yₜ
        at any point in time in relation to K̄₀.
      `,
      doc.h4`Solow Diagram`,
      text.figure(mathml.solowDiagram, doc.figcaption`Solow Diagram`),
      doc.p`
        A solow diagram plots the two terms ${text.b`s̄Y`} and ${
        text.b`d̄K`} that govern change in capital stock. We can
        s̄Y over d̄K and the point in which they intersect demostrates
        a steady state.
        In the absense of any shocks to captial stock, once captial
        reaches K${doc.sup`*`}, the flow becomes zero over time
        (unless there's a change to Technology or Labour).
      `,
    ),
    container(
      text.figure(mathml.netInvestmentConstraint, doc.figcaption`Change Constraint`),
      text.figure(mathml.temporalOutputWithFixedLabour, doc.figcaption`Production with fixed labour`),
      infobox({ title: 'Growth Transition Dynamics' }).c(
        doc.p`
          Transion dynamics describes the behaviour of the
          economy away/outside of the stead state.
        `,
        text.ul(
          doc.li`if s̄·Yt > d̄·Kt then ∆K(t+1) > 0`,
          doc.li`if s̄·Yt < d̄·Kt then ∆K(t+1) < 0`,
          doc.li`if s̄·Yt = d̄·Kt then ∆K(t+1) = 0`,
        ),
      ),
    ),
  ),
  container(
    doc.h3`Difficulty with Computing Solow Swan`,
    twoColumns(
      container(
        doc.p`
          It's worth noting Solving for a fixed value of Capital
          or Output from either ${text.i`(even if capital in an
          initial period)`} is not doable by algebra methods. You
          cannot solve for a function with capital isolated one
          side. For this reason when its taught emphasis is placed
          on the steady state.
        `,
        doc.p`
          ${text.b`What you can do however`}, is use a method called
          the ${LINKS.wiki.ralphNewton.t`Newton Ralphson method`}.
          Which involves a bit of calculus. ${text.b`Assuming you already
          know value of capital from the previous period`}, you can
          roughly follow these steps:
        `,
        text.ol(
          doc.li`Start with Capital (Kₜ)`,
          doc.li`Inline the definition of Output (Yₜ)`,
          doc.li`Move the subtract the right from the left (Kₜ)`,
          doc.li`Get a derivative (over Kₜ) of the right hand side`,
          doc.li`Solve for the value that converges to ${text.b`0`}.`,
        ),
      ),
      container(
        mathml.newtonRalphMethod,
      ),
    ),
  ),
));

export const modelSteadyState = createDoc(() => container(
  doc.h2`Model Steady State`,
  dashbox(
    twoThree(
      container(
        doc.p`
          While we can't solve for the steady state at each point
          in time, we can solve for the steady state level of capital.
          And we can solve for K${doc.sup`*`} by shuffling stuff
          around (working out provided on the side).
        `,
        text.figure(mathml.steadyStateConstraint, doc.figcaption`Steady state constraint`),
        text.figure(mathml.solveSteadyState, doc.figcaption`Steady state of captial`),
        text.figure(mathml.steadyStateOutput, doc.figcaption`Steady state of output`),
      ),
      text.figure(mathml.steadyStateWorkingout, doc.figcaption`Steady State working out`),
    ),
  ),
  dashbox(
    twoThree(
      container(
        doc.h3`Per capita`,
        text.figure(mathml.steadyStatePerWorker, doc.figcaption`Steady state per capita`),
        doc.p`
          And above is the steady state of output per capita, compared with
          output per capita on the bottom. Notably technology plays a more
          prominant role in the steady state with a greater exponenent.
        `,
        doc.p`
          I guess this isn't too surprising when when its showing it potential
          output in the long run, when the cobb douglas is just showing the
          current state.
        `,
      ),
      container(
        text.figure(mathml.steadyStatePerWorkerWorkingOut, doc.figcaption`working out`),
        text.figure(mathml.productionPerCapita, doc.figcaption`production per capita`),
      ),
    ),
  ),
  dashbox(
    doc.h3`The Captial-Output Ratio`,
    text.figure(mathml.outputToCapitalRatio, doc.figcaption`Output To Capital Ratio in Steady state`),
    doc.p`
      Having endogenization capital accumulation into production model,
      comes an additional observable propertybeing the${
      text.b`Capital-Output Ratio`} which is effectively the steady
      state formular rearranged.
    `,
  ),
));

export const transitionDynamics = createDoc(() => dashbox(
  doc.h2`Principle of Transition Dynamics`,
  doc.p`
    You can observe this playing around with the model above
    and seeing how rate of change is faster the further away
    the current accumulation of capitial is from it's steady
    state. If the steady state spikes the growth rate is large
    number that slowly decreases. If there's a large drop in
    the steady state the growth rate is large negative number
    that slowly increases back to zero.
  `,
));

export const strengthsAndLimitations = createDoc(() => dashbox(
  doc.h2`Strengths And Limitations`,
  twoColumns(
    container(
      doc.h4`Strengths`,
      text.ul(
        doc.li`Provides a framework for the growth of capital.`,
        doc.li`Provides a means to isolate TFP via subtraction of labour and capital.`,
      ),
    ),
    container(
      doc.h4`Limitations`,
      text.ul(
        doc.li`No answer to rate at which a country invests.`,
        doc.li`No answer to how the steady moves.`,
        doc.li`No answer to long term growth.`,
      ),
    ),
  ),
));

export const continousK = createDoc(() => dashbox(
  doc.h2`Extra — Continious Capital`,
  text.figure(mathml.continiousK, doc.figcaption`Captial as continuous function`),
  doc.p`
    This isn't really from the textbook but this something
    arrived at via a Bernoulli differential equation.
  `,
));
