/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import { createDoc } from '../common/util.js';
import { infobox, ulLight, dashbox, todo } from '../common/components.js';
import { twoColumns, twoThree, container } from '../common/layout.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
  tradingEconomics: (
    ['a', { href: 'https://tradingeconomics.com' }, 'Trading Economics']
  ),
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
        ['small', { style: 'color: #aaaaff' }, ['ECON2102']],
      ]],
    ),
    infobox('Resources', [
      doc.p('See here for resources relating to the lesson'),
      ['br'],
      ulLight([
        doc.p(LINKS.tradingEconomics, ': Data on economics'),
        doc.p('Chapter 4 of the Textbook'),
      ]),
    ]),
  ),
  // in a way we will treat a country like a firm,
  // even if we are aggregating many firms.
  //
  // > QUESTION, is this literal? If so
));

export const modelOfProduction = createDoc(() => dashbox(
  ['h2', 'A Model of Production'],
  // While this works fairly well in microecononmics, there
  // are issues in marco economics which we will elaborate on
  ['h3', 'Production Function'],
  todo({}, 'Explain Production function'),
  // much of the course will focus on 'A', it is everything
  // else that's missing.
  doc.p('Y = F(K, L, A)'),

  todo({}, 'Explain Cobb-Douglas'),
  doc.b('Functional form'),
  doc.p('Y = Ā * K ^ (1 - alpha) & L ^ alpha'),
  doc.p('letters with bar are assumed to be exogenous'),

  ulLight([
    ['span', [doc.b('Y'),  'output']],
    ['span', [doc.b('K'),  'phyisical capital, machines, equipment, structures, tools']],
    ['span', [doc.b('L'),  'labour (number of workers or hours or work)']],
    // Question, I guess this includes instutions
    ['span', [doc.b('A'),  'technology (a scale of factor)']],
  ]),

  todo({}, 'Document properties of the functional form'),
));

export const marginalProducts = createDoc(() => dashbox(
  ['h2', 'Marginal Products of Labour and Capital'],
  todo({}, 'notes right after diminishing returns'),
  ulLight([
    ['span', [doc.b('MPK'), ': Marginal Product of Captial']],
    ['span', [doc.b('MPL'), ': Marginal Product of Labour']],
  ]),
  todo({}, 'SHOW Maths to derive MPK and MPL'),
  doc.p('Certain coefficents such lower product of _____'),
  todo({}, 'Check what he said before 10:13'),
  // this moel is theorical but it is affirmed in the data
  // and we can estimate it.
  twoColumns(
    container(
      ['h4', 'Marginal Product of Capital'],
      todo({}, 'Notes after chart'),
    ),
    container(
      ['h4', 'Marginal Product of Labour'],
    ),
  ),
));

export const modelOfFirmsBehaviour = createDoc(() => dashbox(
  ['h2', 'Model of Firms Behaviour'],
  ulLight([
    doc.small(doc.b('w'), ': real wage paid to labour'),
    doc.small(doc.b('r'), ': real rental paid to capital'),
    doc.small(doc.b('Π'), ': real profits of a typical firm'),
  ]),
  todo({}, 'Slide before model of firm behaviours'),
  doc.p('Π = Ā * K^(1 - alpha) * L^alpha - wL - rK'),
  todo({}, 'List assumptions'),
  ['h3', 'Condition of Profit Maximisation'],
  todo({}, 'List conditions'),
  ulLight([
    doc.small('Has a cost = r'),
    doc.small('Has a benefit in terms of additional output = MPK'),
    doc.small('Firms will hire more more workers if MPL > w'),
    doc.small('Firms will rent more capital if MPK > r'),
  ]),
));

export const solvingModelEquilibrium = createDoc(() => dashbox(
  ['h2', 'Solving the Model General Equilibrium'],
  doc.p('Collect the equations of the model'),
  ulLight([
    doc.small('Production Function Y = Ā * K^(1 - alpha) * L^alpha'),
    doc.small('Rule for hiring labour (alpha * (Y/L) = w)'),
    doc.small('Rule for hiring capital ((1-alpha) * (Y/K) = r)'),
    doc.small('Deamnd = Supply of Labour L = L̄'),
    doc.small('Deamnd = Supply of captial K = K̄'),
  ]),
  todo({}, 'Remaining notes'),
  ['h3', 'Demand and supply in Labour and Capital Markets'],
));

export const nationalAccounting = createDoc(() => dashbox(
  ['h3', 'National Accounting'],
  todo({}, 'Show national accountign from the earlier variables'),
  todo({}, 'Explain the meaning behind these'),
  ['h3', 'Why are some countries rich and some poor?'],
  todo({}, 'Repeat lecture content and notes and explain it'),
  doc.p('The Production function can be converted into percapita term')
));

export const experiments = createDoc(() => dashbox(
  ['h2', 'Experuments with model'],
  todo({}, 'Explain model in general terms'),
  doc.p('what is management science'),
));

export const chinaAndUsFunctions = createDoc(() => dashbox(
  ['h2', 'Chinese and US Production Functions'],
  todo({}, 'Repeat lecture content and notes and explain it'),
));

export const whatFactorsMightCauseDiffInTFP = createDoc(() => dashbox(
  ['h2', 'What factors might cause differences in TFP?'],
));
