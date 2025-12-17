/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { doc } from '@app/prelude.js';
import { text, todo } from '@prelude-uni/components.js';

export const noop = text.figure(
  todo({}, 'Noop'),
  doc.figcaption`noop`,
);
