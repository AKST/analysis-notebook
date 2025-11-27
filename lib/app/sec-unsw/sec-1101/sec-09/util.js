/**
 * @import { MakeConfigKnobs, Widget } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 * @import { Config, State, Event } from './type.ts';
 */

import * as econSolve from '@base/econ/micro/solver.js';

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {
    externality: {
      kind: 'number',
      range: [-100, 100],
      label: 'Externality',
      of: 0,
    },
    transfer: {
      kind: 'number',
      range: [-100, 100],
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
