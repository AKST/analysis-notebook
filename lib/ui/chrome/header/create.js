/**
 * @import { AppHeaderCtrl } from './type.ts';
 */
import * as doc from '@base/dsl_dom/helper/html.js';
import { updateOn } from '@base/dsl_dom/render.js';
import { SharedStyleSheet } from '@base/dom_ui/shared_style_sheet.js';

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
      doc.header({ className: 'header' }).of(
        doc.div({ id: 'title' }).of(
          doc.slot({ name: 'title' }).of(),
        ),
        doc.div({ id: 'buttons' }).of(
          doc.slot({ name: 'buttons' }).of(),
        ),
      ),
    ]);
  }

  /** @param {HTMLElement} button */
  addButton(button) {
    button.setAttribute('slot', 'buttons');
    this.appendChild(button);
  }
}
