/**
 * @import { ElAttributes, El as $Element, ElFragment as IFragment } from '../type.ts';
 * @import { EventRegistry } from './events.js';
 */
import { Unreachable } from '../../../util/type.js';
const xhtmlUri = 'http://www.w3.org/1999/xhtml';

/** @implements {IFragment} */
class FragmentDemarker {
  /**
   * @param {$Element[]} children
   */
  constructor(children) {
    this.children = children;
  }
}

/**
 * @param {$Element[]} children
 * @returns {IFragment}
 */
export function frag(children) {
  return new FragmentDemarker(children);
}

/**
 * @param {$Element[]} children
 * @returns {Generator<$Element, void, never>}
 */
function * flattenChildren(children) {
  for (const child of children) {
    if (child instanceof FragmentDemarker) {
      yield * flattenChildren(child.children);
    } else if (typeof child === 'number') {
      yield child+'';
    } else {
      yield child;
    }
  }
}

/**
 * @typedef {Object} ParsedElementSpec
 * @property {string} tagName
 * @property {string} [className]
 * @property {string} [ns]
 * @property {Object} [events]
 * @property {Record<string, any>} attributes
 * @property {any[]} children
 */

/**
 * @param {$Element} spec
 * @returns {ParsedElementSpec}
 */
function parseElementSpec(spec) {
  if (!Array.isArray(spec)) {
    console.error(spec);
    throw new Error('Element spec must be an array');
  }

  const atoms = new Set(['string', 'number']);

  /**
   * @param {any} children
   * @returns {$Element[]}
   */
  const handleChildren = children => {
    if (children instanceof FragmentDemarker) {
      return Array.from(flattenChildren(children.children))
    }
    if (atoms.has(typeof children)){
      return [children]
    }
    if (children == null) {
      return [];
    }
    return Array.from(flattenChildren(children));
  }

  const [tagName, secondArg, thirdArg] = spec;

  try {
    if (typeof secondArg === 'object' && !Array.isArray(secondArg)) {
      const { ns, className, events, ...attributes } = secondArg ?? {};
      return {
        tagName: tagName.toLowerCase(),
        className,
        ns,
        events,
        attributes,
        children: handleChildren(thirdArg)
      };
    } else {
      return {
        tagName: tagName.toLowerCase(),
        className: undefined,
        ns: undefined,
        events: undefined,
        attributes: {},
        children: handleChildren(secondArg)
      };
    }
  } catch (e) {
    console.error(spec);
    throw e;
  }
}

/**
 * @param {$Element} spec
 * @param {EventRegistry | undefined} eventRegistry
 * @param {string | undefined} [parentNS]
 * @returns {Element | Text}
 */
export function renderDocument(spec, eventRegistry, parentNS) {
  if (spec instanceof FragmentDemarker) {
    throw new Error('Unexpected Fragment');
  }

  if (spec == null || spec === false) {
    return document.createTextNode('');
  }

  if (typeof spec === 'string' || typeof spec === 'number') {
    return document.createTextNode(spec + '');
  }

  if (!Array.isArray(spec)) {
    console.error(spec);
    throw new Error('Document spec must be string or array');
  }

  const {
    ns = parentNS,
    tagName,
    className,
    events,
    attributes,
    children = [],
  } = parseElementSpec(spec);
  const element = ns == null
    ? document.createElement(tagName)
    : document.createElementNS(ns, tagName);

  if (className) {
    element.classList.add(...className.split(/\s+/).filter(s => !!s));
  }

  if (events && eventRegistry) {
    // @ts-ignore - compiler is unable to detect dataset on element
    element.dataset.eventsource = eventRegistry.register(events);
  }

  for (const [k, v] of Object.entries(attributes)) {
    switch (k) {
      case 'classList':
        element.className = v.join(' ');
        break;
      default:
        element.setAttribute(k, v);
    }
  }

  for (const child of children) {
    element.appendChild(renderDocument(child, eventRegistry, ns));
  }

  return element;
}

/**
 * @param {Element} domElement
 * @param {$Element} newSpec
 * @param {EventRegistry | undefined} eventRegistry
 * @param {string | undefined} [parentNS]
 * @returns {Element | Text | undefined}
 */
export function updateElement(
  domElement,
  newSpec,
  eventRegistry,
  parentNS,
) {
  if (typeof newSpec === 'number') newSpec = newSpec+'';

  if (typeof newSpec === 'string') {
    if (domElement.nodeType === document.TEXT_NODE) {
      if (domElement.textContent !== newSpec) {
        domElement.textContent = newSpec;
      }
      return;
    }
    return renderDocument(newSpec, eventRegistry, parentNS);
  }

  // Handle element -> text mismatch
  if (domElement.nodeType === document.TEXT_NODE) {
    return renderDocument(newSpec, eventRegistry, parentNS);
  }


  const domNS = domElement.namespaceURI === xhtmlUri
    ? undefined
    : domElement.namespaceURI;

  const {
    ns: specNS = parentNS,
    tagName,
    className: newClassName = '',
    events,
    attributes,
    children = [],
  } = parseElementSpec(newSpec);

  // Tag name mismatch - replace entire element
  if (domElement.tagName.toLowerCase() !== tagName || specNS !== domNS) {
    return renderDocument(newSpec, eventRegistry, specNS);
  }

  if (domElement.className !== newClassName) {
    domElement.setAttribute('class', newClassName);
  }

  for (const [key, val] of Object.entries(attributes)) {
    // @ts-ignore - typescript is a (1/10)x thinker
    const currVal = getAttribute(key, domElement);
    if (val === currVal) continue;

    // @ts-ignore - didn't ask tbh
    setAttribute(key, domElement, val);
  }

  if (events && eventRegistry) {
    // @ts-ignore - compiler is unable to detect dataset on element
    domElement.dataset.eventsource = eventRegistry.register(events);
  }

  const currentChildren = Array.from(domElement.childNodes);
  const targetLength = children.length;

  while (domElement.childNodes.length > targetLength) {
    // @ts-ignore - wont happen let it throw if it does
    domElement.removeChild(domElement.lastChild);
  }

  // Update/add children
  for (let i = 0; i < targetLength; i++) {
    const currentChild = /** @type {Element} */
      (currentChildren[i]);

    const newChild = children[i];

    if (currentChild) {
      const replacement = updateElement(currentChild, newChild, eventRegistry, specNS);
      if (replacement) {
        domElement.replaceChild(replacement, currentChild);
      }
    } else {
      domElement.appendChild(renderDocument(newChild, eventRegistry, specNS));
    }
  }
}

/**
 * @param {keyof ElAttributes} key
 * @param {HTMLElement} element
 * @returns {ElAttributes[key]}
 */
function getAttribute(key, element) {
  switch (key) {
    case 'ns':
      return element.namespaceURI ?? undefined;

    case 'classList':
      return Array.from(element.classList);

    case 'className':
      return element.className;

    case 'open':
      return !!element.getAttribute(key);

    case 'alt':
    case 'align':
    case 'columnalign':
    case 'colSpan':
    case 'color':
    case 'display':
    case 'fill':
    case 'fontsize':
    case 'font-size':
    case 'height':
    case 'href':
    case 'name':
    case 'rowSpan':
    case 'size':
    case 'src':
    case 'stroke':
    case 'stroke-width':
    case 'style':
    case 'target':
    case 'text-anchor':
    case 'title':
    case 'type':
    case 'value':
    case 'viewBox':
    case 'width':
    case 'x':
    case 'y':
      return element.getAttribute(key) ?? undefined;

    case 'class':
    case 'events':
      throw new Error('not supported');

    default:
      throw new Unreachable(key);
  }
}


/**
 * @param {keyof ElAttributes} key
 * @param {HTMLElement} element
 * @param {NonNullable<ElAttributes[key]>} value
 */
function setAttribute(key, element, value) {
  switch (key) {
    case 'classList':
      element.classList = (/** @type {string[]} */ (value)).join(' ');
      break;

    case 'className':
      element.className = (/** @type {string} */ (value));
      break;

    case 'alt':
    case 'align':
    case 'colSpan':
    case 'color':
    case 'display':
    case 'fill':
    case 'fontsize':
    case 'font-size':
    case 'height':
    case 'href':
    case 'name':
    case 'rowSpan':
    case 'size':
    case 'src':
    case 'stroke':
    case 'stroke-width':
    case 'style':
    case 'columnalign':
    case 'target':
    case 'text-anchor':
    case 'title':
    case 'type':
    case 'value':
    case 'viewBox':
    case 'width':
    case 'x':
    case 'y':
      element.setAttribute(key, (/** @type {string} */ (value)));
      break;

    case 'open':
      element.setAttribute(key, (/** @type {string} */ (value ? 'open' : '')));
      break;

    case 'ns':
    case 'class':
    case 'events':
      throw new Error('not supported');

    default:
      throw new Unreachable(key);
  }
}
