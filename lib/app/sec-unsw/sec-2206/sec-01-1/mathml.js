/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { doc, table } from '@app/prelude.js';
import { todo } from '@prelude-uni/components.js';

export const noop = doc.figure(
  todo({}, 'Noop'),
  doc.figcaption`noop`,
);
