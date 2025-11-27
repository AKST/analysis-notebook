/**
 * @import * as Econ from '@base/econ/micro/type.ts';
 * @import { Config, State, Event } from './type.ts';
 * @import { MakeConfigKnobs } from '@app/prelude-type.ts';
 */
import * as econSolve from '@base/econ/micro/solver.js';

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

  /** @type {Econ.Curve.Continious} */
  const demand = { kind: 'continious', m: db, i: da, dir: -1 };

  /** @type {Econ.Curve.Continious} */
  const supply = { kind: 'continious', m: sb, i: sa, dir: 1 };

  /** @type {Econ.Model.Config.T} */
  const base = {
    world: { price: 100000 },
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
    demand,
    supply,
    base: maybeModel(base)?.[1],
    ceiling: maybeModel(ceilingInput),
    floor: maybeModel(floorInput),
    subsidy: maybeModel(subsidyInput),
    tax: maybeModel(taxInput),
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
