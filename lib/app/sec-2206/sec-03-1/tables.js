/**
 * @import { E } from '../../prelude-type.ts';
 */

import { doc, table } from '../../prelude.js';
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

