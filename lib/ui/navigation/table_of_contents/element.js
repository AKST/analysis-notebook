/**
 * @import { TocItem } from './type.ts';
 */
import { renderOnto, render } from '../../../base/dom_ui/index.js';
import { SharedStyleSheet } from '../../../base/dom_ui/shared_style_sheet.js';

export class TableOfContentsMenu extends HTMLElement {
  static sheet = new SharedStyleSheet('./lib/ui/navigation/table_of_contents/style.css');

  /** @type {readonly TocItem[]} */ #items;
  /** @type {ShadowRoot} */ #root;

  #ul = document.createElement('ul');

  constructor() {
    super();
    this.#items = [];
    this.#root = this.attachShadow({ mode: 'open' });
    this.shadow = this.#root;
  }

  connectedCallback() {
    TableOfContentsMenu.sheet.install(this.#root);
    this.render();
  }

  render() {
    this.#ul.className = 'table-of-contents-list';
    renderOnto(this.shadow, [
      ['div', { class: 'layout' }, [this.#ul]],
    ]);
  }

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

customElements.define('navigation-toc', TableOfContentsMenu);
