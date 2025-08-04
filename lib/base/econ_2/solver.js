/**
 * @import * as t from './type.ts';
 *
 * @typedef {(
 *   | { kind: 'autarky', bind: undefined | 'ceiling' | 'floor' }
 *   | { kind: 'exporting', demand: 'floor' | 'world' }
 *   | { kind: 'importing', supply: 'ceiling' | 'world' }
 * )} ModelVariant
 *
 * @typedef {(
 *   | { ok: true, q: number, p: number }
 *   | { ok: false, reason: string }
 * )} EquilibriumResult
 */
import { v2, clip, shoelaceArea } from '../geom_2d/index.js';
import { Unreachable } from '../../util/type.js';

/**
 * @param {{ reason: string }} a
 * @param {{ reason: string }} b
 * @returns {{ ok: false, reason: string }}
 */
const combine = (a, b) => ({ ok: false, reason: `${a.reason} / ${b.reason}` });

/**
 * @param {EquilibriumResult} a
 * @param {number} b
 * @returns {number}
 */
const okElseQ = (a, b) => a.ok ? a.q : b;

/**
 * @param {EquilibriumResult} a
 * @param {number} b
 * @returns {number}
 */
const okElseP = (a, b) => a.ok ? a.p : b;

/**
 * @param {t.ModelState['market']} market
 * @returns {EquilibriumResult}
 */
export function equilibrium(market) {
  const [supply, supplyShift] = seperateCurveFromShift(market.supply);
  const [demand, demandShift] = seperateCurveFromShift(market.demand);

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
            } else if (d[q]-sp === 0) {
              break;
            } else if (d[q]-sp < 0) {
              q--;
              break;
            } else {
              q++;
            }
          }
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
            if (dp-sp === 0) {
              break;
            } else if (dp-sp < 0) {
              q--;
              break;
            } else {
              q++;
            }
          }
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

            if (sp - dp === 0) {
              break;
            } else if (sp - dp < 0) {
              q--;
              break;
            } else {
              q++;
            }
          }
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
 * @param {t.Curve.T} rawCurve
 * @param {number} quantity
 * @returns {EquilibriumResult}
 */
export function getPriceAtQuantity(rawCurve, quantity) {
  const [curve, shift] = seperateCurveFromShift(rawCurve);

  switch (curve.kind) {
    case 'continious': {
      const a = curve.i + shift;
      const b = curve.m;
      return { ok: true, p: a + b*quantity, q: quantity };
    }

    case 'discrete':
      if (quantity >= curve.rate.length) {
        return { ok: false, reason: `The quantity ${quantity} is out of bounds from ${curve.rate}` };
      }
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
 * @param {t.Curve.T} rawCurve
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
      if (dir > 0 && c[0] < price) return { ok: false, reason: dirErrMsg(dir) };
      if (dir < 0 && c[0] > price) return { ok: false, reason: dirErrMsg(dir) };
      let q = 0;
      while (true) {
        if (q >= c.length) return { ok: false, reason: boundErrMsg() };
        const p = shift + c[q];
        if (dir > 0 && (p-price) > 0) break
        if (dir < 0 && (p-price) < 0) break
        q++;
      }
      return { ok: true, q, p: price };
    }

    default:
      throw new Unreachable(curve);
  }
}

/**
 * @param {t.Curve.T} curve
 * @returns {[t.Curve.Base, number]}
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
 * @param {t.Curve.T} curve
 * @param {number} difference
 * @returns {t.Curve.T}
 */
export function shiftCurve(curve, difference) {
  const [base, baseDiff] = seperateCurveFromShift(curve);
  return { kind: 'shifted', base, unit: baseDiff + difference };
}

/**
 * @param {t.ModelState} model
 * @returns {(
 *   | { ok: true, model: t.ModelOut.T }
 *   | { ok: false, reason: string }
 * )}
 */
export function status(model) {
  const { world: { price: wp }, policy: { transfer, permit } } = model;
  const priceFloor = model.policy.anchor.price.floor;
  const priceCeiling = model.policy.anchor.price.ceiling;
  const { supply: { unit: sTax }, demand: { unit: dTax } } = transfer.tax;
  const { supply: { unit: sSub }, demand: { unit: dSub } } = transfer.subsidy;
  const supplyWedge = sTax - sSub;
  const demandWedge = dSub - dTax;

  const demandShifted = shiftCurve(model.market.demand, demandWedge);
  const supplyShifted = shiftCurve(model.market.supply, supplyWedge);
  const eq = equilibrium({ demand: demandShifted, supply: supplyShifted });

  if (!eq.ok) return eq;

  const pClampFloor = priceFloor ?? -Infinity;
  const pClampCeil = priceCeiling ?? Infinity;
  if (pClampCeil < pClampFloor) {
    return { ok: false, reason: 'ceiling below floor' };
  }

  const pClamp = Math.max(pClampFloor, Math.min(pClampCeil, eq.p));
  const qClampD = getQuantityAtPrice(demandShifted, pClamp);
  const qClampS = getQuantityAtPrice(supplyShifted, pClamp);
  if (!qClampD.ok) return qClampD;
  if (!qClampS.ok) return qClampS;

  const qClamp = Math.min(qClampD.q, qClampS.q);
  const pImport = wp + transfer.tariff.import.unit;
  const pExport = wp - transfer.tariff.export.unit;
  const qImport = okElseQ(getQuantityAtPrice(demandShifted, pImport), 0);
  const qExport = okElseQ(getQuantityAtPrice(supplyShifted, pExport), 0);

  /** @type {t.ModelOut.WorldStatus['export']} */
  const statusOfExports = {
    price: pExport,
    binding: permit.exporting && (qExport - qClamp) > 0,
  }

  /** @type {t.ModelOut.WorldStatus['import']} */
  const statusOfImports = {
    price: pImport,
    binding: permit.importing && (qImport - qClamp) > 0,
  }

  /** @type {ModelVariant} */
  let market;
  if (!statusOfExports.binding && !statusOfImports.binding) {
    /** @type {'floor' | 'ceiling' | undefined} */
    const bind =
        (pClampFloor === pClamp) ? 'floor' :
        (pClampCeil === pClamp) ? 'ceiling' : undefined;

    market = { kind: 'autarky', bind };
  } else if (statusOfExports.binding) {
    const demand = pClampFloor > pExport ? 'floor' : 'world';
    console.log(pClampFloor, pExport);
    market = { kind: 'exporting', demand };
  } else if (statusOfImports.binding) {
    const supply = pClampCeil > pImport ? 'ceiling' : 'world';
    market = { kind: 'importing', supply };
  } else {
    market = { kind: 'autarky', bind: undefined };
  }

  /** @type {t.ModelOut.Alloc} */
  let demandState;

  /** @type {t.ModelOut.Alloc} */
  let supplyState;

  /** @type {'seperate' | 'supply'} */
  let transferShift;

  const { demand, supply } = model.market;

  console.log(market);
  switch (market.kind) {
    case 'autarky': {
      // TODO(check if this makes sense)
      const dw = market.bind == null ? sSub + dSub : demandWedge;
      const sw = market.bind == null ? sTax + dTax : supplyWedge;

      const dp = getPriceAtQuantity(shiftCurve(demand, dw), qClamp);
      const sp = getPriceAtQuantity(shiftCurve(supply, sw), qClamp);
      if (!dp.ok) return dp;
      if (!sp.ok) return sp;

      const effectivePrice
        = market.bind === 'floor' ? Math.max(dp.p, sp.p)
        : market.bind === 'ceiling' ? Math.min(dp.p, sp.p)
        : dp.p;

      console.log(effectivePrice, qClamp);
      const base = { quantity: qClamp, effectivePrice };
      demandState = { kind: 'mono-alloc', value: { ...base, reservationPrice: dp.p } };
      supplyState = { kind: 'mono-alloc', value: { ...base, reservationPrice: sp.p } };
      transferShift = market.bind === undefined ? 'supply' : 'seperate';
      break
    }

    case 'exporting': {
      const effectivePrice = market.demand === 'world' ? pExport : pClampFloor;
      const dp = getPriceAtQuantity(shiftCurve(demand, demandWedge), qClampD.q);
      const spl = getPriceAtQuantity(shiftCurve(supply, supplyWedge), qClampS.q);
      const sq = getQuantityAtPrice(shiftCurve(supply, supplyWedge), pExport);
      if (!dp.ok) return dp;
      if (!spl.ok) return spl;
      if (!sq.ok) return sq;

      transferShift = 'seperate';

      demandState = {
        kind: 'mono-alloc',
        value: {
          quantity: qClampD.q,
          effectivePrice,
          reservationPrice: dp.p,
        },
      };

      const supplyLocal = {
        quantity: qClamp,
        effectivePrice,
        reservationPrice: spl.p,
      };

      if (market.demand === 'floor') {
        supplyState = {
          kind: 'dual-alloc',
          local: supplyLocal,
          world: {
            quantity: sq.q,
            effectivePrice: pExport,
            reservationPrice: pExport
          },
        };
      } else {
        supplyState = { kind: 'mono-alloc', value: supplyLocal };
      }
      break;
    }

    case 'importing': {
      const effectivePrice = market.supply === 'world' ? pImport : pClampCeil;
      const sp = getPriceAtQuantity(shiftCurve(supply, supplyWedge), qClampS.q);
      const dpl = getPriceAtQuantity(shiftCurve(demand, demandWedge), qClampD.q);
      const dq = getQuantityAtPrice(shiftCurve(demand, demandWedge), pImport);
      if (!sp.ok) return sp;
      if (!dpl.ok) return dpl;
      if (!dq.ok) return dq;

      transferShift = 'seperate';

      supplyState = {
        kind: 'mono-alloc',
        value: {
          quantity: qClampS.q,
          effectivePrice,
          reservationPrice: sp.p,
        },
      };

      const demandLocal = {
        quantity: qClamp,
        effectivePrice,
        reservationPrice: dpl.p,
      };

      if (market.supply === 'ceiling') {
        demandState = {
          kind: 'dual-alloc',
          local: demandLocal,
          world: {
            quantity: dq.q,
            effectivePrice: pImport,
            reservationPrice: pImport,
          },
        };
      } else {
        demandState = { kind: 'mono-alloc', value: demandLocal };
      }
      break;
    }

    default:
      throw new Unreachable(market);
  }

  let demandShift, supplyShift;
  let demandExternality;
  let supplyExternality;
  switch (transferShift) {
    case 'supply': {
      const externSum = (model.extern.demand ?? 0) + (model.extern.supply ?? 0);
      demandShift = (sSub + dSub);
      supplyShift = (sTax + dTax);
      demandExternality = Math.max(0, externSum);
      supplyExternality = Math.min(0, externSum) * -1;
      break;
    }

    case 'seperate':
      demandShift = dSub - dTax;
      supplyShift = sTax - sSub;
      demandExternality = model.extern.demand ?? 0;
      supplyExternality = (model.extern.supply ?? 0) * -1;
      break;

    default:
      throw new Unreachable(transferShift);
  }

  const maxDShift = Math.max(demandShift, demandExternality);
  const minSShift = Math.min(supplyShift, supplyExternality);
  const p0 = okElseP(getPriceAtQuantity(shiftCurve(demand, maxDShift), 0), 0);
  const q0 = Math.max(
    okElseP(getQuantityAtPrice(shiftCurve(supply, minSShift), p0), 0),
    okElseP(getQuantityAtPrice(shiftCurve(demand, maxDShift), p0), 0),
  );

  console.log(demandState, supplyState);

  return {
    ok: true,
    model: {
      demand: {
        alloc: demandState,
        equal: demandExternality === demandShift,
        market: marginalValue(supplyState, shiftCurve(demand, demandShift), q0),
        social: marginalValue(demandState, shiftCurve(demand, demandExternality), q0),
      },
      supply: {
        alloc: supplyState,
        equal: supplyShift === supplyExternality,
        market: marginalValue(supplyState, shiftCurve(supply, supplyShift), q0),
        social: marginalValue(supplyState, shiftCurve(supply, supplyExternality), q0),
      },
      world: {
        price: wp,
        export: statusOfExports,
        import: statusOfImports,
      },
    },
  };
}

/**
 * @param {t.ModelOut.Alloc} alloc
 * @param {t.Curve.T} rawCurve
 * @param {number} qMax
 * @returns {t.ModelOut.MarginalValue}
 */
export function marginalValue(alloc, rawCurve, qMax) {
  const points = [];
  const [curve, shift] = seperateCurveFromShift(rawCurve);

  switch (curve.kind) {
    case 'continious':
      points.push(v2(0, shift + curve.i));
      points.push(v2(qMax, shift + curve.i + curve.m * qMax));
      break;

    case 'discrete':
      for (let q = 0; q < Math.min(qMax, curve.rate.length); q++) {
        points.push(v2(q, curve.rate[q]));
      }
      break;

    default:
      throw new Unreachable(curve);
  }

  let xCeil;
  const surplusInit = [];
  switch (alloc.kind) {
    case 'mono-alloc':
      surplusInit.push(v2(alloc.value.quantity, alloc.value.effectivePrice));
      surplusInit.push(v2(0, alloc.value.effectivePrice));
      xCeil = alloc.value.quantity;
      break;

    case 'dual-alloc':
      surplusInit.push(v2(alloc.world.quantity, alloc.world.effectivePrice));
      surplusInit.push(v2(alloc.local.quantity, alloc.world.effectivePrice));
      surplusInit.push(v2(alloc.local.quantity, alloc.local.effectivePrice));
      surplusInit.push(v2(0, alloc.local.effectivePrice));
      xCeil = alloc.world.quantity;
      break;

    default:
      throw new Unreachable(alloc);
  }

  const geom = clip(
    { x: { ceil: xCeil } },
    surplusInit.concat(points),
  );

  return {
    curve,
    line: points,
    surplus: { geom, size: shoelaceArea(geom) },
  };
}
