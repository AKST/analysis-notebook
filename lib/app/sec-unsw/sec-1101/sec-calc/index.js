/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import * as doc from './doc.js';
import * as render from './render.js';

export { getConfig, onUpdate, createState } from './util.js';

export const meta = {
  kind: 'multi',
  sheets: [
    import.meta.resolve('@prelude-uni/styles.css'),
    import.meta.resolve('./styles.css'),
  ],
};

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.header,
  render.surplus,
  doc.stats,
];
