/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { infobox, ulLight, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
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
        'Nature of Economic Data', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W1, Lecture 1']],
      ]],
    ),
    infobox('Resources', [container(
      doc.p('Lesson resources'),
      ulLight(['Chapter 1 of textbook']),
    )]),
  ),
));

export const about = createDoc(() => dashbox(
  ['h2', 'What is Econometrics'],
  doc.small(`
    Econometrics is largely about applying statical methods to
    estimate economic relations, testing economics theories and
    hypothesises, as well as evaluating and understanding
    government, business and institutional polices. However as
    a field it has developed as a seperate disccipline from
    mathemathical statistics.
  `),
  doc.small(`
    While in the natural science experiments, are often performed under
    laboratory conditions where each variable can be
    controlled and understood, and there are no moral concequences from
    making variation between the control and test cohorts of an experiment.
    In the social sciences to do the same is often impossible, if it is possible
    it is likely an unjustiable use of resources to answer the question at hand
    and in many cases for some of most pressing moral issues such experiments
    would likely be morally repugnant.
  `),
  doc.small(`
    In the absense of being able to apply those methods, those same questions
    still remain and in order to answer them as best we can we need to
    consider other methods, that's what econometrics is about.
  `),
  ['h3', 'Type of data'],
  ulLight([
    doc.small(doc.b('Nonexperimental data'), `:
      Not accumulated through controlled experiments on indivisuals firms, or
      any segment of the economy instead it's typically `,
      doc.b('observational data'), ` or `, doc.b('retrospective data'), ` to
      emphasize the fact the researcher is a passive collector of the data.
    `),
    doc.small(doc.b('Experimental data'), `: collected under laboratory conditions,
      the bare minimum required for the natural sciences
    `),
  ]),
  doc.small(`
    Despite the constraints of nonexperimental data, econometricians try to
    borrow as much as they can from mathematical statisticians whenever possible.
  `),
  ['h3', 'Empirical Ecnomic Analysis'],
  doc.small(`
    Econometric methods are relevant in virtually all branches of applied economics.
    They come into play largely when there's an economic theory to be tested or
    relationship that needs testing in relation to a business policy or policy analysis.
    Testing these is called an `, doc.b('Empirical analysis'), `.
  `),
  doc.small(ulLight([
    doc.p('Sometimes that means testing if something is consistent with an existing economic theory'),
    doc.p('Other times it may mean constructing a formal ', doc.b('Economic model'), '.'),
  ])),
  todo({}, 'How utility maximisation is an underlying premise in many models, page 2'),
));

const crossSectionalData = container(
  ['h4', 'Cross Sectional Data'],
  doc.small('A ', doc.b('Cross sectional'), ` dataset consists
    of a sample of indivisual subjects at a specfic point in
    time. Although sometimes the data isn't observed precisely
    at the same time and instead during different points in a week
    or weeks in a year.
  `),
  doc.small(`
    An important consideration with analyzing cross-sectional
    data is whether it was `, doc.b('Randomly sampled'), `.
    The absense off this can lead to serious limitations with
    the application of the dataset. Some cases where this can
    occur include:`, ulLight([
      'An opt in wealth survey, seeing as wealth familes are less likely to disclose their wealth.',
      'Population spread over a large geographic area and population is not large enough to assume observations are indepenent draws.',
    ])
  ),
  todo({}, 'Provide example table'),
);

const timeSeriesData = container(
  ['h4', 'Time Series Data'],
  doc.small(`
    `, doc.b('Time series Data'), ` is largely a dataset consisting of
    one or more observation per `, doc.b('subject'), ` over time. Such
    as GDP, money, supply, CPI, certain crime stats. Another consideration
    is the `, doc.b('time frame'), ` in which these observations are collected,
    or the `, doc.b('sample rate'), ` in which data is collected.
  `),
  doc.small(`
    A key feature of time series data that can make the more difficult to
    analysis than cross-sectional data is that economic observations can rarely
    if ever be assumed to be independent across time. For this reason more
    needs to be done in specifying econometric models for time series data
    before econometric methods can be justified.
  `),
  todo({}, 'Provide example table'),
);

const pooledCrossSectionalData = container(
  ['h4', 'Pooled Cross Section'],
  doc.small(`
    `, doc.b('Pooled Cross Sectional'), ` data is a combination of cross
    sectional and time series features. One application of Pooling cross
    sectional data is to analysis a poliy effect before and after the
    implemenations of a policy.
  `),
  todo({}, 'Provide example table'),
);

const panelData = container(
  ['h4', 'Panel or Longitudinal Data'],
  doc.small(`
    A `, doc.b('panel data'), ` (or longitudinal data) consists of a
    time series for each cross sectional subject of the dataset.
    How this varies from a `, doc.b('Pooled cross sectional dataset'), `
    is the samples in panel data consists of the same subjects
    repeatedly sampled.
  `),
  doc.small(`
    While the structure of pooled cross sectional data is
    inclusive of panel data, the specific structure of panel
    data lends itself to specific kinds of analysis, answering
    questions that cannot be answered from analysis on a
    simple pooled cross sectional dataset.
  `),
  todo({}, 'Provide example of table'),
);

export const structureOfEconomicData = createDoc(() => dashbox(
  ['h2', 'The Structure of Economic Data'],
  twoColumns(
    container(crossSectionalData, pooledCrossSectionalData),
    container(timeSeriesData, panelData),
  ),
));

export const causality = createDoc(() => dashbox(
  ['h2', 'Causality, Ceteris Paribus, and Counterfactual Reasoning'],
  todo({}, 'Complete this section, page 10-14'),
));

