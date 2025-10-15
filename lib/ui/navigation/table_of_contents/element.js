/**
 * @import { TocItem } from './type.ts';
 */
import { renderOnto, render } from '../../../base/render_ui/index.js';

export class TableOfContentsMenu extends HTMLElement {
  /** @type {readonly TocItem[]} */ #items;

  #ul = document.createElement('ul');

  constructor() {
    super();
    this.#items = [];
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.#ul.className = 'listItems';
    renderOnto(this.shadow, [
      ['link', { rel: 'stylesheet', href: './lib/ui/navigation/table_of_contents/style.css' }],
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
      const listItem = render(['li', {}, [
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
