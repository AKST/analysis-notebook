/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { table, doc } from '@app/prelude.js';
import { components } from '../prelude.js';

const { todo } = components;

export const stataOutputExample = doc.figure(
  table(['', 'Coefficent', 'Std. Err.', 't', 'P>|t|', 'L 95 CI', 'R 95 CI'], [
    ['x₁', .2566717, .0345167, 7.44, 0.000, .1886224, .3247209],
    ['Intercept', 4.821997, .2883396, 16.72, 0.000, 4.253538, 5.390455],
  ], { firstColumnHeader: true, style: 'width: 100%' }),
  doc.figcaption`Example of stata output`,
);

export const significaneLevelTable = doc.figure(
  todo({}, 'Slide 17, Significance Table'),
  doc.figcaption`Significane Level Table`,
);

const criticalLevelHeaders = ['df', '.10', '.05', '.025', '.01', '.005'];

const criticalLevelRows = [
  ['1',  '3.078', '6.314', '12.706', '31.821', '63.657'],
  ['2',  '1.886', '2.920', '4.303',  '6.965',  '9.925'],
  ['3',  '1.638', '2.353', '3.182',  '4.541',  '5.841'],
  ['4',  '1.533', '2.132', '2.776',  '3.747',  '4.604'],
  ['5',  '1.476', '2.015', '2.571',  '3.365',  '4.032'],
  ['6',  '1.440', '1.943', '2.447',  '3.143',  '3.707'],
  ['7',  '1.415', '1.895', '2.365',  '2.998',  '3.499'],
  ['8',  '1.397', '1.860', '2.306',  '2.896',  '3.355'],
  ['9',  '1.383', '1.833', '2.262',  '2.821',  '3.250'],
  ['10', '1.372', '1.812', '2.228',  '2.764',  '3.169'],
  ['12', '1.356', '1.782', '2.179',  '2.681',  '3.055'],
  ['15', '1.341', '1.753', '2.131',  '2.602',  '2.947'],
  ['20', '1.325', '1.725', '2.086',  '2.528',  '2.845'],
  ['25', '1.316', '1.708', '2.060',  '2.485',  '2.787'],
  ['30', '1.310', '1.697', '2.042',  '2.457',  '2.750'],
  ['40', '1.303', '1.684', '2.021',  '2.423',  '2.704'],
  ['60', '1.296', '1.671', '2.000',  '2.390',  '2.660'],
  ['∞',  '1.282', '1.645', '1.960',  '2.326',  '2.576'],
];

export const significanceTable = doc.figure(
  table(criticalLevelHeaders, criticalLevelRows, {
    style: 'width: 100%',
    firstColumnHeader: true,
    headerRows: [
      [0, [
        '2-tailed α: .20  .10  .05  .02  .01'
      ]],
    ],
  }),
  doc.figcaption`Significance level table`
);

const dDf = doc.th({ className: 'denominator-df', rowSpan: 35 }).of(
  doc.span`Degrees of Freedom (Denominator)`
);

export const criticalValuesFDistribution10p = doc.figure(
  doc.table.attr({ className: 'fDistributionTable' })(
    doc.tr(
      doc.th`df₂\\df₁`,
      doc.th({ colSpan: 11 })`Degrees of Freedom (Numerator)`,
    ),
    doc.tr(
      doc.th({ colSpan: 2 })``,
      doc.th`1`,
      doc.th`2`,
      doc.th`3`,
      doc.th`4`,
      doc.th`5`,
      doc.th`6`,
      doc.th`7`,
      doc.th`8`,
      doc.th`9`,
      doc.th`10`,
    ),
    doc.tr(dDf, doc.th`1`, doc.td`39.86`, doc.td`49.50`, doc.td`53.59`, doc.td`55.83`, doc.td`57.24`, doc.td`58.20`, doc.td`58.91`, doc.td`59.44`, doc.td`59.86`, doc.td`60.19`),
    doc.tr(doc.th`2`, doc.td`8.53`, doc.td`9.00`, doc.td`9.16`, doc.td`9.24`, doc.td`9.29`, doc.td`9.33`, doc.td`9.35`, doc.td`9.37`, doc.td`9.38`, doc.td`9.39`),
    doc.tr(doc.th`3`, doc.td`5.54`, doc.td`5.46`, doc.td`5.39`, doc.td`5.34`, doc.td`5.31`, doc.td`5.28`, doc.td`5.27`, doc.td`5.25`, doc.td`5.24`, doc.td`5.23`),
    doc.tr(doc.th`4`, doc.td`4.54`, doc.td`4.32`, doc.td`4.19`, doc.td`4.11`, doc.td`4.05`, doc.td`4.01`, doc.td`3.98`, doc.td`3.95`, doc.td`3.94`, doc.td`3.92`),
    doc.tr(doc.th`5`, doc.td`4.06`, doc.td`3.78`, doc.td`3.62`, doc.td`3.52`, doc.td`3.45`, doc.td`3.40`, doc.td`3.37`, doc.td`3.34`, doc.td`3.32`, doc.td`3.30`),
    doc.tr(doc.th`6`, doc.td`3.78`, doc.td`3.46`, doc.td`3.29`, doc.td`3.18`, doc.td`3.11`, doc.td`3.05`, doc.td`3.01`, doc.td`2.98`, doc.td`2.96`, doc.td`2.94`),
    doc.tr(doc.th`7`, doc.td`3.59`, doc.td`3.26`, doc.td`3.07`, doc.td`2.96`, doc.td`2.88`, doc.td`2.83`, doc.td`2.78`, doc.td`2.75`, doc.td`2.72`, doc.td`2.70`),
    doc.tr(doc.th`8`, doc.td`3.46`, doc.td`3.11`, doc.td`2.92`, doc.td`2.81`, doc.td`2.73`, doc.td`2.67`, doc.td`2.62`, doc.td`2.59`, doc.td`2.56`, doc.td`2.54`),
    doc.tr(doc.th`9`, doc.td`3.36`, doc.td`3.01`, doc.td`2.81`, doc.td`2.69`, doc.td`2.61`, doc.td`2.55`, doc.td`2.51`, doc.td`2.47`, doc.td`2.44`, doc.td`2.42`),
    doc.tr(doc.th`10`, doc.td`3.29`, doc.td`2.92`, doc.td`2.73`, doc.td`2.61`, doc.td`2.52`, doc.td`2.46`, doc.td`2.41`, doc.td`2.38`, doc.td`2.35`, doc.td`2.32`),
    doc.tr(doc.th`11`, doc.td`3.23`, doc.td`2.86`, doc.td`2.66`, doc.td`2.54`, doc.td`2.45`, doc.td`2.39`, doc.td`2.34`, doc.td`2.30`, doc.td`2.27`, doc.td`2.25`),
    doc.tr(doc.th`12`, doc.td`3.18`, doc.td`2.81`, doc.td`2.61`, doc.td`2.48`, doc.td`2.39`, doc.td`2.33`, doc.td`2.28`, doc.td`2.24`, doc.td`2.21`, doc.td`2.19`),
    doc.tr(doc.th`13`, doc.td`3.14`, doc.td`2.76`, doc.td`2.56`, doc.td`2.43`, doc.td`2.35`, doc.td`2.28`, doc.td`2.23`, doc.td`2.20`, doc.td`2.16`, doc.td`2.14`),
    doc.tr(doc.th`14`, doc.td`3.10`, doc.td`2.73`, doc.td`2.52`, doc.td`2.39`, doc.td`2.31`, doc.td`2.24`, doc.td`2.19`, doc.td`2.15`, doc.td`2.12`, doc.td`2.10`),
    doc.tr(doc.th`15`, doc.td`3.07`, doc.td`2.70`, doc.td`2.49`, doc.td`2.36`, doc.td`2.27`, doc.td`2.21`, doc.td`2.16`, doc.td`2.12`, doc.td`2.09`, doc.td`2.06`),
    doc.tr(doc.th`16`, doc.td`3.05`, doc.td`2.67`, doc.td`2.46`, doc.td`2.33`, doc.td`2.24`, doc.td`2.18`, doc.td`2.13`, doc.td`2.09`, doc.td`2.06`, doc.td`2.03`),
    doc.tr(doc.th`17`, doc.td`3.03`, doc.td`2.64`, doc.td`2.44`, doc.td`2.31`, doc.td`2.22`, doc.td`2.15`, doc.td`2.10`, doc.td`2.06`, doc.td`2.03`, doc.td`2.00`),
    doc.tr(doc.th`18`, doc.td`3.01`, doc.td`2.62`, doc.td`2.42`, doc.td`2.29`, doc.td`2.20`, doc.td`2.13`, doc.td`2.08`, doc.td`2.04`, doc.td`2.00`, doc.td`1.98`),
    doc.tr(doc.th`19`, doc.td`2.99`, doc.td`2.61`, doc.td`2.40`, doc.td`2.27`, doc.td`2.18`, doc.td`2.11`, doc.td`2.06`, doc.td`2.02`, doc.td`1.98`, doc.td`1.96`),
    doc.tr(doc.th`20`, doc.td`2.97`, doc.td`2.59`, doc.td`2.38`, doc.td`2.25`, doc.td`2.16`, doc.td`2.09`, doc.td`2.04`, doc.td`2.00`, doc.td`1.96`, doc.td`1.94`),
    doc.tr(doc.th`21`, doc.td`2.96`, doc.td`2.57`, doc.td`2.36`, doc.td`2.23`, doc.td`2.14`, doc.td`2.08`, doc.td`2.02`, doc.td`1.98`, doc.td`1.95`, doc.td`1.92`),
    doc.tr(doc.th`22`, doc.td`2.95`, doc.td`2.56`, doc.td`2.35`, doc.td`2.22`, doc.td`2.13`, doc.td`2.06`, doc.td`2.01`, doc.td`1.97`, doc.td`1.93`, doc.td`1.90`),
    doc.tr(doc.th`23`, doc.td`2.94`, doc.td`2.55`, doc.td`2.34`, doc.td`2.21`, doc.td`2.11`, doc.td`2.05`, doc.td`1.99`, doc.td`1.95`, doc.td`1.92`, doc.td`1.89`),
    doc.tr(doc.th`24`, doc.td`2.93`, doc.td`2.54`, doc.td`2.33`, doc.td`2.19`, doc.td`2.10`, doc.td`2.04`, doc.td`1.98`, doc.td`1.94`, doc.td`1.91`, doc.td`1.88`),
    doc.tr(doc.th`25`, doc.td`2.92`, doc.td`2.53`, doc.td`2.32`, doc.td`2.18`, doc.td`2.09`, doc.td`2.02`, doc.td`1.97`, doc.td`1.93`, doc.td`1.89`, doc.td`1.87`),
    doc.tr(doc.th`26`, doc.td`2.91`, doc.td`2.52`, doc.td`2.31`, doc.td`2.17`, doc.td`2.08`, doc.td`2.01`, doc.td`1.96`, doc.td`1.92`, doc.td`1.88`, doc.td`1.86`),
    doc.tr(doc.th`27`, doc.td`2.90`, doc.td`2.51`, doc.td`2.30`, doc.td`2.17`, doc.td`2.07`, doc.td`2.00`, doc.td`1.95`, doc.td`1.91`, doc.td`1.87`, doc.td`1.85`),
    doc.tr(doc.th`28`, doc.td`2.89`, doc.td`2.50`, doc.td`2.29`, doc.td`2.16`, doc.td`2.06`, doc.td`2.00`, doc.td`1.94`, doc.td`1.90`, doc.td`1.87`, doc.td`1.84`),
    doc.tr(doc.th`29`, doc.td`2.89`, doc.td`2.50`, doc.td`2.28`, doc.td`2.15`, doc.td`2.06`, doc.td`1.99`, doc.td`1.93`, doc.td`1.89`, doc.td`1.86`, doc.td`1.83`),
    doc.tr(doc.th`30`, doc.td`2.88`, doc.td`2.49`, doc.td`2.28`, doc.td`2.14`, doc.td`2.05`, doc.td`1.98`, doc.td`1.93`, doc.td`1.88`, doc.td`1.85`, doc.td`1.82`),
    doc.tr(doc.th`40`, doc.td`2.84`, doc.td`2.44`, doc.td`2.23`, doc.td`2.09`, doc.td`2.00`, doc.td`1.93`, doc.td`1.87`, doc.td`1.83`, doc.td`1.79`, doc.td`1.76`),
    doc.tr(doc.th`60`, doc.td`2.79`, doc.td`2.39`, doc.td`2.18`, doc.td`2.04`, doc.td`1.95`, doc.td`1.87`, doc.td`1.82`, doc.td`1.77`, doc.td`1.74`, doc.td`1.71`),
    doc.tr(doc.th`90`, doc.td`2.76`, doc.td`2.36`, doc.td`2.15`, doc.td`2.01`, doc.td`1.91`, doc.td`1.84`, doc.td`1.78`, doc.td`1.74`, doc.td`1.70`, doc.td`1.67`),
    doc.tr(doc.th`120`, doc.td`2.75`, doc.td`2.35`, doc.td`2.13`, doc.td`1.99`, doc.td`1.90`, doc.td`1.82`, doc.td`1.77`, doc.td`1.72`, doc.td`1.68`, doc.td`1.65`),
    doc.tr(doc.th`∞`, doc.td`2.71`, doc.td`2.30`, doc.td`2.08`, doc.td`1.94`, doc.td`1.85`, doc.td`1.77`, doc.td`1.72`, doc.td`1.67`, doc.td`1.63`, doc.td`1.60`),
  ),
  doc.figcaption`10% critical values F Table distribution`,
);

export const criticalValuesFDistribution5p = doc.figure(
  doc.table.attr({ className: 'fDistributionTable' })(
    doc.tr(
      doc.th`df₂\\df₁`,
      doc.th({ colSpan: 11 })`Numerator Degrees of Freedom`,
    ),
    doc.tr(
      doc.th({ colSpan: 2 })``,
      doc.th`1`,
      doc.th`2`,
      doc.th`3`,
      doc.th`4`,
      doc.th`5`,
      doc.th`6`,
      doc.th`7`,
      doc.th`8`,
      doc.th`9`,
      doc.th`10`,
    ),
    doc.tr(dDf, doc.th`1`, doc.td`161.4`, doc.td`199.5`, doc.td`215.7`, doc.td`224.6`, doc.td`230.2`, doc.td`234.0`, doc.td`236.8`, doc.td`238.9`, doc.td`240.5`, doc.td`241.9`),
    doc.tr(doc.th`2`, doc.td`18.51`, doc.td`19.00`, doc.td`19.16`, doc.td`19.25`, doc.td`19.30`, doc.td`19.33`, doc.td`19.35`, doc.td`19.37`, doc.td`19.38`, doc.td`19.40`),
    doc.tr(doc.th`3`, doc.td`10.13`, doc.td`9.55`, doc.td`9.28`, doc.td`9.12`, doc.td`9.01`, doc.td`8.94`, doc.td`8.89`, doc.td`8.85`, doc.td`8.81`, doc.td`8.79`),
    doc.tr(doc.th`4`, doc.td`7.71`, doc.td`6.94`, doc.td`6.59`, doc.td`6.39`, doc.td`6.26`, doc.td`6.16`, doc.td`6.09`, doc.td`6.04`, doc.td`6.00`, doc.td`5.96`),
    doc.tr(doc.th`5`, doc.td`6.61`, doc.td`5.79`, doc.td`5.41`, doc.td`5.19`, doc.td`5.05`, doc.td`4.95`, doc.td`4.88`, doc.td`4.82`, doc.td`4.77`, doc.td`4.74`),
    doc.tr(doc.th`6`, doc.td`5.99`, doc.td`5.14`, doc.td`4.76`, doc.td`4.53`, doc.td`4.39`, doc.td`4.28`, doc.td`4.21`, doc.td`4.15`, doc.td`4.10`, doc.td`4.06`),
    doc.tr(doc.th`7`, doc.td`5.59`, doc.td`4.74`, doc.td`4.35`, doc.td`4.12`, doc.td`3.97`, doc.td`3.87`, doc.td`3.79`, doc.td`3.73`, doc.td`3.68`, doc.td`3.64`),
    doc.tr(doc.th`8`, doc.td`5.32`, doc.td`4.46`, doc.td`4.07`, doc.td`3.84`, doc.td`3.69`, doc.td`3.58`, doc.td`3.50`, doc.td`3.44`, doc.td`3.39`, doc.td`3.35`),
    doc.tr(doc.th`9`, doc.td`5.12`, doc.td`4.26`, doc.td`3.86`, doc.td`3.63`, doc.td`3.48`, doc.td`3.37`, doc.td`3.29`, doc.td`3.23`, doc.td`3.18`, doc.td`3.14`),
    doc.tr(doc.th`10`, doc.td`4.96`, doc.td`4.10`, doc.td`3.71`, doc.td`3.48`, doc.td`3.33`, doc.td`3.22`, doc.td`3.14`, doc.td`3.07`, doc.td`3.02`, doc.td`2.98`),
    doc.tr(doc.th`11`, doc.td`4.84`, doc.td`3.98`, doc.td`3.59`, doc.td`3.36`, doc.td`3.20`, doc.td`3.09`, doc.td`3.01`, doc.td`2.95`, doc.td`2.90`, doc.td`2.85`),
    doc.tr(doc.th`12`, doc.td`4.75`, doc.td`3.89`, doc.td`3.49`, doc.td`3.26`, doc.td`3.11`, doc.td`3.00`, doc.td`2.91`, doc.td`2.85`, doc.td`2.80`, doc.td`2.75`),
    doc.tr(doc.th`13`, doc.td`4.67`, doc.td`3.81`, doc.td`3.41`, doc.td`3.18`, doc.td`3.03`, doc.td`2.92`, doc.td`2.83`, doc.td`2.77`, doc.td`2.71`, doc.td`2.67`),
    doc.tr(doc.th`14`, doc.td`4.60`, doc.td`3.74`, doc.td`3.34`, doc.td`3.11`, doc.td`2.96`, doc.td`2.85`, doc.td`2.76`, doc.td`2.70`, doc.td`2.65`, doc.td`2.60`),
    doc.tr(doc.th`15`, doc.td`4.54`, doc.td`3.68`, doc.td`3.29`, doc.td`3.06`, doc.td`2.90`, doc.td`2.79`, doc.td`2.71`, doc.td`2.64`, doc.td`2.59`, doc.td`2.54`),
    doc.tr(doc.th`16`, doc.td`4.49`, doc.td`3.63`, doc.td`3.24`, doc.td`3.01`, doc.td`2.85`, doc.td`2.74`, doc.td`2.66`, doc.td`2.59`, doc.td`2.54`, doc.td`2.49`),
    doc.tr(doc.th`17`, doc.td`4.45`, doc.td`3.59`, doc.td`3.20`, doc.td`2.96`, doc.td`2.81`, doc.td`2.70`, doc.td`2.61`, doc.td`2.55`, doc.td`2.49`, doc.td`2.45`),
    doc.tr(doc.th`18`, doc.td`4.41`, doc.td`3.55`, doc.td`3.16`, doc.td`2.93`, doc.td`2.77`, doc.td`2.66`, doc.td`2.58`, doc.td`2.51`, doc.td`2.46`, doc.td`2.41`),
    doc.tr(doc.th`19`, doc.td`4.38`, doc.td`3.52`, doc.td`3.13`, doc.td`2.90`, doc.td`2.74`, doc.td`2.63`, doc.td`2.54`, doc.td`2.48`, doc.td`2.42`, doc.td`2.38`),
    doc.tr(doc.th`20`, doc.td`4.35`, doc.td`3.49`, doc.td`3.10`, doc.td`2.87`, doc.td`2.71`, doc.td`2.60`, doc.td`2.51`, doc.td`2.45`, doc.td`2.39`, doc.td`2.35`),
    doc.tr(doc.th`21`, doc.td`4.32`, doc.td`3.47`, doc.td`3.07`, doc.td`2.84`, doc.td`2.68`, doc.td`2.57`, doc.td`2.49`, doc.td`2.42`, doc.td`2.37`, doc.td`2.32`),
    doc.tr(doc.th`22`, doc.td`4.30`, doc.td`3.44`, doc.td`3.05`, doc.td`2.82`, doc.td`2.66`, doc.td`2.55`, doc.td`2.46`, doc.td`2.40`, doc.td`2.34`, doc.td`2.30`),
    doc.tr(doc.th`23`, doc.td`4.28`, doc.td`3.42`, doc.td`3.03`, doc.td`2.80`, doc.td`2.64`, doc.td`2.53`, doc.td`2.44`, doc.td`2.37`, doc.td`2.32`, doc.td`2.27`),
    doc.tr(doc.th`24`, doc.td`4.26`, doc.td`3.40`, doc.td`3.01`, doc.td`2.78`, doc.td`2.62`, doc.td`2.51`, doc.td`2.42`, doc.td`2.36`, doc.td`2.30`, doc.td`2.25`),
    doc.tr(doc.th`25`, doc.td`4.24`, doc.td`3.39`, doc.td`2.99`, doc.td`2.76`, doc.td`2.60`, doc.td`2.49`, doc.td`2.40`, doc.td`2.34`, doc.td`2.28`, doc.td`2.24`),
    doc.tr(doc.th`26`, doc.td`4.23`, doc.td`3.37`, doc.td`2.98`, doc.td`2.74`, doc.td`2.59`, doc.td`2.47`, doc.td`2.39`, doc.td`2.32`, doc.td`2.27`, doc.td`2.22`),
    doc.tr(doc.th`27`, doc.td`4.21`, doc.td`3.35`, doc.td`2.96`, doc.td`2.73`, doc.td`2.57`, doc.td`2.46`, doc.td`2.37`, doc.td`2.31`, doc.td`2.25`, doc.td`2.20`),
    doc.tr(doc.th`28`, doc.td`4.20`, doc.td`3.34`, doc.td`2.95`, doc.td`2.71`, doc.td`2.56`, doc.td`2.45`, doc.td`2.36`, doc.td`2.29`, doc.td`2.24`, doc.td`2.19`),
    doc.tr(doc.th`29`, doc.td`4.18`, doc.td`3.33`, doc.td`2.93`, doc.td`2.70`, doc.td`2.55`, doc.td`2.43`, doc.td`2.35`, doc.td`2.28`, doc.td`2.22`, doc.td`2.18`),
    doc.tr(doc.th`30`, doc.td`4.17`, doc.td`3.32`, doc.td`2.92`, doc.td`2.69`, doc.td`2.53`, doc.td`2.42`, doc.td`2.33`, doc.td`2.27`, doc.td`2.21`, doc.td`2.16`),
    doc.tr(doc.th`40`, doc.td`4.08`, doc.td`3.23`, doc.td`2.84`, doc.td`2.61`, doc.td`2.45`, doc.td`2.34`, doc.td`2.25`, doc.td`2.18`, doc.td`2.12`, doc.td`2.08`),
    doc.tr(doc.th`60`, doc.td`4.00`, doc.td`3.15`, doc.td`2.76`, doc.td`2.53`, doc.td`2.37`, doc.td`2.25`, doc.td`2.17`, doc.td`2.10`, doc.td`2.04`, doc.td`1.99`),
    doc.tr(doc.th`90`, doc.td`3.95`, doc.td`3.10`, doc.td`2.71`, doc.td`2.47`, doc.td`2.32`, doc.td`2.20`, doc.td`2.11`, doc.td`2.04`, doc.td`1.99`, doc.td`1.94`),
    doc.tr(doc.th`120`, doc.td`3.92`, doc.td`3.07`, doc.td`2.68`, doc.td`2.45`, doc.td`2.29`, doc.td`2.18`, doc.td`2.09`, doc.td`2.02`, doc.td`1.96`, doc.td`1.91`),
    doc.tr(doc.th`∞`, doc.td`3.84`, doc.td`3.00`, doc.td`2.60`, doc.td`2.37`, doc.td`2.21`, doc.td`2.10`, doc.td`2.01`, doc.td`1.94`, doc.td`1.88`, doc.td`1.83`),
  ),
  doc.figcaption`5% critical values F Table distribution`,
);

export const criticalValuesFDistribution1p = doc.figure(
  doc.table.attr({ className: 'fDistributionTable' })(
    doc.tr(
      doc.th`df₂\\df₁`,
      doc.th``,
      doc.th({ colSpan: 11 })`Numerator Degrees of Freedom`,
    ),
    doc.tr(
      doc.th({ colSpan: 2 })``,
      doc.th`1`,
      doc.th`2`,
      doc.th`3`,
      doc.th`4`,
      doc.th`5`,
      doc.th`6`,
      doc.th`7`,
      doc.th`8`,
      doc.th`9`,
      doc.th`10`,
    ),
    doc.tr(dDf, doc.th`1`, doc.td`4052`, doc.td`4999.5`, doc.td`5403`, doc.td`5625`, doc.td`5764`, doc.td`5859`, doc.td`5928`, doc.td`5982`, doc.td`6022`, doc.td`6056`),
    doc.tr(doc.th`2`, doc.td`98.50`, doc.td`99.00`, doc.td`99.17`, doc.td`99.25`, doc.td`99.30`, doc.td`99.33`, doc.td`99.36`, doc.td`99.37`, doc.td`99.39`, doc.td`99.40`),
    doc.tr(doc.th`3`, doc.td`34.12`, doc.td`30.82`, doc.td`29.46`, doc.td`28.71`, doc.td`28.24`, doc.td`27.91`, doc.td`27.67`, doc.td`27.49`, doc.td`27.35`, doc.td`27.23`),
    doc.tr(doc.th`4`, doc.td`21.20`, doc.td`18.00`, doc.td`16.69`, doc.td`15.98`, doc.td`15.52`, doc.td`15.21`, doc.td`14.98`, doc.td`14.80`, doc.td`14.66`, doc.td`14.55`),
    doc.tr(doc.th`5`, doc.td`16.26`, doc.td`13.27`, doc.td`12.06`, doc.td`11.39`, doc.td`10.97`, doc.td`10.67`, doc.td`10.46`, doc.td`10.29`, doc.td`10.16`, doc.td`10.05`),
    doc.tr(doc.th`6`, doc.td`13.75`, doc.td`10.92`, doc.td`9.78`, doc.td`9.15`, doc.td`8.75`, doc.td`8.47`, doc.td`8.26`, doc.td`8.10`, doc.td`7.98`, doc.td`7.87`),
    doc.tr(doc.th`7`, doc.td`12.25`, doc.td`9.55`, doc.td`8.45`, doc.td`7.85`, doc.td`7.46`, doc.td`7.19`, doc.td`6.99`, doc.td`6.84`, doc.td`6.72`, doc.td`6.62`),
    doc.tr(doc.th`8`, doc.td`11.26`, doc.td`8.65`, doc.td`7.59`, doc.td`7.01`, doc.td`6.63`, doc.td`6.37`, doc.td`6.18`, doc.td`6.03`, doc.td`5.91`, doc.td`5.81`),
    doc.tr(doc.th`9`, doc.td`10.56`, doc.td`8.02`, doc.td`6.99`, doc.td`6.42`, doc.td`6.06`, doc.td`5.80`, doc.td`5.61`, doc.td`5.47`, doc.td`5.35`, doc.td`5.26`),
    doc.tr(doc.th`10`, doc.td`10.04`, doc.td`7.56`, doc.td`6.55`, doc.td`5.99`, doc.td`5.64`, doc.td`5.39`, doc.td`5.20`, doc.td`5.06`, doc.td`4.94`, doc.td`4.85`),
    doc.tr(doc.th`11`, doc.td`9.65`, doc.td`7.21`, doc.td`6.22`, doc.td`5.67`, doc.td`5.32`, doc.td`5.07`, doc.td`4.89`, doc.td`4.74`, doc.td`4.63`, doc.td`4.54`),
    doc.tr(doc.th`12`, doc.td`9.33`, doc.td`6.93`, doc.td`5.95`, doc.td`5.41`, doc.td`5.06`, doc.td`4.82`, doc.td`4.64`, doc.td`4.50`, doc.td`4.39`, doc.td`4.30`),
    doc.tr(doc.th`13`, doc.td`9.07`, doc.td`6.70`, doc.td`5.74`, doc.td`5.21`, doc.td`4.86`, doc.td`4.62`, doc.td`4.44`, doc.td`4.30`, doc.td`4.19`, doc.td`4.10`),
    doc.tr(doc.th`14`, doc.td`8.86`, doc.td`6.51`, doc.td`5.56`, doc.td`5.04`, doc.td`4.69`, doc.td`4.46`, doc.td`4.28`, doc.td`4.14`, doc.td`4.03`, doc.td`3.94`),
    doc.tr(doc.th`15`, doc.td`8.68`, doc.td`6.36`, doc.td`5.42`, doc.td`4.89`, doc.td`4.56`, doc.td`4.32`, doc.td`4.14`, doc.td`4.00`, doc.td`3.89`, doc.td`3.80`),
    doc.tr(doc.th`16`, doc.td`8.53`, doc.td`6.23`, doc.td`5.29`, doc.td`4.77`, doc.td`4.44`, doc.td`4.20`, doc.td`4.03`, doc.td`3.89`, doc.td`3.78`, doc.td`3.69`),
    doc.tr(doc.th`17`, doc.td`8.40`, doc.td`6.11`, doc.td`5.18`, doc.td`4.67`, doc.td`4.34`, doc.td`4.10`, doc.td`3.93`, doc.td`3.79`, doc.td`3.68`, doc.td`3.59`),
    doc.tr(doc.th`18`, doc.td`8.29`, doc.td`6.01`, doc.td`5.09`, doc.td`4.58`, doc.td`4.25`, doc.td`4.01`, doc.td`3.84`, doc.td`3.71`, doc.td`3.60`, doc.td`3.51`),
    doc.tr(doc.th`19`, doc.td`8.18`, doc.td`5.93`, doc.td`5.01`, doc.td`4.50`, doc.td`4.17`, doc.td`3.94`, doc.td`3.77`, doc.td`3.63`, doc.td`3.52`, doc.td`3.43`),
    doc.tr(doc.th`20`, doc.td`8.10`, doc.td`5.85`, doc.td`4.94`, doc.td`4.43`, doc.td`4.10`, doc.td`3.87`, doc.td`3.70`, doc.td`3.56`, doc.td`3.46`, doc.td`3.37`),
    doc.tr(doc.th`21`, doc.td`8.02`, doc.td`5.78`, doc.td`4.87`, doc.td`4.37`, doc.td`4.04`, doc.td`3.81`, doc.td`3.64`, doc.td`3.51`, doc.td`3.40`, doc.td`3.31`),
    doc.tr(doc.th`22`, doc.td`7.95`, doc.td`5.72`, doc.td`4.82`, doc.td`4.31`, doc.td`3.99`, doc.td`3.76`, doc.td`3.59`, doc.td`3.45`, doc.td`3.35`, doc.td`3.26`),
    doc.tr(doc.th`23`, doc.td`7.88`, doc.td`5.66`, doc.td`4.76`, doc.td`4.26`, doc.td`3.94`, doc.td`3.71`, doc.td`3.54`, doc.td`3.41`, doc.td`3.30`, doc.td`3.21`),
    doc.tr(doc.th`24`, doc.td`7.82`, doc.td`5.61`, doc.td`4.72`, doc.td`4.22`, doc.td`3.90`, doc.td`3.67`, doc.td`3.50`, doc.td`3.36`, doc.td`3.26`, doc.td`3.17`),
    doc.tr(doc.th`25`, doc.td`7.77`, doc.td`5.57`, doc.td`4.68`, doc.td`4.18`, doc.td`3.85`, doc.td`3.63`, doc.td`3.46`, doc.td`3.32`, doc.td`3.22`, doc.td`3.13`),
    doc.tr(doc.th`26`, doc.td`7.72`, doc.td`5.53`, doc.td`4.64`, doc.td`4.14`, doc.td`3.82`, doc.td`3.59`, doc.td`3.42`, doc.td`3.29`, doc.td`3.18`, doc.td`3.09`),
    doc.tr(doc.th`27`, doc.td`7.68`, doc.td`5.49`, doc.td`4.60`, doc.td`4.11`, doc.td`3.78`, doc.td`3.56`, doc.td`3.39`, doc.td`3.26`, doc.td`3.15`, doc.td`3.06`),
    doc.tr(doc.th`28`, doc.td`7.64`, doc.td`5.45`, doc.td`4.57`, doc.td`4.07`, doc.td`3.75`, doc.td`3.53`, doc.td`3.36`, doc.td`3.23`, doc.td`3.12`, doc.td`3.03`),
    doc.tr(doc.th`29`, doc.td`7.60`, doc.td`5.42`, doc.td`4.54`, doc.td`4.04`, doc.td`3.73`, doc.td`3.50`, doc.td`3.33`, doc.td`3.20`, doc.td`3.09`, doc.td`3.00`),
    doc.tr(doc.th`30`, doc.td`7.56`, doc.td`5.39`, doc.td`4.51`, doc.td`4.02`, doc.td`3.70`, doc.td`3.47`, doc.td`3.30`, doc.td`3.17`, doc.td`3.07`, doc.td`2.98`),
    doc.tr(doc.th`40`, doc.td`7.31`, doc.td`5.18`, doc.td`4.31`, doc.td`3.83`, doc.td`3.51`, doc.td`3.29`, doc.td`3.12`, doc.td`2.99`, doc.td`2.89`, doc.td`2.80`),
    doc.tr(doc.th`60`, doc.td`7.08`, doc.td`4.98`, doc.td`4.13`, doc.td`3.65`, doc.td`3.34`, doc.td`3.12`, doc.td`2.95`, doc.td`2.82`, doc.td`2.72`, doc.td`2.63`),
    doc.tr(doc.th`90`, doc.td`6.93`, doc.td`4.85`, doc.td`4.01`, doc.td`3.53`, doc.td`3.23`, doc.td`3.01`, doc.td`2.84`, doc.td`2.72`, doc.td`2.61`, doc.td`2.52`),
    doc.tr(doc.th`120`, doc.td`6.85`, doc.td`4.79`, doc.td`3.95`, doc.td`3.48`, doc.td`3.17`, doc.td`2.96`, doc.td`2.79`, doc.td`2.66`, doc.td`2.56`, doc.td`2.47`),
    doc.tr(doc.th`∞`, doc.td`6.63`, doc.td`4.61`, doc.td`3.78`, doc.td`3.32`, doc.td`3.02`, doc.td`2.80`, doc.td`2.64`, doc.td`2.51`, doc.td`2.41`, doc.td`2.32`),
  ),
  doc.figcaption`1% critical values F Table distribution`,
);
