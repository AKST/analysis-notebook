import { generateCSS, updateOn } from '../../base/render_ui/index.js';

function getStyle() {
  return generateCSS({
    ':host': {
      display: 'block',
    },

    'input': {
      width: '100%',
      padding: [4, 8],
      border: 'var(--border-inset-grey)',
      borderRadius: 0,
      background: 'white',
      color: 'black',
      fontFamily: 'monospace',
      fontSize: 12,
      boxSizing: 'border-box',
    },

    'input:focus': {
      outline: 'none',
      borderColor: '#0084ff',
      boxShadow: '0 0 0 2px rgba(0, 132, 255, 0.2)',
    },

    'input:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    }
  });
}

/**
 * Text Input Web Component
 * Based on RFC 006 - reusable input for use in knobs and other components
 */
export class TextInput extends HTMLElement {
  static observedAttributes = ['value', 'placeholder', 'disabled'];

  /** @type {string | undefined} */
  placeholder;

  disabled = false;
  #value = '';

  /** @type {HTMLInputElement | null} */
  #input = null;

  /**
   * @param {string} [value='']
   * @param {string} [placeholder]
   * @param {boolean} [disabled=false]
   */
  constructor(value, placeholder, disabled) {
    super();
    this.attachShadow({ mode: 'open' });
    this.#value = value ?? '';
    this.disabled = disabled ?? false;
    this.placeholder = placeholder;
  }

  connectedCallback() {
    this.render();
    this.#input = /** @type {HTMLInputElement | null} */ (this.shadowRoot?.querySelector('input'));
    this.setupEventListeners();
  }

  /**
   * @param {string} name
   * @param {string | null} oldValue
   * @param {string | null} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.updateAttribute(name, newValue);
      this.render();
    }
  }

  setupEventListeners() {
    this.shadowRoot?.addEventListener('input', (e) => {
      if (!(e.target instanceof HTMLInputElement)) return
      this.#value = e.target.value;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.#value },
        bubbles: true
      }));
    });

    this.shadowRoot?.addEventListener('keydown', (e) => {
      if (!(e.target instanceof HTMLInputElement)) return
      if (!(e instanceof KeyboardEvent && e.key === 'Enter')) return;
      this.dispatchEvent(new CustomEvent('submit', {
        detail: { value: this.#value },
        bubbles: true
      }));
    });
  }

  /**
   * @param {string} value
   */
  setValue(value) {
    this.#value = value || '';
    if (this.#input) {
      this.#input.value = value;
    }
    this.render();
  }

  getValue() {
    return this.#value;
  }

  /**
   * @param {string} name
   * @param {any} value
   */
  updateAttribute(name, value) {
    switch (name) {
      case 'value':
        this.#value = value || '';
        if (this.#input) {
          this.#input.value = value;
        }
        break;
      case 'placeholder':
        this.placeholder = value;
        break;
      case 'disabled':
        this.disabled = value === 'disabled' || value === true;
    }
  }

  render() {
    updateOn(this.shadowRoot, [
      ['style', {}, [getStyle()]],
      ['input', {
        type: 'text',
        value: this.#value,
        placeholder: this.placeholder,
        disabled: this.disabled ? 'disabled' : undefined,
      }, []]
    ]);
  }
}

customElements.define('text-input', TextInput);
