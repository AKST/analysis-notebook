/**
 * @import { MakeConfigKnobs } from '../../prelude-type.ts';
 * @import { Rendering } from '../common/type.ts';
 * @import {
 *   NationalAccounting,
 *   LongRun,
 *   ShortRun,
 *   Config,
 *   State,
 *   Event,
 * } from './type.ts';
 */
import { v2, Unreachable } from '../../prelude.js';

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  /**
   * @param {{
   *   label: string | undefined,
   *   range?: [number, number] | undefined,
   *   of?: number,
   * }} config
   * @returns {{
   *   kind: 'number',
   *   label: string | undefined,
   *   of?: number,
   *   input: { kind: 'range', step: number },
   *   range: [number, number] | undefined,
   * }}
   */
  const nKnob = ({ range = undefined, ...cfg }) => ({
    kind: 'number',
    input: { kind: 'range', step: 0.01 },
    range,
    ...cfg
  });

  /** @type {LongRun.CobbDouglas} */
  const cobbDefault = { labour: 100, capital: 100, alpha: 2/3, tfp: 2 };
  const exoDefault = LongRun.outputs({ kind: 'endogenous', value: cobbDefault });

  return {
    realInterest: nKnob({ label: 'Real Interest (R)', range: [0, 1], of: 0.5 }),
    longRun: {
      kind: 'variant',
      label: 'Output/MPK',
      of: { kind: 'exogenous', value: exoDefault },
      variants: {
        exogenous: {
          kind: 'group',
          label: 'Exogenous',
          of: exoDefault,
          group: {
            mpk: nKnob({ label: undefined }),
            output: nKnob({ label: undefined, range: [0, 10000] }),
          },
        },
        endogenous: {
          kind: 'group',
          label: 'Endogenous',
          of:  cobbDefault,
          group: {
            labour: nKnob({ label: 'Labour (L)', range: [0, 1000] }),
            capital: nKnob({ label: 'Capital (K)', range: [0, 1000] }),
            alpha: nKnob({ label: 'Alpha (𝛼)', range: [0, 1] }),
            tfp: nKnob({ label: 'FTP (A)', range: [0, 1000] }),
          },
        },
      },
    },
    isCurve: {
      kind: 'group',
      label: 'IS Curve',
      of: {
        consumption: { kind: 'agg', value: { aggregate: 0.1 } },
        aggregateGovtSpend: 0.1,
        aggregateExporting: 0.1,
        aggregateImporting: 0.1,
        investment: { aggregate:  0.1, sensitivity: 0.5 },
      },
      group: {
        aggregateGovtSpend: nKnob({ label: 'Agg Govt (a)' }),
        aggregateExporting: nKnob({ label: 'Agg Export (a)' }),
        aggregateImporting: nKnob({ label: 'Agg Import (a)' }),
        investment: {
          kind: 'group',
          label: undefined,
          group: {
            aggregate: nKnob({ label: 'Agg Investing (a)' }),
            sensitivity: nKnob({ label: 'Investment Sensetivity (b)' })
          },
        },
        consumption: {
          kind: 'variant',
          label: 'Consumption',
          variants: {
            agg: {
              kind: 'group',
              label: undefined,
              of: { aggregate: 0.1 },
              group: {
                aggregate: nKnob({ label: 'Agg Consumption (a)' }),
              },
            },
            agg_mul: {
              kind: 'group',
              label: undefined,
              of: { aggregate: 0.1, multiplier: 0 },
              group: {
                aggregate: nKnob({ label: 'Aggregate (a[c])' }),
                multiplier: nKnob({ label: 'Multiplier (x[c])' }),
              },
            },
          },
        },
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
      return {
        ...state,
        isCurveChart: plotting.isCurve(event.config),
      };

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

const plotting = {
  /**
   * @param {Config} config
   * @returns {Rendering.Equilibrium2d}
   */
  isCurve(config) {
    const { longRun, isCurve, realInterest: r } = config;
    const rY0 = IsCurve.atOutputOf(longRun, isCurve, 0);
    const yR0 = IsCurve.atRealInterestOf(longRun, isCurve, 0);
    const currentOutput = IsCurve.atRealInterestOf(longRun, isCurve, r);
    return {
      bounds: v2(yR0 * 1.1, 1.1),
      points: [v2(0, rY0), v2(yR0, 0)],
      ticks: [v2(yR0, rY0)],
      eq: v2(currentOutput, r),
    };

  },
};

const IsCurve = {
  /**
   * @param {LongRun.T} longRun
   * @param {ShortRun.IsCurve} isCurve
   * @param {number} Y - Output
   * @returns {number}
   */
  atOutputOf(longRun, isCurve, Y) {
    const { mpk: r } = LongRun.outputs(longRun);
    const a = IsCurve.aggregate(isCurve);
    const b = isCurve.investment.sensitivity;
    return ((Y - a) / (-b)) + r;
  },
  /**
   * @param {LongRun.T} longRun
   * @param {ShortRun.IsCurve} isCurve
   * @param {number} R - Real Interest, R is used out of convention
   * @returns {number}
   */
  atRealInterestOf(longRun, isCurve, R) {
    const { mpk: r } = LongRun.outputs(longRun);
    const a = IsCurve.aggregate(isCurve);
    const b = isCurve.investment.sensitivity;
    const m = IsCurve.multiplier(isCurve);
    return (1/(1-m)) * (a - (b * (R - r)));
  },
  /**
   * @param {ShortRun.IsCurve} isCurve
   * @returns {number}
   */
  multiplier(isCurve) {
    const { consumption } = isCurve;
    return IsCurve.multiplierOf(consumption);
  },
  /**
   * @param {ShortRun.IsCurve} isCurve
   * @returns {number}
   */
  aggregate(isCurve) {
    const {
      consumption: { value: { aggregate: ac } },
      aggregateGovtSpend: ag,
      aggregateImporting: am,
      aggregateExporting: ax,
      investment: { aggregate: ai },
    } = isCurve;
    return ac + ag + ai + (am - ax);
  },

  /**
   * @param {NationalAccounting.ExhaustiveVariant} sector
   * @returns {number}
   */
  multiplierOf(sector) {
    switch (sector.kind) {
      case 'agg_mul':
        return sector.value.multiplier
      default:
        return 0;
    }
  },
};


const LongRun = {
  /**
   * @param {LongRun.CobbDouglas} model
   * @returns {number}
   */
  mpk(model) {
    return (1-model.alpha) * (LongRun.potentialOutput(model)/model.capital);
  },
  /**
   * @param {LongRun.CobbDouglas} model
   * @returns {number}
   */
  potentialOutput(model) {
    return (
      model.tfp *
      (model.labour ** model.alpha) *
      (model.capital ** (1-model.alpha))
    );
  },
  /**
   * @param {LongRun.T} model
   * @returns {LongRun.Exogenous}
   */
  outputs(model) {
    switch (model.kind) {
      case 'exogenous':
        return model.value;
      case 'endogenous': {
        const mpk = LongRun.mpk(model.value);
        const output = LongRun.potentialOutput(model.value);
        return { mpk, output };
      }
      default:
        throw new Unreachable(model);
    }
  }
};
