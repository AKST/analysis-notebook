/**
 * @import { E } from '../../prelude-type.ts';
 * @import { CoaseProblem } from './type.ts';
 */
import { doc } from '../../prelude.js';
import { crossSectionTable } from '../common/components.js';

/**𝚫
 * @param {{
 *   initator?: string,
 *   bystander?: string,
 *   transaction: number,
 *   footer?: E.Item[],
 *   table: CoaseProblem,
 * }} cfg
 * @returns {E.Item}
 */
export function coaseTable({
  initator: initatorName = 'Initiator',
  bystander: bystanderName = 'ByStander',
  transaction: t,
  table: { initator, bystander },
  footer,
}) {
  const delta1 = '+right';
  const delta2 = '-right';
  const total = 'Tranaction ∑';
  const iTotal = initator.refrain + bystander.refrain;
  const eTotal = initator.exercise + bystander.exercise;
  /** @param {number} v */
  const signed = v => `${v < 0 ? '-' : '+'}${Math.abs(v)}`;
  return crossSectionTable({
    rowColor: {},
    colColor: {
      Idle: 'blue',
      Exercise: 'red',
      [delta1]: 'green',
      [delta2]: 'green',
    },
    footer,
    outcomes: {
      [initatorName]: {
        Idle: [initator.refrain],
        Exercise: [initator.exercise],
        [delta1]: [initator.refrain + t],
        [delta2]: [initator.exercise - t],
      },
      [bystanderName]: {
        Idle: [bystander.refrain],
        Exercise: [bystander.exercise],
        [delta1]: [bystander.refrain - t],
        [delta2]: [bystander.exercise + t],
      },
      Total: {
        Idle: [iTotal],
        Exercise: [eTotal],
        [delta1]: [signed(
          initator.refrain + t +
          bystander.refrain - t
        )],
        [delta2]: [signed(
          initator.refrain - t +
          bystander.refrain + t
        )],
      },
    },
  })
}

export const noop = () => undefined;

