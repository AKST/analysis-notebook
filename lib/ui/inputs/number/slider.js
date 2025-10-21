import { render, generateCSS, updateOn } from '../../../base/dom_ui/index.js';
import { setDisable } from '../../../util/dom.js';

function getStyles() {
  return generateCSS({
    '.container': {
      display: 'grid',
      gridTemplateColumns: '1fr 40px',
      gridGap: 16,
    },
    '.slider, .number-input': {
      display: 'block',
      margin: 0,
      appearance: 'none',
      outline: 'none',
      '&:disabled': {
        opacity: '0.5',
      },
    },
    '.slider': {
      gridColumn: '1fr',
      width: '100%',
      height: 16,
      background: 'var(--bg-msgrey)',
      boxSizing: 'content-box',
      border: 'var(--border-inset-grey)',
      '&::-webkit-slider-track': {
        width: '100%',
        height: 4,
        background: '#555',
      },
      '&::-webkit-slider-thumb': {
        appearance: 'none',
        width: 16,
        height: 16,
        background: 'var(--bg-msgrey)',
        cursor: 'pointer',
        border: 'var(--border-outset-grey)',
      },
      '&::-moz-range-track': {
        width: '100%',
        height: 4,
        background: '#555',
        border: 'none'
      },
      '&::-moz-range-thumb': {
        width: 16,
        height: 16,
        background: '#007acc',
        cursor: 'pointer',
        border: 'none'
      },
    },
    '.number-input': {
      gridColumn: 'span 1',
      borderRadius: 0,
      background: 'transparent',
      border: 'none',
      fontSize: '0.775rem',
      fontFamily: 'inherit',
      color: 'inherit',
      minWidth: 0,
      '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
    },
  });
}

/**
 * Number Input Web Component with slider and number input
 * Based on RFC 006 - reusable input for use in knobs and other components
 */
export class NumberSliderInput extends HTMLElement {
  static observedAttributes = ['value', 'min', 'max', 'step', 'disabled'];

  /** @type {HTMLInputElement | undefined} */
  #inputSlide = undefined;
  /** @type {HTMLInputElement | undefined} */
  #inputNumber = undefined;
  #value = 0;
  #min = 0;
  #max = 1;

  /** @type {number | string} [step='any'] */
  #step = 'any';

  #dragging = false;

  /**
   * @param {number} [value=0]
   * @param {number} [min=0]
   * @param {number} [max=1]
   * @param {number | string} [step='any']
   */
  constructor(value = 0, min = 0, max = 1, step = 'any') {
    super();
    this.attachShadow({ mode: 'open' });
    this.#value = value;
    this.#min = min;
    this.#max = max;
    this.#step = step;
  }

  connectedCallback() {
    this.render();

    this.shadowRoot?.addEventListener('input', (e) => {
      if (!(e.target instanceof HTMLInputElement)) return;
      if (!(e.target.matches('.slider, .number-input'))) return;
      this.handleChange(e.target.value);
    });

    this.shadowRoot?.addEventListener('pointerdown', (e) => {
      if (!(e instanceof PointerEvent)) return;
      if (!(e.target instanceof HTMLElement)) return;
      if (!e.target.matches('.slider')) return;

      this.#dragging = true;
      if (e.pointerType === 'touch') e.preventDefault();
    });

    this.shadowRoot?.addEventListener('pointerup', (e) => {
      if (!(e.target instanceof HTMLElement)) return;
      if (!(e.target.matches('.slider'))) return;
      this.#dragging = false;
    });
  }

  /**
   * @param {number} value
   */
  setValue(value) {
    this.#setValue(value);
    this.render();
  }

  /**
   * @param {number | string} value
   */
  #setValue(value) {
    const valueClean = typeof value === 'string'
      ? parseFloat(value) || 0
      : value;
    this.#value = Math.max(this.#min, Math.min(this.#max, valueClean));
  }

  /**
   * @param {string} name
   * @param {unknown} _
   * @param {string} value
   */
  attributeChangedCallback(name, _, value) {
    switch (name) {
      case 'disabled':
        setDisable(this.#inputSlide, value);
        setDisable(this.#inputNumber, value);
        break;
      case 'value':
        this.setValue(parseFloat(value) || 0);
        break;
      case 'min':
        this.#min = parseFloat(value) || 0;
        break;
      case 'max':
        this.#max = parseFloat(value) || 1;
        break;
      case 'step':
        this.#step = value || 'any';
        break;
    }
  }

  /**
   * @param {string} value
   */
  handleChange(value) {
    this.#setValue(value);
    this.updateInputs();
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.#value },
      bubbles: true
    }));
  }

  updateInputs() {
    const slider = /** @type {HTMLInputElement | null} */ (this.shadowRoot?.querySelector('.slider'));
    const numberInput = /** @type {HTMLInputElement | null} */ (this.shadowRoot?.querySelector('.number-input'));

    if (slider && !this.#dragging) slider.value = String(this.#value);
    if (numberInput) numberInput.value = this.#value.toFixed(2);
  }

  render() {
    // @ts-ignore - dw
    this.#inputSlide = render(['input', {
      type: 'range',
      class: 'slider',
      min: this.#min.toString(),
      max: this.#max.toString(),
      step: this.#step,
      value: this.#value.toString(),
      disabled: this.hasAttribute('disabled') || null,
    }, []]);

    // @ts-ignore - dw
    this.#inputNumber = render(['input', {
      type: 'number',
      class: 'number-input',
      min: this.#min.toString(),
      max: this.#max.toString(),
      step: this.#step,
      value: this.#value.toFixed(2),
      disabled: this.hasAttribute('disabled') || null,
    }, []]);

    updateOn(this.shadowRoot, [
      ['style', {}, [getStyles()]],
      ['div', { class: 'container' }, [
        this.#inputSlide,
        this.#inputNumber,
      ]]
    ]);
  }
}

customElements.define('input-number-slider', NumberSliderInput);
