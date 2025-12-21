/**
 * @import { E } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 * @import { State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import * as econCurve from '@base/econ/micro/curve.js';

/**
 * @param {Econ.Curve.Continious} demand
 * @param {Econ.Curve.Continious} supply
 * @param {Econ.Model.Desc.T} base
 * @param {[Econ.Model.Config.T,  Econ.Model.Desc.T]} state
 * @returns {E.Item}
 */
export function taxBurden (demand, supply, base, [conf, desc]) {
  const dBurden = ((-demand.m) / (supply.m - demand.m)).toFixed(2);
  const sBurden = (supply.m / (supply.m - demand.m)).toFixed(2);

  const dChange = desc.demand.market.surplus.size - base.demand.market.surplus.size;
  const sChange = desc.supply.market.surplus.size - base.supply.market.surplus.size;

  return doc.table(
    doc.thead(doc.tr(doc.th`Name`, doc.th`Curve`, doc.th`Burden`, doc.th`Surplus Δ`)),
    doc.tbody(
      doc.tr(
        doc.th`Demand`,
        doc.td.c(econCurve.toString(demand)),
        doc.td.c(dBurden),
        doc.td.c(dChange.toFixed(2)),
      ),
      doc.tr(
        doc.th`Supply`,
        doc.td.c(econCurve.toString(supply)),
        doc.td.c(sBurden),
        doc.td.c(sChange.toFixed(2)),
      ),
    ),
  );
}

/**
 * @param {Econ.Curve.Continious} demand
 * @param {Econ.Curve.Continious} supply
 * @param {Econ.Model.Desc.T} base
 * @param {[Econ.Model.Config.T,  Econ.Model.Desc.T]} state
 * @returns {E.Item}
 */
export function surplusBenefit (demand, supply, base, [conf, desc]) {
  const dBenefit = ((-demand.m) / (supply.m - demand.m)).toFixed(2);
  const sBenefit = (supply.m / (supply.m - demand.m)).toFixed(2);

  const dChange = desc.demand.market.surplus.size - base.demand.market.surplus.size;
  const sChange = desc.supply.market.surplus.size - base.supply.market.surplus.size;

  return doc.table(
    doc.thead(doc.tr(doc.th`Name`, doc.th`Curve`, doc.th`Benefit`, doc.th`Surplus Δ`)),
    doc.tbody(
      doc.tr(
        doc.th`Demand`,
        doc.td.c(econCurve.toString(demand)),
        doc.td.c(dBenefit),
        doc.td.c(dChange.toFixed(2)),
      ),
      doc.tr(
        doc.th`Supply`,
        doc.td.c(econCurve.toString(supply)),
        doc.td.c(sBenefit),
        doc.td.c(sChange.toFixed(2)),
      ),
    ),
  );
}
