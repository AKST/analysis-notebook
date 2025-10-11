/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container, responsiveGridAutoRow } = prelude.layout;
const {
  clsRef, infobox, ulLight,
  dashbox, noteOn, note, todo,
} = prelude.components;
const { createDoc } = prelude.util;

/**
 * @type {Record<string, E.Item>}
 */
const LINKS = {
};

export const INFOBOX = {
  sampleDistribution: infobox('Sample Distribution', [container(
    todo({}, 'TODO'),
  )]),
  tDistribution: infobox('T Distribution', [container(
    todo({}, 'TODO'),
  )]),
  testStatistic: infobox('Test Statistic', [container(
    todo({}, 'TODO'),
  )]),
  criticalValue: infobox('Critical Value', [container(
    todo({}, 'TODO'),
  )]),
  type1Error: infobox('Type 1 Error', [container(
    todo({}, 'TODO'),
  )]),
  type2Error: infobox('Type 2 Error', [container(
    todo({}, 'TODO'),
  )]),
  significance: infobox('Significance', [container(
    todo({}, 'TODO'),
  )]),
}

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
        'Intro to Econometrics', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W3, Lecture 2']],
      ]],
    ),
    infobox('Resources', [
      doc.p`chapter 4 of the textbook`,
    ]),
  ),
));

export const samplingDistribution = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'W'], slide: 3 } }, ['h2', 'Sampling Distribution of OLS Estimators']),
  responsiveGridAutoRow([
    mathml.samplingDistribution,
    mathml.tDistributionOfEstimators,
  ], {
    columns: { desktop: 'auto auto' },
  }),
  note(
    'test statistic in Theorum 4.1, not as useful',
    doc.span`t-distribution in Theorum 4.2, t-distribution${ulLight([
      't-distribution close to standard normal if degrees of freedom (N - K - 1) is large',
    ])}`,
  ),
));

export const importantDefinitions = createDoc(() => dashbox(
  ['h3', 'Some definitions'],
  twoColumns(
    container(
      INFOBOX.sampleDistribution,
      INFOBOX.tDistribution,
    ),
    container(
      INFOBOX.testStatistic,
      INFOBOX.criticalValue,
    ),
  ),
));

export const hypothesisTesting = createDoc(() => dashbox(
  ['h2', 'Hypothesis testing'],
  twoColumns(
    container(
      clsRef({ lec: { id: [3, 'W'], slide: 8 } }, ['h4', 'General Hypothesis testing']),
      todo({}, 'notes from slide 8'),
    ),
    container(
      clsRef({ lec: { id: [3, 'W'], slide: 9 } }, ['h4', 'General Hypothesis testing']),
      todo({}, 'notes from slide 9'),
    ),
  ),
  clsRef({ lec: { id: [3, 'W'], slide: 13 } }, ['h3', 'The process']),
  twoThree(
    container(
      note(
        'Generally start by writing your null hypothesis.',
        'You can start writing it in plain english',
        'But you ought to at least write it in the appropiate mathematic syntax',
      ),
    ),
    mathml.tStatistic,
  ),
  clsRef({ lec: { id: [3, 'W'], slide: 14 } }, note(
    'rejection rule',
  )),
));

export const stataOutputExample = createDoc(() => container(
  tables.stataOutputExample,
  todo({}, 'Describe the table'),
));

export const hypothesisTestingCont = createDoc(() => dashbox(
  ['h4', 'Example of Stata output'],
  clsRef({ lec: { id: [3, 'W'], slide: 18 } }, note(
    'calculate the t statistic',
    doc.span`rejection rule is satisified if${ulLight([
      'test statistics magnitude is greater than significance',
      'e.g. 2 sided tβ̂ᵢ > 1.96 or tβ̂ᵢ < -1.96',
    ])}`,
  )),
  clsRef({ lec: { id: [3, 'W'], slide: 19 } }, note(
    doc.span`rejection rule is satisified if${ulLight([
      'test statistics magnitude is greater than significance',
      'e.g. 2 sided tβ̂ᵢ > 1.96 or tβ̂ᵢ < -1.96',
    ])}`,
  )),
));

export const significaneLevelTable = createDoc(() => container(
  ['details', {}, [
    ['summary', {}, [
      ['h4', {
        style: 'background: var(--bg-pink); color: var(--fg-black-on-pink)',
      }, 'Open to view Significance level table'],
    ]],
    container(
      tables.significaneLevelTable,
      todo({}, 'How to read this table'),
    ),
  ]],
));

export const significance = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'W'], slide: 20 } }, ['h2', 'Significance']),
  twoThree(
    todo({}, 'notes'),
    INFOBOX.significance,
  ),
));

export const typeErrors = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'W'], slide: 21 } }, ['h2', 'Type I & Type II Errors']),
  twoThree(
    todo({}, 'notes'),
    container(
      INFOBOX.type1Error,
      INFOBOX.type2Error,
    ),
  ),
));

const tDist = doc.b`t${doc.sub`N-K-1`}`;
const tBetaJ = doc.b`t${doc.sub`β̂${doc.sub`j`}`}`;

export const pValues = createDoc(() => dashbox(
  clsRef({ lec: { id: [3, 'W'], slide: 22 } }, ['h2', 'P Value']),
  note(
    'Small P Value are evidence against of null hypothesis',
    'Large P Value are evidence in favour of null hypothesis',
    'p Value simmarise infomration on any number of tests at fixed signifiance levels',
  ),
  clsRef({ lec: { id: [3, 'W'], slide: 23 } }, note(
    'Define your hypothesis, and your significance',
    'find the t value',
    'check it against the significance',
    'refect null hypothesis if ??',
  )),
  clsRef({ lec: { id: [3, 'W'], slide: 23 } }, ['h3', 'P Values in Practise']),
  noteOn('Find the P Value')(
    'Define the hypothesis',
    doc.span`find the distribution of the test statistic ${tDist}`,
    doc.span`Calculate the realization of the test statistic ${tBetaJ}`,
    doc.span`P Value is${ulLight([
      doc.span`${doc.b`2 tail`} P(${tDist} > ${tBetaJ}) + P(${tDist} < -${tBetaJ})`,
      doc.span`${doc.b`upper tail`} P(${tDist} > ${tBetaJ})`,
      doc.span`${doc.b`lower tail`} P(${tDist} < -${tBetaJ})`,
    ])}`,
  ),
));
