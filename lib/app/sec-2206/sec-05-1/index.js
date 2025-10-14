/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import * as doc from './doc.js';
import * as render from './render.js';
export { getConfig, createState, onUpdate } from './util.js';
export { createStyle } from './style.js';

export const meta = {
  kind: 'multi',
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620 },
  },
};

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.intro,
  doc.describingQualitativeInformation,
  doc.aSingleDummyIndependentVariable,
  doc.dummyVariablesForMultiCategories,
  doc.dummyInteractions,
  doc.binaryDependentVariable,
  doc.policyAnalysis,
  doc.interpretingRegressionResults,
  // render.dummy,
];
