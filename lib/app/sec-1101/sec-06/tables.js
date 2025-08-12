/**
 * @import { Econ, E } from '../../prelude-type.ts';
 */
import { table } from '../../prelude.js';

/**
 * @param {E.Item} caption
 * @param {Econ.Model.Desc.T} base
 * @param {Econ.Model.Desc.T} ft
 * @param {[Econ.Model.Config.T,  Econ.Model.Desc.T]} tariff
 * @returns {E.Item}
 */
export function tradeDelta (caption, ft, base, [, desc]) {
  const dFChange = desc.demand.market.surplus.size - ft.demand.market.surplus.size;
  const sFChange = desc.supply.market.surplus.size - ft.supply.market.surplus.size;
  const dAChange = desc.demand.market.surplus.size - base.demand.market.surplus.size;
  const sAChange = desc.supply.market.surplus.size - base.supply.market.surplus.size;

  return table(['Name', 'Autarky Δ', 'Free Trade Δ'], [
    ['Demand', dFChange.toFixed(2), dAChange.toFixed(2)],
    ['Supply', sFChange.toFixed(2), sAChange.toFixed(2)],
  ], {
    firstColumnHeader: true,
    caption,
  });
}
