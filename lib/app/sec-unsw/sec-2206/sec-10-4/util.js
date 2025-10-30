/**
 * @import { MakeConfigKnobs } from '@app/prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {
  }
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
 * @returns {State}
 */
export function createState() {
  return {};
}
