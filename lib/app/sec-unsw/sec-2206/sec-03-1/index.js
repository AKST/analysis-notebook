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
  sheets: [
    import.meta.resolve('@prelude-uni/styles.css'),
    import.meta.resolve('./styles.css'),
  ],
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
  // remote.homoskedasticNormalDistributions,
  render.distributionOfEstimator,
  render.distributionOfSamplingDistribtion,
  doc.hypothesisTestingTDist,
  doc.hypothesisTestingTStat,
  doc.hypothesisTestingOneSided,
  doc.hypothesisTestingTwoSided,
  render.tDistributionWithHypothesises,
  doc.stataOutputExample,
  doc.significaneLevelTable,
  doc.typeErrors,
  doc.pValues,
  doc.confindenceIntervals,
  doc.testingHypothesisAboutASingleLinearCombinationOfParameters,
  doc.fTest,
  doc.fDistribution,
];
