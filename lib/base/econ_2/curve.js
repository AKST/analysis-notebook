/**
 * @import { Vec2 } from '../geom_2d/type.ts';
 * @import { Curve } from './type.ts';
 *
 * @typedef {(
 *   | { ok: true, q: number, p: number }
 *   | { ok: false, reason: string }
 * )} EquilibriumResult
 */
import * as numbers from '../../util/number.js';
import { Unreachable } from '../../util/type.js';
import { v2 } from '../geom_2d/index.js';

/**
 * @param {Curve.T} rawCurve
 */
export function toString(rawCurve) {
  const [curve, shift] = seperateCurveFromShift(rawCurve);

  switch (curve.kind) {
    case 'continious': {
      const op = Math.sign(curve.m) > 0 ? '+' : '-';
      const m = Math.abs(curve.m).toFixed(2);
      const i = (shift + curve.i).toFixed(2);
      return `P = ${i} ${op} ${m}Q`;
    }

    case 'discrete':
      return 'P = Q in [discrete series]';

    default:
      throw new Unreachable(curve);
  }
}

/**
 * @param {EquilibriumResult} a
 * @param {number} b
 * @returns {number}
 */
export const okElseQ = (a, b) => a.ok ? a.q : b;

/**
 * @param {EquilibriumResult} a
 * @param {number} b
 * @returns {number}
 */
export const okElseP = (a, b) => a.ok ? a.p : b;

/**
 * @param {-1 | 1} dir
 * @param {readonly number[]} rate
 * @returns {Curve.Discrete}
 */
export const discrete = (dir, rate) => (
  { kind: 'discrete', dir,
    rate: [...rate].sort(dir === 1 ? numbers.compare : numbers.compareInv) }
);

/**
 * @param {Curve.T} demandIn
 * @param {Curve.T} supplyIn
 * @returns {EquilibriumResult}
 */
export function equilibrium(demandIn, supplyIn) {
  const [supply, supplyShift] = seperateCurveFromShift(supplyIn);
  const [demand, demandShift] = seperateCurveFromShift(demandIn);

  switch (supply.kind) {
    case 'continious': {
      const { i: si, m: sb } = supply;
      const sa = si + supplyShift;

      switch (demand.kind) {
        case 'continious': {
          const { i: di, m: db } = demand;
          const da = di + demandShift;
          const q = (da-sa)/(sb-db);
          const p = da+db*q;
          return { ok: true, q, p };
        }

        case 'discrete': {
          let q = 0, sp = 0;
          const d = demand.rate, n = d.length;
          while (true) {
            sp = sa+sb*q;

            if (q >= n) {
              return { ok: false, reason: 'continuious:discrete — out of demand range' };
            } else if (d[q]-sp < 0) {
              break;
            }
            q++;
          }
          q--;
          const p = (sp+d[q])/2;
          return { ok: true, q, p };
        }

        default:
          throw new Unreachable(demand);
      }
    }

    case 'discrete': {
      switch (demand.kind) {
        case 'continious': {
          const { i: di, m: db } = demand;
          const da = di + demandShift;

          let q = 0, dp = 0, sp = 0;
          const s = supply.rate, n = s.length;
          while (true) {
            dp = da+db*q;
            if (q >= n) {
              return { ok: false, reason: 'discrete:continious — out of supply range' };
            }

            sp = supplyShift + s[q];
            if (dp-sp < 0) break;
            q++;
          }
          q--;
          const p = (dp+sp)/2;
          return { ok: true, q, p };
        }

        case 'discrete': {
          const s = supply.rate, d = demand.rate;
          const n = Math.min(s.length, d.length);
          let q = 0;
          let sp = 0, dp = 0;
          while (true) {
            if (q >= n) {
              const minCurve
                = s.length === d.length ? 'either curve'
                : s.length < d.length ? 'supply' : 'demand';
              return { ok: false, reason: `discrete:discrete — out of ${minCurve} range` };
            }
            sp = supplyShift+s[q];
            dp = demandShift+d[q];

            if (sp - dp < 0) break;
            q++;
          }
          q--;
          const p = (sp+dp)/2;
          return { ok: true, q, p };
        }

        default:
          throw new Unreachable(demand);
      }
    }

    default:
      throw new Unreachable(supply);
  }
}

/**
 * @param {Curve.T} rawCurve
 * @param {number} quantity
 * @returns {EquilibriumResult}
 */
export function getPriceAtQuantity(rawCurve, quantity) {
  const [curve, shift] = seperateCurveFromShift(rawCurve);

  /** @param {readonly number[]} rate @returns {EquilibriumResult} */
  const discreteErr = rate =>
    ({ ok: false, reason: `The quantity ${quantity} is out of bounds from ${rate}` })

  switch (curve.kind) {
    case 'continious': {
      const a = curve.i + shift;
      const b = curve.m;
      return { ok: true, p: a + b*quantity, q: quantity };
    }

    case 'discrete':
      if (quantity >= curve.rate.length) return discreteErr(curve.rate);
      return {
        ok: true,
        p: curve.rate[quantity] + shift,
        q: quantity,
      };

    default:
      throw new Unreachable(curve);
  }
}

/**
 * @param {Curve.T} rawCurve
 * @param {number} price
 * @returns {EquilibriumResult}
 */
export function getQuantityAtPrice(rawCurve, price) {
  const [curve, shift] = seperateCurveFromShift(rawCurve);

  /** @param {-1 | 1} dir */
  const dirErrMsg = dir => (dir > 0) ? (
    `price ${price} is below ascending curve (${JSON.stringify(rawCurve)})`
  ) : (
    `price ${price} is above descending curve (${JSON.stringify(rawCurve)})`
  );

  const boundErrMsg = () => (
    `gone out of bounds looking for ${price} (${JSON.stringify(rawCurve)})`
  );

  switch (curve.kind) {
    case 'continious': {
      const a = curve.i + shift;
      const b = curve.m;

      if (curve.dir < 0 && price-a > 0) {
        return { ok: false, reason: dirErrMsg(curve.dir) };
      }
      if (curve.dir > 0 && price-a < 0) {
        return { ok: false, reason: dirErrMsg(curve.dir) };
      }

      return { ok: true, p: price, q: (price-a)/b };
    }

    case 'discrete': {
      const { rate: c, dir } = curve;
      if (dir > 0 && (shift+c[0]) > price) return { ok: false, reason: dirErrMsg(dir) };
      if (dir < 0 && (shift+c[0]) < price) return { ok: false, reason: dirErrMsg(dir) };
      let q = 0;
      while (true) {
        if (q >= c.length) return { ok: false, reason: boundErrMsg() };
        const p = shift + c[q];
        if (dir > 0 && (p-price) > 0) break
        if (dir < 0 && (p-price) < 0) break
        q++;
      }
      q -= 1;
      return { ok: true, q, p: price };
    }

    default:
      throw new Unreachable(curve);
  }
}

/**
 * @param {Curve.T} curve
 * @returns {[Curve.Base, number]}
 */
export function seperateCurveFromShift(curve) {
  switch (curve.kind) {
    case 'discrete':
    case 'continious':
      return [curve, 0];

    case 'shifted':
      return [curve.base, curve.unit];

    default:
      throw new Unreachable(curve);
  }
}

/**
 * @param {Curve.T} curve
 * @param {number} difference
 * @returns {Curve.T}
 */
export function shift(curve, difference) {
  const [base, baseDiff] = seperateCurveFromShift(curve);
  return { kind: 'shifted', base, unit: baseDiff + difference };
}

/**
 * @param {Curve.T} left
 * @param {Curve.T} right
 * @returns {Curve.T}
 */
export function summiseHorizontal(left, right) {
  const [a, aShift] = seperateCurveFromShift(left);
  const [b, bShift] = seperateCurveFromShift(right);
  if (a.dir != b.dir) throw new Error();

  const s = aShift + bShift, dir = a.dir;
  switch (a.kind) {
    case 'continious': switch (b.kind) {
      case 'continious': {
        const si = ((-a.i)/a.m) + ((-b.i)/b.m);
        const sm = (1/a.m) + (1/b.m);
        const i = (-si) / sm;
        const m = 1 / sm;
        return shift({ kind: 'continious', i, m, dir }, s);
      }

      case 'discrete':
        return summiseHorizontal(right, left);

      default:
        throw new Unreachable(b);
    }

    case 'discrete': switch (b.kind) {
      case 'continious':
        throw new Error('not implemented yet');

      case 'discrete': {
        const compare = dir === 1 ? numbers.compare : numbers.compareInv;
        const rate = b.rate.concat(a.rate).sort(compare);
        return shift({ kind: 'discrete', rate, dir }, s);
      }

      default:
        throw new Unreachable(b);
    }

    default:
      throw new Unreachable(a);
  }
}

/**
 * @param {Curve.T} left
 * @param {Curve.T} right
 */
export function summiseVertical(left, right) {
  const [a, aShift] = seperateCurveFromShift(left);
  const [b, bShift] = seperateCurveFromShift(right);
  if (a.dir != b.dir) throw new Error();

  const s = aShift + bShift, dir = a.dir;
  switch (a.kind) {
    case 'continious': switch (b.kind) {
      case 'continious': {
        const i = a.i + b.i;
        const m = a.m + b.m;
        return shift({ kind: 'continious', i, m, dir }, s);
      }

      case 'discrete':
        return summiseVertical(right, left);

      default:
        throw new Unreachable(b);
    }

    case 'discrete': switch (b.kind) {
      case 'continious':
        throw new Error('not implemented yet');

      case 'discrete': {
        const rate = new Array(Math.max(a.rate.length, b.rate.length)).fill(0);
        for (let i = 0; i < rate.length; i++) {
          rate[i] = (a.rate.at(i) ?? 0) + (b.rate.at(i) ?? 0);
        }
        return shift({ kind: 'discrete', rate, dir }, s);
      }

      default:
        throw new Unreachable(b);
    }

    default:
      throw new Unreachable(a);
  }
}

/**
 * @param {readonly Curve.T[]} curves
 */
export function summiseHorizontalAll(curves) {
  return curves.reduce(summiseHorizontal);
}

/**
 * @param {readonly Curve.T[]} curves
 */
export function summiseVerticalAll(curves) {
  return curves.reduce(summiseVertical);
}

/**
 * @param {Curve.T} curve
 * @param {number} length
 * @returns {Vec2[]}
 */
export function getPoints(curve, length) {
  const [base, shift] = seperateCurveFromShift(curve);

  switch (base.kind) {
    case 'continious':
      return [
        v2(0, shift + base.i),
        v2(length, shift + base.i + base.m * length),
      ];

    case 'discrete': {
      const points = [];
      for (let q = 0; q < Math.min(length, base.rate.length); q++) {
        points.push(v2(q, shift + base.rate[q]));
        points.push(v2(q+1, shift + base.rate[q]));
      }
      return points;
    }

    default:
      throw new Unreachable(base);
  }
}
