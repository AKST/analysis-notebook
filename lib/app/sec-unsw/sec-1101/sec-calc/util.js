/**
 * @import { Vec2 } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type';
 * @import { Config, State } from './type.ts';
 */
import { v2, math } from '@app/prelude.js';
import * as econSolve from '@base/econ/micro/solver.js';

/**
 * @param {Config} cfg
 * @returns {State}
 */
export function horizontalSummation ({
  transfer: tr,
  controls: {
    priceFloor: priceFloorKnob,
    priceCeiling: priceCeilingKnob,
  },
  market: {
    demand: demandIn,
    supply: supplyIn,
  },
  externality: extern,
  trade: {
    worldPrice,
    tariff,
    permit,
    licenseeQuota,
  },
}) {
  /** @type {Econ.Curve.T} */
  const demand = { kind: 'continious', i: demandIn[0], m: demandIn[1], dir: -1 };

  /** @type {Econ.Curve.T} */
  const supply = { kind: 'continious', i: supplyIn[0], m: supplyIn[1], dir: 1 };

  /** @type {Econ.Model.Config.T} */
  const input = {
    world: { price: worldPrice },
    market: { supply, demand },
    extern,
    policy: {
      transfer: {
        ...tr,
        tariff: tariff,
      },
      quota: {
        import: { licensed: { unit: licenseeQuota } },
      },
      permit: {
        exporting: permit.exporting,
        importing: permit.importing,
      },
      anchor: {
        price: {
          floor: priceFloorKnob,
          ceiling: priceCeilingKnob,
        },
      },
    },
  };

  /** @type {Econ.Model.Config.T['policy']} */
  const freePolicyLocal = {
    transfer: {
      tariff: { import: { unit: 0 }, export: { unit: 0 } },
      subsidy: { demand: { unit: 0 }, supply: { unit: 0 } },
      tax: { demand: { unit: 0 }, supply: { unit: 0 } },
    },
    quota: {
      import: { licensed: { unit: 0 } },
    },
    permit: { importing: false, exporting: false },
    anchor: { price: {} },
  };

  /** @param {ReturnType<typeof econSolve.status>} result */
  const unwrap = result => {
    if (result.ok) return result.model;
    console.error(result.reason);
    return undefined;
  }

  const model = unwrap(econSolve.status(input));
  return {
    model,
    modelFreeLocal: unwrap(econSolve.status({
      ...input,
      policy: freePolicyLocal,
    })),
    modelFreeWorld: unwrap(econSolve.status({
      ...input,
      policy: {
        ...freePolicyLocal,
        quota: { import: { licensed: { unit: 0 } } },
        permit: { importing: true, exporting: true },
      },
    })),
    input,
    bounds: math.el.add(model?.bounds ?? v2(0, 0), 1),
  }
}

// /**
//  * @param {Econ.Line} agent
//  * @param {Vec2} bounds
//  * @returns {[Vec2, Vec2]}
//  */
// export function plotLine({ src, dst }, bounds) {
//   const { div } = math.el;
//   return [div(src, bounds), div(dst, bounds)];
// };

/**
 * @param {Vec2[]} items
 * @param {Vec2} bounds
 * @returns {Vec2[]}
 */
export function bound(items, bounds) {
  return items.map(v => math.el.div(v, bounds));
}
