/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
import { container } from '../common/layout.js';
export { createStyle } from './style.js';

export const meta = {
  kind: 'multi',
};

/**
 * @returns {any}
 */
export function getConfig() {
  return { placeholder: { kind: 'number', of: 5, range: [0, 10] } };
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

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  {
    meta: { kind: 'document' },
    render: (_ctx, _state) => container(
      ['h1', 'International Trade'],
      ['p', 'Hello world!'],
    ),
  }
];
