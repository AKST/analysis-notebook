/**
 * @import { TocItem } from './type.ts';
 * @import { E } from '@base/dsl-dom/type.ts';
 */
import * as doc from '@base/dsl-dom/helper/html.js';
import { updateOn, render } from '@base/dsl-dom/render.js';
import { SharedStyleSheet } from '@base/platform/styles/shared-style-sheet.js';
import { TableOfContentsSelectEvent } from '../events.js';

export class TableOfContentsMenu extends HTMLElement {
  static sheet = new SharedStyleSheet(import.meta.resolve('./style.css'));
  #ul = render(doc.ul.css({ opacity: '0' }).c());

  /** @type {readonly TocItem[]} */ #items;
  /** @type {ShadowRoot} */ #root;

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
    updateOn(this.#root, [
      doc.p({ id: 'loader' }).t`Loading...`,
      doc.div({ className: 'layout' }).c(this.#ul),
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
    /** @type {E.Item[]} */
    const children = [];

    for (const item of items) {
      if (!item.title) continue;

      const luma = 65 - item.titleLevel;
      const listItem = doc.li({ className: 'list-item' }).css({
        marginLeft: `${8 * (item.titleLevel - 1)}px`,
        background: `lch(from var(--bg-black) calc(l * (${luma}/64)) c h)`,
      }).c(
        doc.a({ href: `#${item.titleId}` }).c(item.title),
        doc.span.void({ className: 'dots' }),
      );

      children.push(listItem);
    }

    updateOn(this.#ul, children);

    this.#items = items;
  }
}

/** @param {string} hash */
export function idFromHash(hash) {
  return hash.slice(hash.indexOf('#')+1);
}

customElements.define('navigation-toc', TableOfContentsMenu);
