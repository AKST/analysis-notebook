/**
 * @import { El } from '../../base/dom_ui/index.js';
 */
import { updateOn } from '../../base/dom_ui/index.js';

export class ToggleInput extends HTMLElement {
  /** @type {boolean} */
  #initiallyChecked

  /** @type {HTMLInputElement | null} */
  checkbox = null;

  /** @param {boolean} initiallyChecked */
  constructor(initiallyChecked) {
    super();
    this.attachShadow({ mode: 'open' });
    this.#initiallyChecked = initiallyChecked
  }

  /**
   * @type {boolean}
   */
  get checked() {
    return this.checkbox?.checked ?? this.#initiallyChecked;
  }

  connectedCallback() {
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
    updateOn(this.shadowRoot, [
      ['link', { rel: 'stylesheet', href: './lib/ui/inputs/checkbox.css' }],
      ['span', { class: 'container' }, [
        this.checkbox,
        ['span', { class: 'box' }],
      ]],
    ]);
  }
}

customElements.define('input-checkbox-toggle', ToggleInput);
