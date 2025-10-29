/**
 * @import { Econ } from '../../../prelude-type.ts';
 * @import { Config, Event, State } from './type.ts';
 */
import { econSolve } from '../../../prelude.js';

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
    case 'config': return initExamples(event.config);
    default: return state;
  }
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function initExamples({ worldPrice, market, policy }) {
  const { demand: [da, db], supply: [sa, sb] } = market;

  /** @type {Econ.Curve.Continious} */
  const demand = { kind: 'continious', m: db, i: da, dir: -1 };

  /** @type {Econ.Curve.Continious} */
  const supply = { kind: 'continious', m: sb, i: sa, dir: 1 };

  /** @type {Econ.Model.Config.T} */
  const base = {
    world: { price: worldPrice },
    market: { demand, supply },
    extern: { demand: 0, supply: 0 },
    policy: {
      transfer: {
        tax: { demand: { unit: 0 }, supply: { unit: 0 } },
        subsidy: { demand: { unit: 0 }, supply: { unit: 0 } },
        tariff: { import: { unit: 0 }, export: { unit: 0 } },
      },
      quota: { import: { licensed: { unit: 0 } } },
      permit: { importing: false, exporting: false },
      anchor: { price: {} },
    },
  };

  /** @type {Econ.Model.Config.T} */
  const freeTrade = {
    ...base,
    policy: {
      ...base.policy,
      permit: { importing: true, exporting: true },
    },
  };

  /** @type {Econ.Model.Config.T} */
  const tariff = {
    ...base,
    policy: {
      ...base.policy,
      permit: { importing: true, exporting: true },
      transfer: {
        ...base.policy.transfer,
        tariff: { import: { unit: policy.tariff }, export: { unit: 0 } },
      },
    },
  };

  /** @type {Econ.Model.Config.T} */
  const quota = {
    ...base,
    policy: {
      ...base.policy,
      quota: { import: { licensed: { unit: policy.quota } } },
    },
  };

  return {
    supply,
    demand,
    models: {
      base: maybeModel(base)?.[1],
      freeTrade: maybeModel(freeTrade)?.[1],
      tariff: maybeModel(tariff),
      quota: maybeModel(quota),
    },
    examples: {
      importing: maybeModel({
        ...base,
        policy: {
          ...base.policy,
          permit: { importing: true, exporting: true },
        },
        world: { price: 20 },
      }),
      exporting: maybeModel({
        ...base,
        policy: {
          ...base.policy,
          permit: { importing: true, exporting: true },
        },
        world: { price: 40 },
      }),
    },
  };
};

