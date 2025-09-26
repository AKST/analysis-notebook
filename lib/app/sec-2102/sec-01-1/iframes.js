/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */


/**
 * @type {Widget<any, State, Config>}
 */
export const cobbDouglas = {
  meta: { kind: 'iframe' },
  title: 'Cobb Douglas Production Function',
  path: '../20250831-wgl/src/example/fun-002-cobb-douglas/index.html?showDebug&configSource=message',
  size: { height: 600, gridColumn: { default: 2, s: 2 } },
  normaliseSend: function * ({ config }) {
    const { productivity: { alpha, technology } } = config;

    yield { kind: 'set', key: 'ctrl-alpha', value: alpha };
    yield { kind: 'set', key: 'ctrl-technology', value: technology };
  },
};
