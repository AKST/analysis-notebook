/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import { container } from '@prelude-uni/layout.js';
import * as math from '../mathml.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return doc.details({ open: true, name: 'week', className: 'dashbox' }).c(
    doc.summary({ className: 'h2' }).c(doc.h2`Week 9 — Research Design & Experimentation, Part 2`),
    container(
      container(
        doc.h3`Challenge of Causal inference`,
        text.ul(
          doc.li`Direct experimentation may not be possibl, (e.g. oil spill), as it may not be ethical`,
          doc.li`For causal interpretation need all other factors to be held constant`,
          doc.li`Also need disturbance (eplison) to remain unchanged as the treatment changes`,
          doc.li`Data availability provides other opportunities to exploit quasi-experimental methods`,
          doc.li`Natural experiments where randomisation is accidental or not done as part of an experiment`,
        ),
      ),
      doc.hr(),
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
  );
}
