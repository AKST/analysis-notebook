/**
 * @import {
 *   BuilderAbstract,
 *   ChildOf,
 *   Helper,
 *   HelperFactory,
 *   HelperNode,
 *   HelperConstructor,
 *   TemplateHelper,
 *   TemplateHelperFactory,
 *   VoidHelperFactory,
 *   VoidConstructor,
 *   VoidBuilderAbstract,
 *   VoidHelper,
 * } from './helper-type.ts'
 * @import { E } from './type.ts'
 */
import { node, MetaContainer, RenderNode, FragmentDemarker } from './render.js';

/**
 * @template NS
 * @template T
 * @template Attrs
 * @template {any[]} Items
 * @implments {BuilderAbstract<NS, T, Attrs, Items>}
 */
class ElementBuilder {
  /** @type {HelperConstructor<NS, T, Attrs, Items>} */ #construct;

  /**
   * @param {HelperConstructor<NS, T, Attrs, Items>} construct
   * @param {Attrs} defAttrs;
   * @param {E.Styles} styles;
   * @param {E.Dataset} dataset
   * @param {E.Events} events
   * @param {Items} children
   */
  constructor(
    construct,
    defAttrs,
    styles,
    dataset,
    events,
    children,
  ) {
    this.#construct = construct;
    this.attrs = defAttrs;
    this.styles = styles;
    this.dataset = dataset;
    this.events = events;
    this.children = children;
  }

  /**
   * @param {Items} itemsIn
   * @returns {HelperNode<NS, T>}
   */
  c(...itemsIn) {
    return this.from(itemsIn);
  }

  /**
   * This is implmented as a property to avoid creating a
   * bound method which may or may not get called, so it
   * have the same overhead of calling in a lambda in map.
   *
   * The difference between this being defined as a bound
   * method and this, is this defined once on the prototype.
   *
   * @type {(item: ChildOf<Items>) => HelperNode<NS, T>}
   */
  get unit () {
    // @ts-ignore - I need to fix this with the typing of Items
    return item => this.c(item);
  }

  /**
   * @param {Items} itemsIn
   * @returns {HelperNode<NS, T>}
   */
  from(itemsIn) {
    const items = this.#pushItems(itemsIn);
    const attrs = new MetaContainer({}, this.dataset, this.styles, this.attrs);
    return this.#construct(attrs, items);
  }

  /**
   * @param {TemplateStringsArray} text
   * @param {...E.Item} itemsIn
   * @returns {HelperNode<NS, T>}
   */
  t(text, ...itemsIn) {
    const items = this.#pushItems(/** @type {any} */ (ElementBuilder.resolveTemplate(text, itemsIn)));
    const attrs = new MetaContainer({}, this.dataset, this.styles, this.attrs);
    return this.#construct(attrs, items);
  }

  /**
   * @param {Attrs} attrsIn
   * @returns {HelperNode<NS, T>}
   */
  void(attrsIn) {
    const attr = this.#upsertAttrs(attrsIn);
    const meta = new MetaContainer({}, this.dataset, this.styles, attr);
    return this.#construct(meta, this.#getChildren());
  }

  /**
   * @param {Items} itemsIn
   */
  cAppend(...itemsIn) {
    return this.#create({ children: this.#pushItems(itemsIn) });
  }

  /**
   * @param {TemplateStringsArray} text
   * @param {...E.Item} itemsIn
   */
  tAppend(text, ...itemsIn) {
    let items = ElementBuilder.resolveTemplate(text, itemsIn);
    const children = this.#pushItems(
      // @ts-ignore - this method won't be exposed unless constructor takes El.Item
      items)
    return this.#create({ children });
  }

  /**
   * @param {Partial<Attrs>} attrsIn
   */
  attr(attrsIn) {
    const attrs = this.#upsertAttrs(attrsIn);
    return this.#create({ attrs });
  }

  /**
   * @param {E.Meta<Attrs>} meta
   */
  meta({ events, dataset, styles, attributes }) {
    return new ElementBuilder(
      this.#construct,
      this.#upsertAttrs(attributes),
      { ...this.styles, ...styles },
      { ...this.data, ...dataset },
      { ...this.events, ...events },
      this.children,
    );
  }

  /**
   * @param {E.Styles} styles
   */
  css(styles) {
    return this.#create({
      styles: { ...this.styles, ...styles },
    });
  }

  /**
   * @param {E.Dataset} dataset
   */
  data(dataset) {
    return this.#create({
      dataset: { ...this.dataset, ...dataset },
    });
  }

  /**
   * @param {Items} itemsIn
   * @returns {Items}
   */
  #pushItems(itemsIn) {
    if (this.children) {
      // @ts-ignore - afaik not an issue
      return this.children.concat(itemsIn);
    } else {
      return itemsIn;
    }
  }

  /**
   * @param {Partial<Attrs>} attrs
   * @returns {Attrs}
   */
  #upsertAttrs(attrs) {
    if (this.attrs == null) {
      return /** @type {any} - we can make assumptions */ (attrs);
    } else {
      return Object.assign({}, this.attrs, attrs);
    }
  }

  /**
   * @param {{
   *   attrs?: Attrs,
   *   styles?: E.Styles,
   *   dataset?: E.Dataset,
   *   events?: E.Events,
   *   children?: Items | undefined,
   * }} options
   * @returns {ElementBuilder<NS, T, Attrs, Items>}
   */
  #create({
    attrs = this.attrs,
    styles = this.styles,
    dataset = this.dataset,
    events = this.events,
    children = this.children,
  }) {
    return new ElementBuilder(
      this.#construct,
      attrs,
      styles,
      dataset,
      events,
      children,
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

  /** @returns {Items} */
  #getChildren() {
    // @ts-ignore - somehow [] isn't a subtype of any[].
    return this.children ?? []
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
   * @param {Attrs} attrs
   * @param {E.Styles} styles
   * @param {E.Dataset} dataset
   * @param {E.Events} events
   */
  constructor(construct, attrs, dataset, styles, events) {
    this.#construct = construct;
    this.attrs = attrs;
    this.dataset = dataset;
    this.styles = styles;
    this.events = events;
  }

  /**
   * @param {Attrs} attrsIn
   * @returns {HelperNode<NS, T>}
   */
  void(attrsIn) {
    const attr = this.#upsertAttrs(attrsIn);
    const meta = new MetaContainer({}, this.dataset, this.styles, attr);
    return this.#construct(meta);
  }

  /**
   * @param {E.Meta<Attrs>} meta
   */
  meta({ events, dataset, styles, attributes }) {
    return new VoidElementBuilder(
      this.#construct,
      this.#upsertAttrs(attributes),
      { ...this.data, ...dataset },
      { ...this.styles, ...styles },
      { ...this.events, ...events },
    );
  }

  /**
   * @param {Attrs} attrsIn
   */
  attrAdd(attrsIn) {
    return new VoidElementBuilder(this.#construct, this.#upsertAttrs(attrsIn), this.dataset, this.styles, this.events);
  }

  /**
   * @param {E.Styles} stylesIn
   */
  css(stylesIn) {
    const styles = { ...this.styles, ...stylesIn };
    return new VoidElementBuilder(this.#construct, this.attrs, this.dataset, styles, this.events);
  }

  /**
   * @param {E.Dataset} datasetIn
   */
  data(datasetIn) {
    const dataset = { ...this.dataset, ...datasetIn };
    return new VoidElementBuilder(this.#construct, this.attrs, dataset, this.styles, this.events);
  }

  /**
   * @param {Attrs} attrs
   * @returns {Attrs}
   */
  #upsertAttrs(attrs) {
    if (this.attrs == null) {
      return this.attrs = attrs;
    } else {
      return { ...this.attrs, ...attrs };
    }
  }
}

/** @type {VoidHelperFactory} */
export const makeVoidHelper = (
  /**
   * @template {string} NS
   * @template {string} T
   * @template {Object} O
   * @param {{
   *   of: [NS, T],
   *   create?: (meta: E.Meta<O>) => HelperNode<NS, T>,
   * }} cfg
   * @returns {VoidHelper<NS, T, O>}
   */
  ({ of: [ns, t], create }) => {
    /**
     * @type {VoidConstructor<NS, T, any>}
     */
    const f = create ?? ((attrs) => node(ns, t, attrs));

    /** @type {VoidHelper<NS, T, O>} */
    const helper = /** @type {any} */ (function () {});

    return new Proxy(helper, {
      apply(_target, _thisArg, args) {
        /** @type {VoidBuilderAbstract<NS, T, O>} */
        const helper = new VoidElementBuilder(f, {}, {}, {}, {});
        if (args[0] instanceof MetaContainer) {
          return helper.meta(args[0]);
        } else {
          return helper.void(args[0]);
        }
      },

      get(_target, prop) {
        /** @type {VoidBuilderAbstract<NS, T, O>} */
        const helper = new VoidElementBuilder(f, {}, {}, {}, {});
        if (Reflect.has(helper, prop)) {
          // @ts-ignore - typed interface
          return helper[prop].bind(helper);
        } else {
          throw new TypeError(`Unknown VoidHelper method: ${prop.toString()}`);
        }
      },
    })
  }
);

/** @type {HelperFactory} */
export const makeHelper = (
  /**
   * @template {string} NS
   * @template {string} T
   * @template {Object} O
   * @template {any[]} I
   *
   * @param {{
   *   of: [NS, T],
   *   create?: (meta: E.Meta<O>, items: I) => HelperNode<NS, T>,
   * }} cfg
   * @returns {Helper<NS, T, O, I>}
   */
  ({ of: [ns, t], create }) => {
    /**
     * @type {HelperConstructor<NS, T, O, I>}
     */
    const f = create ?? ((attrs, items) => (
      node(ns, t, /** @type {any} */ (attrs), /** @type {any} */ (items))
    ));

    /** @type {Helper<NS, T, O, I>} */
    const helper = /** @type {any} */ (function () {});

    /** @type {O} */
    const defaultArgs = /** @type {any} */ ({});

    /** @returns {BuilderAbstract<NS, T, O, I>} */
    const initialise = () => {
      return new ElementBuilder(
        /** @type {any} */(f),
        defaultArgs,
        {}, {}, {},
        /** @type {any} */([]),
      );
    }

    return new Proxy(helper, {
      apply(_target, _thisArg, args) {
        const helper = initialise();

        if (args[0] instanceof MetaContainer) {
          return helper.meta(args[0]);
        } else if (
          args.length === 1 &&
          typeof args[0] === 'object' &&
          !Array.isArray(args[0]) &&
          !(args[0] instanceof RenderNode) &&
          !(args[0] instanceof FragmentDemarker)
        ) {
          return helper.attr({ ...args[0] });
        } else {
          return helper.c(...args);
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
        const helper = initialise();

        if (Reflect.has(helper, prop)) {
          // @ts-ignore - typed interface
          return helper[prop].bind(helper);
        } else if (Reflect.has(target, prop)) {
          return target[prop];
        } else {
          throw new TypeError(`<${ns}:${t}/> Unknown ElementBuilder method: ${prop.toString()}`);
        }
      },
    })
  }
);

/** @type {TemplateHelperFactory} */
export const makeTemplateHelper = (
  /**
   * @template {string} NS
   * @template {string} T
   * @template {Object} O
   * @template {E.Item[]} I
   *
   * @param {{
   *   of: [NS, T],
   *   create?: (meta: E.Meta<O>, items: I) => HelperNode<NS, T>,
   * }} cfg
   * @returns {TemplateHelper<NS, T, O, I>}
   */
  ({ of: [ns, t], create }) => {
    /**
     * @type {HelperConstructor<NS, T, O, I>}
     */
    const f = create ?? ((attrs, items) => (
      node(ns, t, /** @type {any} */ (attrs), /** @type {any} */ (items))
    ));

    /** @type {TemplateHelper<NS, T, O, I>} */
    const helper = /** @type {any} */ (function () {});

    /** @type {O} */
    const defaultArgs = /** @type {any} */ ({});

    /** @returns {BuilderAbstract<NS, T, O, I>} */
    const initialise = () => {
      return new ElementBuilder(
        /** @type {any} */(f),
        defaultArgs,
        {}, {}, {},
        /** @type {any} */([]),
      );
    }

    return new Proxy(helper, {
      apply(_target, _thisArg, args) {
        const helper = initialise();
        if (args[0] instanceof MetaContainer) {
          return helper.meta(args[0]);
        } else if (
          args.length === 1 &&
          typeof args[0] === 'object' &&
          !Array.isArray(args[0]) &&
          !(args[0] instanceof RenderNode) &&
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
       * @template {string} Prop
       * @param {any} target
       * @param {Prop} prop
       */
      get(target, prop) {
        const helper = initialise();
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
