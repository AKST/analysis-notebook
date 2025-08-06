/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import { container } from '../common/layout.js';
import { todo } from '../common/components.js';
export { createStyle } from './style.js';
import * as tables from './tables.js';

/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: () => container(
    ['h1', 'Supply and Demand Curve Tool'],
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const stats = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(
    tables.surplus(state),
    todo({ leadingText: 'TODO(Rendering)' }, 'show govt cost, dead weight loss & Government revenue'),
  ),
}
