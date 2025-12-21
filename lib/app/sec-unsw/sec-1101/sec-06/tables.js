/**
 * @import { E } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 * @import { State } from './type.ts';
 */
import { doc, frag } from '@app/prelude.js';

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

  return doc.table(
    doc.caption({ className: 'footerCap' }).c(caption),
    doc.thead(doc.tr(doc.th`Name`, doc.th`Autarky Δ`, doc.th`Free Trade Δ`)),
    doc.tbody(
      doc.tr(doc.th`Demand`, doc.td.c(dFChange.toFixed(2)), doc.td.c(dAChange.toFixed(2))),
      doc.tr(doc.th`Supply`, doc.td.c(sFChange.toFixed(2)), doc.td.c(sAChange.toFixed(2))),
    ),
  );
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
    doc.th`Autarky`,
    doc.th({ colSpan: 2 }).t`Quota`,
    doc.th({ colSpan: 2 }).t`Tariff`,
    doc.th({ colSpan: 2 }).t`Free Trade`,
  ];

  /** @type {E.Item[]} */
  const cells = [
    doc.th`∑`,
    doc.th`∑`,
    doc.th`Δ`,
    doc.th`∑`,
    doc.th`Δ`,
    doc.th`∑`,
    doc.th`Δ`,
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
      doc.td.c(ns(bv)),
      doc.td.c(ns(qv)),
      doc.td.c(ns(qv - bv)),
      doc.td.c(ns(tv)),
      doc.td.c(ns(tv - bv)),
      doc.td.c(ns(fv)),
      doc.td.c(ns(fv - bv)),
    ];
  };

  /** @type {E.Item} */
  const quantityT = doc.table(
    doc.thead(
      doc.tr(
        doc.th.void({ rowSpan: 3 }),
        doc.th({ colSpan: 7 }).t`Quantity`,
      ),
      doc.tr(...variantHeaders),
      doc.tr(...cells),
    ),
    doc.tbody(
      doc.tr(
        doc.th`Demand`,
        ...getCells(m => getAlloc(m.demand).quantity),
      ),
      doc.tr(
        doc.th`Supply`,
        ...getCells(m => getAlloc(m.supply).quantity),
      ),
    ),
  );

  /** @type {E.Item} */
  const priceT = doc.table(
    doc.thead(
      doc.tr(
        doc.th.void({ rowSpan: 3 }),
        doc.th({ colSpan: 7 }).t`Price`,
      ),
      doc.tr(...variantHeaders),
      doc.tr(...cells),
    ),
    doc.tbody(
      doc.tr(
        doc.th`Demand`,
        ...getCells(m => getAlloc(m.demand).effectivePrice),
      ),
      doc.tr(
        doc.th`Supply`,
        ...getCells(m => getAlloc(m.supply).effectivePrice),
      ),
    ),
  );

  /** @type {E.Item} */
  const surplusT = doc.table(
    doc.thead(
      doc.tr(
        doc.th.void({ rowSpan: 3 }),
        doc.th({ colSpan: 7 }).t`Surplus`,
      ),
      doc.tr(...variantHeaders),
      doc.tr(...cells),
    ),
    doc.tbody(
      doc.tr(
        doc.th`Demand`,
        ...getCells(m => m.demand.market.surplus.size),
      ),
      doc.tr(
        doc.th`Supply`,
        ...getCells(m => m.supply.market.surplus.size),
      ),
      doc.tr(
        doc.th`Govt`,
        ...getCells(m => m.govt.import.revenue.size),
      ),
      doc.tr(
        doc.th`Importer`,
        ...getCells(m => m.rentier.importQuota.rent.size),
      ),
      doc.tr(
        doc.th`TOTAL`,
        ...getCells(m => (
          m.demand.market.surplus.size +
          m.supply.market.surplus.size +
          m.govt.import.revenue.size +
          m.rentier.importQuota.rent.size
        )),
      ),
    ),
  );

  return frag(quantityT, priceT, surplusT);
}

