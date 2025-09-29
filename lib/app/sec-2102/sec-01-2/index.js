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
  doc.solowSwanGrowthModel,
  doc.modelSetup,
  render.dynamicsOfCapital,
  render.dynamicsOfOutput,
  doc.solvingTheModel,
  render.diagrammaticalSolving,
  doc.modelSteadyState,
  render.modelSteadyState,
  doc.understandingTheModel,
  render.effectsOfIncreasingToS,
  doc.transitionDynamics,
  doc.growthRate,
  doc.strengthsAndLimitations,
  doc.createPlaceholder('show continious version'),
];
