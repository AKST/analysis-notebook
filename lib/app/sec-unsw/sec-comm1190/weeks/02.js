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
  return doc.details({ name: 'week', className: 'dashbox' }).c(
    doc.summary.c(doc.h2`Week 2 — Descriptive Stats`),
    container(
      doc.h2`Business Analytics Framework`,
      container(
        doc.h3`Types of data`,
        text.ul(
          doc.li`Quantitative ${text.ul(
            doc.li`${text.b`Discrete`}: limits to how small a change can be`,
            doc.li`${text.b`Continious`}: no limit to how small a change can be`,
          )}`,
          doc.li`Qualitative ${text.ul(
            doc.li`${text.b`Nominal`}: describes charteristics`,
            doc.li`${text.b`Ordinal`}: ranked but descriptive data (neutral, happy, very happy)`,
          )}`,
        ),
      ),
      container(
        doc.h3`Types of Datasets`,
        text.ul(
          doc.li`${text.b`Cross-sectional`}: for each subject we collect one or more variable`,
          doc.li`${text.b`Time series`}: for one subject we collect the same variables over different points in time`,
          doc.li`${text.b`Panel Data`}: for each subject we collect the same variables over different points in time`,
          doc.li`${text.b`Textual Data`}`,
          doc.li`${text.b`Image Data`}`,
          doc.li`etc`,
        ),
      ),
      container(
        doc.h3`Dimentions of Data`,
        text.ul(
          doc.li`${text.b`Completeness`}
            data is comprehensive and meets expectations
          `,
          doc.li`${text.b`Consistency`}
            data across all systems/sourced from different
            places reflects the same information
          `,
          doc.li`${text.b`Conformity`}
            data is following a set of standard data definitions
            like data type, size and format.
          `,
          doc.li`${text.b`Accuracy`}
            data reflects the real world object OR an event being
            described.
          `,
          doc.li`${text.b`Integrity`}
            all data in a database can be traced and
            connected to other data.
          `,
          doc.li`${text.b`Timeliness`}
            informaiton is available when it is expected or needed.
          `,
        ),
      ),
      container(
        doc.h2`Data issues`,
        text.ul(
          doc.li`${text.b`Formatting issues`}`,
          doc.li`${text.b`Data type issues`}`,
          doc.li`${text.b`Missing values`}`,
          doc.li`${text.b`Outliers`}`,
        ),
      ),
      container(
        doc.h3`Techinical Correctness`,
        doc.p`data is techinically correct when`,
        text.ol(
          doc.li`It can be directly recognized as belonging to a certain variable`,
          doc.li`It is stored in a data type that represents the value domain of the real world variable`,
        ),
      ),
      container(
        doc.h3`Missing Data`,
        text.ul(
          doc.li`${text.b`Listwise Deletion`}${text.ul(
            doc.li`Remove records with missing values in any variable`,
            doc.li`
              Straightforward but can lead to significant data loss and bias if
              the missing data are not completly random
            `,
          )}`,
          doc.li`${text.b`Meand/Median/Mode Imputation`}${text.ul(
            doc.li`${text.b`Continious`}: Replace missingg value with the mean`,
            doc.li`${text.b`Skewed Continious`}: Replace with median`,
            doc.li`${text.b`Categorical Variables`}: Replace with Mode`,
            doc.li`Simple but can underestimate variablility and lead to baised estimates`,
          )}`,
        ),
      ),
      doc.h3`Summary statistics`,
      doc.h4`Mean — location measure`,
      math.meanFormular,
      doc.h4`Variance — dispersion measure`,
      math.varFormular,
      doc.h4`Standard deviation`,
      math.stddevFormular,
      doc.p`The standard deviation is the most common measure of risk`,
      doc.h4`Skewness`,
      math.skewness,
      text.ul(
        doc.li`ɣ̂ < 0 means left skew`,
        doc.li`ɣ̂ = 0 means no skew`,
        doc.li`ɣ̂ > 0 means right skew`,
      ),
      doc.h4`NTiles`,
      doc.p`data is sorted and split into equally sized portions`,
      text.ul(
        doc.li`Quantilies — 4 portions`,
        doc.li`Percentiles — 100 portions`,
      ),
      doc.p`${text.b`Interquartile range (IQR)`}
        is the difference between the 3rd and 1st quartile
      `,
      doc.h3`Dealing with Outliers`,
      text.ul(
        doc.li`${text.b`Drop the record`}
          Completely remove the record
        `,
        doc.li`${text.b`Winsorization`}
          Cap your outliers data, by limiting the range (idk).
        `,
        doc.li`${text.b`Imputation`}
          Assign a new value (as arbitrary as it sounds)
        `,
      ),
      doc.h2`Data Privacy`,
      text.ul(
        doc.li`${text.b`Notice`}:
          Inform users about privacy policy, privacy protection
          procedures e.g. who will be collecting dat, how data
          will be collected, who owns data.
        `,
        doc.li`${text.b`Choice and consent`}:
          Consent from indivisuals about the collection,
          use, disclosure, and retention of their information.
        `,
        doc.li`${text.b`Use and retention`}:
          data should be retained and projected according to
          law or business practices required e.g. the length
          or business practices required e.g. length of data
          retention; avoid secondary use of data for other
          purposes.
        `,
        doc.li`${text.b`Access`}:
          provide acceess to indivisuals with the access to review,
          update, and modify the data about their personal information.
        `,
        doc.li`${text.b`Protection`}:
          data is sued only for the purpose stated; de-identifiable
          of sensitive infomraiotn; users have the right to opt out
          for the user of their data.
        `,
        doc.li`${text.b`Enforcement and Redress`}:
          provide channels for indivisuals to report provide
          feedback, or complain.
        `,
      ),
      doc.h2`Data Security`,
      doc.h3`Austrlian Security principals`,
      doc.p`Protect consumer against`,
      text.ol(
        doc.li`Misuse`,
        doc.li`Interference`,
        doc.li`Loss`,
        doc.li`Unauthorised Access`,
        doc.li`Unauthorised Modification`,
        doc.li`Unauthorised disclosure`,
      ),
    ),
  );
}
