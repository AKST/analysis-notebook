/**
 * @import { E } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 * @import { DiscretePartipantState, DiscretePartipant, State } from './type.ts';
 */

import {
  enumerate,
  doc, frag,
} from '@app/prelude.js';
import * as econCurve from '@base/econ/micro/curve.js';
import { container, twoColumns } from '@prelude-uni/layout.js';
import { marketCrossSection_2 as marketCrossSection } from '@prelude-econ/tables.js';

/**
 * @param {State} state
 * @returns {E.Item}
 */
export function tableOfCurves({
  summation: {
    consumers,
    producers,
    aggregate: { consumption, production },
  },
}) {
  /**
   * @param {string} k
   * @param {[string, Econ.Curve.T][]} pairs
   * @returns {E.Item[]}
   */
  const getRows = (k, pairs) => {
    return pairs.map(([name, agent]) => doc.tr(
      doc.td.c(k),
      doc.td.c(name),
      doc.td.c(econCurve.toString(agent)),
    ));
  }

  const headerRow = doc.tr(doc.th`kind`, doc.th`Name`, doc.th`Curve`);
  return frag(
    doc.table(
      doc.thead(headerRow),
      doc.tbody(...getRows('Demand', [
        ['Aggregate', consumption],
        ...Object.entries(consumers),
      ])),
    ),
    doc.table(
      doc.thead(headerRow),
      doc.tbody(...getRows('Supply', [
        ['Aggregate', production],
        ...Object.entries(producers),
      ])),
    ),
  );
}

/**
 * @param {State} state
 * @returns {E.Item}
 */
export function surplus({
  summation: { model, modelEq },
}) {
  if (model == null) return null;
  if (modelEq == null) return null;

  const table = marketCrossSection({
    base: 'actual',
    show: { govt: false, rentier: false },
    variants: {
      actual: {
        label: 'Actual',
        model,
      },
      free: {
        label: 'Equilibrium',
        model: modelEq,
      },
    },
  })
  return container(table);
}

/**
 * @param {State} state
 * @returns {E.Item}
 */
export function surplusDiscrete({
  discrete: {
    producers,
    consumers,
    equilibrium,
  },
}) {
  if (equilibrium == null) return null;

  /**
   * @param {Econ.Curve.Discrete} curve
   * @param {string} k
   * @return {Generator<E.Item>}
   */
  const getRows = function *(curve, k) {
    for (const [i, reservationPrice] of enumerate(curve.rate)) {
      const surplus = (equilibrium.vec[1] - reservationPrice) * curve.dir;
      if (surplus < 0) continue;
      yield doc.tr(
        doc.th`${k} ${i + 1}`,
        doc.td.c(surplus),
        doc.td.c(reservationPrice),
      );
    }
  }

  const headerRow = doc.tr(doc.th` `, doc.th`Surplus`, doc.th`Reserve Price`);
  return twoColumns(
    doc.table(doc.thead(headerRow), doc.tbody(...getRows(consumers, 'Consumer'))),
    doc.table(doc.thead(headerRow), doc.tbody(...getRows(producers, 'Supplier'))),
  );
}
