/**
 * @import { MakeConfigKnobs } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  /**
   * @param {string} label
   * @returns {{ kind: 'number', label: string }} */
  const nKnob = label => ({ kind: 'number', label });

  return {
    realInterest: {
      ...nKnob('Real Interest (R)'),
      of: 0.5,
    },
    mpk: {
      kind: 'variant',
      label: 'MPK',
      of: { kind: 'exogenous', value: 0.5 },
      variants: {
        exogenous: { kind: 'number' },
        cobbDouglas: {
          kind: 'group',
          label: 'Cobb Production',
          of:  { labour: 100, capital: 100, alpha: 2/3, ftp: 1 },
          group: {
            labour: nKnob('Labour (L)'),
            capital: nKnob('Capital (K)'),
            alpha: nKnob('Alpha (𝛼)'),
            ftp: nKnob('FTP (A)'),
          },
        },
      },
    },
    isCurve: {
      kind: 'group',
      label: 'IS Curve',
      of: {
        aggregateConsumption: 0.1,
        aggregateGovtSpend: 0.1,
        aggregateExporting: 0.1,
        aggregateImporting: 0.1,
        investment: { aggregate:  0.1, rateSensitivity: 0.1 },
      },
      group: {
        aggregateConsumption: nKnob('Agg Consumption (a)'),
        aggregateGovtSpend: nKnob('Agg Govt (a)'),
        aggregateExporting: nKnob('Agg Export (a)'),
        aggregateImporting: nKnob('Agg Import (a)'),
        investment: {
          kind: 'group',
          group: {
            aggregate: nKnob('Agg Investing (a)'),
            rateSensitivity: nKnob('Investment Sensetivity (b)')
          },
        }
      },
    },
  }
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  switch (event.kind) {
    case 'config':
      return state;

    default:
      return state;
  }
}

/**
 * @returns {State}
 */
export function createState() {
  return {
    charts: {

    },
  };
}
