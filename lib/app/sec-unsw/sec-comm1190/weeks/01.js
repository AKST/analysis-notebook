/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc } from '@app/prelude.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return doc.details({ name: 'week', className: 'dashbox' }).of(
    doc.summary({ className: 'h2' }).of(doc.h2`Week 1`),
    doc.div({ className: 'container' }).of(
      doc.div({ className: 'c2' }).of(
        doc.div({ className: 'container' }).of(
          doc.h3`Types of Analytics`,
          doc.dl(
            doc.dt`Descriptive Analytics`,
            doc.dd`What happened?`,
            doc.dt`Diagnostic Analytics`,
            doc.dd`Why did it happen?`,
            doc.dt`Prescriptive Analytics`,
            doc.dd`Why should be done about it?`,
            doc.dt`Predictive Analytics`,
            doc.dd`What is likely to happen?`,
          ),
        ),
        doc.div({ className: 'container' }).of(
          doc.h3`Histogram basics`,
          doc.dl(
            doc.dt`Symmetric`,
            doc.dd`Not skewed`,
            doc.dt`Bimodal`,
            doc.dd`Two peaks`,
            doc.dt`Multimodal`,
            doc.dd`Multiple peaks`,
            doc.dt`Right skewed`,
            doc.dd`Extreme values on the right side, concentrated on the left`,
            doc.dt`Left skewed`,
            doc.dd`Extreme values on the left side, concentrated on the right`,
          ),
        ),
      ),
    ),
  );
}
