
/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const {
  twoColumns, twoThree, container,
  responsiveGridAutoRow,
} = prelude.layout;
const { infobox, ulLight, dashbox, note, noteOn, todo } = prelude.components;
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

export const header = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'Labour Markets', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W3, Lecture 1']],
      ]],
      doc.small(`
        The goal of this chapter is look at the labour market,
        and build a basic model for it.
      `),
    ),
    infobox('Resources', [
      ulLight([
        'Chapter 7 of the textbook',
      ]),
    ]),
  ),
));

export const intro = createDoc(() => dashbox(
  ['h2', 'Introduction'],
  todo({}, 'content'),
));

export const unemploymentRate = createDoc(() => dashbox(
  container(
    ['h2', 'Employment'],
    note(
      'employment-popuation ratio',
      'unemployment rate',
    ),
    doc.figure(mathml.unemploymentRate, 'The unemployment rate'),
  ),
  container(
    ['h3', 'Dynamics of Labour Market'],
    note(
      'job creation',
      'job destruction',
    ),
    doc.figure(mathml.unemploymentRate, 'The unemployment rate'),
  ),
));

export const supplyAndDemand = createDoc(() => dashbox(
  container(
    ['h2', 'Supply and Demand'],
  ),
  twoColumns(
    container(
      ['h3', 'Reasons for change in demand'],
      noteOn('changes in demand')(

      ),
    ),
    container(
      ['h3', 'Wage Rigidity'],
      noteOn('wage rigidity')(

      )
    ),
  ),
  container(
    ['h3', 'Different kinds of unemployment'],
    note(
      doc.span(doc.b('the natural rate of unemployment'), ulLight([

      ])),
      doc.span(doc.b('cyclical unemployment'), ulLight([

      ])),
      doc.span(doc.b('frictional unemployment'), ulLight([
        'Workers between jobs',
      ])),
      doc.span(doc.b('structural unemployment'), ulLight([
        'this has more to do with structural issues',
      ])),
    ),
    doc.figure(mathml.actualUnemployment, 'Actual unemployment'),
  ),
));

export const bathtubModel = createDoc(() => dashbox(
  container(
    ['h2', 'Bathtub Model'],
    note(

    ),
    responsiveGridAutoRow([
      doc.figure(mathml.bathtubModel.labourForce, 'Labour Force'),
      doc.figure(mathml.bathtubModel.labourDynamics, 'Labour Dynamics'),
    ], {
      columns: {

      },
    }),
    note(
      doc.span(doc.b('job seperation rate'), ulLight([

      ])),
      doc.span(doc.b('job finding rate'), ulLight([

      ])),
    ),
    responsiveGridAutoRow([
      doc.figure(mathml.bathtubModel.solveForUnemployment, 'Solve for unemployment'),
      doc.figure(mathml.bathtubModel.unemploymentRate, 'Unemployment Rate'),
    ], {
      columns: {

      },
    })
  ),
));

export const hoursOfWork = createDoc(() => dashbox(
  container(
    ['h3', 'Hours of work'],
    note(),
  ),
));

export const valueOfHumanCapital = createDoc(() => dashbox(
  container(
    ['h2', 'Value of Human Capital'],
    note(
    ),
  ),
  container(
    ['h3', 'Present Discounted Value'],
    doc.figure(mathml.valueOfHumanCapital.presentDiscountedRate, 'Present discounted value'),
    note(
    ),
  ),
));

export const risingReturnToEducation = createDoc(() => dashbox(
  container(
    ['h3', 'Rising Return To Education'],
    noteOn('Skill-biased Technical change')(

    ),
    noteOn('Globalisation')(

    ),
  ),
));

export const economicGrowthAndIncomeInequality = createDoc(() => dashbox(
  container(
    ['h3', 'Economic Growth and Income Inequality'],
    note(),
  ),
));
