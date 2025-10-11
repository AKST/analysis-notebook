/**
 * @import { E } from '../../../prelude-type.ts';
 */
import { doc } from '../../../prelude.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return ['details', { name: 'week', className: 'dashbox' }, [
    ['summary', { className: 'h2' }, [doc.h2`Week 1`]],
    ['div', { className: 'container' }, [
      ['div', { className: 'c2' }, [
        ['div', { className: 'container' }, [
          doc.h3`Types of Analytics`,
          doc.dl([
            ['Descriptive Analytics', 'What happened?'],
            ['Diagnostic Analytics', 'Why did it happen?'],
            ['Prescriptive Analytics', 'Why should be done about it?'],
            ['Predictive Analytics', 'What is likely to happen?'],
          ]),
        ]],
        ['div', { className: 'container' }, [
          doc.h3`Histogram basics`,
          doc.dl([
            ['Symmetric', 'Not skewed'],
            ['Bimodal', 'Two peaks'],
            ['Multimodal', 'Multiple peaks'],
            ['Right skewed', 'Extreme values on the right side, concentrated on the left'],
            ['Left skewed', 'Extreme values on the left side, concentrated on the right'],
          ]),
        ]],
      ]],
    ]],
  ]];
}
