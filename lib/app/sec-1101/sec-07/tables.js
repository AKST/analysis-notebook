/**
 * @import { E, Econ } from '../../prelude-type.ts';
 * @import { State } from './type.ts';
 */
import * as prelude from '../prelude.js';
import { table, econFirm } from '../../prelude.js';

const { crossSectionTable } = prelude.components;


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
  if (firm.price.some(p => p == null)) {
    return ['font', {color: 'red'}, 'You may need to adjust quantity per worker'];
  }
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

/**
 * @param {State} state
 */
export const exampleTwoAreas = (state) => {
  if (state.exampleB == null) return;
  const {
    marginalRevenuePrice: a,
    averageCostPrice: b,
    marginalCost: c,
  } = state.exampleB.surpluses;

  const totalA = a.demand.size + a.supply.size;
  const totalB = b.demand.size + b.supply.size;
  const totalC = c.demand.size + c.supply.size;

  return table([
    '',
    'Marginal Revenue Pricing',
    'Avg Total Cost Pricing',
    'Marginal Cost',
    '1st DPD',
  ], [
    ['Demand', ns(a.demand.size), ns(a.demand.size), ns(c.demand.size), '0'],
    ['Supply', ns(a.supply.size), ns(b.demand.size), ns(c.supply.size), ns(totalC)],
    ['Total', ns(totalA), ns(totalB), ns(totalC), ns(totalC)],
    ['Total (DWL)', ns(a.dwl.size), ns(b.dwl.size), '0', '0'],
  ], {
    firstColumnHeader: true,
    headerRows: [
      [3, ['Dead Weight Loss']],
    ],
  });
}

export const priceDiscrimination = () => {
  const tick = '✅', cross = '❌';
  return crossSectionTable({
    rowColor: {},
    colColor: {},
    outcomes: {
      '1st Degree': {
      },
      '2nd Degree': {
      },
      '3rd Degree': {
      },
    },
  });
};


/**
 * @param {State} state
 * @returns {E.Item[]}
 */
export const exampleThreeMarketSegments = (state) => {
  if (state.exampleC == null) return [];

  const { markets: segments } = state.exampleC;

  /** @type {E.Item[]} */
  const items = [];
  for (const [k, v] of Object.entries(segments)) {
    items.push(['h4', 'Market Segment ' +k]);
    items.push(firmTable(v, 0));
  }


  return items;
};
