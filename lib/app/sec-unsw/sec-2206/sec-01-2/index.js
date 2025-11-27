/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import * as doc from './doc.js';
import * as render from './render.js';
import * as remote from './remote.js';
export { getConfig, createState, onUpdate } from './util.js';

export const meta = {
  kind: 'multi',
  sheets: [import.meta.resolve('@prelude-uni/styles.css')],
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620 },
  },
};

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  remote.bostonHousingDataExample,
  doc.intro,
  doc.models,
  doc.linearRegression,
  render.linearFunctionOfX,
  doc.ordinaryLeastSquaresEstimate,
  render.distributionOfSampleCoeffients,
  doc.functionalFormsInvolvingLogs,
  doc.assumptionsOfUnbiasednessInOLS,
  doc.summary,
];
