// https://www.desmos.com/3d/fi6mtryu3u
/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

/**
 * @type {Widget<any, State, Config>}
 */
export const homoskedasticNormalDistributions = {
  meta: { kind: 'remote' },
  title: 'Homoskedastic Normal Distribution',
  source: { kind: 'iframe', src: 'https://www.desmos.com/3d/fi6mtryu3u?embed' },
  size: { height: 500, gridColumn: { default: 2, s: 2 } },
  normaliseSend: function * () {},
};
