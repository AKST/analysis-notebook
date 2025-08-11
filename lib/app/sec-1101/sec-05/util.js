/**
 * @import { Econ } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { econSolve } from '../../prelude.js';

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
 * @param {Config} config
 * @returns {State}
 */
export function initExamples({ market, policy }) {
  const { demand: [da, db], supply: [sa, sb] } = market;

  /** @type {Econ.Model.Config.T} */
  const base = {
    world: { price: 100000 },
    market: {
      demand: { kind: 'continious', m: db, i: da, dir: -1 },
      supply: { kind: 'continious', m: sb, i: sa, dir: 1 },
    },
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

  const ceilingInput = {
    ...base,
    policy: {
      ...base.policy,
      anchor: {
        price: { ceiling: policy.ceiling },
      },
    },
  };

  const floorInput = {
    ...base,
    policy: {
      ...base.policy,
      anchor: {
        price: { floor: policy.floor },
      },
    },
  }

  const taxInput = {
    ...base,
    policy: {
      ...base.policy,
      transfer: {
        ...base.policy.transfer,
        tax: { demand: { unit: policy.tax }, supply: { unit: 0 } },
      },
    },
  }

  const subsidyInput = {
    ...base,
    policy: {
      ...base.policy,
      transfer: {
        ...base.policy.transfer,
        subsidy: { demand: { unit: policy.subsidy }, supply: { unit: 0 } },
      },
    },
  }

  return {
    ceiling: maybeModel(ceilingInput),
    floor: maybeModel(floorInput),
    subsidy: maybeModel(subsidyInput),
    tax: maybeModel(taxInput),
  };
}
