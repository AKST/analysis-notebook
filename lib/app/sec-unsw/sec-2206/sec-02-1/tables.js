import { doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';

export const bias = text.figure(
  doc.table.css({ width: '100%' }).c(
    doc.thead(doc.tr(doc.th``, doc.th`Corr(x₁,x₂) > 0`, doc.th`Corr(x₁,x₂) < 0`)),
    doc.tbody(
      doc.tr(doc.td`β₂ > 0`, doc.td`Positive bias`, doc.td`Negative bias`),
      doc.tr(doc.td`β₂ < 0`, doc.td`Negative bias`, doc.td`Positive bias`),
    ),
  ),
  doc.figcaption`Summary of Bias in β̃₁ when x₂ is an Omitted Variable`,
);
