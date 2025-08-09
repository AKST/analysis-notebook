/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Knobs, Config, State, Event } from './type.ts';
 */
import { v2, COLOR, econFirm, Unreachable } from '../../prelude.js';
import * as render from './render.js';
import * as documents from './doc.js';
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
  /** @type {readonly number[]} */
  const fishCost = Array.from({ length: 6 }, (_, i) => 0.5 * (i+1));
  /** @type {readonly number[]} */
  const appleCost = [1, 2.5, 4.5, 7.5, 14, 30];
  /** @type {[number, number]} */
  const range = [0.01, 5];

  return {
    examples: {
      kind: 'group',
      label: 'Fish and Apples',
      group: {
        a: {
          kind: 'group',
          label: null,
          group: {
            fishCost: {
              kind: 'sequence',
              marginal: false,
              label: 'Fish Price, Cost and Color',
              of: fishCost },
            fishPrice: { kind: 'number', label: null, of: 0.5, range },
            fishColor: { kind: 'color', label: null, of: COLOR.CYAN },
            appleCost: {
              kind: 'sequence',
              marginal: false,
              label: 'Apple Price, Cost and Color',
              of: appleCost },
            applePrice: { kind: 'number', label: null, of: 1.9, range },
            appleColor: { kind: 'color', label: null, of: COLOR.RED },
          },
        },
      },
    },
    firm: {
      kind: 'group',
      label: 'Firm Supply Curve',
      group: {
        price: {
          kind: 'number',
          label: 'Market price of Output',
          of: 7,
          range: [0, 20],
        },
        fixedCost: {
          kind: 'number',
          label: 'Fixed Cost',
          of: 500,
          range: [0, 1000],
        },
        quantity: {
          kind: 'sequence',
          marginal: false,
          label: 'Quantity (per worker)',
          of: [0, 40, 90, 120, 130, 135],
        },
        varCost: {
          kind: 'variant',
          label: 'Variable Cost (per worker)',
          of: { kind: 'scalar', value: 96 },
          variants: {
            scalar: {
              kind: 'number',
              of: 96,
              range: [0, 120],
            },
            cumulative: {
              kind: 'sequence',
              of: [10, 20, 25, 35, 50, 70, 95, 125],
            },
          },
        },
      },
    }
  }
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  switch (event.kind) {
    case 'config': {
      const { examples: { a: eg }, firm: firmCfg } = event.config;

      const fishTable = econFirm.firmBehaviorPerWorkerTable({
        initialRow: { kind: 'no' },
        perworkerCost: { kind: 'cumulative', total: [0, ...eg.fishCost] },
        perworkerPrice: { kind: 'const', const: eg.fishPrice },
        perworkerUnits: { kind: 'scalar', scalar: 1 },
        fixedCost: 0,
      });

      const appleTable = econFirm.firmBehaviorPerWorkerTable({
        initialRow: { kind: 'no' },
        perworkerCost: { kind: 'cumulative', total: [0, ...eg.appleCost] },
        perworkerPrice: { kind: 'const', const: eg.applePrice },
        perworkerUnits: { kind: 'scalar', scalar: 1 },
        fixedCost: 0,
      });

      const { varCost: vc } = firmCfg;
      const firmTable = econFirm.firmBehaviorPerWorkerTable({
        initialRow: { kind: 'no' },
        perworkerCost: (
          vc.kind === 'scalar'
            ? ({ kind: 'scalar', scalar: vc.value })
            : ({ kind: 'cumulative', total: vc.value })
        ),
        perworkerPrice: { kind: 'const', const: firmCfg.price },
        perworkerUnits: { kind: 'cumulative', total: firmCfg.quantity },
        fixedCost: firmCfg.fixedCost,
      });


      if (appleTable == null) return state;
      if (fishTable == null) return state;

      return {
        ...state,
        examples: {
          fish: {
            color: eg.fishColor,
            price: eg.fishPrice,
            table: fishTable,
          },
          apple: {
            color: eg.appleColor,
            price: eg.applePrice,
            table: appleTable,
          },
        },
        firm: firmTable,
        firmScale: (
          firmTable != null
          ? econFirm.tableBounds(firmTable)
          : v2(1, 1)
        ),
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
  return onUpdate({
    firmScale: v2(1, 1),
  }, { kind: 'config', config });
}

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  documents.intro,
  documents.example,
  ...render.renderMarginalCosts(),
  documents.quantity,
  ...render.renderQuantityProduced(),
  documents.kindsOfCosts,
  render.renderFirmSupplyCurve(),
  documents.elascity,
  // TODO show elasicity on graph
];
