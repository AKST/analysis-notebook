/**
 * @import { FindDomElement, ElementAttributesWriteOnly } from '../platform/dom/type.ts';
 * @import { EffectRegistry } from './effects.js';
 * @import { E } from './type.ts';
 */
import { Unreachable } from '../util/type.js';

class UnknownNameSpace extends Error {}

class VdomAssocitedError extends Error {
  /** @type {string[]} */
  parents = [];

  /**
   * @param {any} ns
   * @param {any} t
   * @param {string} message
   */
  constructor(ns, t, message) {
    super(message ?? `Failed while rendering ${ns}::${t}`);
  }

  get message() {
    return `${super.message}, in ${this.parents.join(', ')}`;
  }

  /**
   * @param {any} ns
   * @param {any} t
   */
  flagParentOnPropagation(ns, t) {
    this.parents.push(`${ns}::${t}`);
  }
}

class VdomAttributeAssocitedError extends VdomAssocitedError {
  /**
   * @param {any} ns
   * @param {any} t
   * @param {any} attr
   * @param {string} message
   */
  constructor(ns, t, attr, message) {
    super(ns, t, `${ns}::${t}.${attr}: ${message}`);
    this.attr = attr;
  }
}

class SetAttributeError extends VdomAttributeAssocitedError {
  /**
   * @param {any} ns
   * @param {any} t
   * @param {any} attr
   * @param {any} value
   */
  constructor(ns, t, attr, value) {
    super(ns, t, attr, `Failed to set to ${value}`);
    this.value = value;
  }
}

const URI_XHTML = 'http://www.w3.org/1999/xhtml';
/**
 * Mathml Namespace
 *
 * https://www.w3.org/TR/mathml4/#interf_namespace
 */
const URI_MATHML = 'http://www.w3.org/1998/Math/MathML';
const URI_SVG = 'http://www.w3.org/2000/svg';

/** @param {string} ns @returns {string} */
export function nsIdToURI(ns) {
  switch (ns) {
    case 'html': return URI_XHTML;
    case 'svg': return URI_SVG;
    case 'mathml': return URI_MATHML;
    default: throw new UnknownNameSpace(ns);
  }
}

/** @param {string} ns @returns {string} */
export function uriToNamespaceId(ns) {
  switch (ns) {
    case URI_XHTML: return 'html';
    case URI_SVG: return 'svg';
    case URI_MATHML: return 'mathml';
    default: throw new UnknownNameSpace(ns);
  }
}

/**
 * @template O
 * @implemnts {E.Attrs<O>}
 */
export class AttributeContainer {
  /**
   * @param {E.Events} events
   * @param {E.Dataset} dataset
   * @param {O} attrs
   */
  constructor(events, dataset, attrs) {
    this.events = events;
    this.dataset = dataset;
    this.element = attrs;
  }

  /**
   * @template {keyof O} K
   * @param {K} key
   * @param {O[K]} val
   */
  elem(key, val) {
    return new AttributeContainer(
      this.events,
      this.dataset,
      { ...this.element, [key]: val },
    );
  }

  static empty = new AttributeContainer({}, {}, {});
}

/** @implements {E.Frag} */
export class FragmentDemarker {
  /**
   * @param {E.Item[]} children
   */
  constructor(children) {
    this.children = children;
  }

  /**
   * @param {any} f
   * @returns {f is E.Frag}
   */
  static isFragment(f) {
    return f instanceof FragmentDemarker;
  }
}

/**
 * @type {{
 *   <NS extends string, T extends string>(ns: NS, t: T): E.Attrs<Partial<ElementAttributesWriteOnly<NS, T>>>;
 *   <O extends Object>(): E.Attrs<O>;
 * }}
 */
export const attr = (() => {
  return /** @type {any} */ (AttributeContainer.empty);
});

/**
 * @param {...E.Item} children
 * @returns {E.Frag}
 */
export function frag(...children) {
  return new FragmentDemarker(children);
}

/**
 * @template {string} NS
 * @template {string} T
 * @param {NS} ns
 * @param {T} tagName
 * @param {E.Attrs<Partial<ElementAttributesWriteOnly<NS, T>>>} [attributes]
 * @param {E.Item[]} [children]
 * @return {E.Node<NS, T, Partial<ElementAttributesWriteOnly<NS, T>>>}
 */
export function node(ns, tagName, attributes, children) {
  return {
    ns,
    tagName,
    children,
    attributes,
  };
}

/**
 * @param {readonly E.Item[]} children
 * @returns {Iterable<[number, E.Item]>}
 */
function * flattenChildren(children) {
  let i = 0;
  for (const child of children) {
    if (child instanceof FragmentDemarker) {
      for (const fChild of child.children) yield [i++, fChild];
    } else if (typeof child === 'number') {
      yield [i++, child+''];
    } else {
      yield [i++, child];
    }
  }
}


/**
 * @type {{
 *   <NS, T, O>(spec: E.Node<NS, T, O>, eventRegistry?: EffectRegistry | undefined): FindDomElement<NS, T>;
 *   (spec: E.Item, eventRegistry?: EffectRegistry | undefined): Element | Text;
 * }}
 */
export const render = /** @type {any} */ ((
  /** @type {E.Item} */ spec,
  /** @type {EffectRegistry | undefined} */ eventRegistry = undefined,
) => {
  if (FragmentDemarker.isFragment(spec)) {
    throw new Error('Unexpected Fragment');
  }

  if (spec == null || spec === false) {
    return document.createTextNode('');
  }

  if (typeof spec === 'string' || typeof spec === 'number') {
    return document.createTextNode(spec + '');
  }

  if (spec instanceof Node) {
    return spec;
  }

  /*
   * This function will run an unbound number of times
   * no need add more logic here than necessary.
   */
  const {
    tagName,
    ns: specNS,
    children,
    attributes,
  } = /** @type {E.Node<any, any, Object>} */ (spec);

  const element = document.createElementNS(nsIdToURI(specNS), tagName);

  if (attributes) {
    if (attributes.events && eventRegistry) {
      // element.dataset.eventsource = eventRegistry.register(events);
      throw new Error('events not implemented');
    }

    if (attributes.element) {
      for (const [k, v] of Object.entries(attributes.element)) {
        setAttribute(specNS, tagName, k, element, v);
      }
    }
  }

  if (children) {
    for (const child of children) {
      if (child instanceof FragmentDemarker) {
        for (const fChild of child.children) appendChild(fChild);
      } else {
        appendChild(child);
      }
    }
  }

  return element;

  /**
   * @param {E.Item} child
   */
  function appendChild(child) {
    try {
      element.appendChild(render(child, eventRegistry));
    } catch (e) {
      console.warn(specNS, tagName, attributes, children);
      throw e
    }
  }
});

/**
 * If the node reference changes it'll return a new element.
 *
 * @type {{
 *   <NS, T, O>(dom: Node, newSpec: E.Node<NS, T, O>, eventRegistry?: EffectRegistry | undefined): FindDomElement<NS, T> | undefined;
 *   (dom: Node, newSpec: E.Item, eventRegistry?: EffectRegistry | undefined): Element | Text | undefined;
 * }}
 */
export const update = /** @type {any} */ ((
  /** @type {Node} */ domElement,
  /** @type {E.Item} */ newSpec,
  /** @type {EffectRegistry | undefined} */ effects = undefined,
) => {
  if (!newSpec) newSpec = '';
  if (typeof newSpec === 'number') newSpec = newSpec+'';

  if (typeof newSpec === 'string') {
    if (domElement.nodeType === document.TEXT_NODE) {
      if (domElement.textContent !== newSpec) {
        domElement.textContent = newSpec;
      }
      return;
    }
    return render(newSpec, effects);
  }

  // Handle element -> text mismatch
  if (domElement.nodeType === document.TEXT_NODE) {
    return render(newSpec, effects);
  } else if (!(domElement instanceof Element)) {
    throw new Error('unexpected element');
  }

  const domNS = domElement.namespaceURI ?? URI_XHTML;
  const domNSId = uriToNamespaceId(domNS);

  if (newSpec instanceof Node) {
    return newSpec;
  }

  if (FragmentDemarker.isFragment(newSpec)) {
    throw new Error('should have never been reached');
  }

  const {
    tagName,
    ns: specNS,
    children,
    attributes,
  } = /** @type {E.Node<any, any, Object>} */ (newSpec);

  // Tag name mismatch - replace entire element
  if (domElement.tagName.toLowerCase() !== tagName || specNS !== domNSId) {
    return render(newSpec, effects);
  }

  if (attributes) {
    if (attributes.element) {
      for (const [key, val] of Object.entries(attributes.element)) {
        const currVal = getAttribute(specNS, tagName, key, domElement);
        if (val == currVal) continue;
        setAttribute(specNS, tagName, key, domElement, val);
      }
    }

    if (attributes.events && effects) {
      // element.dataset.eventsource = eventRegistry.register(events);
      throw new Error('events not implemented');
    }
  }

  if (children == null || children.length === 0) {
    domElement.replaceChildren();
    return;
  }

  updateOn(domElement, children, effects);
});

/**
 * @param {Node} parent
 * @param {E.Item[]} defs
 */
export function renderOnto(parent, defs) {
  for (const def of defs) {
    const child = render(def);
    parent.appendChild(child);
  }
}

/**
 * @param {Node} domElement
 * @param {readonly E.Item[]} defs
 * @param {EffectRegistry | undefined} [effects]
 */
export function updateOn(domElement, defs, effects = undefined) {
  while (domElement.childNodes.length > defs.length) {
    if (domElement.lastChild == null) throw new Error('should never happen');
    domElement.removeChild(domElement.lastChild);
  }

  const currentChildren = Array.from(domElement.childNodes);

  for (const [i, newChild] of flattenChildren(defs)) {
    const currentChild = currentChildren[i];

    if (currentChild) {
      const replacement = update(currentChild, newChild, effects);
      if (replacement) domElement.replaceChild(replacement, currentChild);
    } else {
      domElement.appendChild(render(newChild, effects));
    }
  }
}

/**
 * @typedef {'property' | 'getAttribute'} AttributeAccess
 * @typedef {'same' | '!!' | 'array-split-space' | 'Array.from'} AttributeNormalisation
 * @typedef {'same' | '!!' | 'array-join-space'} AttributeStorage
 */

/**
 * @template NS
 * @template Tag
 * @param {NS} ns
 * @param {Tag} tag
 * @param {keyof ElementAttributesWriteOnly<ns, tag>} attr
 * @returns {{
 *   access: AttributeAccess,
 *   encode: AttributeStorage,
 *   decode: AttributeNormalisation,
 * }}
 */
export function attributeMeta(ns, tag, attr) {
  /** @type {AttributeNormalisation} */
  let decode = 'same';

  /** @type {AttributeStorage} */
  let encode = 'same';

  /** @type {AttributeAccess} */
  let access = 'getAttribute';

  switch (/** @type {string} */ (attr)) {
    case 'className':
      return { access: 'property', decode: 'same', encode: 'same' };

    case 'classList':
      return { access: 'property', decode: 'Array.from', encode: 'array-join-space' };

    default:
      break;
  }

  switch (`${ns}:${/** @type {string} */ (attr)}`) {
    case 'html:disabled':
      decode = encode = '!!';
      break;
    default:
      break;
  }

  switch (`${ns}:${tag}:${/** @type {string} */ (attr)}`) {
    case 'html:details:open':
      decode = encode = '!!';
      break;

    case 'svg:svg:viewBox':
      encode = 'array-join-space'
      decode = 'array-split-space'
      break;

    default:
      break;
  }

  return { access, decode, encode };
}

/**
 * @template NS
 * @template Tag
 * @param {NS} ns
 * @param {Tag} tag
 * @param {keyof ElementAttributesWriteOnly<NS, Tag>} attr
 * @param {FindDomElement<NS, Tag>} element
 * @returns {any}
 */
export function getAttribute(ns, tag, attr, element) {
  const { access, decode } = attributeMeta(ns, tag, attr);

  /** @type {any} */
  let value;
  switch (access) {
    case 'getAttribute':
      // @ts-ignore - impossible to correctly type due to API dynamism
      value = element.getAttribute(attr);
      break;

    case 'property':
      // @ts-ignore - impossible to correctly type due to API dynamism
      value = element[attr];
      break;

    default:
      throw new Unreachable(access);
  }

  switch (decode) {
    case 'same':
      return value ?? undefined;
    case '!!':
      return !!value;
    case 'Array.from':
      return Array.from(value);
    case 'array-split-space':
      return value.split(' ');
    default:
      throw new Unreachable(decode);
  }
}

/**
 * @template NS
 * @template Tag
 * @param {NS} ns
 * @param {Tag} tag
 * @param {keyof ElementAttributesWriteOnly<ns, tag>} attr
 * @param {FindDomElement<ns, tag>} element
 * @param {any} valueIn
 */
export function setAttribute(ns, tag, attr, element, valueIn) {
  try {
    const { access, encode } = attributeMeta(ns, tag, attr);

    /** @type {any} */
    let valueEncoded;
    switch (encode) {
      case 'same':
        valueEncoded = valueIn;
        break;

      case '!!':
        valueEncoded = valueIn ? attr : undefined;
        break;

      case 'array-join-space':
        valueEncoded =  (valueIn).join(' ');
        break;

      default:
        throw new Unreachable(encode);
    }

    const sAttr = /** @type {any} - no sane way to type */ (attr);
    switch (access) {
      case 'getAttribute':
        if (valueEncoded == null) {
          element.removeAttribute(sAttr);
        } else {
          element.setAttribute(sAttr, valueEncoded);
        }
        break;

      case 'property': {
        let e = /** @type {any} - no sane way to type */ (element);
        e[attr] = valueEncoded;
        break;
      }

      default:
        throw new Unreachable(access);
    }
  } catch (e) {
    console.error('valid setting attribute');
    throw new SetAttributeError(ns, tag, attr, valueIn);
  }
}
