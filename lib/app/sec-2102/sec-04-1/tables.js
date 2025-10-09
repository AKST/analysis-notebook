/**
 * @import { E } from '../../prelude-type.ts';
 */

import { doc, table } from '../../prelude.js';
import { components } from '../prelude.js';

const { clsRef, todo } = components;

export const moneyTerms = doc.figure(
  todo({}, 'Slide 17'),
  clsRef(
    { lec: { id: ['W', 4], slide: 25 } },
    'Different Measure of money'
  ),
);
