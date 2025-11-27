/**
 * @import { Vec2, MakeConfigKnobs } from '@app/prelude-type.ts';
 * @import { AgentState, Config, State, Event } from './type.ts';
 */

import { vector, convexHull, COLOR, math, objects } from '@app/prelude.js';

const ORIGIN = vector(2)(0, 0);

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  /** @type {[number, number]} */
  const range = [0.01, 50];

  return {
    time: {
      kind: 'number',
      label: 'Time Constraint',
      of: 8,
      range: [1, 24],
    },
    priceX: { kind: 'number', of: 2, range: [0.01, 30] },
    priceY: { kind: 'number', of: 3, range: [0.01, 30] },
    agents: {
      kind: 'many',
      of: {
        a: { point: [.5, 1.5], color: COLOR.CYAN },
        b: { point: [2, 2], color: COLOR.YELLOW },
        c: { point: [1.5, .5], color: COLOR.LIME },
      },
      create: {
        kind: 'group',
        label: 'Agent {id}',
        of: { point: [1, 1], color: 0xcccccc },
        group: {
          point: { kind: 'complex', label: null, range: [range, range] },
          color: { kind: 'color', label: null },
        },
      },
    },
    scale: { kind: 'number', of: 1/6, range: [0.01, 1] },
  }
}

/**
 * @param {number} time
 * @param {{ point: [number, number], color: number }} agent
 * @returns {AgentState}
 */
const constrain = (time, { point: [x, y], color }) => ({
  color,
  point: vector(2)(time/x, time/y)
});

/**
 * @param {Vec2[]} ppcPoints
 * @param {Vec2} price
 */
function findOptimalProductionPoint(ppcPoints, price) {
  return ppcPoints.reduce((best, current) => {
    const currentRevenue = math.vector.dot(current, price);
    const bestRevenue = math.vector.dot(best, price);
    return currentRevenue > bestRevenue ? current : best;
  });
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  switch (event.kind) {
    case 'config': {
      const { config } = event;
      const { time, priceX, priceY } = config;
      const price = vector(2)(priceX, priceY);
      const agents = objects.map(config.agents, o => constrain(time, o));
      const econPPF = convexHull(Object.values(agents).map(p => p.point), ORIGIN)
      const optimal = findOptimalProductionPoint(econPPF, price);

      return {
        ...state,
        price,
        agents,
        econPPF,
        optimalProduction: optimal,
      };
    }
    default:
      return state;
  }
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function createState(config) {
  return onUpdate({
    price: vector(2)(0, 0),
    agents: {},
    econPPF: [],
    optimalProduction: ORIGIN,
  }, { kind: 'config', config });
}
