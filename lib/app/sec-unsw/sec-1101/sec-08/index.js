/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import * as doc from './doc.js';

export { getConfig, onUpdate, createState } from './util.js';
export { createStyle } from './style.js';

export const meta = {
  kind: 'multi',
};

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
