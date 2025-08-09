/**
 * @import { Econ } from '../../prelude-type.ts';
 * @import { State } from './type.ts';
 */
import { econSolve } from '../../prelude.js';

/**
 * @template {{ ok: false, reason: string } | { ok: true }} T
 * @param {T} result
 * @returns {Extract<T, { ok: true }> | undefined}
 */
const unwrap = result => {
  if (result.ok) {
    /** @ts-ignore - dw i got it */
    return result;
  }
  console.error(result.reason);
  return undefined;
}

/**
 * @returns {State}
 */
export function initExamples() {
  const { status } = econSolve;
  /** @type {Econ.Model.Config.T} */
  const base = {
    world: { price: 100000 },
    market: {
      demand: { kind: 'continious', m: -1, i: 40, dir: -1 },
      supply: { kind: 'continious', m: 1, i: 0, dir: 1 },
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
        price: { ceiling: 10 },
      },
    },
  };

  const floorInput = {
    ...base,
    policy: {
      ...base.policy,
      anchor: {
        price: { floor: 30 },
      },
    },
  }

  const taxInput = {
    ...base,
    policy: {
      ...base.policy,
      transfer: {
        ...base.policy.transfer,
        tax: { demand: { unit: 10 }, supply: { unit: 0 } },
      },
    },
  }

  const subsidyInput = {
    ...base,
    policy: {
      ...base.policy,
      transfer: {
        ...base.policy.transfer,
        subsidy: { demand: { unit: 10 }, supply: { unit: 0 } },
      },
    },
  }

  return {
    ceilingInput,
    ceilingModel: unwrap(status(ceilingInput))?.model,
    floorInput,
    floorModel: unwrap(status(floorInput))?.model,
    subsidyInput,
    subsidyModel: unwrap(status(subsidyInput))?.model,
    taxInput,
    taxModel: unwrap(status(taxInput))?.model,
  };
}
