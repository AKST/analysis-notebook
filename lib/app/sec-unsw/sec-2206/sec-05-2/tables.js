/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { doc, table } from '@app/prelude.js';
import { todo } from '@prelude-uni/components.js';

export const example = doc.figure(
  todo({}, 'write me'),
  doc.figcaption`dummy`,
);
