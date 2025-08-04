/**
 * @import { MakeConfigKnobs, Widget } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
import * as doc from './doc.js';
export { createStyle } from './style.js';

export const meta = {
  kind: 'multi',
};

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {
    marginalCost: { kind: 'number', of: 30, range: [0, 100] },
    consumers: {
      kind: 'many',
      label: 'Consumers',
      of: { A: [50, -5], B: [25, -2.5] },
      create: id => ({
        kind: 'curve',
        label: `Consumer ${id}`,
        of: [30, -3],
      }),
    },
  };
}

/**
 * @param {State} state
 * @param {Event} _event
 * @returns {State}
 */
export function onUpdate(state, _event) {
  return state;
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function createState(config) {
  return onUpdate({}, { kind: 'config', config });
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.header,
  doc.createPlaceholder('Vertical Summation'),
  doc.aggregatingDemandForPublicGoods,
  doc.freeRiding,
  doc.createPlaceholder('Each Consumers Surplus at their Lindhal Price or free riding'),
  doc.marketFailure,
];
