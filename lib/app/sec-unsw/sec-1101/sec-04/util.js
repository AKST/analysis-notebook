/**
 * @import { Econ, Vec2 } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import {
  v2,
  econSolve as solve,
  econCurve as curve,
  math,
  objects,
} from '@app/prelude.js';

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
 * @param {Config['summation']} cfg
 * @returns {State['summation']}
 */
export function horizontalSummation ({
  priceCtrl: priceCtrlKnob,
  consumers: consumersIn,
  producers: producersIn,
}) {
  /** @type {Record<string, Econ.Curve.Continious>} */
  const consumers = objects.mapEntries(consumersIn, ([i, m]) => (
    { kind: 'continious', dir: -1, i, m }
  ));

  /** @type {Record<string, Econ.Curve.Continious>} */
  const producers = objects.mapEntries(producersIn, ([i, m]) => (
    { kind: 'continious', dir: 1, i, m }
  ));

  const demand = curve.summiseHorizontalAll(Object.values(consumers));
  const supply = curve.summiseHorizontalAll(Object.values(producers));
  const eqResult = curve.equilibrium(demand, supply);
  const eqPrice = eqResult.ok ? eqResult.p : undefined;

  /** @type {number | undefined} */
  let floor = undefined, ceiling = undefined;
  switch (priceCtrlKnob.kind) {
    case 'relative':
      switch (true) {
        case eqPrice && priceCtrlKnob.value < 0:
          ceiling = eqPrice + priceCtrlKnob.value;
          break;

        case eqPrice && priceCtrlKnob.value > 0:
          floor = eqPrice + priceCtrlKnob.value;
          break;
      }
      break;
    case 'absolute':
      switch (true) {
        case eqPrice && eqPrice > priceCtrlKnob.value:
          ceiling = priceCtrlKnob.value;
          break;

        case eqPrice && eqPrice < priceCtrlKnob.value:
          floor = priceCtrlKnob.value;
          break;
      }
      break;

    default:
      break;
  }


  /** @type {Econ.Model.Config.T} */
  const modelState = {
    world: { price: 100000 },
    market: { supply, demand },
    extern: { supply: 0, demand: 0 },
    policy: {
      transfer: {
        tax: { demand: { unit: 0 }, supply: { unit: 0 } },
        subsidy: { demand: { unit: 0 }, supply: { unit: 0 } },
        tariff: { import: { unit: 0 }, export: { unit: 0 } },
      },
      quota: {
        import: { licensed: { unit: 0 } },
      },
      permit: {
        importing: false,
        exporting: false,
      },
      anchor: {
        price: { ceiling, floor },
      },
    },
  };

  const model = unwrap(solve.status(modelState))?.model;

  return {
    model,
    modelEq: unwrap(solve.status({
      ...modelState,
      policy: {
        ...modelState.policy,
        anchor: { price: { ceiling: undefined, floor: undefined } },
      },
    }))?.model,
    modelState,
    bounds: model?.bounds ?? v2(1, 1),
    consumers,
    producers,
    aggregate: {
      consumption: demand,
      production: supply,
    },
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
 * @param {readonly Vec2[]} items
 * @param {Vec2} bounds
 * @returns {Vec2[]}
 */
export function bound(items, bounds) {
  return items.map(v => math.el.div(v, bounds));
}

/**
 * @param {{ consumers: number[], producers: number[] }} curves
 * @returns {State['discrete']}
 */
export function discreteCurves({
  consumers,
  producers,
}) {
  const supply = curve.discrete(1, producers);
  const demand = curve.discrete(-1, consumers);
  const equilibrium = unwrap(curve.equilibrium(demand, supply));

  const model = unwrap(solve.status({
    world: { price: 1 },
    market: { supply, demand },
    extern: { supply: 0, demand: 0 },
    policy: {
      quota: { import: { licensed: { unit: 0 } } },
      permit: { exporting: false, importing: false },
      anchor: { price: { floor: undefined, ceiling: undefined } },
      transfer: {
        tariff: { import: { unit: 0 }, export: { unit: 0 } },
        tax: { supply: { unit: 0 }, demand: { unit: 0 } },
        subsidy: { supply: { unit: 0 }, demand: { unit: 0 } },
      },
    },
  }))?.model;

  return {
    model,
    producers: supply,
    consumers: demand,
    equilibrium: (
      equilibrium
        ? v2(equilibrium.q, equilibrium.p)
        : undefined
    ),
    bounds: math.el.add(1, v2(
      Math.max(supply.rate.length, demand.rate.length),
      Math.max(
        supply.rate.reduce((a, b) => Math.max(a, b), 0),
        demand.rate.reduce((a, b) => Math.max(a, b), 0),
      ),
    )),
  };
}
