import { generateCSS, updateOn } from '../../base/dom_ui/index.js';
import { colorHex, hexToColor } from '../../util/color/index.js';

function getStyles() {
  return generateCSS({
    ':host': {
      display: 'block',
    },
    '.color-input': {
      display: 'block',
      width: '100%',
      height: 24,
      outline: 'none',
      background: 'transparent',
      cursor: 'pointer',
      borderRadius: 0,
      padding: 0,
      border: 'var(--border-outset-grey)',
      '&::-webkit-color-swatch': {
        border: 'none',
      },
    },
  });
}

/**
 * Color Input Web Component
 * Based on RFC 006 - reusable input for use in knobs and other components
 */
export class ColorInput extends HTMLElement {
  static observedAttributes = ['value', 'disabled'];

  #value = 0xff0000; // Default red

  /**
   * @param {number} value
   */
  constructor(value) {
    super();
    this.#value = value
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
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
    updateOn(this.shadowRoot, [
      ['style', {}, [getStyles()]],
      ['input', {
        type: 'color',
        class: 'color-input',
        styles: {
          backgroundColor: colorHex(this.#value),
        },
        value: colorHex(this.#value),
        disabled: this.hasAttribute('disabled') || null,
      }, []]
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
