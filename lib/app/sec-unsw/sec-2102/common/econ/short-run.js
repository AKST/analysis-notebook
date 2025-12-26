/**
 * @import { NationalAccounting, ShortRun, LongRun } from '../type.ts';
 */
import { Unreachable } from '@base/util/type.js';
import { CobbDouglas } from './long-run.js';

export const IsCurve = {
  /**
   * @param {LongRun.T} longRun
   * @param {ShortRun.IsCurve} isCurve
   * @param {number} Y - Output
   * @returns {number}
   */
  atOutputOf(longRun, isCurve, Y) {
    const { mpk: r } = CobbDouglas.outputs(longRun);
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
    const { mpk: r } = CobbDouglas.outputs(longRun);
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
    return ac + ag + ai + (ax - am);
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

export const PhillipsCurve = {
  /**
   * @param {number} y - output flucuation
   * @param {number} v - inflation sensivity to demand conditions
   * @param {number} o - inflation shock
   */
  inflationChangeAtOutputGap(y, v, o) {
    return v*y + o;
  },
  /**
   * @param {number} i - inflation change
   * @param {number} v - inflation sensivity to demand conditions
   * @param {number} o - inflation shock
   */
  outputGapAtInflationChange(i, v, o) {
    return (i-o)/v;
  }
};
