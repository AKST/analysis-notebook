/**
 * @import { El } from '@base/dom_ui/type.js';
 */
import { render, updateOn } from '@base/dom_ui/index.js';
import { SharedStyleSheet } from '@base/dom_ui/shared_style_sheet.js';

const STYLE_SHEET_PATH = import.meta.resolve('./select.css');

/**
 * @template {string} K
 * @template T
 */
export class TextSelect extends HTMLElement {
  static sheet = new SharedStyleSheet(STYLE_SHEET_PATH);

  /** @type {K} */ #active;
  /** @type {{ [P in K]: { label: string, value: T } }} */ #options
  /** @type {HTMLSelectElement | undefined} */ #select = undefined;
  /** @type {ShadowRoot} */ #root;

  /**
   * @param {K} active
   * @param {{ [P in K]: { label: string, value: T } }} options
   */
  constructor(active, options) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.#active = active;
    this.#options = options;
  }

  /** @type {T} */
  get value() {
    return this.#options[this.#active].value;
  }

  connectedCallback() {
    TextSelect.sheet.install(this.#root);
    const select = this.#select = document.createElement('select');
    for (const [k, { label }] of Object.entries(this.#options)) {
      const option = render(['option', {}, [label]]);
      option.value = k
      option.selected = this.#active === k;
      select.appendChild(option);
      if (this.#active === k) select.value = k;
    }

    updateOn(this.shadowRoot, [
      ['div', { class: 'container' }, [
        ['div', { class: 'fake-button' }, []],
        select,
      ]],
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
