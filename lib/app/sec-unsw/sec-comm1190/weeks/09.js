/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc } from '@app/prelude.js';
import { crossSectionTable, twoColumns, container, ol, ul } from '../common.js';
import * as math from '../mathml.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return ['details', { open: true, name: 'week', className: 'dashbox' }, [
    ['summary', { className: 'h2' }, [doc.h2`Week 9 — Research Design & Experimentation, Part 2`]],
    container(
      container(
        doc.h3`Challenge of Causal inference`,
        ul(
          doc.p`Direct experimentation may not be possibl, (e.g. oil spill), as it may not be ethical`,
          doc.p`For causal interpretation need all other factors to be held constant`,
          doc.p`Also need disturbance (eplison) to remain unchanged as the treatment changes`,
          doc.p`Data availability provides other opportunities to exploit quasi-experimental methods`,
          doc.p`Natural experiments where randomisation is accidental or not done as part of an experiment`,
        ),
      ),
      ['hr'],
      container(
        doc.h3`Hedonic Regressions`,
        math.hedonicRegression,
        doc.p`
          Say if you wanted to simulate the impact of an oil spill
          on house prices, you could take the above, replace y with
          house price, replace subject with "near" as in near the
          oil spill, and replace event with "after" as in after
          the spill and then you can measure the difference in
          difference.
        `,
      ),
    ),
  ]];
}
