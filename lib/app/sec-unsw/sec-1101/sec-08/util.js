/**
 * @import { Config, State, Event } from './type.ts';
 */

/**
 * @returns {any}
 */
export function getConfig() {
  return {};
}

/**
 * @param {State} state
 * @param {Event} _event
 * @returns {State}
 */
export function onUpdate(state, _event) {
  return state;
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function createState(config) {
  return onUpdate({}, { kind: 'config', config });
}
