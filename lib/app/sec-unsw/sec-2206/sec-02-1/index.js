/**
 * @import { Widget } from '../../../prelude-type.ts';
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
  doc.motivationForMultiRegression,
  doc.mechanicsOfOLS,
  doc.createPlaceholder('Discuss confounding factors'),
  doc.expectedOLSEstimators,
  doc.expectedOLSEstimatorsIrrelevantVars,
  doc.expectedOLSEstimatorsOmittedVariableBias,
  doc.expectedOLSEstimatorsVariance,
  doc.varianceInMisspecifedModels,
  doc.estimatingStandardErrorOfOLSEstimators,
  doc.efficiencyOfOLS,
  doc.other,
  doc.beyondTheScope,
];
