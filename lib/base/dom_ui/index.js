/**
 * @import { El, ElTopLevel, ElNode } from './type.ts'
 */

import { enumerate } from '../util/enumerate.js';

export { generateCSS } from './css.js';

/**
 * @type {{
 *   <TagName extends keyof HTMLElementTagNameMap>(def: ElNode<TagName>): HTMLElementTagNameMap[TagName];
 *   (def: El): (Element | Text);
 * }}
 */
export const render = (/** @type {El} */ def) => {
  try {
    if (!def) {
      /** @ts-ignore - dsl */
      return document.createTextNode('');
    } else if (typeof def === 'string') {
      try {
        /** @ts-ignore - dsl */
        return document.createTextNode(def);
      } catch (e) {
        console.error('invalid text node');
        throw e;
      }
    } else if (def instanceof Node) {
      /** @ts-ignore - dsl */
      return def;
    } else {
      let element;
      try { element = document.createElement(def[0]); } catch (e) {
        console.error('failed to create element');
        throw e
      }

      if (def[1] != null) {
        const { events = {}, styles = {}, dataset = {}, ...other } = def[1];

        // we want to move away from using events here because
        // it makes the update logic too complicated, but also
        // having a single event handler is more efficent.

        for (const [key, value] of Object.entries(events)) {
          try { element.addEventListener(key, value) } catch (e) {
            console.error('failed to add event listener');
            throw e;
          }
        }

        for (const [key, value] of Object.entries(styles)) {
          // @ts-ignore - I didn't ask
          element.style[key] = value;
        }

        for (const [key, value] of Object.entries(dataset)) {
          try { element.dataset[key] = value; } catch (e) {
            console.error('failed to set data');
            throw e;
          }
        }

        for (const [key, value] of Object.entries(other)) {
          if (value == null) continue
          try { element.setAttribute(key, value) } catch (e) {
            console.error('falied to set attribute', key, value);
            throw e;
          };
        }
      }

      const children = def[2] ?? []
      for (const child of children.map(render)) {
        element.appendChild(child);
      }
      /** @ts-ignore - dsl */
      return element;
    }
  } catch (e) {
    console.error(def);
    throw e
  }
};

/**
 * @param {Node} parent
 * @param {El[]} defs
 */
export function renderOnto(parent, defs) {
  for (const child of defs.map(render)) {
    parent.appendChild(child);
  }
}

/**
 * @param {Node | null} domElement
 * @param {El[]} vElements
 */
export function updateOn(domElement, vElements) {
  if (domElement == null) return;

  // @ts-ignore - childNodes is safe enough
  for (const [i, el] of enumerate(domElement.childNodes)) {
    updateElement(/** @type {Element} */ (el), domElement, vElements[i]);
  }

  if (domElement.childNodes.length < vElements.length) {
    const l = domElement.childNodes.length
    renderOnto(domElement, vElements.slice(l));
  }
}

/**
 * @param {Element} node
 * @param {Node} parent
 * @param {El} vElement
 * @returns {boolean}
 */
export function updateElement(node, parent, vElement) {
  try {
    if (!vElement) {
      if (node) {
        const emptyTextNode = document.createTextNode('');
        parent.insertBefore(emptyTextNode, node);
        parent.removeChild(node);
      }
      return true;
    }

    if (typeof vElement === 'string') {
      if (node.nodeType === document.TEXT_NODE && node.textContent === vElement) {
        return false;
      }
      parent.insertBefore(render(vElement), node);
      parent.removeChild(node);
      return true;
    }

    if (
      vElement instanceof Node
    ) {
      if (node !== vElement) {
        parent.insertBefore(vElement, node);
        parent.removeChild(node);
        return true;
      }
      return false;
    }

    const [tagName, attributes = {}, children = []] = vElement;
    const domElement = /* @type {Element} */ (node);

    if (domElement.tagName.toLowerCase() !== tagName.toLowerCase()) {
      parent.insertBefore(render(vElement), domElement);
      parent.removeChild(domElement);
      return true;
    }

    const currLen = domElement.childNodes.length;
    const virtLen = children.length;

    while (domElement.childNodes.length > virtLen) {
      // @ts-ignore - wont happen let it throw if it does
      domElement.removeChild(domElement.lastChild);
    }


    // @ts-ignore - wont happen let it throw if it does
    for (const [i, el] of enumerate(domElement.childNodes)) {
      updateElement(/** @type {Element} */ (el), domElement, children[i]);
    }

    if (currLen < virtLen) {
      renderOnto(domElement, children.slice(currLen));
    }

    const { styles = {}, dataset = {}, ...otherAttrs } = attributes ?? {};
    const dAttrSet = new Set(domElement.getAttributeNames());
    const vAttrSet = new Set(Object.keys(otherAttrs));

    for (const dAttr of dAttrSet) {
      if (!vAttrSet.has(dAttr)) {
        domElement.removeAttribute(dAttr)
      }
    }

    for (const [vAttr, value] of Object.entries(otherAttrs)) {
      if (value == null) {
        if (dAttrSet.has(vAttr)) {
          domElement.removeAttribute(vAttr)
        }
      } else {
        if (!dAttrSet.has(vAttr) || domElement.getAttribute(vAttr) !== value) {
          domElement.setAttribute(vAttr, value)
        }
      }
    }

    for (const [key, value] of Object.entries(dataset)) {
      // @ts-ignore - compiler is unable to detect dataset on element
      if (domElement.dataset[key] !== value) {
        // @ts-ignore - compiler is unable to detect dataset on element
        domElement.dataset[key] = value;
      }
    }

    if (domElement instanceof HTMLElement) {
      for (const [key, value] of Object.entries(styles)) {
        // @ts-ignore - i'm sick of this
        if (domElement.style[key] !== value) {
          // @ts-ignore - ...
          domElement.style[key] = value;
        }
      }
    }

    return false;
  } catch (e) {
    console.error(e);
    throw e
  }
}
