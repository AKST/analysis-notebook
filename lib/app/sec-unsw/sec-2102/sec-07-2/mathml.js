/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { doc, table } from '@app/prelude.js';
import { components } from '../prelude.js';

const { todo } = components;

export const noop = doc.figure(
  todo({}, 'Noop'),
  doc.figcaption`noop`,
);
