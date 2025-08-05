/**
 * @import { Econ2, Econ, E } from '../../prelude-type.ts';
 *
 * @typedef {Econ.ModelOutput<'snapshot'>} Model
 */

import { table, strings, Unreachable } from '../../prelude.js';

/** @param {number} n */
const ns = n => n.toFixed(2);

/**
 * @param {Model} model
 */
export function totalSurplus(model) {
  return model.consumer.surplus.size
       + model.producer.surplus.size;
}

/**
 * @template {Record<string, { label: string, model: Model }>} Variants
 * @param {{ base: keyof Variants, variants: Variants }} config
 * @returns {E.Item}
 */
export function marketCrossSection({
  base: baseKey,
  variants,
}) {
  /** @type {(keyof Variants)[]} */
  const keysWithoutBase = Object.keys(variants).filter(m => m !== baseKey);

  /** @type {(keyof Variants)[]} */
  const keysAll = [baseKey, ...keysWithoutBase];

  /**
   * @template V
   * @param {(m: Model) => V} mapModel
   * @returns {(k: keyof Variants) => V}
   */
  const createKeyProjection =
    mapModel => key => mapModel(variants[key].model);

  /**
   * @param {string} rowName
   * @param {(m: Model) => number} getCell
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

  // /**
  //  * @returns {E.Item[]}
  //  */
  // const getDwlRow = function () {
  //   const area = model.policy.dwl.reduce((acc, it) => it.size+acc, 0);
  //   return ['Dead weight', '/', ns(area), diffS(area)];
  // }

  return table([
    '',
    ...keysAll.map(k => `${variants[k].label}`),
    ...keysWithoutBase.map(k => `${variants[k].label} ∆`),
  ], [
    createRow('Total Surplus', totalSurplus),
    createRow('Consumer Surplus', m => m.consumer.surplus.size),
    createRow('Producer Surplus', m => m.producer.surplus.size),
    createRow('Consumer Quantity', m => m.consumer.alloc.vec[0]),
    createRow('Producer Quantity', m => m.producer.alloc.vec[0]),
    createRow('Consumer Price', m => m.consumer.alloc.vec[1]),
    createRow('Producer Price', m => m.producer.alloc.vec[1]),
    //getDwlRow(),
  ], {
    firstColumnHeader: true,
    className: 'common-market-surplus-table',
    headerRows: [
      [3, ['Quantity']],
      [5, ['Price']],
    ],
  });
}

/**
 * @param {Econ2.Model.Desc.T} model
 */
export function totalSurplus_2(model) {
  return model.demand.market.surplus.size
       + model.supply.market.surplus.size;
}

/**
 * @template {Record<string, { label: string, model: Econ2.Model.Desc.T }>} Variants
 * @param {{ base: keyof Variants, variants: Variants }} config
 * @returns {E.Item}
 */
export function marketCrossSection_2({
  base: baseKey,
  variants,
}) {
  /** @type {(keyof Variants)[]} */
  const keysWithoutBase = Object.keys(variants).filter(m => m !== baseKey);

  /** @type {(keyof Variants)[]} */
  const keysAll = [baseKey, ...keysWithoutBase];

  /**
   * @template V
   * @param {(m: Econ2.Model.Desc.T) => V} mapModel
   * @returns {(k: keyof Variants) => V}
   */
  const createKeyProjection =
    mapModel => key => mapModel(variants[key].model);

  /**
   * @param {string} rowName
   * @param {(m: Econ2.Model.Desc.T) => number} getCell
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
   * @param {Econ2.Model.Desc.Alloc} alloc
   * @param {(atom: Econ2.Model.Desc.AllocAtom) => number} apply
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

  return table([
    '',
    ...keysAll.map(k => `${variants[k].label}`),
    ...keysWithoutBase.map(k => `${variants[k].label} ∆`),
  ], [
    createRow('Total Surplus', totalSurplus_2),
    createRow('Consumer Surplus', m => m.demand.market.surplus.size),
    createRow('Producer Surplus', m => m.supply.market.surplus.size),
    createRow('Consumer Quantity', m => withAlloc(m.demand.alloc, a => a.quantity)),
    createRow('Producer Quantity', m => withAlloc(m.supply.alloc, a => a.quantity)),
    createRow('Consumer Price', m => withAlloc(m.demand.alloc, a => a.effectivePrice)),
    createRow('Producer Price', m => withAlloc(m.supply.alloc, a => a.effectivePrice)),
    //getDwlRow(),
  ], {
    firstColumnHeader: true,
    className: 'common-market-surplus-table',
    headerRows: [
      [3, ['Quantity']],
      [5, ['Price']],
    ],
  });
}
