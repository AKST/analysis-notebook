/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { doc, table } from '@app/prelude.js';
import { text, todo } from '@prelude-uni/components.js';

export const example = text.figure(
  todo({}, 'write me'),
  doc.figcaption`dummy`,
);
