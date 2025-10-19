/**
 * @import { E } from '../../prelude-type.ts';
 */

import { doc, table } from '../../prelude.js';
import { components } from '../prelude.js';

const { todo } = components;

export const example = doc._figure(
  todo({}, 'write me'),
  doc.figcaption`dummy`,
);
