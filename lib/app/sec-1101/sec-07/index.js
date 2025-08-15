/**
 * @import { MakeVariantKnob, MakeConfigKnobs } from '../../prelude-type.ts';
 * @import { Widget } from '../../prelude-type.ts';
 * @import { RateOfChangeCfg, Config, State, Event } from './type.ts';
 */
import { container } from '../common/layout.js';
import * as doc from './doc.js';
import * as render from './render.js';

export { createStyle } from './style.js';
export { onUpdate, createState } from './util.js';

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
   * @returns {MakeConfigKnobs<{ a: RateOfChangeCfg }>['a']}
   */
  function rateOfChange(label, { marginalSteps, numberDefault, numberRange }) {
    return {
      kind: 'variant',
      label,
      of: { kind: 'scalar', value: numberDefault },
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
    exampleA: {
      kind: 'group',
      label: 'Monopoly Example 1',
      group: {
        fixedCost: {
          kind: 'number',
          label: 'Fixed Cost',
          range: [0, 1000],
          of: 100,
        },
        perworkerCost: rateOfChange('Variable Cost (Per Worker)', {
          numberDefault: 10,
          numberRange: [0, 2500],
          marginalSteps: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
        }),
        perworkerQuantity: rateOfChange('Quantity (Per Worker)', {
          numberDefault: 200,
          numberRange: [0, 2000],
          marginalSteps: [
            200, 400, 600, 800, 1000,
            1200, 1400, 1600, 1800, 2000,
          ]
        }),
        price: {
          kind: 'variant',
          label: 'Demand Fn',
          of: { kind: 'curve', value: { curve: [1.05, -0.001] } },
          variants: {
            curve: {
              kind: 'group',
              label: undefined,
              group: {
                curve: {
                  kind: 'curve',
                  mode: 'P',
                  label: 'Curve',
                  of: [1.05, -0.001],
                },
              },
            },
            schedule: {
              kind: 'group',
              label: undefined,
              group: {
                prices: {
                  kind: 'sequence',
                  label: 'Schedule',
                  marginal: false,
                  of: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5],
                },
              },
            },
          },
        },
        maxWorkers: {
          kind: 'number',
          label: 'Max Workers',
          range: [0, 100],
          of: 5,
        },
      },
    },
    exampleB: {
      kind: 'group',
      label: 'Monopolist Example 2',
      group: {
        supply: {
          kind: 'curve',
          mode: 'P',
          label: 'MC',
          of: [300, 0.025],
        },
        demand: {
          kind: 'curve',
          mode: 'P',
          label: 'Price',
          of: [1000, -1],
        },
        fixedCost: {
          kind: 'number',
          of: 65000,
          label: 'Fixed Cost',
          range: [0, 100000],
        },
        useAvgCostPrice: {
          kind: 'boolean',
          label: 'Use ACP',
          of: false,
        },
      },
    },
    // demand: {
    //   kind: 'group',
    //   label: 'Demand',
    //   group: {
    //     demandSchedule: {
    //       kind: 'sequence',
    //       label: null,
    //       of: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5],
    //     },
    //   },
    // },
  };
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
  render.renderExampleA,
  doc.exampleA,
  render.renderExampleB,
  doc.deadWeightLoss,
  doc.monopolyRegulation,
  doc.priceDiscrimination,
];
