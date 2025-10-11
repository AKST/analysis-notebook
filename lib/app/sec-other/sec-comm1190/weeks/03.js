/**
 * @import { E } from '../../../prelude-type.ts';
 */
import { doc } from '../../../prelude.js';
import { twoColumns, container, ol, ul } from '../common.js';
import * as math from '../mathml.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return ['details', { name: 'week', className: 'dashbox' }, [
    ['summary', { className: 'h2' }, [['h2', 'Week 3 — Data Communication 1']]],
    container(
      ['h3', 'Pop out effect'],
      doc.p`Reserving constrasting element to the most releveant piece of info`,
      ['h3', 'Data vis categories'],
      ul(
        doc.p`${doc.b`Declaritive`}${ul(
          doc.p`${doc.b`Conceptual`} Idea Illustration`,
          doc.p`${doc.b`Data Driven`} Everyday data visualisation`,
        )}`,
        doc.p`${doc.b`Exploratory`}${ul(
          doc.p`${doc.b`Conceptual`} Idea Generation`,
          doc.p`${doc.b`Data Driven`} Visual Discovery`,
        )}`,
      ),
      ['h4', 'Dimensions'],
      ul(
        doc.p`${doc.b`Conceptual`}: "Ideas", with the goal to "simplify" & "teach".`,
        doc.p`${doc.b`Data Driven`}: "Statistics", with the goal to "inform" & "enlighten".`,
        doc.p`${doc.b`Declaritive`}: "Reporting", with the goal to "affirm".`,
        doc.p`${doc.b`Exploratory`}: "Interacting", with the goal to "discover" & "corroborate".`,
      ),
      ['h3', 'Elements of excellent charts'],
      ul('clear', 'easy to understand', 'impactful', 'tells a story', 'accurate', 'visuallu engaging'),
    ),
  ]];
}
