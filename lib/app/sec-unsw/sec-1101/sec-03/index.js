/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import * as docs from './docs.js';
import * as render from './render.js';

export { getConfig, onUpdate, createState } from './util.js';

export const meta = {
  kind: 'multi',
  sheets: [
    import.meta.resolve('@prelude-uni/styles.css'),
    import.meta.resolve('./styles.css'),
  ],
  layout: {
    gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr'],
    breakpoints: { s: 620, m: 900 },
  },
};

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  docs.createPlaceholder('document horizontal intepretation of curve'),
  docs.header,
  ...render.renderMarginalUtilityPerDollar(),
  docs.kindsOfgoods,
  docs.reservationPrice,
  ...render.renderReservationPrice(),
  docs.relativeValue,
  ...render.renderRelativePrice(),
  docs.curveShifts,
  docs.elascity,
  docs.createPlaceholder('Elasiticity comparison'),
];
