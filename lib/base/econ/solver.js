/**
 * @import { ModelStatus, ModelState, MarketVariant } from './type.ts';
 *
 * @typedef {MarketVariant<{ reservePrice: number, quantity: number }>} PartialResult
 *
 * @typedef {{
 *   sp: number,
 *   dp: number,
 *   importing: boolean,
 *   exporting: boolean,
 *   demandFloor: number,
 *   demandCeiling: number,
 *   supplyFloor: number,
 *   supplyCeiling: number,
 *   wedge: {
 *    demand: number,
 *    supply: number,
 *  },
 * }} Equilibrium
 */
import {
  calcQ,
} from './curve.js';

/**
 * @param {ModelState} model
 * @returns {Equilibrium}
 */
export function autarkyEquilibrium({
  market: { demand, supply },
  policy: {
    transfer,
    anchor: {
      price: {
        floor: priceFloor = -Infinity,
        ceiling: priceCeiling = Infinity,
      },
    },
  },
}) {
  const { demand: { unit: taxDemand } } = transfer.tax;
  const { supply: { unit: taxSupply } } = transfer.tax;
  const { demand: { unit: subDemand } } = transfer.subsidy;
  const { supply: { unit: subSupply } } = transfer.subsidy;

  const { i: dpa, m: dpb } = demand;
  const { i: spa, m: spb } = supply;
  const w = (taxDemand - subDemand) + (taxSupply - subSupply);
  const q = (dpa - (spa + w)) / (spb - dpb)

  return {
    sp: spa + spb*q,
    dp: dpa + dpb*q,
    importing: false,
    exporting: false,
    demandFloor: priceFloor,
    demandCeiling: priceCeiling,
    supplyFloor: priceFloor,
    supplyCeiling: priceCeiling,
    wedge: {
      demand: taxDemand - subDemand,
      supply: taxSupply - subSupply,
    },
  };
}

/**
 * @param {ModelState} model
 * @returns {Equilibrium | undefined}
 */
export function equilibriumWithWedge(model) {
  const {
    world,
    market: { demand, supply },
    policy: {
      transfer: { tariff },
      permit,
      anchor: {
        price: {
          floor: priceFloor = -Infinity,
          ceiling: priceCeiling = Infinity,
        },
      },
    },
  } = model;

  const autarky = autarkyEquilibrium(model);
  if (!permit.importing && !permit.exporting) {
    if (priceFloor > priceCeiling) return undefined;
    if (demand.m === supply.m) return undefined;
    return autarky;
  }

  const iDemandWedge = tariff.import.unit;
  const iSupplyWedge = 0;

  const importing = permit.importing
    && (Math.max(priceFloor, autarky.dp) > (world.price + iDemandWedge));

  const exporting = permit.exporting
    && (Math.min(autarky.sp, priceCeiling) < (world.price - iSupplyWedge));

  let baseDp, baseSp;
  let demandFloor, supplyFloor;
  let demandCeiling, supplyCeiling;

  if (exporting && importing) {
    supplyFloor = demandFloor = world.price;
    supplyCeiling = demandCeiling = world.price;
    baseDp = world.price;
    baseSp = world.price;
  } else if (exporting) {
    demandFloor = Math.max(world.price, priceFloor);
    supplyFloor = Math.max(world.price, priceFloor);
    supplyCeiling = Math.max(world.price, priceCeiling);
    demandCeiling = Math.max(world.price, priceCeiling);
    baseDp = autarky.dp;
    baseSp = Math.max(world.price, autarky.sp);
  } else if (importing) {
    demandFloor = Math.min(world.price, priceFloor);
    supplyFloor = Math.min(world.price, priceFloor);
    demandCeiling = Math.min(world.price, priceCeiling);
    supplyCeiling = Math.min(world.price, priceCeiling)
    baseDp = Math.min(world.price, autarky.dp);
    baseSp = autarky.sp;
  } else {
    demandFloor = supplyFloor = priceFloor;
    demandCeiling = supplyCeiling = priceCeiling;
    baseDp = autarky.dp;
    baseSp = autarky.sp;
  }

  const importTariff = importing ? iDemandWedge : 0;
  const exportTariff = exporting ? iSupplyWedge : 0;
  const demandWedge = autarky.wedge.demand + importTariff;
  const supplyWedge = autarky.wedge.supply + exportTariff - importTariff;
  return {
    sp: baseSp - supplyWedge,
    dp: baseDp + demandWedge,
    importing,
    exporting,
    demandFloor,
    demandCeiling,
    supplyFloor,
    supplyCeiling,
    wedge: {
      demand: demandWedge,
      supply: supplyWedge,
    },
  };
}

/**
 * @param {ModelState} model
 * @returns {(
 *   | undefined
 *   | ModelStatus
 * )}
 */
export function solve(model) {
  const equilbrium = equilibriumWithWedge(model);
  if (equilbrium == null) return undefined;

  const {
    demandFloor,
    demandCeiling,
    supplyFloor,
    supplyCeiling,
    importing,
    exporting,
    wedge,
  } = equilbrium;
  let supplyPrice = equilbrium.sp;
  let demandPrice = equilbrium.dp;
  demandPrice = Math.max(demandPrice, demandFloor + wedge.demand);
  supplyPrice = Math.max(supplyPrice, supplyFloor - wedge.supply);
  demandPrice = Math.min(demandPrice, demandCeiling + wedge.demand);
  supplyPrice = Math.min(supplyPrice, supplyCeiling - wedge.supply);

  const { market: { supply, demand } } = model;
  const demandQ = calcQ(demandPrice, demand);
  const supplyQ = calcQ(supplyPrice, supply);
  const minQ = Math.min(demandQ, supplyQ);
  const dq = importing ? demandQ : minQ;
  const sq = exporting ? supplyQ : minQ;

  return {
    demand: {
      quantity: dq,
      reservePrice: demand.i + demand.m * dq,
      effectivePrice: demandPrice,
    },
    supply: {
      quantity: sq,
      reservePrice: supply.i + supply.m * sq,
      effectivePrice: supplyPrice,
    },
  };
}
