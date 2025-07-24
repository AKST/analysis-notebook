/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { infobox } from '../common/components.js';
import { container, twoColumns, twoThree } from '../common/layout.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';


/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: (_ctx, _state) => container(
    ['h1', 'Government Intervention'],
    ['p', 'Hello world!'],
    mathml.solveForEqulibriumWithWedge(),
  ),
};
