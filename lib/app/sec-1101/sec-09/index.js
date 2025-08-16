/**
 * @import { MakeConfigKnobs, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import * as doc from './doc.js';
import * as render from './render.js';

export { createStyle } from './style.js';
export { createState, onUpdate } from './util.js';

export const meta = {
  kind: 'multi',
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620, m: 900 },
  },
}

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {
    externality: {
      kind: 'number',
      range: [-10000, 10000],
      label: 'Externality',
      of: 0,
    },
    transfer: {
      kind: 'number',
      range: [-10000, 10000],
      label: 'Net Transfer (Tax or Subsidy)',
      of: 0,
    },
    market: {
      kind: 'group',
      label: 'Market',
      group: {
        demand: {
          kind: 'curve',
          mode: 'P',
          label: 'Demand',
          of: [40, -1],
        },
        supply: {
          kind: 'curve',
          mode: 'P',
          label: 'Supply',
          of: [0, 1],
        },
      },
    },
  };
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.createPlaceholder('Matrix for coase problems'),
  doc.header,
  doc.coaseTheorem,
  doc.largerMarkets,
  render.chart,
  doc.deadWeightLossTable,
  doc.internalisingLargerMarketsExternalities,
  doc.computeExternalityFromDesiredQuantity,
  /*
   * See time 53:30
   *
   * @ https://www.youtube.com/watch?v=C0naMEbEcjY
   */
  doc.createPlaceholder('Government Intervention Summary Table'),
];
