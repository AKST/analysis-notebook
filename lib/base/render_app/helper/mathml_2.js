/**
 * @import { E, ElAttributes } from '../type.ts'
 * @import { Helper } from './type.ts'
 */
import { frag as _frag } from '../core/render.js';
import { makeHelper } from './util.js';

const mathml = {};

mathml.math = makeHelper((attr, body) => ['math', {
  ns: 'http://www.w3.org/1998/Math/MathML',
  display: 'block',
  ...attr,
}, body]);


/**
 * @type {Helper<{ space: number }, never>}
 */
mathml.mspace = makeHelper(({ space, ...attr }) => (
  ['mspace', { width: (space ?? 32) + "px", ...attr }]
), {
  space: 0,
});

mathml.mfrac = makeHelper((attrs, body) => ['mfrac', attrs, body]);
mathml.mi = makeHelper((attrs, body) => ['mi', attrs, body]);
mathml.mmultiscripts = makeHelper((attrs, body) => ['mmultiscripts', attrs, body]);
mathml.mn = makeHelper((attrs, body) => ['mn', attrs, body]);
mathml.mprescripts = makeHelper((attrs, body) => ['mprescripts', attrs, body]);
mathml.mo = makeHelper((attrs, body) => ['mo', attrs, body]);
mathml.mover = makeHelper((attr, body) => ['mover', attr, body]);
mathml.mrow = makeHelper((attrs, body) => ['mrow', attrs, body]);
mathml.mtext = makeHelper((attrs, body) => ['mtext', attrs, body]);
mathml.mtable = makeHelper((attrs, body) => ['mtable', attrs, body]);
mathml.mtr = makeHelper((attrs, body) => ['mtr', attrs, body]);
mathml.mtd = makeHelper((attrs, body) => ['mtd', attrs, body]);
mathml.munder = makeHelper((attr, body) => ['munder', attr, body]);
mathml.munderover = makeHelper((attr, body) => ['munderover', attr, body])
mathml.msqrt = makeHelper((attr, body) => ['msqrt', attr, body]);
mathml.msub = makeHelper((attr, body) => ['msub', attr, body]);
mathml.msup = makeHelper((attr, body) => ['msup', attr, body]);
mathml.msubsup = makeHelper((attr, body) => ['msubsup', attr, body]);

export { mathml }

