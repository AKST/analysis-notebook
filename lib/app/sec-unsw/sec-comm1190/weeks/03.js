/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import { container } from '@prelude-uni/layout.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return doc.details({ name: 'week', className: 'dashbox' }).c(
    doc.summary.c(doc.h2`Week 3 — Data Communication 1`),
    container(
      doc.h3`Pop out effect`,
      doc.p`Reserving constrasting element to the most releveant piece of info`,
      doc.h3`Data vis categories`,
      text.ul(
        doc.li`${text.b`Declaritive`}${text.ul(
          doc.li`${text.b`Conceptual`} Idea Illustration`,
          doc.li`${text.b`Data Driven`} Everyday data visualisation`,
        )}`,
        doc.li`${text.b`Exploratory`}${text.ul(
          doc.li`${text.b`Conceptual`} Idea Generation`,
          doc.li`${text.b`Data Driven`} Visual Discovery`,
        )}`,
      ),
      doc.h4`Dimensions`,
      text.ul(
        doc.li`${text.b`Conceptual`}: "Ideas", with the goal to "simplify" & "teach".`,
        doc.li`${text.b`Data Driven`}: "Statistics", with the goal to "inform" & "enlighten".`,
        doc.li`${text.b`Declaritive`}: "Reporting", with the goal to "affirm".`,
        doc.li`${text.b`Exploratory`}: "Interacting", with the goal to "discover" & "corroborate".`,
      ),
      doc.h3`Elements of excellent charts`,
      text.ul(
        doc.li`clear`,
        doc.li`easy to understand`,
        doc.li`impactful`,
        doc.li`tells a story`,
        doc.li`accurate`,
        doc.li`visually engaging`,
      ),
    ),
  );
}
