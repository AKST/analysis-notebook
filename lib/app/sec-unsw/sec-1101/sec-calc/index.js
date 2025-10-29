/**
 * @import { Widget } from '../../../prelude-type.ts';
 * @import { Knobs, Config, State, Event } from './type.ts';
 */

export { createStyle } from './style.js';
import * as prelude from '../../../prelude.js';
import * as util from './util.js';
import * as doc from './doc.js';
import * as render from './render.js';

export const meta = {
  kind: 'multi',
};

/**
 * @returns {Knobs}
 */
export function getConfig() {
  return {
    market: {
      kind: 'group',
      label: 'Market',
      group: {
        demand: {
          kind: 'curve',
          mode: 'P',
          label: 'Demand',
          of: [40, -1],
        },
        supply: {
          kind: 'curve',
          mode: 'P',
          label: 'Supply',
          of: [0, 1],
        },
      },
    },
    transfer: {
      kind: 'group',
      label: 'Transfers',
      group: {
        tax: {
          kind: 'group',
          label: undefined,
          group: {
            demand: {
              kind: 'group',
              label: undefined,
              group: {
                unit: {
                  kind: 'number',
                  label: 'Demand Per Unit Tax',
                  of: 0,
                  range: [0, 100],
                },
              },
            },
            supply: {
              kind: 'group',
              label: undefined,
              group: {
                unit: {
                  kind: 'number',
                  label: 'Supply Per Unit Tax',
                  of: 0,
                  range: [0, 100],
                },
              },
            }
          },
        },
        subsidy: {
          kind: 'group',
          label: undefined,
          group: {
            demand: {
              kind: 'group',
              label: undefined,
              group: {
                unit: {
                  kind: 'number',
                  label: 'Demand Per Unit Subsidy',
                  of: 0,
                  range: [0, 100],
                },
              },
            },
            supply: {
              kind: 'group',
              label: undefined,
              group: {
                unit: {
                  kind: 'number',
                  label: 'Supply Per Unit Subsidy',
                  of: 0,
                  range: [0, 100],
                },
              },
            }
          },
        },
      },
    },
    controls: {
      kind: 'group',
      label: 'Controls',
      group: {
        priceFloor: {
          kind: 'optional',
          enabled: false,
          some: {
            kind: 'number',
            label: 'Floor',
            of: 0,
            range: [0, 200],
          },
        },
        priceCeiling: {
          kind: 'optional',
          enabled: false,
          some: {
            kind: 'number',
            label: 'Ceiling',
            of: 40,
            range: [0, 200]
          },
        },
      },
    },
    externality: {
      kind: 'group',
      label: 'Externality',
      group: {
        demand: {
          kind: 'number',
          range: [-40, 40],
          label: 'Demand Externality',
          of: 0,
        },
        supply: {
          kind: 'number',
          range: [-40, 40],
          label: 'Supply Externality',
          of: 0,
        },
      },
    },
    trade: {
      kind: 'group',
      label: 'Trade',
      group: {
        permit: {
          kind: 'group',
          label: 'Trade Policy',
          layout: 'sparse',
          group: {
            exporting: {
              kind: 'boolean',
              label: '📤 Exports',
              of: false,
            },
            importing: {
              kind: 'boolean',
              label: '📥 Imports',
              of: false,
            },
          },
        },
        worldPrice: {
          kind: 'number',
          label: '🌐 World Price',
          range: [0, 200],
          of: 10,
        },
        tariff: {
          kind: 'group',
          label: undefined,
          group: {
            import: {
              kind: 'group',
              label: undefined,
              group: {
                unit: {
                  kind: 'number',
                  label: 'Import Per Unit Tariff',
                  of: 0,
                  range: [0, 100],
                },
              },
            },
            export: {
              kind: 'group',
              label: undefined,
              group: {
                unit: {
                  kind: 'number',
                  label: 'Export Per Unit Tariff',
                  of: 0,
                  range: [0, 100],
                },
              },
            },
          },
        },
        licenseeQuota: {
          kind: 'number',
          label: 'Permitted Imports (Quota)',
          range: [0, 100],
          of: 0,
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
        ...util.horizontalSummation(event.config),
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
    model: undefined,
    modelFreeLocal: undefined,
    modelFreeWorld: undefined,
    input: undefined,
    bounds: prelude.v2(1, 1),
  }, { kind: 'config', config });
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.header,
  render.surplus,
  doc.stats,
];
