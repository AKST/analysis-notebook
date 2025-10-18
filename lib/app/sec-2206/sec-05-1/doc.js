/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container, responsiveGridAutoRow } = prelude.layout;
const { clsRef, infobox, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

const LINKS = {
};

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const w5Ref = ({ slide, page }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 7, page }) : undefined,
    lec: slide != null ? ({ id: [5, 'Tu'], slide }) : undefined,
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

export const intro = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'Multiple Regression Analysis with Qualitative Info', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2206, W5, Lecture 1']],
      ]],
    ),
    infobox('Resources', [
      doc.p`See here for resources relating to the lesson`,
    ]),
  ),
));

export const describingQualitativeInformation = createDoc(() => dashbox(
  doc.h2`Describing Qualitative Information`,
  todo({}, 'content'),
));

export const aSingleDummyIndependentVariable = createDoc(() => dashbox(
  doc.h2`A Single Dummy Independent Variable`,
  todo({}, 'content'),
));

export const dummyVariablesForMultiCategories = createDoc(() => dashbox(
  doc.h2`Using Dummy Variables for Multiple Categories`,
  todo({}, 'content'),
));

export const dummyInteractions = createDoc(() => dashbox(
  doc.h2`Interactions Involving Dummy Variables`,
  todo({}, 'content'),
));

export const binaryDependentVariable = createDoc(() => dashbox(
  doc.h2`A Binary Dependent Variable: The Linear Probability Model`,
  todo({}, 'content'),
));

export const policyAnalysis = createDoc(() => dashbox(
  doc.h2`More on Policy Analysis and Program Evaluation`,
  todo({}, 'content'),
));

export const interpretingRegressionResults = createDoc(() => dashbox(
  doc.h2`Interpreting Regression Results with Discrete Dependent Variables`,
  todo({}, 'content'),
));
