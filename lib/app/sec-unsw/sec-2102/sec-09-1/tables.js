/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';

export const wheatHarvests = text.figure(
  doc.table({ className: 'paddedTable' }).of(
    doc.tr(
      doc.th`Year`,
      doc.th`1`,
      doc.th`2`,
      doc.th`3`,
      doc.th`4`,
      doc.th`5`,
      doc.th`6`,
    ),
    doc.tr(
      doc.th({ colSpan: 7 }).t`Wheat harvest`,
    ),
    doc.tr(
      doc.th`Oddtopia`,
      doc.td`100`,
      doc.td`0`,
      doc.td`100`,
      doc.td`0`,
      doc.td`100`,
      doc.td`0`,
    ),
    doc.tr(
      doc.th`Eventopia`,
      doc.td`0`,
      doc.td`100`,
      doc.td`0`,
      doc.td`100`,
      doc.td`0`,
      doc.td`100`,
    ),
    doc.tr(
      doc.th({ colSpan: 7 }).t`Trade balance`,
    ),
    doc.tr(
      doc.th`Oddtopia`,
      doc.td.of(doc.font({ color: 'green' }).t`+50`),
      doc.td.of(doc.font({ color: 'red' }).t`−50`),
      doc.td.of(doc.font({ color: 'green' }).t`+50`),
      doc.td.of(doc.font({ color: 'red' }).t`−50`),
      doc.td.of(doc.font({ color: 'green' }).t`+50`),
      doc.td.of(doc.font({ color: 'red' }).t`−50`),
    ),
    doc.tr(
      doc.th`Eventopia`,
      doc.td.of(doc.font({ color: 'red' }).t`−50`),
      doc.td.of(doc.font({ color: 'green' }).t`+50`),
      doc.td.of(doc.font({ color: 'red' }).t`−50`),
      doc.td.of(doc.font({ color: 'green' }).t`+50`),
      doc.td.of(doc.font({ color: 'red' }).t`−50`),
      doc.td.of(doc.font({ color: 'green' }).t`+50`),
    ),
    doc.tr(
      doc.th({ colSpan: 7 }).t`Consumption`,
    ),
    doc.tr(
      doc.th`Oddtopia`,
      doc.td`50`,
      doc.td`50`,
      doc.td`50`,
      doc.td`50`,
      doc.td`50`,
      doc.td`50`,
    ),
    doc.tr(
      doc.th`Eventopia`,
      doc.td`50`,
      doc.td`50`,
      doc.td`50`,
      doc.td`50`,
      doc.td`50`,
      doc.td`50`,
    ),
  ),
  doc.figcaption`Wheat Harvests in Oddtopia and Eventopia`,
);

export const northSouthSetup = text.figure(
  doc.table({ className: 'setupTable paddedTable' }).of(
    doc.tr(
      doc.th``,
      doc.th`North`,
      doc.th`South`,
    ),
    doc.tr(
      doc.th`Labor force`,
      doc.td`100`,
      doc.td`400`,
    ),
    doc.tr(
      doc.th`Number of apples one worker can produce`,
      doc.td`160`,
      doc.td`100`,
    ),
    doc.tr(
      doc.th`Number of computers one worker can produce`,
      doc.td`16`,
      doc.td`2`,
    ),
  ),
  doc.figcaption`The Setup of the North–South Example`,
);

export const northSouthAutarky = text.figure(
  doc.table({ className: 'really-wide setupTable' }).of(
    doc.tr(
      doc.th``,
      doc.th`North`,
      doc.th`South`,
    ),
    doc.tr(
      doc.th`Wage, w`,
      doc.td`160 🍎`,
      doc.td`100 🍎`,
    ),
    doc.tr(
      doc.th`Price of a computer, p`,
      doc.td`10 🍎`,
      doc.td`50 🍎`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 }).t``,
    ),
    doc.tr(
      doc.th`Consumption of apples (per person)`,
      doc.td`80 🍎`,
      doc.td`50 🍎`,
    ),
    doc.tr(
      doc.th`Consumption of computers (per person)`,
      doc.td`8 💻`,
      doc.td`1 💻`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 }).t``,
    ),
    doc.tr(
      doc.th`Fraction of labor working to produce apples`,
      doc.td`50%`,
      doc.td`50%`,
    ),
    doc.tr(
      doc.th`Fraction of labor working to produce computers`,
      doc.td`50%`,
      doc.td`50%`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 }).t``,
    ),
    doc.tr(
      doc.th`Total production in the apple sector`,
      doc.td`8,000 🍎`,
      doc.td`20,000 🍎`,
    ),
    doc.tr(
      doc.th`Total production in the computer sector`,
      doc.td`800 💻`,
      doc.td`400 💻`,
    ),
  ),
  doc.figcaption`The North and the South under Autarky`,
);

export const northSouthFreeTrade = text.figure(
  doc.table({ className: 'really-wide setupTable' }).of(
    doc.tr(
      doc.th``,
      doc.th`North`,
      doc.th`South`,
    ),
    doc.tr(
      doc.th`Fraction of labor working to produce apples`,
      doc.td`0%`,
      doc.td`100%`,
    ),
    doc.tr(
      doc.th`Fraction of labor working to produce computers`,
      doc.td`100%`,
      doc.td`0%`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 }).t``,
    ),
    doc.tr(
      doc.th`Total production in the apple sector`,
      doc.td`0 🍎`,
      doc.td`40,000 🍎`,
    ),
    doc.tr(
      doc.th`Total production in the computer sector`,
      doc.td`1,600 💻`,
      doc.td`0 💻`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 }).t``,
    ),
    doc.tr(
      doc.th`Wage, w`,
      doc.td`400 🍎`,
      doc.td`100 🍎`,
    ),
    doc.tr(
      doc.th`World price of a computer, p`,
      doc.td({ colSpan: 2 }).t`25 🍎 per 💻`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 }).t``,
    ),
    doc.tr(
      doc.th`Consumption of apples (per person)`,
      doc.td.of(doc.b`200 🍎`),
      doc.td`50 🍎`,
    ),
    doc.tr(
      doc.th`Consumption of computers (per person)`,
      doc.td`8 💻`,
      doc.td.of(doc.b`2 💻`),
    ),
  ),
  doc.figcaption`The North and South with Free Trade`,
);

export const northSouthFreeMigration = text.figure(
  doc.table({ className: 'really-wide setupTable' }).of(
    doc.tr(
      doc.th``,
      doc.th`Workers born in the North`,
      doc.th`Migrants from the South`,
    ),
    doc.tr(
      doc.th`Wage, w`,
      doc.td`160 🍎`,
      doc.td`160 🍎`,
    ),
    doc.tr(
      doc.th`Price of a computer, p`,
      doc.td({ colSpan: 2 }).t`10 🍎`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 }).t``,
    ),
    doc.tr(
      doc.th`Consumption of apples (per person)`,
      doc.td`80 🍎`,
      doc.td`80 🍎`,
    ),
    doc.tr(
      doc.th`Consumption of computers (per person)`,
      doc.td`8 💻`,
      doc.td`8 💻`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 }).t``,
    ),
    doc.tr(
      doc.th`Fraction of labor working to produce apples`,
      doc.td({ colSpan: 2 }).t`50%`,
    ),
    doc.tr(
      doc.th`Fraction of labor working to produce computers`,
      doc.td({ colSpan: 2 }).t`50%`,
    ),
    doc.tr(
      doc.th({ colSpan: 3 }).t``,
    ),
    doc.tr(
      doc.th`Total production in the apple sector`,
      doc.td({ colSpan: 2 }).t`40,000 🍎`,
    ),
    doc.tr(
      doc.th`Total production in the computer sector`,
      doc.td({ colSpan: 2 }).t`4,000 💻`,
    ),
  ),
  doc.figcaption`Northern and Southern Workers with Free Migration`,
);
