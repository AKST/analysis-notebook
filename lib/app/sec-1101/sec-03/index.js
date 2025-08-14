/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { GoodUtility, Knobs, Config, State, Event } from './type.ts';
 */
import { Unreachable, numbers } from '../../prelude.js';
import * as docs from './docs.js';
import * as render from './render.js';
export { createStyle } from './style.js';

export const meta = {
  kind: 'multi',
  layout: {
    gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr'],
    breakpoints: { s: 620, m: 900 },
  },
};

/**
 * @returns {Knobs}
 */
export function getConfig() {
  const muffins = [0, 40, 76, 104, 128, 144, 156, 164];
  const dounts = [0, 10, 20, 30, 40, 50, 60, 70];

  return {
    utility: {
      kind: 'group',
      label: 'Marginal Utility',
      group: {
        donuts: {
          kind: 'sequence',
          label: 'Donut Utility',
          of: dounts,
          marginal: true,
        },
        dountPrice: {
          kind: 'number',
          label: 'Donut Price',
          range: [0.01, 20],
          of: 2,
        },
        donutColor: {
          kind: 'color',
          label: null,
          of: 0xaaff66,
        },
        muffins: {
          kind: 'sequence',
          label: 'Muffin Utility',
          of: muffins,
          marginal: true,
        },
        muffinPrice: {
          kind: 'number',
          label: 'Muffin Price',
          range: [0.01, 20],
          of: 4,
        },
        muffinColor: {
          kind: 'color',
          label: null,
          of: 0xff66aa,
        },
      },
    },
  };
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  /**
   * @param {number} color
   * @param {number} price
   * @param {readonly number[]} seq
   * @returns {GoodUtility} */
  const good = (color, price, seq) => ({
    price,
    color,
    total: seq,
    marginal: numbers.marginal(seq),
    marginalPer$: numbers.marginal(seq).map(u => u/price),
  });

  switch (event.kind) {
    case 'config': {
      const u = event.config.utility;
      return {
        ...state,
        utility: {
          donuts: good(u.donutColor, u.dountPrice, u.donuts),
          muffins: good(u.muffinColor, u.muffinPrice, u.muffins),
        },
      };
    }
    default:
      console.error(event);
      throw new Unreachable(event.kind);
  }
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function createState(config) {
  return onUpdate({}, { kind: 'config', config });
}

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
