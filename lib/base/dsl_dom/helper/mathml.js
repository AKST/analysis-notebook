/**
 * @import { DefaultHelperAttrs, Helper } from '../helper-type.ts'
 * @import { E } from '../type.ts'
 */
import { makeTemplateHelper, makeVoidHelper, makeHelper } from '../helper.js';
import { node } from '../render.js';
import * as Meta from '../node_meta.js';

export const math = makeHelper({
  of: ['mathml', 'math'],
  create(meta, items) {
    const { display = 'block' } = meta.attributes;
    return node('mathml', 'math', Meta.attr(meta, 'display', display), items);
  },
});

/**
 * TODO support more attributes turns out there are more than just width
 * https://developer.mozilla.org/en-US/docs/Web/MathML/Reference/Element/mspace
 */
export const mspace = makeHelper({
  of: ['mathml', 'mspace'],
  /**
   * @param {[number | string]} items
   */
  create: (meta, items) => {
    const [space] = items;
    let width = undefined;

    if (typeof space === 'number') {
      width = space + "px"
    } else if (typeof space === 'string') {
      width = space;
    }

    return node('mathml', 'mspace', Meta.attr(meta, 'width', width), []);
  },
});

/** @type {Helper<'mathml', 'mfrac', DefaultHelperAttrs<'mathml', 'mfrac'>, [E.Item, E.Item]>} */
export const mfrac = makeHelper({ of: ['mathml', 'mfrac'] });
export const mi = makeTemplateHelper({ of: ['mathml', 'mi'] });
export const mmultiscripts = makeHelper({ of: ['mathml', 'mmultiscripts'] });

/** @type {Helper<'mathml', 'mn', DefaultHelperAttrs<'mathml', 'mn'>, [number]>} */
export const mn = makeHelper({ of: ['mathml', 'mn'] });
export const mprescripts = makeVoidHelper({ of: ['mathml', 'mprescripts'] });
export const mo = makeTemplateHelper({ of: ['mathml', 'mo'] });

/** @type {Helper<'mathml', 'mover', DefaultHelperAttrs<'mathml', 'mover'>, [E.Item, E.Item]>} */
export const mover = makeHelper({ of: ['mathml', 'mover'] });
export const mrow = makeHelper({ of: ['mathml', 'mrow'] });

/** @type {Helper<'mathml', 'mroot', DefaultHelperAttrs<'mathml', 'mroot'>, [E.Item, E.Item]>} */
export const mroot = makeHelper({ of: ['mathml', 'mroot'] });
export const mtext = makeTemplateHelper({ of: ['mathml', 'mtext'] });

/** @type {Helper<'mathml', 'mtable', DefaultHelperAttrs<'mathml', 'mtable'>, E.Item[]>} */
export const mtable = makeHelper({ of: ['mathml', 'mtable'] });
export const mtr = makeHelper({ of: ['mathml', 'mtr'] });
export const mtd = makeHelper({ of: ['mathml', 'mtd'] });

/** @type {Helper<'mathml', 'munder', DefaultHelperAttrs<'mathml', 'munder'>, [E.Item, E.Item]>} */
export const munder = makeHelper({ of: ['mathml', 'munder'] });

/** @type {Helper<'mathml', 'munderover', DefaultHelperAttrs<'mathml', 'munderover'>, [E.Item, E.Item, E.Item]>} */
export const munderover = makeHelper({ of: ['mathml', 'munderover'] });

/** @type {Helper<'mathml', 'msqrt', DefaultHelperAttrs<'mathml', 'msqrt'>, [E.Item]>} */
export const msqrt = makeHelper({ of: ['mathml', 'msqrt'] });

/** @type {Helper<'mathml', 'msub', DefaultHelperAttrs<'mathml', 'msub'>, [E.Item, E.Item]>} */
export const msub = makeHelper({ of: ['mathml', 'msub'] });

/** @type {Helper<'mathml', 'msup', DefaultHelperAttrs<'mathml', 'msup'>, [E.Item, E.Item]>} */
export const msup = makeHelper({ of: ['mathml', 'msup'] });

/** @type {Helper<'mathml', 'msubsup', DefaultHelperAttrs<'mathml', 'msubsup'>, [E.Item, E.Item, E.Item]>} */
export const msubsup = makeHelper({ of: ['mathml', 'msubsup'] });
