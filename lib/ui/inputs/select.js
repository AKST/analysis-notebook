import { updateOn } from '../../base/dom_ui/index.js';

/**
 * @template {string} K
 * @template T
 */
export class TextSelect extends HTMLElement {
  /** @type {K} */ #active;
  /** @type {{ [P in K]: { label: string, value: T } }} */ #options
  /** @type {HTMLSelectElement | undefined} */ #select = undefined;

  /**
   * @param {K} active
   * @param {{ [P in K]: { label: string, value: T } }} options
   */
  constructor(active, options) {
    super();
    this.attachShadow({ mode: 'open' });
    this.#active = active;
    this.#options = options;
  }

  /** @type {T} */
  get value() {
    return this.#options[this.#active].value;
  }

  connectedCallback() {
    const select = this.#select = document.createElement('select');
    for (const [k, { label }] of Object.entries(this.#options)) {
      const option = document.createElement('option');
      option.appendChild(document.createTextNode(label));
      option.value = k
      option.selected = this.#active === k;
      select.appendChild(option);
      if (this.#active === k) select.value = k;
    }

    updateOn(this.shadowRoot, [
      select,
    ]);

    this.shadowRoot?.addEventListener('change', e => {
      if (e.target !== this.#select) return;
      this.#active = /** @type {K} */ (select.value);
      const option = this.#options?.[this.#active];
      if (option == null) throw new TypeError();
      const value = option.value;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value },
        bubbles: true
      }));
    });
  }
}

customElements.define('input-text-select', TextSelect);
