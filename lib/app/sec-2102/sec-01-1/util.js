/**
 * @import { Vec2 } from '../../prelude-type.ts';
 * @import { Chart2D, Config, State, Event } from './type.ts';
 */
import { v2 } from '../../prelude.js';

/**
 * @returns {State}
 */
export function createState() {
  return {
    charts: {

    },
  };
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  switch (event.kind) {
    case 'config':
      return state;

    default:
      return state;
  }
}

/**
 * @param {number} min
 * @param {number} max
 * @param {number} step
 * @param {(v: number) => Vec2} f
 * @returns {Chart2D}
 */
export function createChart(min, max, step, f) {
  return {
    bounds: v2(1, 1),
    points: [v2(0, 0), v2(1, 1)]
  };
}
