/**
 * @import {
 *   LongRun,
 * } from '../type.ts';
 */
import { Unreachable } from '@base/util/type.js';

export const CobbDouglas = {
  /**
   * @param {LongRun.CobbDouglas} model
   * @returns {number}
   */
  mpk(model) {
    return (1-model.alpha) * (CobbDouglas.potentialOutput(model)/model.capital);
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
        const mpk = CobbDouglas.mpk(model.value);
        const output = CobbDouglas.potentialOutput(model.value);
        return { mpk, output };
      }
      default:
        throw new Unreachable(model);
    }
  }
}
