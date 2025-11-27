/**
 * @import { E } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 * @import { State } from './type.ts';
 */
import { table, frag } from '@app/prelude.js';

/** @param {number} n @returns {string} */
const ns = n => n.toFixed(2);

/**
 * @param {E.Item} caption
 * @param {Econ.Model.Desc.T} base
 * @param {Econ.Model.Desc.T} ft
 * @param {[Econ.Model.Config.T,  Econ.Model.Desc.T]} tariff
 * @returns {E.Item}
 */
export function tradeDelta (caption, ft, base, [, desc]) {
  const dFChange = desc.demand.market.surplus.size - ft.demand.market.surplus.size;
  const sFChange = desc.supply.market.surplus.size - ft.supply.market.surplus.size;
  const dAChange = desc.demand.market.surplus.size - base.demand.market.surplus.size;
  const sAChange = desc.supply.market.surplus.size - base.supply.market.surplus.size;

  return table(['Name', 'Autarky Δ', 'Free Trade Δ'], [
    ['Demand', dFChange.toFixed(2), dAChange.toFixed(2)],
    ['Supply', sFChange.toFixed(2), sAChange.toFixed(2)],
  ], {
    firstColumnHeader: true,
    caption,
  });
}

/**
 * @param {State} state
 * @returns {E.Item}
 */
export function everything(state) {
  const { quota: qa, tariff: ta, base, freeTrade: ft } = state.models;
  if (qa == null || ta == null || base == null || ft == null) return undefined;
  const [,quota] = qa;
  const [,tariff] = ta;

  /**
   * @param {Econ.Model.Desc.CurveDescription} curve
   * @returns {Econ.Model.Desc.AllocAtom}
   */
  const getAlloc = curve => {
    if (curve.alloc.kind !== 'mono-alloc') throw new Error();
    return curve.alloc.value;
  };

  /** @type {E.Item[]} */
  const variantHeaders = [
    ['th', 'Autarky'],
    ['th', { colSpan: 2 }, 'Quota'],
    ['th', { colSpan: 2 }, 'Tariff'],
    ['th', { colSpan: 2 }, 'Free Trade'],
  ];

  /** @type {E.Item[]} */
  const cells = [
    ['th', '∑'],
    ['th', '∑'],
    ['th', 'Δ'],
    ['th', '∑'],
    ['th', 'Δ'],
    ['th', '∑'],
    ['th', 'Δ'],
  ];

  /**
   * @param {(model: Econ.Model.Desc.T) => number} withModel
   * @returns {E.Item[]}
   */
  const getCells = (withModel) => {
    const bv = withModel(base);
    const qv = withModel(quota);
    const tv = withModel(tariff);
    const fv = withModel(ft);
    return [
      ['td', [ns(bv)]],
      ['td', [ns(qv)]],
      ['td', [ns(qv - bv)]],
      ['td', [ns(tv)]],
      ['td', [ns(tv - bv)]],
      ['td', [ns(fv)]],
      ['td', [ns(fv - bv)]],
    ];
  };

  /** @type {E.Item} */
  const quantityT = ['table', {}, [
    ['thead', [
      ['tr', [
        ['th', { rowSpan: 3 }],
        ['th', { colSpan: 7 }, 'Quantity'],
      ]],
      ['tr', variantHeaders],
      ['tr', cells],
    ]],
    ['tbody', [
      ['tr', [
        ['th', 'Demand'],
        ...getCells(m => getAlloc(m.demand).quantity),
      ]],
      ['tr', [
        ['th', 'Supply'],
        ...getCells(m => getAlloc(m.supply).quantity),
      ]],
    ]],
  ]];

  /** @type {E.Item} */
  const priceT = ['table', {}, [
    ['thead', [
      ['tr', [
        ['th', { rowSpan: 3 }],
        ['th', { colSpan: 7 }, 'Price'],
      ]],
      ['tr', variantHeaders],
      ['tr', cells],
    ]],
    ['tbody', [
      ['tr', [
        ['th', 'Demand'],
        ...getCells(m => getAlloc(m.demand).effectivePrice),
      ]],
      ['tr', [
        ['th', 'Supply'],
        ...getCells(m => getAlloc(m.supply).effectivePrice),
      ]],
    ]],
  ]];

  /** @type {E.Item} */
  const surplusT = ['table', {}, [
    ['thead', [
      ['tr', [
        ['th', { rowSpan: 3 }],
        ['th', { colSpan: 7 }, 'Surplus'],
      ]],
      ['tr', variantHeaders],
      ['tr', cells],
    ]],
    ['tbody', [
      ['tr', [
        ['th', 'Demand'],
        ...getCells(m => m.demand.market.surplus.size),
      ]],
      ['tr', [
        ['th', 'Supply'],
        ...getCells(m => m.supply.market.surplus.size),
      ]],
      ['tr', [
        ['th', 'Govt'],
        ...getCells(m => m.govt.import.revenue.size),
      ]],
      ['tr', [
        ['th', 'Importer'],
        ...getCells(m => m.rentier.importQuota.rent.size),
      ]],
      ['tr', [
        ['th', 'TOTAL'],
        ...getCells(m => (
          m.demand.market.surplus.size +
          m.supply.market.surplus.size +
          m.govt.import.revenue.size +
          m.rentier.importQuota.rent.size
        )),
      ]],
    ]],
  ]];

  return frag([quantityT, priceT, surplusT]);
}

