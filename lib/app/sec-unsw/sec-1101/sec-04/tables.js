/**
 * @import { Econ, E } from '@app/prelude-type.ts';
 * @import { DiscretePartipantState, DiscretePartipant, State } from './type.ts';
 */

import {
  econCurve,
  enumerate,
  table, frag,
} from '@app/prelude.js';
import { container, twoColumns } from '@prelude-uni/layout.js';
import { marketCrossSection_2 as marketCrossSection } from '@prelude-uni/tables.js';

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
   * @returns {E.Item[][]}
   */
  const getRows = (k, pairs) => {
    return pairs.map(([name, agent]) => [k, name, econCurve.toString(agent)]);
  }

  const columns = ['kind', 'Name', 'Curve'];
  return frag([
    table(columns, getRows('Demand', [
      ['Aggregate', consumption],
      ...Object.entries(consumers),
    ])),
    table(columns, getRows('Supply', [
      ['Aggregate', production],
      ...Object.entries(producers),
    ])),
  ]);
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
   * @return {E.Item[][]}
   */
  const getRows = (curve, k) => {
    const items = [];
    for (const [i, reservationPrice] of enumerate(curve.rate)) {
      const surplus = (equilibrium.vec[1] - reservationPrice) * curve.dir;
      if (surplus < 0) continue;
      items.push([`${k} ${i + 1}`, surplus, reservationPrice]);
    }
    return items;
  }

  const columns = [' ', 'Surplus', 'Reserve Price'];
  return twoColumns(
    table(columns, getRows(consumers, 'Consumer'), { firstColumnHeader: true }),
    table(columns, getRows(producers, 'Supplier'), { firstColumnHeader: true }),
  );
}
