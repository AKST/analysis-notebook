/**
 * @import { MakeVariantKnob, MakeConfigKnobs } from '../../prelude-type.ts';
 * @import { Econ, Widget } from '../../prelude-type.ts';
 * @import { RateOfChangeCfg, Config, State, Event } from './type.ts';
 */
import { Unreachable, v2, econFirm } from '../../prelude.js';

/**
 * @param {RateOfChangeCfg} roc
 * @returns {Econ.DiscreteRateOfChange}
 */
function rateOfChange(roc) {
  switch (roc.kind) {
    case 'scalar':
      return { kind: 'scalar', scalar: roc.value };

    case 'marginal':
      return { kind: 'cumulative', total: roc.value };

    default:
      throw new Unreachable(roc);
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
      const {
        exampleA: {
          fixedCost,
          perworkerQuantity,
          perworkerCost,
          maxWorkers,
          price,
        },
        exampleB: {
          supply,
          demand,
        },
      } = event.config;

      return {
        ...state,
        exampleA: econFirm.firmBehaviorPerWorkerTable({
          initialRow: { kind: 'no' },
          fixedCost,
          maxWorkers,
          perworkerCost: rateOfChange(perworkerCost),
          perworkerUnits: rateOfChange(perworkerQuantity),
          priceFunction: {
            param: 'units',
            rateOfChange: {
              kind: 'curve',
              curve: { m: price[1], i: price[0] },
            },
          },
        }),
        exampleB: getExampleB(supply, demand),
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
  return onUpdate({}, { kind: 'config', config });
}

/**
 * @param {[number, number]} supply
 * @param {[number, number]} demand
 * @returns {State['exampleB']}
 */
export function getExampleB(supply, demand) {
  const socialEqQ = (demand[0] - supply[0]) / (-demand[1] + supply[1]);
  const socialEqP = demand[0] + demand[1] * socialEqQ;
  const profitEqQ = (demand[0] - supply[0]) / (-demand[1]*2 + supply[1]);
  const profitEqP = demand[0] + demand[1] * profitEqQ;
  const deadWeightLoss = [
    v2(profitEqQ, profitEqP),
    v2(profitEqQ, socialEqP),
    v2(socialEqQ, socialEqP),
  ];


  const qOfP0 = (-demand[0])/demand[1];
  const qOfR0 = (-demand[0])/(demand[1]*2);

  console.log(demand, qOfR0);

  return {
    bounds: v2(qOfP0, demand[0]),
    demand: { kind: 'continious', dir: -1, i: demand[0], m: demand[1] },
    marginalCost: { kind: 'continious', dir: 1, i: supply[0], m: supply[1] },
    marginalRevenue: { kind: 'continious', dir: -1, i: demand[0], m: demand[1] * 2 },
    socialEq: v2(socialEqQ, socialEqP),
    profitEq: v2(profitEqQ, profitEqP),
    lines: {
      demand: [v2(0, demand[0]), v2(qOfP0, 0)],
      revenue: [v2(0, demand[0]), v2(qOfR0, 0)],
      supply: [v2(0, supply[0]), v2(qOfP0, qOfP0*supply[1]+supply[0])],
    },
    deadWeightLoss: {
      size: (profitEqP-socialEqP) * (socialEqQ-profitEqQ) * 0.5,
      geom: deadWeightLoss,
    },
  };
}
