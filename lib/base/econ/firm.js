/**
 * @import { Vec2 } from '../geom_2d/type.ts';
 * @import {
 *   Firm,
 *   DiscreteRateOfChange,
 * } from './type.ts';
 */
import { mapEntries } from '../../util/object.js';
import { Unreachable } from '../../util/type.js';
import * as math from '../math/value.js';
import { v2 } from '../geom_2d/index.js';

/**
 * @param {number} workers
 * @param {number} units
 * @param {Firm.DiscreteFunction} fn
 * @returns {number}
 */
function callDiscreteFunction(workers, units, fn) {
  switch (fn.param) {
    case 'worker':
      return nth(workers, fn.rateOfChange);
    case 'units':
      return nth(units, fn.rateOfChange);
    default:
      throw new Unreachable(fn);
  }
}

/**
 * @param {DiscreteRateOfChange} rate
 * @param {number} i
 * @returns {number}
 */
function nth(i, rate) {
  switch (rate.kind) {
    case 'const': return rate.const;
    case 'curve': return rate.curve.i + rate.curve.m * i;
    case 'scalar': return rate.scalar * i;
    case 'cumulative': return rate.total[i];
    case 'marginal':
      return rate.rate.slice(i).reduce((a, b) => a+b, 0);
    default:
      throw new Unreachable(rate);
  }
}

/**
 * @param {number} safeMax
 * @param {...DiscreteRateOfChange} rates
 * @returns {number}
 */
function safeLength(safeMax, ...rates) {
  return rates.map(rate => {
    switch (rate.kind) {
      case 'const': return Infinity;
      case 'curve': return Infinity;
      case 'scalar': return Infinity;
      case 'cumulative': return rate.total.length;
      case 'marginal':
        return rate.rate.length;
      default:
        throw new Unreachable(rate);
    }
  }).reduce((a, b) => Math.min(a, b), safeMax);
}

/**
 * @param {{
 *   initialRow: { kind: 'no' } | { kind: 'yes', default: 0 | NaN },
 *   maxWorkers?: number,
 *   fixedCost?: number,
 *   perworkerCost: DiscreteRateOfChange,
 *   perworkerUnits: DiscreteRateOfChange,
 *   priceFunction: Firm.DiscreteFunction,
 * }} cfg
 * @returns {Generator<Firm.MarginalBehaviour, undefined, undefined>}
 */
export function * firmBehaviourPerWorker({
  initialRow,
  maxWorkers = 100,
  fixedCost = 0,
  perworkerCost,
  perworkerUnits,
  priceFunction,
}) {
  const length = safeLength(
    maxWorkers + 1,
    perworkerCost,
    perworkerUnits,
    priceFunction.rateOfChange,
  );

  /** @param {number} workers */
  const nonMarginalPortion = workers => {
    const costVar = nth(workers, perworkerCost);
    const units = nth(workers, perworkerUnits);
    const price = callDiscreteFunction(workers, units, priceFunction);
    return {
      costVar,
      costTotal: costVar + fixedCost,
      price,
      units,
      workers,
      revenue: price * units,
      profit: price * units - (costVar + fixedCost),
    };
  };

  if (initialRow.kind === 'yes') {
    const zero = initialRow.default;
    const init = nonMarginalPortion(0);
    yield {
      avgCostVar: zero,
      avgCostTotal: zero,
      marginalCost: zero,
      marginalRevenue: zero,
      marginalBenefit: NaN,
      ...init
    };
  }

  for (let workers = 1; workers < length; workers++) {
    const prev = nonMarginalPortion(workers - 1);
    const curr = nonMarginalPortion(workers);

    const mu = prev.units - curr.units;
    const avgCostVar = curr.costVar / curr.units;
    const avgCostTotal = curr.costTotal / curr.units;
    const marginalCost = (prev.costTotal - curr.costTotal)/mu;
    const marginalRevenue = (prev.revenue - curr.revenue)/mu;
    const marginalBenefit =  curr.price / marginalCost
    yield {
      avgCostVar,
      avgCostTotal,
      marginalCost,
      marginalRevenue,
      marginalBenefit,
      ...curr
    };
  }
}
/**
 * @param {{
 *   initialRow: { kind: 'no' } | { kind: 'yes', default: 0 | NaN },
 *   maxWorkers?: number,
 *   fixedCost?: number,
 *   perworkerCost: DiscreteRateOfChange,
 *   perworkerUnits: DiscreteRateOfChange,
 *   priceFunction: Firm.DiscreteFunction,
 * }} options
 * @returns {Firm.BehaviourTable | undefined}
 */
export function firmBehaviorPerWorkerTable(options) {
  const iterator = firmBehaviourPerWorker(options);
  const head = iterator.next();
  if (head.value == null) return undefined;

  /** @type {Firm.BehaviourTable} */
  const out = {
    costVar: [],
    costTotal: [],
    units: [],
    price: [],
    revenue: [],
    profit: [],
    workers: [],
    avgCostVar: [],
    avgCostTotal: [],
    marginalCost: [],
    marginalRevenue: [],
    marginalBenefit: [],
  };

  for (const item of firmBehaviourPerWorker(options)) {
    // @ts-ignore - whatever
    mapEntries(item, (item, key) => out[key].push(item));
  }

  return out;
}

/**
 * @param {Firm.BehaviourTable} table
 */
export function * supplyElasicity(table) {
  for (let i = 1; i < table.units.length; i++) {
    const q = table.units[i];
    const mc = table.marginalCost[i];
    const qd = table.units[i] - table.units[i-1];
    const mcd = table.marginalCost[i] - table.marginalCost[i-1];
    yield (mc/q) * (qd/mcd);
  }
}

/**
 * @param {Firm.BehaviourTable} table
 * @returns {Vec2}
 */
export function tableBounds(table) {
  return v2(
    Math.max(...table.units) * 1.1,
    Math.max(...[
      table.avgCostTotal,
      table.avgCostVar,
      table.marginalCost,
      table.price,
      table.marginalRevenue,
    ].map(ls => Math.max(...ls))) * 1.1,
  );
}

/**
 * @param {Firm.BehaviourTable} table
 * @param {Vec2} [scale]
 * @returns {{
 *   units: readonly number[],
 *   marginalRevenue: readonly Vec2[],
 *   marginalCost: readonly Vec2[],
 *   avgCostTotal: readonly Vec2[],
 *   avgCostVar: readonly Vec2[],
 *   price: readonly Vec2[],
 * }}
 */
export function tablePlots(table, scale = v2(1, 1)) {
  /** @param {readonly number[]} xs */
  const makePoints = xs => table.units.map((q, i) => (
    math.el.div(v2(q, xs[i]), scale)
  ));
  return {
    units: table.units,
    price: makePoints(table.price),
    avgCostVar: makePoints(table.avgCostVar),
    avgCostTotal: makePoints(table.avgCostTotal),
    marginalCost: makePoints(table.marginalCost),
    marginalRevenue: makePoints(table.marginalRevenue),
  }
}

/**
 * @param {Firm.BehaviourTable} table
 * @returns {Generator<Firm.MarginalBehaviour, undefined, undefined>}
 */
export function * firmBehaviourTableIter(table) {
  for (let i = 0; i < table.price.length; i++) {
    // @ts-ignore - whatever
    yield mapEntries(table, items => items[i]);
  }
}
