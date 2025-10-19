/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { text, readmore, infobox, dashbox, noteOn, note, todo } = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
  laboursDecliningShareOfIncome: ['a', {
    href: 'https://economistsview.typepad.com/economistsview/2012/09/labors-declining-share-of-income-and-rising-inequality.html',
  }, 'Labor\'s Declining Share of Income'],
  wikipediaSolowSwan: ['a', {
    href: 'https://en.wikipedia.org/wiki/Solow–Swan_model',
  }, 'Wikipedia Solow Swan'],
  worldBank: ['a', {
    href: 'https://data.worldbank.org',
  }, 'World Bank Data'],
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
      ['h1', [
        'Macroeconomics 2', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W1, Lecture 2']],
      ]],
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
    infobox('Resources', [container(
      doc.p`See here for resources relating to the lesson`,
      text.ul(
        doc.li`Chapter 5 of the textbook`,
        doc.li.of(LINKS.laboursDecliningShareOfIncome),
        doc.li.of(LINKS.wikipediaSolowSwan),
        doc.li.of(LINKS.worldBank),
      ),
    )]),
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
        being we now ${doc.b`endogenize`} Captial, as Solow Swan
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
        doc.figure(mathml.temporalOutput, doc.figcaption`Output over time`),
        text.ul(
          doc.li`${doc.b`t`}: denotes time`,
          doc.li`Technology is fixed`
        ),
      ),
      container(
        doc.figure(mathml.resourceConstraint, doc.figcaption`Resource Constraint`),
        text.ul(
          doc.li`${doc.b`C`}: Aggregate Consumption`,
          doc.li`${doc.b`I`}: Aggregate Investment`,
        ),
      ),
    ),
    doc.quote`
      Closed economy with no ${doc.b`Government`} sector or ${
      doc.b`Imports`} or ${doc.b`Exports`}.
    `,
    twoColumns(
      container(
        doc.h4`Capital`,
        doc.figure(mathml.capitalAccumulation, doc.figcaption`Capital Dynamics`),
        text.ul(
          doc.li`d̄ is rate of depreciation`,
          doc.li`Models Captial dynamics${text.ul(
            doc.li`Investment undertaken during t`,
            doc.li`physical depreciation of stock`,
          )}`,
        ),
        doc.figure(mathml.capitalAccumulation2, doc.figcaption`Rewrite capital dynamics`),
        doc.p`
          With this we add capital accumulation dynamics, and in order
          to start change, initial values need to be a assumed for
          capital and investment.
        `,
        doc.figure(mathml.initialStock, doc.figcaption`Initial stock`),
      ),
      container(
        doc.h4`Labour`,
        doc.figure(mathml.exogenousLabour, doc.figcaption`Exogenous Labour`),
        text.ul(
          doc.li`Labour is assumed to be constant`,
          doc.li`Labour is exogenously determined`,
          doc.li`See note below for Labour growth`,
        ),
        doc.h4`Consumption and Investment`,
        doc.figure(mathml.investmentDynamics, doc.figcaption`Investment Dynamics`),
        doc.figure(mathml.consumptionDynamics, doc.figcaption`Consumption Dynamics`),
        text.ul(
          doc.li`${doc.b`s̄`}: is portion the periods GPD reinvested`,
          doc.li`${doc.b`(1 - s̄)`}: is portion the GPD consumed`,
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
        we need to consider, that being the ${doc.b`real interest rate`}.
      `,
      doc.p`
        Turns out this is equal to the ${doc.b`rental price of captial`}
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
      doc.figure(mathml.solowDiagram, doc.figcaption`Solow Diagram`),
      doc.p`
        A solow diagram plots the two terms ${doc.b`s̄Y`} and ${
        doc.b`d̄K`} that govern change in capital stock. We can
        s̄Y over d̄K and the point in which they intersect demostrates
        a steady state.
        In the absense of any shocks to captial stock, once captial
        reaches K${['sup', '*']}, the flow becomes zero over time
        (unless there's a change to Technology or Labour).
      `,
    ),
    container(
      doc.figure(mathml.netInvestmentConstraint, doc.figcaption`Change Constraint`),
      doc.figure(mathml.temporalOutputWithFixedLabour, doc.figcaption`Production with fixed labour`),
      infobox('Growth Transition Dynamics', [container(
        doc.p`
          Transion dynamics describes the behaviour of the
          economy away/outside of the stead state.
        `,
        text.ul(
          doc.li`if s̄·Yt > d̄·Kt then ∆K(t+1) > 0`,
          doc.li`if s̄·Yt < d̄·Kt then ∆K(t+1) < 0`,
          doc.li`if s̄·Yt = d̄·Kt then ∆K(t+1) = 0`,
        ),
      )]),
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
          And we can solve for K${['sup', '*']} by shuffling stuff
          around (working out provided on the side).
        `,
        doc.figure(mathml.steadyStateConstraint, doc.figcaption`Steady state constraint`),
        doc.figure(mathml.solveSteadyState, doc.figcaption`Steady state of captial`),
        doc.figure(mathml.steadyStateOutput, doc.figcaption`Steady state of output`),
      ),
      doc.figure(mathml.steadyStateWorkingout, doc.figcaption`Steady State working out`),
    ),
  ),
  dashbox(
    twoThree(
      container(
        doc.h3`Per capita`,
        doc.figure(mathml.steadyStatePerWorker, doc.figcaption`Steady state per capita`),
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
        doc.figure(mathml.steadyStatePerWorkerWorkingOut, doc.figcaption`working out`),
        doc.figure(mathml.productionPerCapita, doc.figcaption`production per capita`),
      ),
    ),
  ),
  dashbox(
    doc.h3`The Captial-Output Ratio`,
    doc.figure(mathml.outputToCapitalRatio, doc.figcaption`Output To Capital Ratio in Steady state`),
    doc.p`
      Having endogenization capital accumulation into production model,
      comes an additional observable propertybeing the${
      doc.b`Capital-Output Ratio`} which is effectively the steady
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
  doc.figure(mathml.continiousK, doc.figcaption`Captial as continuous function`),
  doc.p`
    This isn't really from the textbook but this something
    arrived at via a Bernoulli differential equation.
  `,
));
