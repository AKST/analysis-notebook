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
  doc.createPlaceholder('t value vs test statistic vs t distribution'),
  doc.samplingDistribution,
  render.distributionOfEstimator,
  render.distributionOfSamplingDistribtion,
  doc.importantDefinitions,
  doc.hypothesisTesting,
  render.tDistributionWithHypothesises,
  doc.stataOutputExample,
  doc.hypothesisTestingCont,
  doc.significaneLevelTable,
  doc.significance,
  doc.typeErrors,
  doc.pValues,
];
