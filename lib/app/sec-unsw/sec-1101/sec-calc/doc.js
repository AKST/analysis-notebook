/**
 * @import { Widget } from '../../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import * as prelude from '../prelude.js';
import { doc } from '../../../prelude.js';

const { container } = prelude.layout;
const { todo } = prelude.components;
export { createStyle } from './style.js';
import * as tables from './tables.js';

/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: () => container(
    doc.h1`Supply and Demand Curve Tool`,
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const stats = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    tables.surplus(state),
    todo({ leadingText: 'TODO(Rendering)' }, 'show dead weight loss'),
  ),
}
