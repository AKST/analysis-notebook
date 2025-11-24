/**
 * @import { MakeConfigKnobs, Widget } from '@app/prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
import { v2 } from '@app/prelude.js';
import * as doc from './doc.js';
import { onUpdate } from './util.js';
export { createStyle } from './style.js';
import * as render from './render.js';

export { onUpdate }

export const meta = {
  kind: 'multi',
};

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {
    marginalCost: {
      kind: 'number',
      label: 'Public Good Marginal Cost',
      of: 200,
      range: [0, 1000],
    },
    consumers: {
      kind: 'many',
      label: 'Consumers',
      of: {
        A: [600, -20],
        B: [300, -10],
        C: [180, -6],
        D: [120, -4],
      },
      create: {
        kind: 'curve',
        label: 'Consumer {id}',
        of: [30, -3],
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
    bounds: v2(0, 0),
    marginalCost: 0,
    consumers: {},
    produced: { contribute: 0, freeRide: 0 },
    aggregateDemand: { kind: 'continious', m: -1, i: 1, dir: -1 },
  }, { kind: 'config', config });
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.header,
  render.aggregateDemand,
  doc.curveInformation,
  doc.aggregatingDemandForPublicGoods,
  doc.freeRiding,
  doc.createPlaceholder('Each Consumers Surplus at their Lindhal Price or free riding'),
  doc.marketFailure,
];
