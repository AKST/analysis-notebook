/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';

export const usFederalBudget2018 = text.figure(
  doc.table({ className: 'setupTable paddedTable' })(
    doc.tr(
      doc.th``,
      doc.th`Percentage of GDP`,
      doc.th`Dollars per person`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 })``,
    ),
    doc.tr(
      doc.th({ style: 'background: deeppink' })`Total expenditures`,
      doc.td`20.0`,
      doc.td`12,550`,
    ),
    doc.tr(
      doc.th`Health (including Medicare)`,
      doc.td`5.6`,
      doc.td`3,480`,
    ),
    doc.tr(
      doc.th`Social Security`,
      doc.td`4.8`,
      doc.td`3,020`,
    ),
    doc.tr(
      doc.th`National defence`,
      doc.td`3.1`,
      doc.td`1,930`,
    ),
    doc.tr(
      doc.th`Income security`,
      doc.td`2.4`,
      doc.td`1,510`,
    ),
    doc.tr(
      doc.th`Net interest`,
      doc.td`1.6`,
      doc.td`990`,
    ),
    doc.tr(
      doc.th`Other`,
      doc.td`2.6`,
      doc.td`1,620`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 })``,
    ),
    doc.tr(
      doc.th({ style: 'background: deeppink' })`Total revenues`,
      doc.td`16.2`,
      doc.td`10,170`,
    ),
    doc.tr(
      doc.th`Individual income taxes`,
      doc.td`8.2`,
      doc.td`5,140`,
    ),
    doc.tr(
      doc.th`Social insurance and retirement receipts`,
      doc.td`5.7`,
      doc.td`3,580`,
    ),
    doc.tr(
      doc.th`Corporate income taxes`,
      doc.td`1.0`,
      doc.td`630`,
    ),
    doc.tr(
      doc.th`Other`,
      doc.td`1.3`,
      doc.td`830`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 })``,
    ),
    doc.tr(
      doc.th({ style: 'background: deeppink' })`Budget deficit`,
      doc.td`−3.8`,
      doc.td`−2,380`,
    ),
  ),
  doc.figcaption`The U.S. Federal Government Budget, 2018`,
);
