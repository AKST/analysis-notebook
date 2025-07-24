/**
 * @import {
 *   MarginalFirmBehaviour,
 *   FirmBehaviourTable,
 *   DiscreteRateOfChange,
 * } from './type.ts';
 */
import { mapEntries } from '../../../util/object.js';
import { Unreachable } from '../../../util/type.js';

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
 *   maxworker?: number,
 *   fixedCost?: number,
 *   perworkerCost: DiscreteRateOfChange,
 *   perworkerUnits: DiscreteRateOfChange,
 *   perworkerPrice: DiscreteRateOfChange,
 * }} cfg
 * @returns {Generator<MarginalFirmBehaviour, undefined, undefined>}
 */
export function * firmBehaviourPerWorker({
  maxworker = 100,
  fixedCost = 0,
  perworkerCost,
  perworkerUnits,
  perworkerPrice,
}) {
  const length = safeLength(
    maxworker,
    perworkerCost,
    perworkerUnits,
    perworkerPrice,
  );

  /** @param {number} workers */
  const nonMarginalPortion = workers => {
    const costVar = nth(workers, perworkerCost);
    const units = nth(workers, perworkerUnits);
    const price = nth(workers, perworkerPrice);
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
 *   maxworker?: number,
 *   fixedCost?: number,
 *   perworkerCost: DiscreteRateOfChange,
 *   perworkerUnits: DiscreteRateOfChange,
 *   perworkerPrice: DiscreteRateOfChange,
 * }} options
 * @returns {FirmBehaviourTable | undefined}
 */
export function firmBehaviorPerWorkerTable(options) {
  const iterator = firmBehaviourPerWorker(options);
  const head = iterator.next();
  if (head.value == null) return undefined;

  /** @type {FirmBehaviourTable} */
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
 * @param {FirmBehaviourTable} table
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
 * @param {FirmBehaviourTable} table
 * @returns {Generator<MarginalFirmBehaviour, undefined, undefined>}
 */
export function * firmBehaviourTableIter(table) {
  for (let i = 0; i < table.price.length; i++) {
    // @ts-ignore - whatever
    yield mapEntries(table, items => items[i]);
  }
}
