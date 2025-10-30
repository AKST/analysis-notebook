/**
 * @import { E } from '@app/prelude-type.ts';
 * @import { State } from './type.ts';
 */

import * as prelude from '../prelude.js';

const layout = prelude.layout;
const { marketCrossSection_2 } = prelude.tables;

/**
 * @param {State} state
 * @returns {E.Item}
 */
export function surplus({
  model,
  modelFreeLocal,
  modelFreeWorld,
}) {
  if (model == null) return null;
  if (modelFreeLocal == null) return null;
  if (modelFreeWorld == null) return null;

  const table = marketCrossSection_2({
    base: 'actual',
    show: { govt: true, rentier: true },
    variants: {
      actual: {
        label: 'Actual',
        model,
      },
      domestic: {
        label: 'Free Local',
        model: modelFreeLocal,
      },
      world: {
        label: 'Free World',
        model: modelFreeWorld,
      },
    },
  })

  return layout.container(table);
}
