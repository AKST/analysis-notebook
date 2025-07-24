/**
 * @import { Vec2 } from '../../geom_2d/type.ts';
 *
 * @typedef {readonly Vec2[]} Curve
 */
import * as numbers from '../../../util/number.js';
import { v2 } from '../../geom_2d/index.js';

/**
 * @param {number[]} reservationPrices
 * @param {'supply' | 'demand'} kind
 * @return {Curve}
 */
export function curve(reservationPrices, kind) {
  const compare = kind === 'demand' ? numbers.compareInv : numbers.compare;
  return reservationPrices.sort(compare).map((v, i) => v2(i+1, v));
}

/**
 * @param {Curve} supply
 * @param {Curve} demand
 * @return {Vec2 | undefined}
 */
export function equilibrium(supply, demand) {
  const sign = Math.sign(demand[0].vec[1] - supply[0].vec[1]);
  const xIndex = supply.findIndex((v, i) => sign !== Math.sign(demand[i].vec[1] - v.vec[1]))
  if (xIndex === -1) return undefined;

  console.log(demand);
  const y = (demand[xIndex].vec[1] + supply[xIndex].vec[1]) / 2;
  return v2(xIndex, y);
}
