import * as doc from '@base/dsl_dom/helper/html.js';
import { updateOn } from '@base/dsl_dom/render.js';
import { SharedStyleSheet } from '@base/platform/styles/shared_style_sheet.js';
import { colorHex, hexToColor } from '@base/util/color/index.js';

/**
 * Color Input Web Component
 * Based on RFC 006 - reusable input for use in knobs and other components
 */
export class ColorInput extends HTMLElement {
  static sheet = new SharedStyleSheet('./lib/ui/inputs/color.css');
  static observedAttributes = ['value', 'disabled'];

  /** @type {ShadowRoot} */ #root;
  #value = 0xff0000; // Default red

  /**
   * @param {number} value
   */
  constructor(value) {
    super();
    this.#value = value
    this.#root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    ColorInput.sheet.install(this.#root);
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.shadowRoot?.addEventListener('change', (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.#value = hexToColor(e.target.value);
        this.updateInput()
        this.dispatchEvent(new CustomEvent('change', {
          detail: { value: this.#value },
          bubbles: true
        }));
      }
    });
  }

  /**
   * @param {number} value
   */
  setValue(value) {
    this.#value = value;
    this.updateInput();
  }

  getValue() {
    return this.#value;
  }

  updateInput() {
    const input = this.#input;
    if (input) {
      input.value = colorHex(this.#value);
      input.style.background = colorHex(this.#value)
    }
  }

  render() {
    updateOn(this.#root, [
      doc.input.css({
        backgroundColor: colorHex(this.#value),
      }).attr({
        type: 'color',
        className: 'color-input',
        value: colorHex(this.#value),
        disabled: this.hasAttribute('disabled'),
      })
    ]);
  }

  /**
   * @returns {HTMLInputElement | null}
   */
  get #input () {
    const colorInput = this.shadowRoot?.querySelector('.color-input');
    return colorInput ? /** @type {HTMLInputElement} */ (colorInput) : null;
  }
}

customElements.define('color-input', ColorInput);
