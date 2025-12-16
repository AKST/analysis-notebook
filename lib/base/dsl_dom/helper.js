/**
 * @import {
 *   BuilderAbstract,
 *   ChildOf,
 *   TemplateHelperFactory,
 *   VoidHelperFactory,
 *   VoidConstructor,
 *   VoidBuilderAbstract,
 *   VoidHelper,
 *   HelperFactory,
 *   HelperNode,
 *   HelperConstructor,
 * } from './helper-type.ts'
 * @import { E, ElAttributes } from './type.ts'
 */
import { node, AttributeContainer, FragmentDemarker } from './render.js';

/**
 * @template NS
 * @template T
 * @template Attrs
 * @template {any[]} Items
 * @implments {BuilderAbstract<Attrs, Items>}
 */
class ElementBuilder {
  /** @type {HelperConstructor<NS, T, Attrs, Items>} */ #construct;

  /**
   * @param {HelperConstructor<NS, T, Attrs, Items>} construct
   * @param {Attrs} defAttrs;
   * @param {Items | undefined} [leading]
   * @param {Items | undefined} [trailing]
   * @param {Items | undefined} [children]
   */
  constructor(
    construct,
    defAttrs,
    leading = undefined,
    children = undefined,
    trailing = undefined,
  ) {
    this.#construct = construct;
    this.attrs = defAttrs;
    this.leading = leading;
    this.children = children;
    this.trailing = trailing;
  }

  /**
   * @param {Items} itemsIn
   * @returns {HelperNode<NS, T>}
   */
  of(...itemsIn) {
    const items = this.#joinChildren(this.#pushItems(itemsIn, 'children'));
    const attrs = new AttributeContainer({}, {}, this.attrs);
    return this.#construct(attrs, items);
  }

  /**
   * @param {TemplateStringsArray} text
   * @param {...E.Item} itemsIn
   * @returns {HelperNode<NS, T>}
   */
  t(text, ...itemsIn) {
    const items = ElementBuilder.resolveTemplate(text, itemsIn);
    const attrs = new AttributeContainer({}, {}, this.attrs);
    return this.#construct(attrs, this.#joinChildren(
      // @ts-ignore - text can't be called unless constructor takes items
      items
    ));
  }

  /**
   * @param {Items} itemsIn
   */
  app(...itemsIn) {
    const children = this.#pushItems(itemsIn, 'children')
    return this.#create({ children });
  }

  /**
   * @param {Items} itemsIn
   */
  pre(...itemsIn) {
    const leading = this.#pushItems(itemsIn, 'leading')
    return this.#create({ leading });
  }

  /**
   * @param {Items} itemsIn
   */
  post(...itemsIn) {
    const trailing = this.#pushItems(itemsIn, 'trailing')
    return this.#create({ trailing });
  }

  /**
   * @param {TemplateStringsArray} text
   * @param {...E.Item} itemsIn
   */
  appT(text, ...itemsIn) {
    let items = ElementBuilder.resolveTemplate(text, itemsIn);
    const children = this.#pushItems(
      // @ts-ignore - this method won't be exposed unless constructor takes El.Item
      items,
      'children')
    return this.#create({ children });
  }

  /**
   * @param {TemplateStringsArray} text
   * @param {...E.Item} itemsIn
   */
  preT(text, ...itemsIn) {
    let items = ElementBuilder.resolveTemplate(text, itemsIn);
    const leading = this.#pushItems(
      // @ts-ignore - this method won't be exposed unless constructor takes El.Item
      items,
      'leading')
    return this.#create({ leading });
  }

  /**
   * @param {TemplateStringsArray} text
   * @param {...E.Item} itemsIn
   */
  postT(text, ...itemsIn) {
    let items = ElementBuilder.resolveTemplate(text, itemsIn);
    const trailing = this.#pushItems(
      // @ts-ignore - this method won't be exposed unless constructor takes El.Item
      items,
      'trailing')
    return this.#create({ trailing });
  }

  /**
   * @param {Partial<Attrs>} attrsIn
   */
  attr(attrsIn) {
    const attrs = this.#updateAttrs(attrsIn);
    return this.#create({ attrs });
  }

  /**
   * @param {Items} items
   * @returns {Items}
   */
  #joinChildren(items) {
    if (this.leading) {
      // @ts-ignore - afaik not an issue
      items = items.length ? this.leading.concat(items) : this.leading;
    }
    if (this.trailing) {
      // @ts-ignore - afaik not an issue
      items = items.length ? items.concat(this.trailing) : this.trailing;
    }
    return items;
  }

  /**
   * @param {Items} itemsIn
   * @param {'children' | 'leading' | 'trailing'} dst
   * @returns {Items}
   */
  #pushItems(itemsIn, dst) {
    if (this[dst]) {
      // @ts-ignore - afaik not an issue
      return this[dst].concat(itemsIn);
    } else {
      return itemsIn;
    }
  }

  /**
   * @param {Partial<Attrs>} attrs
   * @returns {Attrs}
   */
  #updateAttrs(attrs) {
    if (this.attrs == null) {
      return /** @type {any} - we can make assumptions */ (attrs);
    } else {
      return Object.assign({}, this.attrs, attrs);
    }
  }

  /**
   * @param {{
   *   attrs?: Attrs,
   *   leading?: Items | undefined,
   *   children?: Items | undefined,
   *   trailing?: Items | undefined,
   * }} options
   * @returns {ElementBuilder<NS, T, Attrs, Items>}
   */
  #create({
    attrs = this.attrs,
    leading = this.leading,
    children = this.children,
    trailing = this.trailing,
  }) {
    return new ElementBuilder(
      this.#construct,
      attrs,
      leading,
      children,
      trailing,
    );
  }

  /**
   * @param {TemplateStringsArray} text
   * @param {E.Item[]} items
   * @returns {E.Item[]}
   */
  static resolveTemplate(text, items) {
    if (typeof text === 'string') return text;

    if (text.length !== items.length + 1) {
      console.error(text, items);
      throw new Error('failed to build helper');
    }

    /** @type {E.Item[]} */
    const body = []
    for (let i = 0; i < items.length; i++) {
      body.push(text[i]);
      body.push(items[i]);
    }
    body.push(text.at(-1));
    return body;
  }
}

/**
 * @template NS
 * @template T
 * @template Attrs
 * @implments {VoidBuilderAbstract<NS, T, Attrs>}
 */
class VoidElementBuilder {
  /** @type {VoidConstructor<NS, T, Attrs>} */ #construct;

  /**
   * @param {VoidConstructor<NS, T, Attrs>} construct
   * @param {Attrs} defAttrs
   */
  constructor(construct, defAttrs) {
    this.#construct = construct;
    this.attrs = defAttrs;
  }

  /**
   * @param {Attrs} attrsIn
   * @returns {HelperNode<NS, T>}
   */
  attr(attrsIn) {
    const attrs = new AttributeContainer({}, {}, attrsIn);
    return this.#construct(attrs);
  }

  /**
   * @param {Attrs} attrsIn
   */
  attrAdd(attrsIn) {
    return new VoidElementBuilder(this.#construct, this.#updateAttrs(attrsIn));
  }

  /**
   * @param {Attrs} attrs
   * @returns {Attrs}
   */
  #updateAttrs(attrs) {
    if (this.attrs == null) {
      return this.attrs = attrs;
    } else {
      return { ...this.attrs, ...attrs };
    }
  }
}

export const makeVoidHelper = /** @type {VoidHelperFactory} */ (
  /**
   * @template {string} NS
   * @template {string} T
   * @param {NS} ns
   * @param {T} t
   * @returns {<O>(f: any, d?: any) => any}
   */
  (ns, t) => (fIn = undefined, defArgs = {}) => {
    /**
     * @type {VoidConstructor<NS, T, any>}
     */
    const f = fIn ?? ((attrs) => node(ns, t, attrs));

    return new Proxy(/** @type {any} */ (function () {}), {
      apply(_target, _thisArg, args) {
        const helper = new VoidElementBuilder(f, defArgs);
        return helper.attr(args[0]);
      },

      get(_target, prop) {
        const helper = new VoidElementBuilder(f, defArgs);
        if (Reflect.has(helper, prop)) {
          // @ts-ignore - typed interface
          return helper[prop].bind(helper);
        } else {
          throw new TypeError(`Unknown VoidHelper method: ${prop.toString()}`);
        }
      },
    });
  }
);


export const makeHelper = /** @type {HelperFactory} */ (
  /**
   * @template {string} NS
   * @template {string} T
   * @param {NS} ns
   * @param {T} t
   * @returns {<O>(f: any, d?: any) => any}
   */
  (ns, t) => (fIn = undefined, defArgs = {}) => {
    /**
     * @type {HelperConstructor<NS, T, any, any>}
     */
    const f = fIn ?? ((attrs, items) => node(ns, t, attrs, items));

    return new Proxy(/** @type {any} */ (function () {}), {
      apply(_target, _thisArg, args) {
        const helper = new ElementBuilder(f, { ...defArgs });
        if (
          args.length === 1 &&
          typeof args[0] === 'object' &&
          !Array.isArray(args[0]) &&
          !(args[0] instanceof FragmentDemarker)
        ) {
          return helper.attr({ ...args[0] });
        } else {
          return helper.of(...args);
        }
      },

      /**
       * @param {any} target
       * @param {string} prop
       * @param {prop} value
       */
      set(target, prop, value) {
        return Reflect.set(target, prop, value);
      },

      /**
       * @param {any} target
       * @param {string} prop
       */
      get(target, prop) {
        const helper = new ElementBuilder(f, defArgs);
        if (Reflect.has(helper, prop)) {
          // @ts-ignore - typed interface
          return helper[prop].bind(helper);
        } else if (Reflect.has(target, prop)) {
          return target[prop];
        } else {
          throw new TypeError(`Unknown NonVoidHelper method: ${prop.toString()}`);
        }
      },
    })
  }
);

export const makeTemplateHelper = /** @type {TemplateHelperFactory} */ (
  /**
   * @template {string} NS
   * @template {string} T
   * @param {NS} ns
   * @param {T} t
   * @returns {<O>(f?: any, d?: any) => any}
   */
  (ns, t) => (fIn = undefined, defArgs = {}) => {
    /**
     * @type {HelperConstructor<NS, T, any, any>}
     */
    const f = fIn ?? ((attrs, items) => node(ns, t, attrs, items));

    return new Proxy(/** @type {any} */ (function () {}), {
      apply(_target, _thisArg, args) {
        const helper = new ElementBuilder(f, { ...defArgs });
        if (
          args.length === 1 &&
          typeof args[0] === 'object' &&
          !Array.isArray(args[0]) &&
          !(args[0] instanceof FragmentDemarker)
        ) {
          return helper.attr({ ...args[0] });
        } else {
          // @ts-ignore - i can't be stuffed
          return helper.t(...args);
        }
      },

      /**
       * @param {any} target
       * @param {string} prop
       * @param {prop} value
       */
      set(target, prop, value) {
        return Reflect.set(target, prop, value);
      },

      /**
       * @param {any} target
       * @param {string} prop
       */
      get(target, prop) {
        const helper = new ElementBuilder(f, defArgs);
        if (Reflect.has(helper, prop)) {
          // @ts-ignore - typed interface
          return helper[prop].bind(helper);
        } else if (Reflect.has(target, prop)) {
          return target[prop];
        } else {
          throw new TypeError(`Unknown NonVoidHelper method: ${prop.toString()}`);
        }
      },
    });
  }
);
