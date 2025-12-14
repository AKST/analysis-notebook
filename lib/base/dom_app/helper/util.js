/**
 * @import { E, ElAttributes } from '../type.ts'
 * @import {
 *   TemplateHelperFactory,
 *   VoidHelperFactory,
 *   VoidConstructor,
 *   VoidBuilderAbstract,
 *   HelperFactory,
 * } from './type.ts'
 */
import { FragmentDemarker } from '../core/render.js';

export const makeTemplateHelper = /** @type {TemplateHelperFactory} */ ((
  /** @type {(attrs: ElAttributes, items: E.Item[]) => E.Item} */
  f,
  defArgs = {}
) => {
  /**
   * @param {any} attrs
   * @param {TemplateStringsArray} text
   * @param {...E.Item} items
   * @returns {E.Item}
   */
  const stringTemplateFunction = function (attrs, text, ...items) {
    if (typeof text === 'string') return f(attrs, [text]);

    if (text.length !== items.length + 1) {
      console.error(text, items);
      throw new Error();
    }

    /** @type {E.Item[]} */
    const body = []
    for (let i = 0; i < items.length; i++) {
      body.push(text[i]);
      body.push(items[i]);
    }
    body.push(text.at(-1));
    return f(attrs, body);
  };

  // @ts-ignore - i can't be stuffed
  const withAttr = function (attr) {
    // @ts-ignore - i can't be stuffed
    const localHelper = (...args) => stringTemplateFunction(attr, ...args);
    /** @param {...E.Item} items */
    localHelper.of = (...items) => f(attr, items);
    return localHelper;
  }

  // @ts-ignore - i can't be stuffed
  const helper = function () {
    if (
      arguments.length === 1 &&
      typeof arguments[0] === 'object' &&
      !Array.isArray(arguments[0]) &&
      !(arguments[0] instanceof FragmentDemarker)
    ) {
      // @ts-ignore - i can't be stuffed
      return withAttr(arguments[0]);
    } else {
      // @ts-ignore - i can't be stuffed
      return stringTemplateFunction({}, ...arguments);
    }
  };

  /** @param {...E.Item} items */
  helper.of = (...items) => f({}, items);
  helper.attr = withAttr;

  // @ts-ignore - i can't be stuffed
  return helper;
});

/**
 * @template Attrs
 * @implments {VoidBuilderAbstract<Attrs>}
 */
class VoidBuilder {
  /** @type {Attrs | undefined} */ attrs = undefined;
  /** @type {VoidConstructor<Attrs>} */ #construct;

  /**
   * @param {VoidConstructor<Attrs>} construct
   */
  constructor(construct) {
    this.#construct = construct;
  }

  /**
   * @param {Attrs} attrsIn
   * @returns {E.Item}
   */
  attr(attrsIn) {
    return this.#construct(this.#updateAttrs(attrsIn));
  }

  /**
   * @param {Attrs} attrsIn
   * @returns {this}
   */
  attrAdd(attrsIn) {
    this.#updateAttrs(attrsIn);
    return this;
  }

  /**
   * @param {Attrs} attrs
   * @returns {Attrs}
   */
  #updateAttrs(attrs) {
    if (this.attrs == null) {
      return this.attrs = attrs;
    } else {
      return Object.assign(this.attrs, attrs);
    }
  }
}

export const makeVoidHelper = /** @type {VoidHelperFactory} */ ((
  /** @type {any} */
  f,
  defArgs = {}
) => (
  new Proxy(function () {}, {
    apply(_target, _thisArg, args) {
      const helper = new VoidBuilder(f);
      helper.attrAdd(defArgs);
      // @ts-ignore - typed interface
      return helper.attr(...args);
    },

    get(_target, prop) {
      const helper = new VoidBuilder(f);
      helper.attrAdd(defArgs);
      if (Reflect.has(helper, prop)) {
        // @ts-ignore - typed interface
        return helper[prop].bind(helper);
      } else {
        throw new TypeError(`Unknown VoidHelper method: ${prop.toString()}`);
      }
    },
  })
));

export const makeHelper = /** @type {HelperFactory} */ ((
  /** @type {(attrs: ElAttributes, items: E.Item[]) => E.Item} */
  f,
  defArgs = {}
) => {
  // @ts-ignore - i can't be stuffed
  const withAttr = function (attr) {
    // @ts-ignore - i can't be stuffed
    const wrapper = function (...items) {
      /* makeHelper::withAttr */
      return f(attr, items);
    }
    /** @param {...E.Item} items */
    wrapper.of = (...items) => f(attr, items);
    return wrapper;
  }

  // @ts-ignore - i can't be stuffed
  const helper = function () {
    if (
      arguments.length === 1 &&
      typeof arguments[0] === 'object' &&
      !Array.isArray(arguments[0]) &&
      !(arguments[0] instanceof FragmentDemarker)
    ) {
      // @ts-ignore - i can't be stuffed
      return withAttr(arguments[0]);
    } else {
      // @ts-ignore - i can't be stuffed
      return f({}, Array.from(arguments));
    }
  };

  // @ts-ignore - i can't be stuffed
  helper.of = (...items) => f({}, items);

  // @ts-ignore - i can't be stuffed
  helper.attr = withAttr;

  // @ts-ignore - i can't be stuffed
  return helper;
});
