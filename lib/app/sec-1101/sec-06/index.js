/**
 * @import { MakeConfigKnobs, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import * as doc from './doc.js';
import * as render from './render.js';
import { onUpdate } from './util.js';

export { createStyle } from './style.js';
export { onUpdate }

export const meta = {
  kind: 'multi',
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620, m: 900 },
  },
};

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {
    worldPrice: { kind: 'number', label: 'World Price', of: 20, range: [0, 100] },
    market: {
      kind: 'group',
      label: 'Market',
      group: {
        demand: {
          kind: 'curve',
          mode: 'P',
          label: 'Demand',
          of: [50, -1],
        },
        supply: {
          kind: 'curve',
          mode: 'P',
          label: 'Supply',
          of: [10, 1],
        },
      },
    },
    policy: {
      kind: 'group',
      label: 'Intervention',
      group: {
        tariff: {
          kind: 'number',
          of: 2,
          range: [0, 100],
          label: 'Import Tariff',
        },
        quota: {
          kind: 'number',
          of: 10,
          range: [0, 100],
          label: 'Import Quota',
        },
      },
    },
  };
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function createState(config) {
  return onUpdate({
    demand: { kind: 'continious', dir: -1, m: -1, i: 1 },
    supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
  }, { kind: 'config', config });
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.header,
  render.tariff,
  render.quota,
];
