/**
 * @import { Econ, MakeConfigKnobs, Widget } from '@app/prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */

import { econSolve } from '@app/prelude.js';

/**
 * @param {Econ.Model.Config.T} config
 * @returns {[Econ.Model.Config.T, Econ.Model.Desc.T] | undefined}
 */
const maybeModel = config => {
  const model = econSolve.status(config);
  if (model.ok) {
    return [config, model.model];
  }
  console.error(model.reason);
  return undefined;
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  switch (event.kind) {
    case 'config': {
      const { market: { supply, demand }, transfer, externality } = event.config;
      return {
        model: maybeModel({
          world: { price: 0 },
          market: {
            supply: { kind: 'continious', m: supply[1], i: supply[0], dir: 1 },
            demand: { kind: 'continious', m: demand[1], i: demand[0], dir: -1 },
          },
          extern: {
            demand: 0,
            supply: externality,
          },
          policy: {
            quota: { import: { licensed: { unit: 0 } } },
            permit: { importing: false, exporting: false },
            anchor: { price: {} },
            transfer: {
              tax: {
                supply: { unit: -Math.max(0, transfer) },
                demand: { unit: 0 },
              },
              subsidy: {
                supply: { unit: Math.min(0, transfer) },
                demand: { unit: 0 },
              },
              tariff: {
                import: { unit: 0 },
                export: { unit: 0 },
              },
            },
          },
        })
      };
    }

    default:
      return state;
  }
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function createState(config) {
  return onUpdate({}, { kind: 'config', config });
}
