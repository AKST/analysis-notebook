/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Knobs, Config, State, Event } from './type.ts';
 */

export { createStyle } from './style.js';
import * as prelude from '@app/prelude.js';
import * as util from './util.js';
import * as doc from './doc.js';
import * as render from './render.js';

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
  return {
    summation: {
      kind: 'group',
      label: 'Horizontal Summation',
      group: {
        priceCtrl: {
          kind: 'variant',
          label: 'Price Control 🏛️',
          of: { kind: 'absolute', value: 10 },
          variants: {
            absolute: {
              kind: 'number',
              label: 'Absolute',
              of: 10,
              range: [0, 100],
            },
            relative: {
              kind: 'number',
              label: 'Relative',
              of: 0,
              range: [-25, 25],
            },
          },
        },
        consumers: {
          kind: 'many',
          label: "Consumers 🍽️",
          of: {
            '🐩': [20, -2],
            '🐕': [20, -1],
          },
          create: {
            kind: 'curve',
            label: 'Consumer {id}',
            of: [10, -1],
          },
        },
        producers: {
          kind: 'many',
          label: "Producers 👨‍🌾",
          of: {
            '🐈': [0, 1],
            '🐈‍⬛': [0, 2],
          },
          create: {
            kind: 'curve',
            label: 'Producer {id}',
            of: [0, 2],
          },
        },
      },
    },
    reservationPrices: {
      kind: 'group',
      label: 'Reservation Prices',
      group: {
        consumers: {
          kind: 'sequence',
          label: "Consumers 🍽️",
          marginal: false,
          of: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
        producers: {
          kind: 'sequence',
          label: "Producers 👨‍🌾",
          marginal: false,
          of: [1, 2, 3, 4, 5, 6, 7, 8, 9],
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
  switch (event.kind) {
    case 'config': {
      return {
        ...state,
        discrete: util.discreteCurves(
          event.config.reservationPrices
        ),
        summation: util.horizontalSummation(
          event.config.summation,
        ),
      };
    }
    default:
      return state;
  }
}

/**
 * @param {Config} config
 * @returns {State}
 */
export function createState(config) {
  return onUpdate({
    discrete: {
      model: undefined,
      bounds: prelude.v2(1, 1),
      equilibrium: undefined,
      consumers: { kind: 'discrete', dir: -1, rate: [] },
      producers: { kind: 'discrete', dir: 1, rate: [] },
    },
    summation: {
      model: undefined,
      modelEq: undefined,
      modelState: undefined,
      bounds: prelude.v2(1, 1),
      consumers: {},
      producers: {},
      aggregate: {
        production: { kind: 'continious', dir: 1, i: 0, m: 1 },
        consumption: { kind: 'continious', dir: -1, i: 40, m: -1 },
      },
    },
  }, { kind: 'config', config });
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.intro,
  doc.subjectPerfectCompetition,
  doc.introAggregateSupplyAndDemand,
  render.aggregateCurves,
  render.aggregateCurveSurplus,
  doc.continiousSurplus,
  doc.discrete,
  render.discreteCurve,
  render.discreteSurplus,
  doc.discreteSurplus,
  doc.findingEquilibrium,
  doc.longRunEquilibrium,
];
