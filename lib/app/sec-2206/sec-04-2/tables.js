/**
 * @import { E } from '../../prelude-type.ts';
 */

import { doc, table } from '../../prelude.js';
import { components } from '../prelude.js';

const { todo } = components;

export const example = doc.figure(
  todo({}, 'write me'),
  'dummy',
);
