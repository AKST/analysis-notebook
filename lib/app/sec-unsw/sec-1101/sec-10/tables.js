/**
 * @import { E } from '@app/prelude-type.ts';
 * @import { Behaviour, State } from './type.ts';
 */
import { doc, frag } from '@app/prelude.js';
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

  const aggregateRow = doc.tr(
    doc.th`Aggregate`,
    doc.td.of(econCurve.toString(aggregateDemand)),
    doc.td`/`,
    doc.td.of(ns((aggregateDemand.i - marginalCost) * produced.contribute * 0.5)),
    doc.td`/`,
  );

  const rows = Object.entries(consumers).map(([name, v]) => {
    const colC = ns(v.lindahlPrice);
    const colD = ns(v.surplus.contribute.size);
    const colE = ns(v.surplus.freeRide.size);
    return doc.tr(
      doc.th.of(name),
      doc.td.of(econCurve.toString(v.curve)),
      doc.td.of(colC),
      doc.td.of(colD),
      doc.td.of(colE),
    );
  });

  const freeridePMaybe = econCurve.getPriceAtQuantity(aggregateDemand, produced.freeRide);
  const freerideP = freeridePMaybe.ok ? freeridePMaybe.p : 0;

  return frag([
    doc.table(
      doc.thead(doc.tr(
        doc.th`Agent`,
        doc.th`Curve`,
        doc.th`Lindahl Price`,
        doc.th`Surplus Contribute`,
        doc.th`Surplus Freeride`,
      )),
      doc.tbody(
        aggregateRow,
        ...rows,
      ),
    ),
    doc.table(
      doc.thead(doc.tr(
        doc.th`Contribute Quantity`,
        doc.th`Freeride Quantity`,
        doc.th`Freeride Dead Weight Loss`,
      )),
      doc.tbody(doc.tr(
        doc.td.of(ns(produced.contribute)),
        doc.td.of(ns(produced.freeRide)),
        doc.td.of(ns(
          (produced.contribute - produced.freeRide) *
          (freerideP - marginalCost) * 0.5
        )),
      )),
    ),
  ]);
};

