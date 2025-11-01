/**
 * @import { MakeConfigKnobs } from '@app/prelude-type.ts';
 * @import { NationalAccounting, Rendering, LongRun, ShortRun } from '../common/type.ts';
 * @import { Config, State, Event } from './type.ts';
 */
import { v2, Unreachable } from '@app/prelude.js';
import { CobbDouglas as LongRunLib } from '../common/econ/long_run.js';
import { IsCurve } from '../common/econ/short_run.js';


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
  const exoDefault = LongRunLib.outputs({ kind: 'endogenous', value: cobbDefault });

  return {
    dynamics: {
      kind: 'group',
      label: 'Dynamics',
      of: { msPerPeriod: 250 },
      group: {
        msPerPeriod: nKnob({ label: 'MS per Period', range: [0, 1000] })
      },
    },
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
            mpk: nKnob({ label: 'MPK' }),
            output: nKnob({ label: 'Output', range: [0, 10000] }),
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
        aggregateGovtSpend: 0.32,
        aggregateExporting: 0.3,
        aggregateImporting: 0.3,
        investment: { aggregate:  0.27, sensitivity: 0.09 },
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
    mpCurve: {
      kind: 'group',
      label: 'MP Curves',
      of: { realInterest: { 1: 3.45, 2: 2.75 } },
      group: {
        realInterest: {
          kind: 'many',
          label: 'Real Interest Rate',
          create: id => nKnob({ label: id, range: [0, 10], of: 0.5 }),
        },
      },
    },
    inflationShock: {
      kind: 'group',
      label: 'Inflation Shock',
      of: { size: 0, decay: 5 },
      group: {
        size: nKnob({ label: 'Shock Size (ō)', range: [0, 1], of: 0.5 }),
        decay: nKnob({ label: 'Decay (periods)', range: [0, 100], of: 0.5 }),
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
        ...plotMPISCurve(event.config),
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

/**
 * @param {Config} config
 * @returns {Pick<State, 'isCurveChart'>}
 */
export function plotMPISCurve(config) {
  const { longRun, isCurve, mpCurve } = config;
  const rY0 = IsCurve.atOutputOf(longRun, isCurve, 0);
  const yR0 = IsCurve.atRealInterestOf(longRun, isCurve, 0);
  /** @param {number} n */
  const shiftBound = n => Math.pow(10, Math.floor(Math.log10(n))+1);
  return {
    isCurveChart: {
      bounds: v2(shiftBound(yR0) * 1.1, shiftBound(rY0) * 1.1),
      ticks: [v2(yR0, rY0)],
      isCurve: [v2(0, rY0), v2(yR0, 0)],
      mpCurves: Object.values(mpCurve.realInterest).map(r => {
        return v2(IsCurve.atRealInterestOf(longRun, isCurve, r), r);
      }),
    },
  };
};
