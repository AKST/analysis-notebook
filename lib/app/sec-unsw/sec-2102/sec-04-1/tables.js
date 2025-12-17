/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { doc } from '@app/prelude.js';
import { text, clsRef, todo } from '@prelude-uni/components.js';

export const moneyTerms = text.figure(
  ['div', { style: 'display: grid; grid-template-columns: 1fr' }, [
    doc.table(
      doc.thead(doc.tr(doc.th`Identifier`, doc.th`Meaning`)),
      doc.tbody(
        doc.tr(doc.td`C`, doc.td`Currency`),
        doc.tr(doc.td`MB`, doc.td`Monetary Base = currency plus reserves`),
        doc.tr(doc.td`M1`, doc.td`Currency plus demand deposits (e.g. checking accounts)`),
        doc.tr(doc.td`M2`, doc.td`M1 plus savings deposits and indivisual money market accounts`),
      ),
    ),
  ]],
  doc.figcaption`Different Measure of money`
);
