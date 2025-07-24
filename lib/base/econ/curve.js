/**
 * @import { VectorOf } from '../math/type.ts';
 * @import { CurveParams } from './type.ts';
 */
import { vector} from '../math/value.js';

/**
 * @param {readonly Pick<CurveParams, 'i' | 'm'>[]} params
 * @returns {Pick<CurveParams, 'i' | 'm'>}
 */
export const summation = (params) => {
  const sumIntercepts = params.reduce((sum, a) => sum + (-a.i)/a.m, 0);
  const sumSlopes = params.reduce((sum, a) => sum + 1/a.m, 0);
  return {
    i: -sumIntercepts / sumSlopes,
    m: 1 / sumSlopes
  };
};

/**
 * Given a function of P = a + bQ it will solve for
 * a function for Q = a + bP, and by function I mean
 * this CurveParam object which encodes coefficents
 * for a linear made up of an intercept and a multipler.
 *
 * @template {Pick<CurveParams, 'm' | 'i'>} T
 * @param {T} curve
 * @returns {Omit<T, 'm' | 'i'> & Pick<CurveParams, 'm' | 'i'>}
 */
export const solveForParam = (curve) => {
  const { m, i, ...other } = curve;
  return { ...other, i: (-i)/m, m: 1/m };
}

/**
 * @param {number} q
 * @param {Pick<CurveParams, 'm' | 'i'>} curve
 * @returns {number}
 */
export function calcP(q, curve) {
  return curve.i + q*curve.m;
}

/**
 * @param {number} p
 * @param {Pick<CurveParams, 'm' | 'i'>} curve
 * @returns {number}
 */
export function calcQ(p, curve) {
  return (p-curve.i)/curve.m;
}

/**
 * @param {Pick<CurveParams, 'm' | 'i'>} curve
 * @param {...number} prices
 * @returns {number}
 */
export function priceWithMaxQ(curve, ...prices) {
  let p = prices[0], q = calcQ(prices[0], curve);
  for (const otherP of prices.slice(1)) {
    const otherQ = calcQ(otherP, curve);
    if (otherQ > q) {
      p = otherP;
      q = otherQ;
    }
  }
  return p;
}

/**
 * @param {Pick<CurveParams, 'm' | 'i'>} demand
 * @param {Pick<CurveParams, 'm' | 'i'>} supply
 * @returns {number}
 */
export function equilibriumQuantity(demand, supply) {
  return (demand.i - supply.i) / (supply.m - demand.m)
}

/**
 * @param {Pick<CurveParams, 'm' | 'i'>} demand
 * @param {Pick<CurveParams, 'm' | 'i'>} supply
 * @returns {VectorOf<'r', 2>}
 */
export function equilibrium(demand, supply) {
  const q = equilibriumQuantity(demand, supply);
  return vector(2)(q, calcP(q, demand));
}

