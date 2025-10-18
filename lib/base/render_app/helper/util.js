/**
 * @import { E, ElAttributes } from '../type.ts'
 * @import { HelperFactory } from './type.ts'
 */

export const makeHelper = /** @type {HelperFactory} */ ((
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
    if (typeof arguments[0] === 'object' && !Array.isArray(arguments[0])) {
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
