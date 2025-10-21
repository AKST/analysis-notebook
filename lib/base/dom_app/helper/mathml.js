/**
 * @import { E } from '../type.ts'
 * @import { Helper } from './type.ts'
 */
import { frag as _frag } from '../core/render.js';
import {
  makeTemplateHelper,
  makeVoidHelper,
  makeHelper,
} from './util.js';

const mathml = {};

mathml.math = makeHelper((attr, body) => ['math', {
  ns: 'http://www.w3.org/1998/Math/MathML',
  display: 'block',
  ...attr,
}, body]);


/**
 * @type {Helper<undefined, [number | string]>}
 */
mathml.mspace = makeHelper((attr, [space]) => {
  let width;

  if (typeof space === 'number') {
    width = space + "px"
  } else {
    width = space;
  }

  return ['mspace', { width, ...attr }]
});

/** @type {Helper<undefined, [E.Item, E.Item]>} */
mathml.mfrac = makeHelper((attrs, body) => ['mfrac', attrs, body]);

mathml.mi = makeTemplateHelper((attrs, body) => ['mi', attrs, body]);
mathml.mmultiscripts = makeHelper((attrs, body) => ['mmultiscripts', attrs, body]);

/** @type {Helper<undefined, [number]>} */
mathml.mn = makeHelper((attrs, body) => ['mn', attrs, body]);
mathml.mprescripts = makeVoidHelper((attrs) => ['mprescripts', attrs]);
mathml.mo = makeTemplateHelper((attrs, body) => ['mo', attrs, body]);

/** @type {Helper<undefined, [E.Item, E.Item]>} */
mathml.mover = makeHelper((attr, body) => ['mover', attr, body]);

mathml.mrow = makeHelper((attrs, body) => ['mrow', attrs, body]);

/** @type {Helper<undefined, [E.Item, E.Item]>} */
mathml.mroot = makeHelper((attr, body) => ['mroot', attr, body]);

mathml.mtext = makeTemplateHelper((attrs, body) => ['mtext', attrs, body]);

/** @type {Helper<undefined, E.Item[]>} */
mathml.mtable = makeHelper((attrs, body) => ['mtable', attrs, body]);
mathml.mtr = makeHelper((attrs, body) => ['mtr', attrs, body]);
mathml.mtd = makeHelper((attrs, body) => ['mtd', attrs, body]);

/** @type {Helper<undefined, [E.Item, E.Item]>} */
mathml.munder = makeHelper((attr, body) => ['munder', attr, body]);

/** @type {Helper<undefined, [E.Item, E.Item, E.Item]>} */
mathml.munderover = makeHelper((attr, body) => ['munderover', attr, body])

/** @type {Helper<undefined, [E.Item]>} */
mathml.msqrt = makeHelper((attr, body) => ['msqrt', attr, body]);

/** @type {Helper<undefined, [E.Item, E.Item]>} */
mathml.msub = makeHelper((attr, body) => ['msub', attr, body]);

/** @type {Helper<undefined, [E.Item, E.Item]>} */
mathml.msup = makeHelper((attr, body) => ['msup', attr, body]);

/** @type {Helper<undefined, [E.Item, E.Item, E.Item]>} */
mathml.msubsup = makeHelper((attr, body) => ['msubsup', attr, body]);

export { mathml }

