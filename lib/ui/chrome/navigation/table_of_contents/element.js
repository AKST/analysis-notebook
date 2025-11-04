/**
 * @import { TocItem } from './type.ts';
 */
import { renderOnto, render } from '@base/dom_ui/index.js';
import { SharedStyleSheet } from '@base/dom_ui/shared_style_sheet.js';
import { TableOfContentsSelectEvent } from '../events.js';

export class TableOfContentsMenu extends HTMLElement {
  static sheet = new SharedStyleSheet(import.meta.resolve('./style.css'));

  /** @type {readonly TocItem[]} */ #items;
  /** @type {ShadowRoot} */ #root;

  /** @type {HTMLElement} */
  #ul = render(['ul', { style: 'opacity: 0' }, []]);

  constructor() {
    super();
    this.#items = [];
    this.#root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    TableOfContentsMenu.sheet.install(this.#root);
    this.render();
    this.#root.addEventListener('click', this.#listenForAnchorClick);
    this.#fadeIn();
  }

  async #fadeIn() {
    await TableOfContentsMenu.sheet.sheetPromise;
    this.#root.getElementById('loader')?.remove();
    this.#ul.style.opacity = '1';
  }

  disconnectCallback() {
    this.#root.removeEventListener('click', this.#listenForAnchorClick);
  }

  render() {
    this.#ul.className = 'table-of-contents-list';
    renderOnto(this.#root, [
      ['p', { id: 'loader' }, ['Loading...']],
      ['div', { class: 'layout' }, [this.#ul]],
    ]);
  }

  /**
   * @param {Event} event
   */
  #listenForAnchorClick = event => {
    if (!(event instanceof MouseEvent)) return;
    const { target } = event;
    if (!(target instanceof HTMLAnchorElement)) return;
    const id = idFromHash(target.href);
    this.dispatchEvent(new TableOfContentsSelectEvent({ id }, {
      bubbles: true,
      composed: true,
    }));
  };

  /**
   * @param {readonly TocItem[]} items
   */
  set items (items) {
    /** @type {Node[]} */
    const children = [];

    for (const item of items) {
      if (!item.title) continue;
      const listItem = render(['li', {
          style: `
            margin-left: ${8 * (item.titleLevel - 1)}px;
            background: lch(from var(--bg-black) calc(l * (${65 - item.titleLevel}/64)) c h);
          `,
          class: 'list-item',
        }, [
        ['a', { href: `#${item.titleId}` }, [item.title]],
        ['span', { class: 'dots' }],
      ]]);
      children.push(listItem);
    }
    this.#ul.replaceChildren(...children);
    this.#items = items;
  }
}

/** @param {string} hash */
export function idFromHash(hash) {
  return hash.slice(hash.indexOf('#')+1);
}

customElements.define('navigation-toc', TableOfContentsMenu);
