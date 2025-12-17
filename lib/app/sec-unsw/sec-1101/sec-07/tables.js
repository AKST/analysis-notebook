/**
 * @import { E } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 * @import { State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { crossSectionTable } from '@prelude-uni/components.js';
import * as econFirm from '@base/econ/micro/firm.js';


/** @param {number} n */
const ns = n => n.toFixed(2);

/** @param {number} n */
const intstr = n => n.toFixed(0);

/** @template T @param {T | undefined | null} p @returns {boolean} */
const isNullish = p => p == null;

/**
 * @param {Econ.Firm.BehaviourTable} firm
 * @param {number} fixedCost,
 * @returns {E.Item}
 */
export const firmTable = (firm, fixedCost) => {
  if (firm.price.some(isNullish)) {
    return ['font', {color: 'red'}, 'You may need to adjust quantity per worker'];
  }
  const rows = Array.from(econFirm.firmBehaviourTableIter(firm), row => doc.tr(
    doc.td.of(intstr(row.workers)),
    doc.td.of(ns(fixedCost)),
    doc.td.of(ns(row.costVar)),
    doc.td.of(ns(row.costTotal)),
    doc.td.of(ns(row.marginalCost)),
    doc.td.of(ns(row.avgCostTotal)),
    doc.td.of(ns(row.avgCostVar)),
    doc.td.of(intstr(row.units)),
    doc.td.of(ns(row.price)),
    doc.td.of(ns(row.revenue)),
    doc.td.of(ns(row.marginalRevenue)),
    doc.td.of(ns(row.profit)),
  ));
  return doc.table(
    doc.thead(doc.tr(
      doc.th`W`,
      doc.th`FC`,
      doc.th`VC`,
      doc.th`TC`,
      doc.th`MC`,
      doc.th`ATC`,
      doc.th`AVC`,
      doc.th`Q`,
      doc.th`Price`,
      doc.th`R`,
      doc.th`MR`,
      doc.th`Profit`,
    )),
    doc.tbody(...rows),
  );
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

  return doc.table(
    doc.thead(doc.tr(
      doc.th``,
      doc.th`Marginal Revenue Pricing`,
      doc.th`Avg Total Cost Pricing`,
      doc.th`Marginal Cost`,
      doc.th`1st DPD`,
    )),
    doc.tbody(
      doc.tr(
        doc.th`Demand`,
        doc.td.of(ns(a.demand.size)),
        doc.td.of(ns(a.demand.size)),
        doc.td.of(ns(c.demand.size)),
        doc.td`0`,
      ),
      doc.tr(
        doc.th`Supply`,
        doc.td.of(ns(a.supply.size)),
        doc.td.of(ns(b.demand.size)),
        doc.td.of(ns(c.supply.size)),
        doc.td.of(ns(totalC)),
      ),
      doc.tr(
        doc.th`Total`,
        doc.td.of(ns(totalA)),
        doc.td.of(ns(totalB)),
        doc.td.of(ns(totalC)),
        doc.td.of(ns(totalC)),
      ),
      doc.tr(doc.th({ colSpan: 5 }).t`Dead Weight Loss`),
      doc.tr(
        doc.th`Total (DWL)`,
        doc.td.of(ns(a.dwl.size)),
        doc.td.of(ns(b.dwl.size)),
        doc.td`0`,
        doc.td`0`,
      ),
    ),
  );
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
