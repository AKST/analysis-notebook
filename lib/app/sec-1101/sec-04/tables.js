/**
 * @import { Econ2 as Econ, E } from '../../prelude-type.ts';
 * @import { DiscretePartipantState, DiscretePartipant, State } from './type.ts';
 */

import {
  econCurve_2 as econCurve,
  enumerate,
  table, frag,
} from '../../prelude.js';
import * as layout from '../common/layout.js';
import { marketCrossSection_2 as marketCrossSection } from '../common/tables.js';

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
  return layout.container(table);
}

/**
 * @param {State} state
 * @returns {E.Item}
 */
export function surplusDiscrete({
  discrete: { producers, consumers },
}) {
  /**
   * @param {DiscretePartipantState} state
   * @param {string} k
   * @return {E.Item[][]}
   */
  const getRows = (state, k) => {
    const items = [];
    for (const [i, { surplus, reservationPrice }] of enumerate(state.agents)) {
      if (surplus === 0) continue;
      items.push([`${k} ${i + 1}`, surplus, reservationPrice]);
    }
    return items;
  }

  const columns = [' ', 'Surplus', 'Reserve Price'];
  return layout.twoColumns(
    table(columns, getRows(consumers, 'Consumer'), { firstColumnHeader: true }),
    table(columns, getRows(producers, 'Supplier'), { firstColumnHeader: true }),
  );
}
