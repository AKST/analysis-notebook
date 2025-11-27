/**
 * @import { Vec2, Widget } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 * @import { ComparisionPlot, Config, State, Event } from './type.ts';
 */
import { v2, Unreachable } from '@app/prelude.js';
import * as econFirm from '@base/econ/micro/firm.js';

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
    console.log(curves);
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
