/**
 * @import { Econ2 as Econ, Vec2 } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import {
  v2,
  econSolve as solve,
  econCurve as curve,
  econCurveDiscrete as disreteCurve,
  math,
  objects,
} from '../../prelude.js';

/**
 * @param {Config['summation']} cfg
 * @returns {State['summation']}
 */
export function horizontalSummation ({
  priceCtrl: priceCtrlKnob,
  consumers: consumersIn,
  producers: producersIn,
}) {
  /** @type {Record<string, Econ.Curve.T>} */
  const consumers = objects.mapEntries(consumersIn, ([i, m]) => (
    { kind: 'continious', dir: -1, i, m }
  ));

  /** @type {Record<string, Econ.Curve.T>} */
  const producers = objects.mapEntries(producersIn, ([i, m]) => (
    { kind: 'continious', dir: 1, i, m }
  ));

  const demand = curve.summiseHorizontalAll(Object.values(consumers));
  const supply = curve.summiseHorizontalAll(Object.values(producers));
  const eqResult = curve.equilibrium(demand, supply);
  const eqPrice = eqResult.ok ? eqResult.p : undefined;

  /** @type {number | undefined} */
  let floor = undefined, ceiling = undefined;
  switch (true) {
    case eqPrice && priceCtrlKnob < 0:
      ceiling = eqPrice + priceCtrlKnob;
      break;

    case eqPrice && priceCtrlKnob > 0:
      floor = eqPrice + priceCtrlKnob;
      break;
  }


  /** @type {Econ.Model.Config.T} */
  const modelState = {
    world: { price: 0 },
    market: { supply, demand },
    extern: { supply: 0, demand: 0 },
    policy: {
      transfer: {
        tax: { demand: { unit: 0 }, supply: { unit: 0 } },
        subsidy: { demand: { unit: 0 }, supply: { unit: 0 } },
        tariff: { import: { unit: 0 }, export: { unit: 0 } },
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

  const result = solve.status(modelState)
  const model = result.ok ? result.model : undefined;

  const resultEq = solve.status({
    ...modelState,
    policy: {
      ...modelState.policy,
      anchor: { price: { ceiling: undefined, floor: undefined } },
    },
  });
  const modelEq = resultEq.ok ? resultEq.model : undefined;

  return {
    model,
    modelEq: modelEq,
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
 * @param {Vec2[]} items
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
  /** @type {readonly Vec2[]} */
  const supply = disreteCurve.curve(producers, 'supply');
  const demand = disreteCurve.curve(consumers, 'demand');
  const equilibrium = disreteCurve.equilibrium(supply, demand);

  const marketPrice = equilibrium?.vec[1];

  return {
    producers: {
      curve: supply,
      agents: producers.map(price => {
        const zeroSurplus = marketPrice == null || marketPrice < price;
        return {
          reservationPrice: price,
          surplus: zeroSurplus ? 0 : (marketPrice - price)
        };
      }),
    },
    consumers: {
      curve: demand,
      agents: consumers.map(price => {
        const zeroSurplus = marketPrice == null || marketPrice > price;
        return {
          reservationPrice: price,
          surplus: zeroSurplus ? 0 : (price - marketPrice)
        };
      }).reverse(),
    },
    equilibrium,
    bounds: math.el.add(1, v2(
      Math.max(supply.length, demand.length),
      Math.max(
        supply.reduce((a, b) => Math.max(a, b.vec[1]), 0),
        demand.reduce((a, b) => Math.max(a, b.vec[1]), 0),
      ),
    )),
  };
}

/**
 * @param {readonly Vec2[]} curve
 * @param {Vec2} bounds
 * @returns {Vec2[]}
 */
export function plotDiscrete(curve, bounds) {
  const { div, sub } = math.el;
  const x1y0 = v2(1, 0);
  return curve.flatMap(v => [sub(v, x1y0), v]).map(v => div(v, bounds))
}
