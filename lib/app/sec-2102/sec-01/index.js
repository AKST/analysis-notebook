/**
 * @import { MakeConfigKnobs, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import * as doc from './doc.js';
import * as render from './render.js';
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
    productivity: {
      kind: 'group',
      of: { capital: 5000000, labour: 40000, alpha: (2/3) },
      group: {
        capital: { kind: 'number', of: 0, range: [0, 10**8] },
        labour: { kind: 'number', of: 0, range: [0, 10**8] },
        alpha: { kind: 'number', of: 0, range: [0, 1] },
      },
    },
  }
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.createPlaceholder('CREATE STATE HOOKS'),
  doc.createPlaceholder('CREATE WEBGL2 RENDERER'),
  doc.intro,
  doc.modelOfProduction,
  render.diminishingReturnToScale,
  doc.marginalProducts,
  render.marginalProductOfLabour,
  render.marginalProductOfCapital,
  doc.modelOfFirmsBehaviour,
  doc.solvingModelEquilibrium,
  render.demandForLabourAndCapital,
  doc.nationalAccounting,
  render.experimentCurves,
  doc.experiments,
  render.productionCurvesOfChinaAndUsa,
  doc.chinaAndUsFunctions,
  doc.createPlaceholder('What Factors might Cause differences in TFP'),
];
