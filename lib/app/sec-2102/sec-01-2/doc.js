/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { infobox, ulLight, dashbox, noteOn, note, todo } = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
  laboursDecliningShareOfIncome: ['a', {
    href: 'https://economistsview.typepad.com/economistsview/2012/09/labors-declining-share-of-income-and-rising-inequality.html',
  }, 'Labor\'s Declining Share of Income'],
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
      ]),
    )]),
  ),
));

export const solowSwanGrowthModel = createDoc(() => dashbox(
  ['h2', 'Solow Swan Growth Model'],
  note(
    'Captial Decomposition Over time',
    'Explains how captial accumulates over time',
    'The role of diminsihign marginal product of captial in epxlaingin differences in growth rates across countries',
    'Priciniple of transition dynamics',
    'Some limiations',
  ),
  noteOn('Motivation')(
    doc.p('Expalin divergence in South Korea and the Philippines', ulLight([
      doc.p('In 1960  they were fairly similar', ulLight([
        doc.p('GPD per-capita was about $1500 (10% of the US level)'),
        doc.p('Working age population was about 50%'),
        doc.p('Fraction of workers in agricultural or industry sector was similar'),
        doc.p('Koreans were less educated than Filipinos'),
      ])),
      doc.p('50 years later', ulLight([
        doc.p('Average growth rate in Korea was almost 6%, with 2.4% in Philippines'),
        doc.p('GDP per-capita in Korea approached $35000, 67% of use level'),
        doc.p('GDP per-capita in Philippines is less than $7000'),
      ])),
    ])),
  ),
));

export const modelSetup = createDoc(() => dashbox(
  ['h2', 'Model Setup'],
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
      doc.figure(mathml.capitalAccumulation, 'Capital Dynamics'),
      doc.small(ulLight([
        'd̄ is rate of depreciation',
        doc.span('Models Captial dynamics', ulLight([
          'Investment undertaken during t',
          'physical depreciation of stock',
        ])),
      ])),
    ),
    container(
      doc.figure(mathml.capitalAccumulation2, 'Rewrite capital dynamics'),
      doc.small(`
        In order to start change, initial values need to be a
        assumed for capital and investment.
      `),
      doc.figure(mathml.initialStock, 'Initial stock'),
    ),
  ),
  todo({}, 'Insert diagram, showing how capital grows slowly'),
  twoColumns(
    container(
      doc.figure(mathml.exogenousLabour, 'Exogenous Labour'),
      doc.small(ulLight([
        'Labour is assumed to be constant',
        'Labour is exogenously determined',
        'However if growth behaviour it can be specified, although we will not do so',
      ])),
    ),
    container(
      doc.figure(mathml.investmentDynamics, 'Investment Dynamics'),
      doc.figure(mathml.consumptionDynamics, 'Consumption Dynamics'),
      doc.small(ulLight([
        doc.span(doc.b('s̄'), ': is portion the periods GPD reinvested'),
        doc.span(doc.b('(1 - s̄)'), ': is portion the GPD consumed'),
      ])),
    ),
  ),
  note(
    'Ct + It = Yt => Ct + s̄ * Yt = Yt => Ct = (1 - s̄) * Yt',
  ),
  ['hr'],
  ['h4', 'Real Interest Rate'],
  noteOn('Review')(
    'Rela wage is equal to the marginal product of labour at L̄',
    'Real rental price of captial is equal to the MP of captial',
  ),
  note(
    'Since the amount of captial is endogenous, so too is the rental price of captial',
  ),
  note(
    'In Solow model, one unit of investment earns the marignal product of captial',
    'Investment comes from savings',
    'It = Yt - Ct = St',
    'The return to savings / the real interest rate, ieq equal to rental price of capital',
  ),
  ['h3', 'The Complete Model'],
  todo({}, 'insert full model from 28:29'),
));

export const solvingTheModel = createDoc(() => dashbox(
  ['h2', 'Solving the Model'],
  noteOn('math')(
    'ΔK(t+1) = s̄ · Yt - d̄ · Kt',
    'Yt = Ā · Kt^(1 - α) · L^𝛼',
    doc.p('First equation describes the transion dynamics', ulLight([
      doc.p('if s̄·Yt > d̄·Kt then ∆K(t+1) > 0'),
      doc.p('if s̄·Yt < d̄·Kt then ∆K(t+1) < 0'),
      doc.p('if s̄·Yt = d̄·Kt then ∆K(t+1) = 0'),
    ])),
  ),
));

export const modelSteadyState = createDoc(() => dashbox(
  ['h2', 'Model Steady State'],
  noteOn('existing equations')(
    'ΔK(t+1) = s̄ · Yt - d̄ · Kt',
    'Yt = Ā · Kt^(1 - α) · L^𝛼',
  ),
  note(
    doc.p('If we set ΔK(t+1) = 0 and substitute out for Yt, we get', ulLight([
      's̄ · Y* = d̄ · K*',
      's̄Ā · K*^(1-𝛼) · L̄^𝛼 = d̄ · K*',
    ])),
    doc.p('Stead state solution', ulLight([
      'K* = (s̄Ā / d̄)^(1/𝛼) · L̄',
    ])),
  ),
  ['h3', 'Per capita'],
  note(
    doc.p('rearrange', ulLight([
      'Y* = Ā · K*^(1-𝛼) · L̄^𝛼',
      'Y* = Ā · (s̄Ā / d̄)^((1-𝛼)/𝛼) · L̄^(1-𝛼) · L̄^𝛼',
      'Y* = Ā^(1/𝛼) · (s̄/d̄)^((1-𝛼)/𝛼) · L̄',
    ])),
    doc.p('steady state per worker', ulLight([
      'y* = Y*/L* = Ā^(1/𝛼) · (s̄/d̄)^((1-𝛼)/𝛼)',
    ])),
  ),
  ['h3', 'Comparing with production model'],
  noteOn('comparing 2 models')(
    'y* = Ā^(1/𝛼) · (s̄/d̄)^((1-𝛼)/𝛼)',
    'y* = Ā · k̄^(1-𝛼)',
    doc.p('Differences', ulLight([
      'Captial in the Solow-Swan model is endogenous',
      'Solow-Swan model, increases in productivity/tech cauase higher output per person (the exponent on Ā is higher); why?',
    ])),
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
