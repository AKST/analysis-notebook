/**
 * @import { E } from '@app/prelude-type.ts';
 */
import { doc } from '@app/prelude.js';
import { twoColumns, container } from '@prelude-uni/layout.js';

/**
 * @returns {E.Item}
 */
export function render() {
  return doc.details({ name: 'week', className: 'dashbox' }).c(
    doc.summary.c(doc.h2`Week 1`),
    container(
      twoColumns(
        container(
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
        container(
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
