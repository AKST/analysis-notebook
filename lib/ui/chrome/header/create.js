/**
 * @import { AppHeaderCtrl } from './type.ts';
 */
import { SharedStyleSheet } from '@base/dom_ui/shared_style_sheet.js';
import { updateOn } from '@base/dom_ui/index.js';

/**
 * @returns {AppHeaderCtrl}
 */
export function installHeader() {
  customElements.define('app-header', AppHeader);
  const oldHeader = document.querySelector('header');
  if (oldHeader == null) throw new Error('weird... app header is missing');

  const header = new AppHeader();
  header.replaceChildren(...oldHeader.childNodes);

  for (const attr of Array.from(oldHeader.attributes)) {
    header.setAttribute(attr.name, attr.value);
  }

  oldHeader.replaceWith(header);
  return { header };
}

export class AppHeader extends HTMLElement {
  static sheet = new SharedStyleSheet(import.meta.resolve('./styles.css'));
  #root = this.attachShadow({ mode: 'open' });

  connectedCallback() {
    AppHeader.sheet.install(this.#root);
    updateOn(this.#root, [
      ['header', { class: 'header' }, [
        ['div', { id: 'title' }, [
          ['slot', { name: 'title' }, []],
        ]],
        ['div', { id: 'buttons' }, [
          ['slot', { name: 'buttons' }, []],
        ]],
      ]],
    ]);
  }

  /** @param {HTMLElement} button */
  addButton(button) {
    button.setAttribute('slot', 'buttons');
    this.appendChild(button);
  }
}
