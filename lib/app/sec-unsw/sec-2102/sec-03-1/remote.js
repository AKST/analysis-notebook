/**
 * @import { Widget } from '../../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */


/**
 * @type {Widget<any, State, Config>}
 */
export const unemployment = {
  meta: { kind: 'remote' },
  title: 'Unemployement between countries',
  source: {
    kind: 'iframe',
    attrs: { scrolling: 'no' },
    src: 'https://data.worldbank.org/share/widget?end=2024&indicators=SL.UEM.TOTL.ZS&locations=US-JP-XC&start=1991',
  },
  size: { height: 550, gridColumn: { default: 2, s: 2 } },
  normaliseSend: function * () {},
};
