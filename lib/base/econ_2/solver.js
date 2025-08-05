/**
 * @import { Curve, Model } from './type.ts';
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
import * as curve from './curve.js';

const { okElseQ, okElseP } = curve;

/**
 * @param {Model.Config.T} model
 * @returns {(
 *   | { ok: true, model: Model.Desc.T }
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

  const demandShifted = curve.shift(model.market.demand, demandWedge);
  const supplyShifted = curve.shift(model.market.supply, supplyWedge);
  const eq = curve.equilibrium(demandShifted, supplyShifted);

  if (!eq.ok) return eq;

  const pClampFloor = priceFloor ?? -Infinity;
  const pClampCeil = priceCeiling ?? Infinity;
  if (pClampCeil < pClampFloor) {
    return { ok: false, reason: 'ceiling below floor' };
  }

  const pClamp = Math.max(pClampFloor, Math.min(pClampCeil, eq.p));
  const qClampD = curve.getQuantityAtPrice(demandShifted, pClamp);
  const qClampS = curve.getQuantityAtPrice(supplyShifted, pClamp);
  if (!qClampD.ok) return qClampD;
  if (!qClampS.ok) return qClampS;

  const qClamp = Math.min(qClampD.q, qClampS.q);
  const pImport = wp + transfer.tariff.import.unit;
  const pExport = wp - transfer.tariff.export.unit;
  const qImport = okElseQ(curve.getQuantityAtPrice(demandShifted, pImport), 0);
  const qExport = okElseQ(curve.getQuantityAtPrice(supplyShifted, pExport), 0);

  /** @type {Model.Desc.WorldStatus['export']} */
  const statusOfExports = {
    price: pExport,
    binding: permit.exporting && (qExport - qClamp) > 0,
  }

  /** @type {Model.Desc.PriorityImporterStatus} */
  let licensedQuotaStatus = {
    size: 0,
    cost: 0,
    rent: { size: 0, geom: [] },
  };

  /** @type {Pick<Model.Desc.WorldStatus['import'], 'price' | 'binding'>} */
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
    market = { kind: 'exporting', demand };
  } else if (statusOfImports.binding) {
    const supply = pClampCeil < pImport ? 'ceiling' : 'world';
    market = { kind: 'importing', supply };
  } else {
    market = { kind: 'autarky', bind: undefined };
  }

  /** @type {number} */
  let maxQuantitySold;

  /** @type {Model.Desc.Alloc} */
  let demandState;

  /** @type {Model.Desc.Alloc} */
  let supplyState;

  /** @type {'seperate' | 'supply'} */
  let transferShift;

  const { demand, supply } = model.market;

  switch (market.kind) {
    case 'autarky': {
      const dw = market.bind == null ? sSub + dSub : demandWedge;
      const sw = market.bind == null ? sTax + dTax : supplyWedge;

      const dp = curve.getPriceAtQuantity(curve.shift(demand, dw), qClamp);
      const sp = curve.getPriceAtQuantity(curve.shift(supply, sw), qClamp);
      if (!dp.ok) return dp;
      if (!sp.ok) return sp;

      const effectivePrice
        = market.bind === 'floor' ? Math.max(dp.p, sp.p)
        : market.bind === 'ceiling' ? Math.min(dp.p, sp.p)
        : dp.p;

      const base = { quantity: qClamp, effectivePrice };
      demandState = { kind: 'mono-alloc', value: { ...base, reservationPrice: dp.p } };
      supplyState = { kind: 'mono-alloc', value: { ...base, reservationPrice: sp.p } };
      transferShift = market.bind === undefined ? 'supply' : 'seperate';
      maxQuantitySold = qClamp;
      break
    }

    case 'exporting': {
      const effectivePrice = market.demand === 'world' ? pExport : pClampFloor;
      const dq = curve.getQuantityAtPrice(curve.shift(demand, demandWedge), effectivePrice);
      const spl = curve.getPriceAtQuantity(curve.shift(supply, supplyWedge), qClampS.q);
      const sq = curve.getQuantityAtPrice(curve.shift(supply, supplyWedge), pExport);
      if (!dq.ok) return dq;
      if (!spl.ok) return spl;
      if (!sq.ok) return sq;

      transferShift = 'seperate';

      demandState = {
        kind: 'mono-alloc',
        value: {
          quantity: dq.q,
          effectivePrice,
          reservationPrice: dq.p,
        },
      };

      const supplyWorld = {
        quantity: sq.q,
        effectivePrice: pExport,
        reservationPrice: pExport
      };

      if (market.demand === 'floor') {
        supplyState = {
          kind: 'dual-alloc',
          local: {
            quantity: qClamp,
            effectivePrice,
            reservationPrice: spl.p,
          },
          world: supplyWorld,
        };
      } else {
        supplyState = { kind: 'mono-alloc', value: supplyWorld };
      }

      maxQuantitySold = supplyWorld.quantity;
      break;
    }

    case 'importing': {
      const effectivePrice = market.supply === 'world' ? pImport : pClampCeil;
      const sq = curve.getQuantityAtPrice(curve.shift(supply, supplyWedge), effectivePrice);
      const dpl = curve.getPriceAtQuantity(curve.shift(demand, demandWedge), qClampD.q);
      const dq = curve.getQuantityAtPrice(curve.shift(demand, demandWedge), pImport);
      if (!sq.ok) return sq;
      if (!dpl.ok) return dpl;
      if (!dq.ok) return dq;

      transferShift = 'seperate';

      supplyState = {
        kind: 'mono-alloc',
        value: {
          quantity: sq.q,
          effectivePrice,
          reservationPrice: sq.p,
        },
      };

      const demandWorld = {
        quantity: dq.q,
        effectivePrice: pImport,
        reservationPrice: pImport,
      };

      if (market.supply === 'ceiling') {
        demandState = {
          kind: 'dual-alloc',
          local: {
            quantity: qClamp,
            effectivePrice,
            reservationPrice: dpl.p,
          },
          world: demandWorld,
        };
      } else {
        demandState = { kind: 'mono-alloc', value: demandWorld };
      }

      maxQuantitySold = demandWorld.quantity;
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
  const p0 = okElseP(curve.getPriceAtQuantity(curve.shift(demand, maxDShift), 0), 0);
  const q0 = Math.max(
    maxQuantitySold * 1.5,
    okElseP(curve.getQuantityAtPrice(curve.shift(supply, minSShift), p0), 0),
    okElseP(curve.getQuantityAtPrice(curve.shift(demand, maxDShift), p0), 0),
  );

  return {
    ok: true,
    model: {
      bounds: v2(q0 * 1.01, p0 * 1.05),
      demand: {
        alloc: demandState,
        equal: demandExternality === demandShift,
        market: marginalValue(demandState, curve.shift(demand, demandShift), q0),
        social: marginalValue(demandState, curve.shift(demand, demandExternality), q0),
      },
      supply: {
        alloc: supplyState,
        equal: supplyShift === supplyExternality,
        market: marginalValue(supplyState, curve.shift(supply, supplyShift), q0),
        social: marginalValue(supplyState, curve.shift(supply, supplyExternality), q0),
      },
      world: {
        price: wp,
        export: statusOfExports,
        import: {
          ...statusOfImports,
          quota: {
            licensed: licensedQuotaStatus,
          },
        },
      },
    },
  };
}

/**
 * Takes the curve, and the allocated quantity and
 * prices, and provides the necessary geometry for
 * `Model.Desc.MarginalValue`.
 *
 * @param {Model.Desc.Alloc} alloc
 * @param {Curve.T} rawCurve
 * @param {number} qMax
 * @returns {Model.Desc.MarginalValue}
 */
export function marginalValue(alloc, rawCurve, qMax) {
  const points = curve.getPoints(rawCurve, qMax);

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

  const surplusGeom = clip({ x: { ceil: xCeil } }, surplusInit.concat(points));

  return {
    curve: rawCurve,
    line: clip({ y: { floor: 0 } }, points),
    surplus: {
      geom: surplusGeom,
      size: shoelaceArea(surplusGeom),
    },
  };
}
