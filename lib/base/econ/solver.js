/**
 * @import { Curve, Model } from './type.ts';
 * @import { Vec2 } from '../geom_2d/type.ts';
 *
 * @typedef {(
 *  | { kind: 'trap' }
 *  | { kind: 'rect', x: number, dir: -1 | 1 }
 * )} RectOrTrapezoid
 *
 * @typedef {(
 *   | { ok: true, q: number, p: number }
 *   | { ok: false, reason: string }
 * )} EquilibriumResult
 */
import { v2, clip } from '../geom_2d/index.js';
import { Unreachable } from '../../util/type.js';
import * as surplus from './surplus.js';
import * as curve from './curve.js';

const { okElseQ, okElseP } = curve;

/**
 * @param {number} quantity
 * @param {number} effectivePrice
 * @param {number} reservationPrice
 * @returns {Model.Desc.Alloc}
 */
const monoAlloc = (quantity, effectivePrice, reservationPrice) =>
  ({ kind: 'mono-alloc', value: { quantity, effectivePrice, reservationPrice } });

/**
 * @param {number} quantity
 * @param {number} effectivePrice
 * @param {number} reservationPrice
 * @returns {Model.Desc.AllocAtom}
 */
const allocAtom = (quantity, effectivePrice, reservationPrice) =>
  ({ quantity, effectivePrice, reservationPrice })

/**
 * @param {{ ok: false, reason: string }} err
 * @param {string} extraMessage
 * @returns {{ ok: false, reason: string }}
 */
const extendReason = (err, extraMessage) =>
  ({ ok: false, reason: extraMessage  + " :: " + err.reason });

/**
 * @param {Model.Desc.Alloc} alloc
 * @returns {number}
 */
const maxAllocUnits = alloc => alloc.kind === 'mono-alloc'
  ? alloc.value.quantity
  : alloc.world.quantity;

/** @type {Model.Geom.Space} */
const EMPTY_SPACE = { geom: [], size: 0 };


/**
 * @param {RectOrTrapezoid} mode
 * @param {Vec2} p1
 * @param {Vec2} p2
 * @param {number} width
 * @returns {Model.Geom.Space}
 */
function maybeParallelogram(mode, p1, p2, width) {
  return mode.kind === 'trap' ? surplus.parallelogram({
    shear: 'horizontal',
    y1: p1,
    y2: p2,
    units: width,
  }) : surplus.rect(
    mode.x, p1.vec[1],
    width,
    (p1.vec[0] - p2.vec[0]) * mode.dir,
  )
}

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
      (
        !permit.importing &&
        (quotaImportUnits > 0) &&
        (importUnits - clampUnits) > 0 &&
        importQuotaPrice.p <= importPrice
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

  /** @type {Model.Geom.Space} */
  let govtImport = EMPTY_SPACE;

  /** @type {Model.Geom.Space} */
  let govtExport = EMPTY_SPACE;

  /** @type {Model.Geom.Space} */
  let importerRent = EMPTY_SPACE;

  const { demand, supply } = model.market;

  switch (market.kind) {
    case 'autarky': {
      transferShift = market.bind === undefined
          ? 'supply'
          : 'seperate';

      const dw = market.bind == null
          ? 0
          : demandWedge;

      const sw = market.bind == null
          ? (sTax + dTax) - (sSub + dSub)
          : supplyWedge;

      const dp = curve.getPriceAtQuantity(curve.shift(demand, dw), clampUnits);
      const sp = curve.getPriceAtQuantity(curve.shift(supply, sw), clampUnits);
      if (!dp.ok) return dp;
      if (!sp.ok) return sp;

      const effectivePrice
        = market.bind === 'floor' ? Math.max(dp.p, sp.p)
        : market.bind === 'ceiling' ? Math.min(dp.p, sp.p)
        : dp.p;

      demandState = monoAlloc(clampUnits, effectivePrice, dp.p);
      supplyState = monoAlloc(clampUnits, effectivePrice, sp.p);
      transferShift = market.bind === undefined ? 'supply' : 'seperate';
      maxQuantitySold = clampUnits;
      break
    }

    case 'exporting': {
      const effectivePrice = market.demand === 'world' ? exportPrice : clampPriceFloor;
      const dq = curve.getQuantityAtPrice(curve.shift(demand, demandWedge), effectivePrice);
      const spl = curve.getPriceAtQuantity(curve.shift(supply, supplyWedge), clampUnitsS.q);
      const sq = curve.getQuantityAtPrice(curve.shift(supply, supplyWedge), exportPrice);
      const wq = curve.getQuantityAtPrice(curve.shift(demand, demandWedge), world.price);
      if (!sq.ok) return extendReason(sq, `supply/${market.kind}`);
      if (!dq.ok) return extendReason(dq, `demand/${market.kind}`);
      if (!wq.ok) return extendReason(wq, `world/${market.kind}`);
      if (!spl.ok) return extendReason(spl, `supply-local/${market.kind}`);

      const supplyWorld = allocAtom(sq.q, exportPrice, exportPrice);
      const supplyLocal = allocAtom(clampUnits, effectivePrice, spl.p);
      demandState = monoAlloc(dq.q, effectivePrice, dq.p);
      supplyState = market.demand === 'floor'
        ? ({ kind: 'dual-alloc', local: supplyLocal, world: supplyWorld })
        : ({ kind: 'mono-alloc', value: supplyWorld });

      govtExport = maybeParallelogram(
        demandWedge === 0
          ? ({ kind: 'trap' })
          : ({ kind: 'rect', x: dq.q, dir: -1 }),
        v2(dq.q, dq.p),
        v2(wq.q, wq.p),
        sq.q- dq.q,
      );

      transferShift = 'seperate';
      maxQuantitySold = supplyWorld.quantity;
      break;
    }

    case 'importing:world': {
      const effectivePrice = market.supply === 'world' ? importPrice : clampPriceCeil;
      const sq = curve.getQuantityAtPrice(curve.shift(supply, supplyWedge), effectivePrice);
      const dpl = curve.getPriceAtQuantity(curve.shift(demand, demandWedge), clampUnitsD.q);
      const dq = curve.getQuantityAtPrice(curve.shift(demand, demandWedge), importPrice);
      const wq = curve.getQuantityAtPrice(curve.shift(supply, supplyWedge), world.price);
      if (!sq.ok) return extendReason(sq, `supply/${market.kind}`);
      if (!dq.ok) return extendReason(dq, `demand/${market.kind}`);
      if (!dpl.ok) return extendReason(dpl, `demand-local/${market.kind}`);
      if (!wq.ok) return extendReason(wq, `world/${market.kind}`);

      const demandWorld = allocAtom(dq.q, importPrice, importPrice);
      const demandLocal = allocAtom(clampUnits, effectivePrice, dpl.p);

      /** @type {number} */ let bottomLeft;
      if (market.supply === 'ceiling') {
        demandState = ({ kind: 'dual-alloc', local: demandLocal, world: demandWorld });
        bottomLeft = sq.q;
      } else {
        demandState = ({ kind: 'mono-alloc', value: demandWorld });
        bottomLeft = supplyWedge === 0 ? wq.q : sq.q;
      }

      govtImport = surplus.parallelogram({
        shear: 'horizontal',
        y1: v2(sq.q, dq.p),
        y2: v2(bottomLeft, wq.p),
        units: dq.q - sq.q,
      });

      transferShift = 'seperate';
      supplyState = monoAlloc(sq.q, effectivePrice, sq.p);
      maxQuantitySold = demandWorld.quantity;
      break;
    }

    case 'importing:quota': {
      const effectivePrice = clampImportQuotaPrice;
      const dq = curve.getQuantityAtPrice(curve.shift(demand, demandWedge), effectivePrice);
      const sq = curve.getQuantityAtPrice(curve.shift(supply, supplyWedge), effectivePrice);
      const rq = curve.getQuantityAtPrice(curve.shift(supply, supplyWedge), importPrice);
      const wq = curve.getQuantityAtPrice(curve.shift(supply, supplyWedge), world.price);
      if (!dq.ok) return extendReason(dq, `demand/${market.kind}`);
      if (!sq.ok) return extendReason(sq, `supply/${market.kind}`);
      if (!rq.ok) return extendReason(rq, `rent/${market.kind}`);
      if (!wq.ok) return extendReason(wq, `world/${market.kind}`);

      /** @type {RectOrTrapezoid} */
      const mode = supplyWedge === 0
        ? ({ kind: 'trap' })
        : ({ kind: 'rect', x: sq.q, dir: 1 });

      importerRent = maybeParallelogram(
        mode,
        v2(sq.q, sq.p),
        v2(rq.q, rq.p),
        statusOfImportRentier.units,
      );

      govtImport = maybeParallelogram(
        mode,
        v2(rq.q, rq.p),
        v2(wq.q, wq.p),
        statusOfImportRentier.units,
      );

      demandState = monoAlloc(dq.q, effectivePrice, dq.p);
      supplyState = monoAlloc(sq.q, effectivePrice, sq.p);
      transferShift = 'seperate';
      maxQuantitySold = dq.q;
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
      demandShift = 0;
      supplyShift = (sTax + dTax) - (sSub + dSub);
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

  /*
   * This code is pretty cooked, and a tad arbitrary, but
   * the goal is here is to mostly figure out a point at
   * which we can place an upper horizontal limit on lines.
   *
   * We also use that to create "bounds" which is largely
   * used to scale the plots and points to the screen.
   */
  const maxDShift = Math.max(demandShift, demandExternality);
  const minSShift = Math.min(supplyShift, supplyExternality);
  const p0 = okElseP(curve.getPriceAtQuantity(curve.shift(demand, maxDShift), 0), 0);
  const q0 = Math.max(
    maxQuantitySold * 2.1,
    okElseP(curve.getQuantityAtPrice(curve.shift(supply, minSShift), p0), 0),
    okElseP(curve.getQuantityAtPrice(curve.shift(demand, maxDShift), p0), 0),
  );

  const marketDemand = curve.shift(demand, demandShift);
  const socialDemand = curve.shift(demand, demandExternality);
  const marketSupply = curve.shift(supply, supplyShift);
  const socialSupply = curve.shift(supply, supplyExternality);
  const govtDemand = taxRevenue(demandState, marketDemand, demandShift);
  const govtSupply = taxRevenue(supplyState, marketSupply, supplyShift);

  if (!govtDemand.ok) return govtDemand;
  if (!govtSupply.ok) return govtSupply;

  return {
    ok: true,
    model: {
      bounds: v2(q0 * 1.01, p0 * 1.05),
      demand: {
        alloc: demandState,
        equal: demandExternality === demandShift,
        market: marginalValue(demandState, marketDemand, q0),
        social: marginalValue(demandState, socialDemand, q0),
      },
      supply: {
        alloc: supplyState,
        equal: supplyShift === supplyExternality,
        market: marginalValue(supplyState, marketSupply, q0),
        social: marginalValue(supplyState, socialSupply, q0),
      },
      world: {
        price: world.price,
        export: statusOfExports,
        import: statusOfImports,
      },
      rentier: {
        importQuota: {
          rent: importerRent,
          binding: statusOfImportRentier.binding,
          price: statusOfImportRentier.price,
          units: statusOfImportRentier.units,
        },
      },
      govt: {
        demand: { revenue: govtDemand.space },
        supply: { revenue: govtSupply.space },
        import: { revenue: govtImport },
        export: { revenue: govtExport },
      },
    },
  };
}

/**
 * @param {Model.Desc.Alloc} alloc
 * @param {Curve.T} rawCurve
 * @param {number} shift
 * @returns {(
 *   | { ok: true, space: Model.Geom.Space }
 *   | { ok: false, reason: string }
 * )}
 */
export function taxRevenue(alloc, rawCurve, shift) {

  /**
   * @param {Model.Desc.AllocAtom} atom
   * @returns {(
   *   | { ok: true, pa: number, pb: number }
   *   | { ok: false, reason: string }
   * )}
   */
  const prices = atom => {
    const pa = curve.getPriceAtQuantity(rawCurve, 0);
    if (!pa.ok) return pa;

    const pb = curve.getPriceAtQuantity(rawCurve, atom.quantity);
    if (!pb.ok) return pb;

    return { ok: true, pa: pa.p, pb: pb.p };
  }

  switch (alloc.kind) {
    case 'mono-alloc': {
      const ps = prices(alloc.value);
      if (!ps.ok) return ps;

      return {
        ok: true,
        space: surplus.parallelogram({
          shear: 'vertical',
          x1: v2(0, ps.pa),
          x2: v2(alloc.value.quantity, ps.pb),
          price: -shift,
        }),
      };
    }
    case 'dual-alloc': {
      const ps = prices(alloc.local);
      if (!ps.ok) return ps;

      return {
        ok: true,
        space: surplus.parallelogram({
          shear: 'vertical',
          x1: v2(0, ps.pa),
          x2: v2(alloc.local.quantity, ps.pb),
          price: -shift,
        }),
      };
    }
    default:
      throw new Unreachable(alloc);
  }
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
  return {
    curve: rawCurve,
    line: clip({ y: { floor: 0 } }, points),
    surplus: surplus.shape(alloc, points),
  };
}
