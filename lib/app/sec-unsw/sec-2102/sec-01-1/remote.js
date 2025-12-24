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
  source: {
    kind: 'iframe',
    /**
     * @akst::bundle::html-path:declare
     */
    src: './lib/remote/app-embed/sec-2102-cobb-douglas?rho=0',
  },
  size: { height: 300, gridColumn: { default: 1, s: 2 } },
  normaliseSend: function * ({ config }, origin) {
    const { production: { alpha, technology } } = config;

    yield { kind: 'set', key: 'ctrl-xi', value: 1 };
    yield { kind: 'set', key: 'ctrl-rho', value: 0 };
    yield { kind: 'set', key: 'ctrl-alpha', value: alpha };
    yield { kind: 'set', key: 'ctrl-technology', value: technology };

    if (origin.kind === 'knob' && origin.source === 'production:technology') {
      yield { kind: 'rerun', task: 'grid-compute' };
    }
  },
};

/**
 * @type {Widget<any, State, Config>}
 */
export const ces = {
  meta: { kind: 'remote' },
  title: 'CES Production Function',
  source: {
    kind: 'iframe',
    src: './lib/remote/app-embed/sec-2102-cobb-douglas?rho=-10'
  },
  size: { height: 300, gridColumn: { default: 1, s: 2 } },
  normaliseSend: function * ({ config }, origin) {
    const { production: { alpha, technology } } = config;
    const { ces: { xi, rho } } = config;

    yield { kind: 'set', key: 'ctrl-xi', value: xi };
    yield { kind: 'set', key: 'ctrl-rho', value: rho };
    yield { kind: 'set', key: 'ctrl-alpha', value: alpha };
    yield { kind: 'set', key: 'ctrl-technology', value: technology };

    if (origin.kind === 'knob' && origin.source === 'production:technology') {
      yield { kind: 'rerun', task: 'grid-compute' };
    }
  },
};
