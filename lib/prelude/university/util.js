/**
 * @import { DocumentWidget, Widget } from '@base/runtime/type.ts';
 */

/**
 * @template State
 * @template Config
 * @param {DocumentWidget<any, State, Config>['render']} render
 * @returns {Widget<any, State, Config>}
 */
export const createDoc = (render) => ({
  meta: { kind: 'document' },
  render: (...args) => render(...args),
});
