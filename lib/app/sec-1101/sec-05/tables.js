/**
 * @import { Econ, E } from '../../prelude-type.ts';
 * @import { State } from './type.ts';
 */
import * as prelude from '../prelude.js';
import { econCurve, table } from '../../prelude.js';

const layout = prelude.layout;

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

  return table(['Name', 'Curve', 'Burden', 'Surplus Δ'], [
    ['Demand', econCurve.toString(demand), dBurden, dChange.toFixed(2)],
    ['Supply', econCurve.toString(supply), sBurden, sChange.toFixed(2)],
  ], {
    firstColumnHeader: true,
  });
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

  return table(['Name', 'Curve', 'Benefit', 'Surplus Δ'], [
    ['Demand', econCurve.toString(demand), dBenefit, dChange.toFixed(2)],
    ['Supply', econCurve.toString(supply), sBenefit, sChange.toFixed(2)],
  ], {
    firstColumnHeader: true,
  });
}
