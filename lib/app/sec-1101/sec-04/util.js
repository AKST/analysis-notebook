/**
 * @import { Econ, Vec2 } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import {
  v2,
  econCurve as curve,
  econCurveDiscrete as disreteCurve,
  getMarketSnapshot,
  math,
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
  const consumers = Object.entries(consumersIn)
    .map(([name, [i, m]]) => ({ i, m, name }));

  const producers = Object.entries(producersIn)
    .map(([name, [i, m]]) => ({ i, m, name }));

  const consumption = { name: 'aggregate', ...curve.summation(consumers) };
  const production = { name: 'aggregate', ...curve.summation(producers) };
  const [_, eqPrice] = curve.equilibrium(consumption, production).vec;

  /** @type {number | undefined} */
  let floor = undefined, ceiling = undefined;
  switch (true) {
    case priceCtrlKnob < 0:
      ceiling = eqPrice + priceCtrlKnob;
      break;

    case priceCtrlKnob > 0:
      floor = eqPrice + priceCtrlKnob;
      break;
  }


  /** @type {Econ.ModelState} */
  const modelState = {
    world: { price: 0 },
    market: {
      supply: { kind: 'supply', ...production },
      demand: { kind: 'demand', ...consumption },
    },
    policy: {
      transfer: {
        tax: { demand: { unit: 0 }, supply: { unit: 0 } },
        subsidy: { demand: { unit: 0 }, supply: { unit: 0 } },
        tariff: { import: { unit: 0 } },
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
  const model = getMarketSnapshot(modelState)

  // yc = a + b(xc) ^ yc = 0 => xc = -a/b
  // yp = a + b(xc)
  const xc = (-consumption.i)/consumption.m;
  const yp = production.i+production.m*xc;

  return {
    model,
    modelEq: getMarketSnapshot({
      ...modelState,
      policy: {
        ...modelState.policy,
        anchor: { price: { ceiling: undefined, floor: undefined } },
      },
    }),
    modelState,
    bounds: math.el.add(v2(xc, Math.max(consumption.i, yp)), 1),
    consumers,
    producers,
    aggregate: { consumption, production },
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
