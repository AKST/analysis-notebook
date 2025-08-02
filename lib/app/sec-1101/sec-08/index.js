/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
import * as doc from './doc.js';
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
  doc.header,
  doc.entryGame,
  doc.createPlaceholder('Violation of invisible hand principle'),
  doc.prisonerDelimma,
  doc.cartels,
  doc.mixedStrategy,
];
