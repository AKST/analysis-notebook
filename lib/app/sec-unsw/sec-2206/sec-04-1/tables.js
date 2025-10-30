/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { doc, table } from '@app/prelude.js';
import { components } from '../prelude.js';

const { todo } = components;

export const example = doc.figure(
  todo({}, 'write me'),
  doc.figcaption`dummy`,
);
