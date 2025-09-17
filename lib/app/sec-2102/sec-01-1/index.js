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
      of: {
        technology: 1,
        capital: 50000,
        labour: 40000,
        alpha: (2/3),
      },
      group: {
        technology: { kind: 'number', range: [0, 10], label: 'Technology (A)' },
        capital: { kind: 'number', range: [0, 10**6], label: 'Capital (K)' },
        labour: { kind: 'number', range: [0, 10**6], label: 'Labour (L)' },
        alpha: { kind: 'number', range: [0, 1], label: 'Alpha' },
      },
    },
  }
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.intro,
  doc.modelOfProduction,
  {
    meta: { kind: 'iframe' },
    title: 'Cobb Douglas Production Function',
    path: '../20250831-wgl/src/example/fun-002-cobb-douglas/embed.html',
    size: { height: 600, gridColumn: { default: 2, s: 2 } },
  },
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
