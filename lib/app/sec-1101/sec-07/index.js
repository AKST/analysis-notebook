/**
 * @import { MakeVariantKnob, MakeConfigKnobs } from '../../prelude-type.ts';
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
import { container } from '../common/layout.js';
import * as doc from './doc.js';
export { createStyle } from './style.js';

export const meta = {
  kind: 'multi',
};

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  /**
   * @param {string} label
   * @param {{
   *   marginalSteps: number[],
   *   numberRange: [number, number],
   *   numberDefault: number,
   * }} cfg
   */
  function rateOfChange(label, { marginalSteps, numberDefault, numberRange }) {
    return {
      kind: /** @type {'variant'} */ ('variant'),
      label,
      variants: {
        scalar: {
          kind: /** @type {'number'} */ ('number'),
          label: undefined,
          of: numberDefault,
          range: numberRange,
        },
        marginal: {
          kind: /** @type {'sequence'} */ ('sequence'),
          label: undefined,
          marginal: false,
          of: marginalSteps,
        },
      },
    }
  }

  return {
    monopoly: {
      kind: 'group',
      label: 'Monopoly',
      group: {
        fixedCost: {
          kind: 'number',
          label: 'Fixed Cost',
          of: 5,
        },
        perworkerQuantity: rateOfChange('Quantity (Per Worker)', {
          numberDefault: 200,
          numberRange: [0, 1000],
          marginalSteps: [0, 200, 400, 600, 800, 1000]
        }),
      },
    },
    demand: {
      kind: 'group',
      label: 'Demand',
      group: {
        demandSchedule: {
          kind: 'sequence',
          label: null,
          of: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5],
        },
      },
    },
  };
}

/**
 * @param {State} state
 * @param {Event} _event
 * @returns {State}
 */
export function onUpdate(state, _event) {
  return state;
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
  doc.header,
  doc.createPlaceholder(`
    Market Power And Demand, Showing Supply and
    Demand, as well as a firm curve in perfect
    competition
  `),
  doc.originsOfMonopolies,
  doc.costBenefitPrinciple,
  doc.profitMaximisingForMonopolies,
  doc.createPlaceholder(`
    Show how the market differs with a monopolist,
    show how there's a seperate line for marginal revenue
  `),
  doc.revenueTradeOff,
  doc.createPlaceholder(`
    Show revenue trade off graphic
  `),
  doc.monopolyData,
  doc.createPlaceholder(`
    Show above table on a chart, include "demand",
    "marginal cost" and "marginal revenue".
  `),
  doc.createPlaceholder(`
    Show deadweight loss under marginal revenue.
  `),
  doc.monopolyRegulation,
  doc.createPlaceholder(`Average Cost Pricing Example`),
  doc.priceDiscrimination,
];
