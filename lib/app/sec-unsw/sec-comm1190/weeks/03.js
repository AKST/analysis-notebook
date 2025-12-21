/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import { twoColumns, container, ol, ul } from '../common.js';
import * as math from '../mathml.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return doc.details({ name: 'week', className: 'dashbox' }).c(
    doc.summary({ className: 'h2' }).c(doc.h2`Week 3 — Data Communication 1`),
    container(
      doc.h3`Pop out effect`,
      doc.p`Reserving constrasting element to the most releveant piece of info`,
      doc.h3`Data vis categories`,
      ul(
        doc.p`${text.b`Declaritive`}${ul(
          doc.p`${text.b`Conceptual`} Idea Illustration`,
          doc.p`${text.b`Data Driven`} Everyday data visualisation`,
        )}`,
        doc.p`${text.b`Exploratory`}${ul(
          doc.p`${text.b`Conceptual`} Idea Generation`,
          doc.p`${text.b`Data Driven`} Visual Discovery`,
        )}`,
      ),
      doc.h4`Dimensions`,
      ul(
        doc.p`${text.b`Conceptual`}: "Ideas", with the goal to "simplify" & "teach".`,
        doc.p`${text.b`Data Driven`}: "Statistics", with the goal to "inform" & "enlighten".`,
        doc.p`${text.b`Declaritive`}: "Reporting", with the goal to "affirm".`,
        doc.p`${text.b`Exploratory`}: "Interacting", with the goal to "discover" & "corroborate".`,
      ),
      doc.h3`Elements of excellent charts`,
      ul('clear', 'easy to understand', 'impactful', 'tells a story', 'accurate', 'visuallu engaging'),
    ),
  );
}
