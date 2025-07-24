/**
 * @import { El } from '../../base/render_ui/index.js';
 */
import { generateCSS, updateOn } from '../../base/render_ui/index.js';

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
      ['span', { class: 'container' }, [
        ['style', {}, [getStyle()]],
        this.checkbox,
        ['span', { class: 'box' }],
      ]],
    ]);
  }
}

customElements.define('input-checkbox-toggle', ToggleInput);

function getStyle() {
  return generateCSS({
    ':host:not(:first-child)': {
      positive: 'relative',
    },
    '.container': {
      display: 'inline-block',
      position: 'relative',
    },
    '.checkbox': {
      '-webkit-appearance': 'none',
      display: 'inline-block',
      margin: 0,
      border: 'var(--border-inset-grey)',
      borderWidth: 2,
      padding: 0,
      appearance: 'none',
      width: 32,
      height: 16,
      verticalAlign: 'text-bottom',
      background: 'red',
      placeContent: 'center',
      cursor: 'pointer',
      '&:checked': {
        background: '#66ff00',
      },
    },
    '.box': {
      content: '',
      boxSizing: 'border-box',
      display: 'block',
      border: 'var(--border-outset-grey)',
      background: 'var(--bg-msgrey)',
      borderWidth: 2,
      position: 'absolute',
      top: 2,
      right: 2,
      height: 12,
      width: 14,
      pointerEvents: 'none',
    },
    '.checkbox:checked + .box': {
      transform: 'translateX(-14px)',
    },
  });
}
