/**
 * @import { MakeVariantKnob, MakeConfigKnobs } from '@app/prelude-type.ts';
 * @import { Vec2, Widget } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 * @import { PriceSchedule, MarketSurplusSummary, RateOfChangeCfg, Config, State, Event } from './type.ts';
 */
import {
  Unreachable,
  v2,
  shoelaceArea,
  objects,
} from '@app/prelude.js';
import * as econFirm from '@base/econ/micro/firm.js';

/**
 * @param {RateOfChangeCfg} roc
 * @returns {Econ.DiscreteRateOfChange}
 */
function rateOfChange(roc) {
  switch (roc.kind) {
    case 'scalar':
      return { kind: 'scalar', scalar: roc.value };

    case 'marginal':
      return { kind: 'cumulative', total: [0, ...roc.value] };

    default:
      throw new Unreachable(roc);
  }
}

/**
 * @param {PriceSchedule} ps
 * @returns {Econ.DiscreteRateOfChange}
 */
function getPriceSchedule(ps) {
  switch (ps.kind) {
    case 'curve':
      return { kind: 'curve', curve: { m: ps.value.curve[1], i: ps.value.curve[0] } };

    case 'schedule':
      return { kind: 'cumulative', total: [0, ...ps.value.prices] };

    default:
      throw new Unreachable(ps);
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
        exampleA: ea,
        exampleC: ec,
        exampleB: {
          supply,
          demand,
          fixedCost: fixedCostB,
        },
      } = event.config;

      /** @type {Record<string, Econ.Firm.BehaviourTable> | undefined} */
      let cMarkets = undefined;

      const maybeCMarkets = objects.mapEntries(ec.marketSegments, price => (
        econFirm.firmBehaviorPerWorkerTable({
          initialRow: { kind: 'no' },
          fixedCost: 0,
          maxWorkers: 100,
          perworkerCost: rateOfChange(ec.perworkerCost),
          perworkerUnits: {
            kind: 'scalar',
            scalar: ec.perworkerQuantity,
          },
          priceFunction: {
            param: 'units',
            rateOfChange: getPriceSchedule(price),
          },
        })
      ));
      if (Object.values(maybeCMarkets).every(it => it != null)) {
        // @ts-ignore - its okay
        cMarkets = maybeCMarkets;
      }


      return {
        ...state,
        exampleA: econFirm.firmBehaviorPerWorkerTable({
          initialRow: { kind: 'no' },
          fixedCost: ea.fixedCost,
          maxWorkers: ea.maxWorkers,
          perworkerCost: rateOfChange(ea.perworkerCost),
          perworkerUnits: rateOfChange(ea.perworkerQuantity),
          priceFunction: {
            param: 'units',
            rateOfChange: getPriceSchedule(ea.price),
          },
        }),
        exampleB: getExampleB(
          supply,
          demand,
          fixedCostB,
        ),
        exampleC: cMarkets && ({
          markets: cMarkets,
        }),
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
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {[number, number]}
 */
export function solveQuadraticFn(a, b, c) {
  const d1 = -b
  const d2 = Math.sqrt((b**2) - (4 * a * c));
  const d3 = 2 * a;
  return [(d1 + d2) / d3, (d1 - d2) / d3];
}

/**
 * @param {[number, number]} supply
 * @param {[number, number]} demand
 * @param {number} fixedCost
 * @returns {State['exampleB']}
 */
export function getExampleB(supply, demand, fixedCost) {
  const socialEqQ = (demand[0] - supply[0]) / (-demand[1] + supply[1]);
  const socialEqP = demand[0] + demand[1] * socialEqQ;
  const profitEqQ = (demand[0] - supply[0]) / (-demand[1]*2 + supply[1]);
  const profitEqP = demand[0] + demand[1] * profitEqQ;

  const qOfP0 = (-demand[0])/demand[1];
  const qOfR0 = (-demand[0])/(demand[1]*2);

  /*
   *  Ps = a + bQ
   *  Pd = c + dQ (note d < 0)
   * ATC = FC/q + a + (b/2)q
   *
   * Solve for Q at ATC = Pd
   *
   * c + dQ = FC/q + a + (b/2)q
   *      0 = FC/q + (a-c) + ((b/2)-d)q
   *      0 = FC + (a-c)q + ((b/2)-d)q^2
   */
  const atcQMax = Math.max(...solveQuadraticFn(
    (supply[1]/2) - demand[1],
    (supply[0] - demand[0]),
    fixedCost,
  ));
  const atcP = (fixedCost/atcQMax) + supply[0] + supply[1]*0.5*atcQMax;

  const eq = {
    social: v2(socialEqQ, socialEqP),
    profit: v2(profitEqQ, profitEqP),
    atc: v2(atcQMax, atcP),
  }

  /**
   * @param {Vec2} eq
   * @returns {MarketSurplusSummary}
   */
  const compSurplus = ({ vec: [eqQ, eqP] }) => {
    const deadWeightLoss = [
      v2(eqQ, eqP),
      v2(eqQ, eqQ * supply[1] + supply[0]),
      v2(socialEqQ, socialEqP),
    ];

    const demandSurplus = [
      v2(0, demand[0]),
      v2(0, eqP),
      v2(eqQ, eqP),
    ];

    const supplySurplus = [
      v2(0, eqP),
      v2(0, supply[0]),
      v2(eqQ, supply[0] + supply[1] * eqQ),
      v2(eqQ, eqP),
    ];

    return {
      supply: {
        size: shoelaceArea(supplySurplus),
        geom: supplySurplus,
      },
      demand: {
        size: shoelaceArea(demandSurplus),
        geom: demandSurplus,
      },
      dwl: {
        size: shoelaceArea(deadWeightLoss),
        geom: deadWeightLoss,
      },
    };
  };

  const ATC_SAMPLES = 200;
  const atcCurve = Array.from({ length: ATC_SAMPLES }, (_, i) => {
    const q = qOfP0 * (i/ATC_SAMPLES);
    const p = fixedCost/q + supply[0] + (supply[1]/2)*q;
    return v2(q, p);
  })

  return {
    bounds: v2(qOfP0, demand[0]),
    demand: { kind: 'continious', dir: -1, i: demand[0], m: demand[1] },
    marginalCost: { kind: 'continious', dir: 1, i: supply[0], m: supply[1] },
    marginalRevenue: { kind: 'continious', dir: -1, i: demand[0], m: demand[1] * 2 },
    eq,
    fixedCost,
    lines: {
      demand: [v2(0, demand[0]), v2(qOfP0, 0)],
      revenue: [v2(0, demand[0]), v2(qOfR0, 0)],
      supply: [v2(0, supply[0]), v2(qOfP0, qOfP0*supply[1]+supply[0])],
      atc: atcCurve,
    },
    surpluses: {
      marginalRevenuePrice: compSurplus(eq.profit),
      averageCostPrice: compSurplus(eq.atc),
      marginalCost: compSurplus(eq.social),
    },
  };
}
