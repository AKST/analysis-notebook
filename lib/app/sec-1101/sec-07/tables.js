/**
 * @import { E, Econ } from '../../../prelude-type.ts';
 */
import { table, econFirm } from '../../prelude.js';

/** @param {number} n */
const ns = n => n.toFixed(2);

/** @param {number} n */
const intstr = n => n.toFixed(0);

/**
 * @param {Econ.Firm.BehaviourTable} firm
 * @param {number} fixedCost,
 * @returns {E.Item}
 */
export const firmTable = (firm, fixedCost) => {
  const rows = Array.from(econFirm.firmBehaviourTableIter(firm), row => {
    return [
      intstr(row.workers),
      ns(fixedCost),
      ns(row.costVar),
      ns(row.costTotal),
      ns(row.marginalCost),
      ns(row.avgCostTotal),
      ns(row.avgCostVar),
      intstr(row.units),
      ns(row.price),
      ns(row.revenue),
      ns(row.marginalRevenue),
      ns(row.profit),
    ];
  });
  return table([
    'W',
    'FC',
    'VC',
    'TC',
    'MC',
    'ATC',
    'AVC',
    'Q',
    'Price',
    'R',
    'MR',
    'Profit'
  ], rows);
};

