/**
 */
import { render, updateOn } from '@base/dom_ui/index.js';
import { SharedStyleSheet } from '@base/dom_ui/shared_style_sheet.js';
import { setDisable } from '@base/util/dom.js';
import { NumberTextChangeEvent, NumberTextInput } from './text.js';

/**
 * Number Input Web Component with slider and number input
 * Based on RFC 006 - reusable input for use in knobs and other components
 */
export class NumberSliderInput extends HTMLElement {
  static sheet = new SharedStyleSheet('./lib/ui/inputs/number/slider.css');
  static observedAttributes = ['value', 'min', 'max', 'step', 'disabled'];

  /** @type {ShadowRoot} */
  #root;

  /** @type {HTMLInputElement | undefined} */
  #inputSlide = undefined;
  /** @type {NumberTextInput | undefined} */
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
    this.#root = this.attachShadow({ mode: 'open' });
    this.#value = value;
    this.#min = min;
    this.#max = max;
    this.#step = step;
  }

  connectedCallback() {
    NumberSliderInput.sheet.install(this.#root);
    this.render();

    this.shadowRoot?.addEventListener('change', (e) => {
      if (!(e instanceof NumberTextChangeEvent)) return;
      if (!e.detail.valid) return;
      this.handleChange(e.detail.value);
    });

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
    this.updateInputs();
  }

  /**
   * @param {string} value
   */
  #setStrValue(value) {
    const valueClean = typeof value === 'string'
      ? parseFloat(value) || 0
      : value;
    this.#setValue(valueClean);
  }

  /**
   * @param {number} value
   */
  #setValue(value) {
    this.#value = Math.max(this.#min, Math.min(this.#max, value));
  }

  /**
   * @param {number} value
   */
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
   * @param {number | string} value
   */
  handleChange(value) {
    if (typeof value === 'string') {
      this.#setStrValue(value);
    } else {
      this.#setValue(value);
    }
    this.updateInputs();
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.#value },
      bubbles: true
    }));
  }

  updateInputs() {
    const slider = /** @type {HTMLInputElement | null} */ (this.shadowRoot?.querySelector('.slider'));

    if (slider && !this.#dragging) slider.value = String(this.#value);
    if (this.#inputNumber) {
      this.#inputNumber.text = this.#value.toFixed(2);
    }
  }

  render() {
    this.#inputSlide = render(['input', {
      type: 'range',
      class: 'slider',
      min: this.#min.toString(),
      max: this.#max.toString(),
      step: this.#step,
      value: this.#value.toString(),
      disabled: this.hasAttribute('disabled') || null,
    }, []]);

    this.#inputNumber = new NumberTextInput(
      this.#value.toString(),
      this.#min,
      this.#max,
      typeof this.#step === 'string' ? 1 : this.#step,
      'float',
      'small',
      false,
    );
    this.#inputNumber.className = 'number-input';
    setDisable(this.#inputNumber, this.hasAttribute('disabled'));

    updateOn(this.shadowRoot, [
      ['div', { class: 'container' }, [
        this.#inputSlide,
        this.#inputNumber,
      ]]
    ]);
  }
}

customElements.define('input-number-slider', NumberSliderInput);
