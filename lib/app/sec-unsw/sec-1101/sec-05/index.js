/**
 * @import { MakeConfigKnobs, Widget } from '../../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
import * as doc from './doc.js';
import * as render from './render.js';
export { createStyle } from './style.js';
import { initExamples } from './util.js';


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
        floor: { kind: 'number', of: 40, range: [0, 100], label: 'Floor' },
        ceiling: { kind: 'number', of: 20, range: [0, 100], label: 'Ceiling' },
        tax: { kind: 'number', of: 10, range: [0, 100], label: 'Tax' },
        subsidy: { kind: 'number', of: 10, range: [0, 100], label: 'Subsidy' },
      },
    },
  };
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  switch (event.kind) {
    case 'config':
      return {
        ...state,
        ...initExamples(event.config),
      };
    default:
      return state;
  }
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
  doc.priceControls,
  render.priceFloor,
  render.priceCeil,
  doc.taxesAndSubsidies,
  render.demandTax,
  render.demandSubsidy,
  doc.taxBurdenTable,
];
