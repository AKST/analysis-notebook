/**
 * @import { El } from '@base/dsl_dom/type.ts';
 */
import * as doc from '@base/dsl_dom/helper/html.js';
import { updateOn } from '@base/dsl_dom/render.js';
import { SharedStyleSheet } from '@base/platform/styles/shared_style_sheet.js';

export class ToggleInput extends HTMLElement {
  static sheet = new SharedStyleSheet('./lib/ui/inputs/checkbox.css');

  /** @type {boolean} */
  #initiallyChecked

  /** @type {ShadowRoot} */
  #root;

  /** @type {HTMLInputElement | null} */
  checkbox = null;

  /** @param {boolean} initiallyChecked */
  constructor(initiallyChecked) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.#initiallyChecked = initiallyChecked
  }

  /**
   * @type {boolean}
   */
  get checked() {
    return this.checkbox?.checked ?? this.#initiallyChecked;
  }

  connectedCallback() {
    ToggleInput.sheet.install(this.#root);

    const checkbox = this.checkbox = document.createElement('input');
    checkbox.checked = this.#initiallyChecked
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';

    this.render();

    this.checkbox.addEventListener('change', (e) => {
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: checkbox.checked },
        bubbles: true
      }));
    });
  }

  /**
   * @param {boolean} value
   */
  setValue(value) {
    if (this.checkbox) {
      this.checkbox.checked = value;
    } else {
      this.#initiallyChecked = value;
    }
  }

  getValue() {
    return this.checkbox?.checked ?? this.#initiallyChecked;
  }

  render() {
    updateOn(this.#root, [
      doc.span({ className: 'container' }).c(
        this.checkbox,
        doc.span.void({ className: 'box' }),
      ),
    ]);
  }
}

customElements.define('input-checkbox-toggle', ToggleInput);
