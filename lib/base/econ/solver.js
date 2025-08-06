/**
 * @import { Curve, Model } from './type.ts';
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
  const { world, policy: { transfer, permit, quota } } = model;
  const priceFloor = model.policy.anchor.price.floor;
  const priceCeiling = model.policy.anchor.price.ceiling;
  const { supply: { unit: sTax }, demand: { unit: dTax } } = transfer.tax;
  const { supply: { unit: sSub }, demand: { unit: dSub } } = transfer.subsidy;
  const { import: { licensed: { unit: quotaImportUnits } } } = quota;
  const supplyWedge = sTax - sSub;
  const demandWedge = dSub - dTax;

  const demandShifted = curve.shift(model.market.demand, demandWedge);
  const supplyShifted = curve.shift(model.market.supply, supplyWedge);
  const eq = curve.equilibrium(demandShifted, supplyShifted);

  if (!eq.ok) return eq;

  const clampPriceFloor = priceFloor ?? -Infinity;
  const clampPriceCeil = priceCeiling ?? Infinity;
  if (clampPriceCeil < clampPriceFloor) {
    return { ok: false, reason: 'ceiling below floor' };
  }

  const clampPrice = Math.max(clampPriceFloor, Math.min(clampPriceCeil, eq.p));
  const clampUnitsD = curve.getQuantityAtPrice(demandShifted, clampPrice);
  const clampUnitsS = curve.getQuantityAtPrice(supplyShifted, clampPrice);
  if (!clampUnitsD.ok) return clampUnitsD;
  if (!clampUnitsS.ok) return clampUnitsS;

  const clampUnits = Math.min(clampUnitsD.q, clampUnitsS.q);
  const importPrice = world.price + transfer.tariff.import.unit;
  const exportPrice = world.price - transfer.tariff.export.unit;
  const importUnits = okElseQ(curve.getQuantityAtPrice(demandShifted, importPrice), 0);
  const exportUnits = okElseQ(curve.getQuantityAtPrice(supplyShifted, exportPrice), 0);

  const importQuotaPrice = curve.quotaPrice(demandShifted, supplyShifted, quotaImportUnits);
  if (!importQuotaPrice.ok) return importQuotaPrice;

  const clampImportQuotaPrice = Math.min(importQuotaPrice.p, clampPriceCeil);

  /** @type {Model.Desc.WorldStatus['export']} */
  const statusOfExports = {
    price: exportPrice,
    binding: permit.exporting && (exportUnits - clampUnits) > 0,
  }

  /** @type {Model.Desc.WorldStatus['import']} */
  const statusOfImports = {
    price: importPrice,
    binding: (
      permit.importing && (importUnits - clampUnits) > 0 ||

      // for when the quota is insane
      !permit.importing && (
        (importUnits - clampUnits) > 0 &&
        clampImportQuotaPrice <= importPrice
      )
    ),
  }

  /** @type {Omit<Model.Desc.RentierStatus['importQuota'], 'rent'>} */
  const statusOfImportRentier = {
    price: clampImportQuotaPrice,
    units: quotaImportUnits,
    binding: (
      !permit.importing &&
      quotaImportUnits > 0 &&
      clampImportQuotaPrice > importPrice
    ),
  };

  /** @type {Model.Classification} */
  let market;
  if (statusOfImportRentier.binding) {
    const { price } = statusOfImportRentier;
    const supply = clampPriceCeil < price ? 'ceiling' : 'quota';
    market = { kind: 'importing:quota', supply };
  } else if (!statusOfExports.binding && !statusOfImports.binding) {
    /** @type {'floor' | 'ceiling' | undefined} */
    const bind =
        (clampPriceFloor === clampPrice) ? 'floor' :
        (clampPriceCeil === clampPrice) ? 'ceiling' : undefined;

    market = { kind: 'autarky', bind };
  } else if (statusOfExports.binding) {
    const demand = clampPriceFloor > exportPrice ? 'floor' : 'world';
    market = { kind: 'exporting', demand };
  } else if (statusOfImports.binding) {
    const supply = clampPriceCeil < importPrice ? 'ceiling' : 'world';
    market = { kind: 'importing:world', supply };
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

      const dp = curve.getPriceAtQuantity(curve.shift(demand, dw), clampUnits);
      const sp = curve.getPriceAtQuantity(curve.shift(supply, sw), clampUnits);
      if (!dp.ok) return dp;
      if (!sp.ok) return sp;

      const effectivePrice
        = market.bind === 'floor' ? Math.max(dp.p, sp.p)
        : market.bind === 'ceiling' ? Math.min(dp.p, sp.p)
        : dp.p;

      const base = { quantity: clampUnits, effectivePrice };
      demandState = { kind: 'mono-alloc', value: { ...base, reservationPrice: dp.p } };
      supplyState = { kind: 'mono-alloc', value: { ...base, reservationPrice: sp.p } };
      transferShift = market.bind === undefined ? 'supply' : 'seperate';
      maxQuantitySold = clampUnits;
      break
    }

    case 'exporting': {
      const effectivePrice = market.demand === 'world' ? exportPrice : clampPriceFloor;
      const dq = curve.getQuantityAtPrice(curve.shift(demand, demandWedge), effectivePrice);
      const spl = curve.getPriceAtQuantity(curve.shift(supply, supplyWedge), clampUnitsS.q);
      const sq = curve.getQuantityAtPrice(curve.shift(supply, supplyWedge), exportPrice);
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
        effectivePrice: exportPrice,
        reservationPrice: exportPrice
      };

      if (market.demand === 'floor') {
        supplyState = {
          kind: 'dual-alloc',
          local: {
            quantity: clampUnits,
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

    case 'importing:world': {
      const effectivePrice = market.supply === 'world' ? importPrice : clampPriceCeil;
      const sq = curve.getQuantityAtPrice(curve.shift(supply, supplyWedge), effectivePrice);
      const dpl = curve.getPriceAtQuantity(curve.shift(demand, demandWedge), clampUnitsD.q);
      const dq = curve.getQuantityAtPrice(curve.shift(demand, demandWedge), importPrice);
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
        effectivePrice: importPrice,
        reservationPrice: importPrice,
      };

      if (market.supply === 'ceiling') {
        demandState = {
          kind: 'dual-alloc',
          local: {
            quantity: clampUnits,
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

    case 'importing:quota': {
      console.log(statusOfImportRentier, clampPrice, clampImportQuotaPrice, importPrice);
      throw new Error('not implemented');
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
    maxQuantitySold * 2.1,
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
        price: world.price,
        export: statusOfExports,
        import: statusOfImports,
      },
      rentier: {
        importQuota: {
          ...statusOfImportRentier,
          rent: { size: 0, geom: [] },
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
