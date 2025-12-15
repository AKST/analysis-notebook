/**
 * @import * as Dom from '../../platform/dom/type.ts';
 * @import { DefaultHelperAttrs, Helper } from '../helper-type.ts'
 * @import { E } from '../type.ts'
 */
import { node } from '../render.js';
import { makeTemplateHelper, makeVoidHelper, makeHelper } from '../helper.js';

export const math = makeHelper('mathml', 'math')().attr({ display: 'block' });

/**
 * TODO support more attributes turns out there are more than just width
 * https://developer.mozilla.org/en-US/docs/Web/MathML/Reference/Element/mspace
 *
 * @type {Helper<'mathml', 'mspace', DefaultHelperAttrs<'mathml', 'mspace'>, [number | string]>}
 */
export const mspace = makeHelper('mathml', 'mspace')((attr, [space]) => {
  let width = undefined;

  if (typeof space === 'number') {
    width = space + "px"
  } else if (typeof space === 'string') {
    width = space;
  }

  return node('mathml', 'mspace', attr.elem('width', width), []);
});

/** @type {Helper<'mathml', 'mfrac', DefaultHelperAttrs<'mathml', 'mfrac'>, [E.Item, E.Item]>} */
export const mfrac = makeHelper('mathml', 'mfrac')();
export const mi = makeTemplateHelper('mathml', 'mi')();
export const mmultiscripts = makeHelper('mathml', 'mmultiscripts')();
/** @type {Helper<'mathml', 'mn', DefaultHelperAttrs<'mathml', 'mn'>, [number]>} */
export const mn = makeHelper('mathml', 'mn')();
export const mprescripts = makeVoidHelper('mathml', 'mprescripts')();
export const mo = makeTemplateHelper('mathml', 'mo')();
/** @type {Helper<'mathml', 'mover', DefaultHelperAttrs<'mathml', 'mover'>, [E.Item, E.Item]>} */
export const mover = makeHelper('mathml', 'mover')();
export const mrow = makeHelper('mathml', 'mrow')();
/** @type {Helper<'mathml', 'mroot', DefaultHelperAttrs<'mathml', 'mroot'>, [E.Item, E.Item]>} */
export const mroot = makeHelper('mathml', 'mroot')();
export const mtext = makeTemplateHelper('mathml', 'mtext')();
/** @type {Helper<'mathml', 'mtable', DefaultHelperAttrs<'mathml', 'mtable'>, E.Item[]>} */
export const mtable = makeHelper('mathml', 'mtable')();
export const mtr = makeHelper('mathml', 'mtr')();
export const mtd = makeHelper('mathml', 'mtd')();
/** @type {Helper<'mathml', 'munder', DefaultHelperAttrs<'mathml', 'munder'>, [E.Item, E.Item]>} */
export const munder = makeHelper('mathml', 'munder')();
/** @type {Helper<'mathml', 'munderover', DefaultHelperAttrs<'mathml', 'munderover'>, [E.Item, E.Item, E.Item]>} */
export const munderover = makeHelper('mathml', 'munderover')()
/** @type {Helper<'mathml', 'msqrt', DefaultHelperAttrs<'mathml', 'msqrt'>, [E.Item]>} */
export const msqrt = makeHelper('mathml', 'msqrt')();
/** @type {Helper<'mathml', 'msub', DefaultHelperAttrs<'mathml', 'msub'>, [E.Item, E.Item]>} */
export const msub = makeHelper('mathml', 'msub')();
/** @type {Helper<'mathml', 'msup', DefaultHelperAttrs<'mathml', 'msup'>, [E.Item, E.Item]>} */
export const msup = makeHelper('mathml', 'msup')();
/** @type {Helper<'mathml', 'msubsup', DefaultHelperAttrs<'mathml', 'msubsup'>, [E.Item, E.Item, E.Item]>} */
export const msubsup = makeHelper('mathml', 'msubsup')();
