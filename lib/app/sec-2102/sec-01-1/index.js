/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import * as doc from './doc.js';
import * as render from './render.js';
import * as remote from './remote.js';

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
  doc.modelOfProduction,
  remote.cobbDouglas,
  doc.deminishingReturns,
  render.deminishingReturnsToLabour,
  render.deminishingReturnsToCapital,
  doc.marginalProducts,
  render.marginalProductOfLabour,
  render.marginalProductOfCapital,
  doc.modelOfFirmsBehaviour,
  doc.solvingModelEquilibrium,
  render.equilibriumLabour,
  render.equilibriumCapital,
  doc.nationalAccounting,
  doc.experiments,
  render.productionCurvesOfChinaAndUsa,
  doc.whatFactorsMightCauseDiffInTFP,
];
