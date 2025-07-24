/**
 * @import { Econ, Vec2 } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import {
  v2,
  econCurve as curve,
  getMarketSnapshot,
  math,
} from '../../prelude.js';

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
  trade: {
    worldPrice,
    tariff,
    permit,
  },
}) {
  /** @type {Econ.CurveParams} */
  const demand = { kind: 'demand', i: demandIn[0], m: demandIn[1] };
  /** @type {Econ.CurveParams} */
  const supply = { kind: 'supply', i: supplyIn[0], m: supplyIn[1] };

  /** @type {Econ.ModelState} */
  const input = {
    world: { price: worldPrice },
    market: { supply, demand },
    policy: {
      transfer: {
        ...tr,
        tariff: tariff,
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

  const freePolicyLocal = {
    transfer: {
      tariff: { import: { unit: 0 } },
      subsidy: { demand: { unit: 0 }, supply: { unit: 0 } },
      tax: { demand: { unit: 0 }, supply: { unit: 0 } },
    },
    permit: { importing: false, exporting: false },
    anchor: { price: {} },
  };

  const [marketQ] = curve.equilibrium(demand, supply).vec;
  return {
    model: getMarketSnapshot(input),
    modelFreeLocal: getMarketSnapshot({
      ...input,
      policy: freePolicyLocal,
    }),
    modelFreeWorld: getMarketSnapshot({
      ...input,
      policy: {
        ...freePolicyLocal,
        permit: { importing: true, exporting: true },
      },
    }),
    input,
    bounds: math.el.add(v2(marketQ*2, demand.i), 1),
    demand,
    supply,
  }
}

/**
 * @param {Econ.Line} agent
 * @param {Vec2} bounds
 * @returns {[Vec2, Vec2]}
 */
export function plotLine({ src, dst }, bounds) {
  const { div } = math.el;
  return [div(src, bounds), div(dst, bounds)];
};

/**
 * @param {Vec2[]} items
 * @param {Vec2} bounds
 * @returns {Vec2[]}
 */
export function bound(items, bounds) {
  return items.map(v => math.el.div(v, bounds));
}
