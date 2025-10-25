/**
 * @import { El } from '../../../base/dom_ui/index.js';
 *
 * @typedef {(
 *   | { valid: true, value: number, text: string }
 *   | { valid: false, value: number | undefined, text: string }
 * )} NumberTextChangeEventDetails
 */
import { Unreachable } from '../../../base/util/type.js';
import { eventFilterByElem } from '../../../base/util/dom.js';
import { render, updateOn } from '../../../base/dom_ui/index.js';

/**
 * @extends {CustomEvent<NumberTextChangeEventDetails>}
 */
export class NumberTextChangeEvent extends CustomEvent {
  /**
   * @param {NumberTextChangeEventDetails} detail
   * @param {Omit<CustomEventInit<unknown>, 'detail'>} [init]
   */
  constructor(detail, init) {
    super('change', {
      bubbles: true,
      composed: true,
      ...init,
      detail,
    });
  }
}

export class NumberTextInput extends HTMLElement {
  static get observedAttributes() {
    return ['value'];
  }

  /** @type {ShadowRoot} */ #shadow;
  /** @type {HTMLInputElement | undefined} */ #input;
  /** @type {'float' | 'int'} */ #numberKind;
  /** @type {string} */ #text;
  /** @type {number} */ #min;
  /** @type {number} */ #max;
  /** @type {number} */ #inc;

  /**
   * @param {string} [text]
   * @param {number} [min]
   * @param {number} [max]
   * @param {number} [inc]
   * @param {'float' | 'int'} [numberKind]
   */
  constructor(
      text='0',
      min = -Infinity,
      max = Infinity,
      inc = 1,
      numberKind = 'float',
  ) {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#input = undefined;
    this.#text = text;
    this.#min = min;
    this.#max = max;
    this.#inc = inc;
    this.#numberKind = numberKind;
  }

  /**
   * @param {number} value
   * @param {number} [min]
   * @param {number} [max]
   */
  static createFromNumber(value, min, max) {
    return new NumberTextInput(`${value}`, min, max);
  }

  connectedCallback() {
    const input = this.#render();

    this.#shadow.addEventListener('input', (
      eventFilterByElem(InputEvent, input, this.onChange)
    ));

    this.#shadow.addEventListener('keydown', (
      eventFilterByElem(KeyboardEvent, input, this.onKeyPress)
    ));
  }

  /**
   * @param {HTMLInputElement} element
   * @param {InputEvent} _event
   */
  onChange = (element, _event) => {
    this.#internalSetValue(element.value);
  };

  /**
   * @param {HTMLInputElement} element
   * @param {KeyboardEvent} event
   */
  onKeyPress = (element, event) => {
    console.log(event.key);
    let diff = 0;
    switch (event.key) {
      case 'ArrowUp':
        diff = this.#inc;
        break;
      case 'ArrowDown':
        diff = -this.#inc;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (this.value == null) return;

    const update = this.value + diff;
    element.value = update+'';
    this.#internalSetValue(update+'');
  };

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) return;

    switch (name) {
      case 'value':
        this.#internalSetValue(newValue);
        break;
    }
  }

  /** @param {string} text */
  boardCastSet(text) {
    this.#internalSetValue(text);
  }

  get valid() {
    const value = this.value;
    if (value == null) return false;
    if (Number.isNaN(value)) return false;
    if (value > this.#max) return false;
    if (value < this.#min) return false;
    return true;
  }

  get text() { return this.#text; }
  set text(value) {
    this.#text = value;

    if (this.#input) {
      this.#input.value = value;
    }
  }

  /**
   * @type {number | undefined}
   */
  get value() {
    try {
      switch (this.#numberKind) {
        case 'int':
          return parseInt(this.#text, 10);

        case 'float':
          return parseFloat(this.#text);

        default:
          throw new Unreachable(this.#numberKind);
      }
    } catch (e) {
      console.info(e);
      return undefined;
    }
  }

  /**
   * @param {string} text
   */
  #internalSetValue(text) {
    this.#text = text;
    const valid = this.valid, value = this.value;
    if (!valid) {
      this.#input?.setCustomValidity("Field is invalid.");
      this.dispatchEvent(new NumberTextChangeEvent({
        text,
        valid: false,
        value,
      }));
    } else {
      this.#input?.setCustomValidity("");
      this.dispatchEvent(new NumberTextChangeEvent({
        text,
        valid: true,
        value: /** @type {any} */ (value),
      }));
    }
  }

  /**
   * @returns {HTMLInputElement}
   */
  #render() {
    const input = this.#input = render(['input', {
      type: 'text',
      value: this.#text,
    }]);
    updateOn(this.shadowRoot, [
      ['link', { rel: 'stylesheet', href: './lib/ui/inputs/number/text.css' }],
      ['div', { class: 'container' }, [input]],
    ]);
    return input;
  }
}

customElements.define('input-number-text', NumberTextInput);
