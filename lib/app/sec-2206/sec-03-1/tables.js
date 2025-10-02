/**
 * @import { E } from '../../prelude-type.ts';
 */

import { doc, table } from '../../prelude.js';
import { components } from '../prelude.js';

const { todo } = components;

export const stataOutputExample = doc.figure(
  todo({}, 'table showing stata output, slide 12'),
  'Example of stata output',
);

export const significaneLevelTable = doc.figure(
  todo({}, 'Slide 17, Significance Table'),
  'Significane Level Table',
);
