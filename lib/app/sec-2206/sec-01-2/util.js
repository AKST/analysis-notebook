/**
 * @import { State, Event } from './type.ts';
 */

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
 * @returns {State}
 */
export function createState() {
  return {
    crimeMean: undefined,
  };
}
