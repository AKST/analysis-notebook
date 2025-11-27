/**
 * @import { Vec2, Widget } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 * @import { ComparisionPlot, Config, State, Event, Knobs } from './type.ts';
 */
import { v2, Unreachable, COLOR } from '@app/prelude.js';
import * as econFirm from '@base/econ/micro/firm.js';

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
          range: [0, 3000],
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
      const { examples: eg } = event.config;
      const { appleTable, fishTable, firmTable } = createTables(event.config);
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
        quantityProducedPlots: (
          fishTable && appleTable && (
            createPlots(eg, fishTable, appleTable)
          )
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
 * @param {readonly number[]} array
 * @param {'start' | 'end'} position
 */
function intoSteps(array, position = 'end') {
  if (position === 'start') {
    return [0, ...array].flatMap((it, i, all) => [
      i === 0 ? v2(0, 0) : v2(i, all[i-1]),
      v2(i, it),
    ]);
  }
  const last = array.at(-1);
  if (last == null) throw new TypeError();

  return [...array, last].flatMap((it, i, all) => [
    i === 0 ? v2(0, 0) : v2(i, all[i-1]),
    v2(i, it),
  ]);
}

/**
 * @param {Config['examples']} eg
 * @param {Econ.Firm.BehaviourTable} fishTable
 * @param {Econ.Firm.BehaviourTable} appleTable
 * @returns {State['quantityProducedPlots'] | undefined}
 */
export function createPlots(eg, fishTable, appleTable) {
  const fb = fishTable.marginalBenefit;
  const ab = appleTable.marginalBenefit;
  const fbd = fb.map((v, i) => v - ab[i]);
  const abd = ab.map((v, i) => v - fb[i]);

  const maxf =
    Math.max(1.5, eg.fishPrice, ...fbd.map(v => Math.abs(v)))

  const maxa =
    Math.max(1.5, eg.applePrice, ...abd.map(v => Math.abs(v)))

  /**
   * @param {[readonly Vec2[], readonly Vec2[]]} curves
   * @returns {ComparisionPlot}
   */
  const comp = curves => {
    const maxX = Math.max(...curves.flatMap(c => c.map(p => p.vec[0])));
    const maxY = Math.max(...curves.flatMap(c => c.map(p => p.vec[1])));

    return {
      bounds: v2(maxX, maxY),
      colors: [eg.fishColor, eg.appleColor],
      curves,
    };
  };

  return {
    fishOverApple: {
      bounds: v2(fbd.length, maxf),
      curve: intoSteps(fbd),
      price: eg.fishPrice,
      color: eg.fishColor,
    },
    appleOverFish: {
      bounds: v2(abd.length, maxa),
      curve: intoSteps(abd),
      price: eg.applePrice,
      color: eg.appleColor,
    },
    marginalTime: comp([
      intoSteps(fishTable.costVar),
      intoSteps(appleTable.costVar),
    ]),
    marginalProfit: comp([
      intoSteps(fishTable.marginalBenefit),
      intoSteps(appleTable.marginalBenefit),
    ]),
    marginalBenefit: comp([
      intoSteps(appleTable.marginalBenefit.map((b, i) => fishTable.marginalBenefit[i] - b)),
      intoSteps(fishTable.marginalBenefit.map((b, i) => appleTable.marginalBenefit[i] - b)),
    ]),
    marginalOC: comp([
      [v2(0, 0), ...fishTable.costTotal.map((c, i) => v2(c, (1+i) * eg.fishPrice))],
      [v2(0, 0), ...appleTable.costTotal.map((c, i) => v2(c, (1+i) * eg.applePrice))],
    ]),
  };
}

/**
 * @param {Config} config
 */
export function createTables({ examples: eg, firm: firmCfg }) {
  const fishTable = econFirm.firmBehaviorPerWorkerTable({
    initialRow: { kind: 'no' },
    perworkerCost: { kind: 'cumulative', total: [0, ...eg.fishCost] },
    priceFunction: {
      param: 'worker',
      rateOfChange: { kind: 'const', const: eg.fishPrice },
    },
    perworkerUnits: { kind: 'scalar', scalar: 1 },
    fixedCost: 0,
  });

  const appleTable = econFirm.firmBehaviorPerWorkerTable({
    initialRow: { kind: 'no' },
    perworkerCost: { kind: 'cumulative', total: [0, ...eg.appleCost] },
    priceFunction: {
      param: 'worker',
      rateOfChange: { kind: 'const', const: eg.applePrice },
    },
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
    priceFunction: {
      param: 'worker',
      rateOfChange: { kind: 'const', const: firmCfg.price },
    },
    perworkerUnits: { kind: 'cumulative', total: firmCfg.quantity },
    fixedCost: firmCfg.fixedCost,
  });

  return { firmTable, appleTable, fishTable };
}
