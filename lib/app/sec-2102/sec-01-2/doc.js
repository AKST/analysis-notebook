/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { readmore, infobox, ulLight, dashbox, noteOn, note, todo } = prelude.components;
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
      doc.small(`
        There's actually no reason growth of labour cannot be added to
        the model, however for simplicity sake it has been omitted, and
        assumed it is a constant level of L̄.
      `),
    ],
  }),
  rentalPriceOfCapitalAndWageRate: readmore({
    summary: ['Rental Prices of Captial and Wage Rate'],
    details: [
      doc.small(`
        While these haven't been included thus far, they could be.
        However at this stage the focus is on captial accumulation
        dynamics of growth over time. If at any stage we'd like to
        look into them along side these growth dynamics we can always
        reintroduce them back into the model.
      `),
      doc.small(`
        That said below we're about to explain an aspect of the model
        that relates to the rental price of captial.
      `),
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
      doc.small('Focus:', ulLight([
        doc.p('Extends production model from earlier'),
        doc.p('Solow-Swan model: theory of captial'),
        doc.p('Key difference, accumulation of capital is endogenous'),
        doc.p('Insights:', doc.small(ulLight([
          doc.p('Capital accumulation insufficient to generate sustained growth'),
          doc.p('Transition dynamics, how poorer countries catch up'),
        ]))),
      ])),
    ),
    infobox('Resources', [container(
      doc.p('See here for resources relating to the lesson'),
      ulLight([
        doc.p('Chapter 5 of the textbook'),
        LINKS.laboursDecliningShareOfIncome,
        LINKS.wikipediaSolowSwan,
        LINKS.worldBank,
      ]),
    )]),
  ),
));

export const solowSwanGrowthModel = createDoc(() => dashbox(
  ['h2', 'Solow Swan Growth Model'],
  twoColumns(
    container(
      ['h4', 'Motivation'],
      doc.small(`
        To understand Economic growth let alone growth, we need a model
        or framework to model how change occurs over time. One such model
        is the Solow Swan Growth model which we can use to introduce a
        capital growth dynamics to the cobb douglas model.
      `),
      doc.small(`
        With that we make one important change to the Cobb douglas model,
        being we now `, doc.b('endogenize'), ` Captial, as Solow Swan
        helps us explain captial growth within our model.
      `),
    ),
    container(
      ['h4', 'Applications'],
      doc.small(`
        The Solow model is useful for explaining how countries such as
        the Philippines and South Korea diverged over time despite
        having very similar economies sizes at the end of World War 2.
        In the case of the Philippines the population was even better
        educated.
      `),
      doc.small(`
        Despite that South Korean growth outpaced the Philippines,
        and South Koreas GDP drawfs that of the Philippines.
      `),
    ),
  ),
  ['h4', 'Flow vs Stock'],
  todo({}, 'write something here'),
));

export const modelSetup = createDoc(() => container(
  ['h2', 'Model Setup'],
  dashbox(
    twoColumns(
      container(
        doc.figure(mathml.temporalOutput, 'Output over time'),
        doc.small(ulLight([
          doc.span(doc.b('t'), ': denotes time'),
          doc.span('Technology is fixed')
        ])),
      ),
      container(
        doc.figure(mathml.resourceConstraint, 'Resource Constraint'),
        doc.small(ulLight([
          doc.span(doc.b('C'), ': Aggregate Consumption'),
          doc.span(doc.b('I'), ': Aggregate Investment'),
        ])),
      ),
    ),
    doc.quote(doc.small(
      'Closed economy with no ', doc.b('Government'), ' sector or ',
      doc.b('Imports'), ' or ', doc.b('Exports'), '.'
    )),
    twoColumns(
      container(
        ['h4', 'Capital'],
        doc.figure(mathml.capitalAccumulation, 'Capital Dynamics'),
        doc.small(ulLight([
          'd̄ is rate of depreciation',
          doc.span('Models Captial dynamics', ulLight([
            'Investment undertaken during t',
            'physical depreciation of stock',
          ])),
        ])),
        doc.figure(mathml.capitalAccumulation2, 'Rewrite capital dynamics'),
        doc.small(`
          With this we add capital accumulation dynamics, and in order
          to start change, initial values need to be a assumed for
          capital and investment.
        `),
        doc.figure(mathml.initialStock, 'Initial stock'),
      ),
      container(
        ['h4', 'Labour'],
        doc.figure(mathml.exogenousLabour, 'Exogenous Labour'),
        doc.small(ulLight([
          'Labour is assumed to be constant',
          'Labour is exogenously determined',
          'See note below for Labour growth',
        ])),
        ['h4', 'Consumption and Investment'],
        doc.figure(mathml.investmentDynamics, 'Investment Dynamics'),
        doc.figure(mathml.consumptionDynamics, 'Consumption Dynamics'),
        doc.small(ulLight([
          doc.span(doc.b('s̄'), ': is portion the periods GPD reinvested'),
          doc.span(doc.b('(1 - s̄)'), ': is portion the GPD consumed'),
        ])),
      ),
    ),
    ['h4', 'Deriving consumption'],
    mathml.derivingConsumptionT,
  ),
  twoColumns(
    dashbox(
      ['h3', 'Real Interest Rate'],
      mathml.investmentConstraint,
      doc.small(`
        So far we've left out the rental rate of capital, whether
        not we factor that in our model, there's one more price
        we need to consider, that being the `, doc.b('real interest rate'), `.
      `),
      doc.small(`
        Turns out this is equal to the `, doc.b('rental price of captial'), `
        because it ends up being the amount a person can earn by saving one
        unit of output for a year, or equilivantly the amount a person must
        pay to borrow one units of output for a year.
      `),
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
  ['h2', 'Solving the Model'],
  twoThree(
    container(
      doc.small(`
        By solve the model, we mean to figure out the known values
        for the different endogenous variables at a given point in
        time. We can start by reducing the number variables given
        the above relations and constraints.
      `),
      doc.small(`
        For example we can
        replace investment with s̄Yₜ and we can then determine Kₜ
        by setting K̄₀ the amount of capital at a given point in
        time and applying the dynamics from that point to any
        point in time which will allow us to get the Kₜ and Yₜ
        at any point in time in relation to K̄₀.
      `),
      ['h4', 'Solow Diagram'],
      doc.figure(mathml.solowDiagram, 'Solow Diagram'),
      doc.small(`
        A solow diagram plots the two terms `, doc.b('s̄Y'), ' and ',
        doc.b('d̄K'), ` that govern change in capital stock. We can
        s̄Y over d̄K and the point in which they intersect demostrates
        a steady state.
        In the absense of any shocks to captial stock, once captial
        reaches K`, ['sup', '*'], `, the flow becomes zero over time
        (unless there's a change to Technology or Labour).
      `),
    ),
    container(
      doc.figure(mathml.netInvestmentConstraint, 'Change Constraint'),
      doc.figure(mathml.temporalOutputWithFixedLabour, 'Production with fixed labour'),
      infobox('Growth Transition Dynamics', [container(
        doc.p(`
          Transion dynamics describes the behaviour of the
          economy away/outside of the stead state.
        `),
        ulLight([
          'if s̄·Yt > d̄·Kt then ∆K(t+1) > 0',
          'if s̄·Yt < d̄·Kt then ∆K(t+1) < 0',
          'if s̄·Yt = d̄·Kt then ∆K(t+1) = 0',
        ]),
      )]),
    ),
  ),
));

export const modelSteadyState = createDoc(() => container(
  ['h2', 'Model Steady State'],
  dashbox(
    twoThree(
      container(
        doc.small(`
          While we can't solve for the steady state at each point
          in time, we can solve for the steady state level of capital.
          And we can solve for K`, ['sup', '*'], ` by shuffling stuff
          around (working out provided on the side).
        `),
        doc.figure(mathml.steadyStateConstraint, 'Steady state constraint'),
        doc.figure(mathml.solveSteadyState, 'Steady state of captial'),
        doc.figure(mathml.steadyStateOutput, 'Steady state of output'),
      ),
      doc.figure(mathml.steadyStateWorkingout, 'Steady State working out'),
    ),
  ),
  dashbox(
    twoThree(
      container(
        ['h3', 'Per capita'],
        doc.figure(mathml.steadyStatePerWorker, 'Steady state per capita'),
        doc.small(`
          And above is the steady state of output per capita, compared with
          output per capita on the bottom. Notably technology plays a more
          prominant role in the steady state with a greater exponenent.
        `),
        doc.small(`
          I guess this isn't too surprising when when its showing it potential
          output in the long run, when the cobb douglas is just showing the
          current state.
        `),
      ),
      container(
        doc.figure(mathml.steadyStatePerWorkerWorkingOut, 'working out'),
        doc.figure(mathml.productionPerCapita, 'production per capita'),
      ),
    ),
    doc.figure(mathml.outputToCapitalRatio, 'Output To Capital Ratio in Steady state'),
  ),
));

export const understandingTheModel = createDoc(() => dashbox(
  ['h2', 'Understanding The Model'],
  note(
    doc.p('Model has been used to better understand differences across countries', ulLight([
      'output per person',
      'growth rates per person',
    ])),
    doc.p('Suppose', ulLight([
      'we thought most countries were at a steady state as described by the model.',
      'then we have — K*/Y* = s̄/d̄',
    ])),
    doc.p('for many countries', ulLight([
      '(K*/Y*)_i = s̄_i/d̄',
    ])),
  ),
  ['h3', 'Differences with Cobb-Douglas'],
  note(
    'Differences in captial per person is due to differences in productivity',
    'Solow-Swan model gives an even larger role to TFP than our production model did',
  ),
  ['h4', 'Percapita'],
  todo({}, 'rich verse poor math'),
  ['h4', 'Basic Predictions'],
  note(
    doc.p('goal of model is to', ulLight([
      'The transition dynamics to the new steady state',
      'Compare the new steady state to the old steady state',
    ])),
    'it is worth noting, in the stead state, there is not grouwht so output per person grouwht is zero',
    'in this model, economic growth is only a feature of transition dyanamics',
  ),
));

export const transitionDynamics = createDoc(() => dashbox(
  ['h2', 'Principle of Transition Dynamics'],
  note(
    doc.p('another explaination for differences in growth rates across countries', ulLight([
      'If the economy is below its steady state',
      'If the economy is above the steady state',
    ])),
    'Initial increases are large, subsequent increases get smaller until a new steady state is achieved',
    'A country will go faster the further below the steady state it is',
  ),
));

export const growthRate = createDoc(() => dashbox(
  ['h2', 'Growth Rate'],
  note(
    doc.p('', ulLight([
    ])),
  ),
));

export const strengthsAndLimitations = createDoc(() => dashbox(
  ['h2', 'Strengths And Limitations'],
  note(
    doc.p('Stengths', ulLight([
      'Provides a theory that determines characteristics at the stead state',
      'Helps us to udnerstand differences in grwoth rates across countries',
    ])),
    doc.p('Limitations', ulLight([
      'Main mechanism in the model is through captial accumulation, not very important qunatitatively',
      'Productivity and saving rates are exogenous',
      'Does not provide a theory of the long run growth',
    ])),
  ),
));
