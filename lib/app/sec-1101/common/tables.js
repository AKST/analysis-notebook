/**
 * @import { Econ, E } from '../../prelude-type.ts';
 */

import { table, Unreachable } from '../../prelude.js';

/** @param {number} n */
const ns = n => n.toFixed(2);

/**
 * @param {Econ.Model.Desc.T} model
 * @returns {number}
 */
export function govtSurplus(model) {
  return model.govt.demand.revenue.size
       + model.govt.supply.revenue.size
       + model.govt.import.revenue.size
       + model.govt.export.revenue.size
}

/**
 * @param {Econ.Model.Desc.T} model
 * @returns {number}
 */
export function rentierSurplus(model) {
  return model.rentier.importQuota.rent.size;
}

/**
 * @param {Econ.Model.Desc.T} model
 */
export function totalSurplus(model) {
  return model.demand.market.surplus.size
       + model.supply.market.surplus.size
       + govtSurplus(model)
       + rentierSurplus(model);
}

/**
 * @template {Record<string, { label: string, model: Econ.Model.Desc.T }>} Variants
 * @param {{
 *    base: keyof Variants,
 *    show: { govt: boolean, rentier: boolean },
 *    variants: Variants,
 * }} config
 * @returns {E.Item}
 */
export function marketCrossSection_2({
  base: baseKey,
  show,
  variants,
}) {
  /** @type {(keyof Variants)[]} */
  const keysWithoutBase = Object.keys(variants).filter(m => m !== baseKey);

  /** @type {(keyof Variants)[]} */
  const keysAll = [baseKey, ...keysWithoutBase];

  /**
   * @template V
   * @param {(m: Econ.Model.Desc.T) => V} mapModel
   * @returns {(k: keyof Variants) => V}
   */
  const createKeyProjection =
    mapModel => key => mapModel(variants[key].model);

  /**
   * @param {string} rowName
   * @param {(m: Econ.Model.Desc.T) => number} getCell
   * @returns {E.Item[]}
   */
  const createRow = (rowName, getCell) => {
    const apply = createKeyProjection(getCell);
    const baseOut = apply(baseKey);
    return [
      rowName,
      ns(baseOut),
      ...keysWithoutBase.map(apply).map(ns),
      ...keysWithoutBase.map(k => {
        const variantOut = apply(k);
        const diff = baseOut - variantOut;
        const sign = Math.sign(diff) < 0 ? '-' : '+';
        return `${sign}${ns(Math.abs(diff))}`;
      }),
    ];
  };

  /**
   * @param {Econ.Model.Desc.Alloc} alloc
   * @param {(atom: Econ.Model.Desc.AllocAtom) => number} apply
   * @returns {number}
   */
  const withAlloc = (alloc, apply) => {
    switch (alloc.kind) {
      case 'mono-alloc':
        return apply(alloc.value);

      case 'dual-alloc':
        return apply(alloc.world);

      default:
        throw new Unreachable(alloc);
    }
  };


  // /**
  //  * @returns {E.Item[]}
  //  */
  // const getDwlRow = function () {
  //   const area = model.policy.dwl.reduce((acc, it) => it.size+acc, 0);
  //   return ['Dead weight', '/', ns(area), diffS(area)];
  // }

  const headerOffset = 0
    + (show.govt ? 1 : 0)
    + (show.rentier ? 1 : 0);

  /** @type {E.Item[][]} */
  const otherSurplus = [];
  if (show.govt ?? true) {
    otherSurplus.push(createRow('Govt Net Transfer', govtSurplus));
  }
  if (show.rentier ?? true) {
    otherSurplus.push(createRow('Rentier', rentierSurplus));
  }

  return table([
    '',
    ...keysAll.map(k => `${variants[k].label}`),
    ...keysWithoutBase.map(k => `${variants[k].label} ∆`),
  ], [
    createRow('Total Surplus', totalSurplus),
    createRow('Consumer Surplus', m => m.demand.market.surplus.size),
    createRow('Producer Surplus', m => m.supply.market.surplus.size),
    ...otherSurplus,
    createRow('Consumer Quantity', m => withAlloc(m.demand.alloc, a => a.quantity)),
    createRow('Producer Quantity', m => withAlloc(m.supply.alloc, a => a.quantity)),
    createRow('Consumer Price', m => withAlloc(m.demand.alloc, a => a.effectivePrice)),
    createRow('Producer Price', m => withAlloc(m.supply.alloc, a => a.effectivePrice)),
    //getDwlRow(),
  ], {
    firstColumnHeader: true,
    className: 'common-market-surplus-table',
    headerRows: [
      [headerOffset + 3, ['Quantity']],
      [headerOffset + 5, ['Price']],
    ],
  });
}
