/**
 * @import { MakeConfigKnobs, E } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
export { createStyle } from './style.js';

export const meta = { kind: 'document' };

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  console.log(event);
  return state;
}

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {};
}

/** @returns {State} */
export function createState() {
  return {
  };
}

/**
 * @param {unknown} _context
 * @param {State} _state
 * @param {Config} _config
 */
export function render(_context, _state, _config) {
  return ['div', { className: 'container' }, [
    ['h1', 'test'],
  ]]
}
