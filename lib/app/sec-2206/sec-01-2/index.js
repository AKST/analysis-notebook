/**
 * @import { MakeConfigKnobs, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import * as doc from './doc.js';
import * as render from './render.js';
import * as iframe from './iframe.js';
export { createState, onUpdate } from './util.js';
export { createStyle } from './style.js';

export const meta = {
  kind: 'multi',
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620 },
  },
};

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {
    dummy: { kind: 'number', of: 0, range: [0, 1] },
  }
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.createPlaceholder('Mention SLR 1-4 assumptions for causal relations'),
  doc.createPlaceholder('Discuss confounding factors'),
  iframe.example,
  doc.intro,
  doc.models,
  doc.linearRegression,
  render.linearFunctionOfX,
  doc.estimation,
  doc.ols,
  doc.simulatedExample,
  render.distributionOfSampleCoeffients,
  doc.summary,
];
