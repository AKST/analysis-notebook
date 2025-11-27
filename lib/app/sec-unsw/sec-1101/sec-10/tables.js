/**
 * @import { E } from '@app/prelude-type.ts';
 * @import { Behaviour, State } from './type.ts';
 */
import { table, frag } from '@app/prelude.js';
import * as econCurve from '@base/econ/micro/curve.js';

/** @param {number} n */
const ns = n => n.toFixed(2);

/**
 * @param {State} state
 * @returns {E.Item}
 */
export const curveInformation = ({
  aggregateDemand,
  marginalCost,
  consumers,
  produced,
}) => {
  if (aggregateDemand == null) return undefined;

  const aggregateRow = [
    'Aggregate',
    econCurve.toString(aggregateDemand),
    '/',
    ns((aggregateDemand.i - marginalCost) * produced.contribute * 0.5),
    '/',
  ];

  /** @type {string[][]} */
  const rows = Object.entries(consumers).map(([name, v]) => {
    const colC = ns(v.lindahlPrice);
    const colD = ns(v.surplus.contribute.size);
    const colE = ns(v.surplus.freeRide.size);
    return [name, econCurve.toString(v.curve), colC, colD, colE];
  });

  const freeridePMaybe = econCurve.getPriceAtQuantity(aggregateDemand, produced.freeRide);
  const freerideP = freeridePMaybe.ok ? freeridePMaybe.p : 0;

  return frag([
    table([
      'Agent',
      'Curve',
      'Lindahl Price',
      'Surplus Contribute',
      'Surplus Freeride',
    ], [
      aggregateRow,
      ...rows,
    ], {
      firstColumnHeader: true,
    }),
    table([
      'Contribute Quantity',
      'Freeride Quantity',
      'Freeride Dead Weight Loss',
    ], [[
      ns(produced.contribute),
      ns(produced.freeRide),
      ns(
        (produced.contribute - produced.freeRide) *
        (freerideP - marginalCost) * 0.5
      ),
    ]]),
  ]);
};

