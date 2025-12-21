/**
 * @import { E } from '@app/prelude-type.ts';
 * @import * as Econ from '@base/econ/micro/type.ts';
 * @import { State, Config, CoaseProblem } from './type.ts';
 */
import { crossSectionTable } from '@prelude-uni/components.js';
import { doc } from '@app/prelude.js';

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

/**
 * @param {Config} config
 * @returns {E.Item}
 */
export const deadWeightLoss = ({
  market: { demand: [da, db], supply: [sa, sb] },
  externality,
}) => {
  const privateQ = (da - sa) / (sb - db);
  const socialQ = (da - sa + externality) / (sb - db);

  return doc.table(
    doc.thead(doc.tr(doc.th`Dead Weight Loss`, doc.th`Social Quantity`, doc.th`Private Quantity`)),
    doc.tbody(doc.tr(
      doc.td.c(0.5 * (privateQ - socialQ) * externality),
      doc.td.c(socialQ),
      doc.td.c(privateQ),
    )),
  );
};

