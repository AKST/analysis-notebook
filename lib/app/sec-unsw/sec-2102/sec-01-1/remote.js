/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */


/**
 * @type {Widget<any, State, Config>}
 */
export const cobbDouglas = {
  meta: { kind: 'remote' },
  title: 'Cobb Douglas Production Function',
  //source: { kind: 'iframe', src: '../20250831-wgl/src/example/fun-002-cobb-douglas/index.html?showDebug&configSource=message' },
  source: { kind: 'iframe', src: './lib/remote/app-embed/sec-2102-cobb-douglas/index.html' },
  size: { height: 600, gridColumn: { default: 2, s: 2 } },
  normaliseSend: function * ({ config }) {
    const { productivity: { alpha, technology } } = config;

    yield { kind: 'set', key: 'ctrl-alpha', value: alpha };
    yield { kind: 'set', key: 'ctrl-technology', value: technology };
  },
};
