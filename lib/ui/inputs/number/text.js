/**
 * @import { El } from '../../../base/dom_ui/index.js';
 *
 * @typedef {(
 *   | { valid: true, value: number, text: string }
 *   | { valid: false, value: number | undefined, text: string }
 * )} NumberTextChangeEventDetails
 *
 * @typedef {'small' | 'medium'} ScaleAppearance
 */
import { Unreachable } from '../../../base/util/type.js';
import { setDisable } from '../../../base/util/dom.js';
import { eventFilterByElem } from '../../../base/util/dom.js';
import { render, updateOn } from '../../../base/dom_ui/index.js';
import { SharedStyleSheet } from '../../../base/dom_ui/shared_style_sheet.js';

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
  static sheet = new SharedStyleSheet('./lib/ui/inputs/number/text.css');
  static get observedAttributes() {
    return ['disabled', 'value', 'scale', 'showBorder'];
  }

  /** @type {ShadowRoot} */ #shadow;
  /** @type {HTMLInputElement | undefined} */ #input;
  /** @type {'float' | 'int'} */ #numberKind;
  /** @type {string} */ #text;
  /** @type {number} */ #min;
  /** @type {number} */ #max;
  /** @type {number} */ #inc;
  /** @type {ScaleAppearance} */ #appearanceScale;
  /** @type {boolean} */ #appearanceShowBorder;

  /**
   * @param {string} [text]
   * @param {number} [min]
   * @param {number} [max]
   * @param {number} [inc]
   * @param {'float' | 'int'} [numberKind]
   * @param {ScaleAppearance} [scale]
   * @param {boolean} [showBorder]
   */
  constructor(
      text='0',
      min = -Infinity,
      max = Infinity,
      inc = 1,
      numberKind = 'float',
      scale = 'medium',
      showBorder = true,
  ) {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#input = undefined;
    this.#text = text;
    this.#min = min;
    this.#max = max;
    this.#inc = inc;
    this.#numberKind = numberKind;
    this.#appearanceScale = scale;
    this.#appearanceShowBorder = showBorder;
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
    NumberTextInput.sheet.loadSheet(sheet => this.#shadow.adoptedStyleSheets = [sheet]);
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
    let diff = 0;
    const m = event.shiftKey ? 10 : 1;
    switch (event.key) {
      case 'ArrowUp':
        diff = this.#inc * m;
        break;
      case 'ArrowDown':
        diff = -(this.#inc * m);
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
   * @returns {HTMLInputElement}
   */
  #render() {
    const input = this.#input = render(['input', {
      type: 'text',
      value: this.#text,
      disabled: this.hasAttribute('disabled') || null,
    }]);
    this.setScaleAppearance(this.#appearanceScale);
    this.setShowBorderAppearance(this.#appearanceShowBorder);
    updateOn(this.shadowRoot, [input]);
    return input;
  }

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == newValue) return;

    switch (name) {
      case 'disabled':
        setDisable(this.#input, newValue);
        break;

      case 'value':
        this.#internalSetValue(newValue);
        break;

      case 'scale':
        if (!['small', 'medium'].includes(newValue)) break;
        this.setScaleAppearance(newValue);
        break;

      case 'show-border':
        this.setShowBorderAppearance(oldValue === false || oldValue !== 'false');
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

  /** @param {ScaleAppearance} scale */
  setScaleAppearance(scale) {
    this.#appearanceScale = scale;
    if (this.#input == null) return;

    switch (scale) {
      case 'small':
        this.#input.classList.add('small');
        this.#input.classList.remove('medium');
        break;

      case 'medium':
        this.#input.classList.remove('small');
        this.#input.classList.add('medium');
        break;
      default:
        throw new Unreachable(scale);
    }
  }

  /** @param {boolean} showBorder */
  setShowBorderAppearance(showBorder) {
    this.#appearanceShowBorder = showBorder;
    if (this.#input == null) return;
    if (showBorder) {
      this.#input.classList.remove('hide-border');
    } else {
      this.#input.classList.add('hide-border');
    }
  }
}

customElements.define('input-number-text', NumberTextInput);
