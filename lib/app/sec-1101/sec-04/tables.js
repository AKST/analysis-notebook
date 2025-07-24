/**
 * @import { E } from '../../prelude-type.ts';
 * @import { DiscretePartipantState, DiscretePartipant, Agent, State } from './type.ts';
 */

import { enumerate, table, frag } from '../../prelude.js';
import * as layout from '../common/layout.js';
import { marketCrossSection } from '../common/tables.js';

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
   * @returns {(agent: Agent) => E.Item[]}
   */
  const getRow = k => function (agent) {
    const a = agent.i.toFixed(2);
    const b = Math.abs(agent.m).toFixed(2);
    const s = Math.sign(agent.m) < 0 ? '-' : '+';
    return [k, agent.name, `P = ${a} ${s} ${b}Q`];
  }

  const columns = ['kind', 'Name', 'Curve'];
  return frag([
    table(columns, [consumption, ...consumers].map(getRow('Demand'))),
    table(columns, [production, ...producers].map(getRow('Supply'))),
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
