import { clamp } from '@base/util/number.js';
import { generateCSS, updateOn } from '@base/dom_ui/index.js';
import { SharedStyleSheet } from '@base/dom_ui/shared_style_sheet.js';
import { isChrome } from '@base/util/xplatform.js';

function getStyles() {
  const inputPadding = 4;
  const inputHeight = 22;
  const borderWidth = 2;
  const spinWidth = 16;
  const spinGap = borderWidth + 2;

  let inputWidth;
  let spanOpacity;

  if (isChrome()) {
    inputWidth = '100%';
    spanOpacity = '0';
  } else {
    inputWidth = `calc(100% - ${spinWidth+spinGap}px)`;
    spanOpacity = '1';
  }

  return generateCSS({
    ':host': {
      '--input-height': inputHeight,
      '--spin-width': spinWidth,
      '--border-width': borderWidth,
      '--span-opacity': spanOpacity,
      '--input-padding': inputPadding,
      '--width': inputWidth,
    },
  });
}

export class NumberTickerInput extends HTMLElement {
  static sheet = new SharedStyleSheet('./lib/ui/inputs/number/ticker.css');

  /** @type {ShadowRoot} */
  #root;

  /** @type {HTMLInputElement | null} */
  #input = null;

  #initialValue = 0;
  /** @type {number | null} */
  #min = null;
  /** @type {number | null} */
  #max = null;
  /** @type {number | 'any'} */
  #step = 'any';

  /**
   * @param {number} value
   * @param {number | null} min
   * @param {number | null} max
   * @param {number | 'any'} [step='any']
   */
  constructor(value, min, max, step = 'any') {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.#initialValue = value;
    this.#min = min;
    this.#max = max;
    this.#step = step;
  }

  /**
   * @returns {number}
   */
  get value () {
    const value = this.#input?.value
    return typeof value === 'string'
      ? parseFloat(value)
      : (value ?? 0)
  }

  connectedCallback() {
    NumberTickerInput.sheet.install(this.#root);
    this.render();
    this.shadowRoot?.addEventListener('change', e => {
      this.dispatchEvent(new CustomEvent('change', {
        ...e,
        detail: { value: this.value },
        bubbles: true,
      }));
    });
  }

  render() {
    updateOn(this.shadowRoot, [
      ['style', null, [getStyles()]],
      ['div', null, [
        ['input', {
          type: 'number',
          class: isChrome() ? undefined : 'webkit-input',
          value: this.#initialValue,
          min: this.#min,
          max: this.#max,
          step: this.#step,
        }, []],
        ['span', { id: 'a' }, ['+']],
        ['span', { id: 'b' }, ['-']],
      ]],
    ]);

    this.#input = /** @type {HTMLInputElement | null} */ (this.shadowRoot?.querySelector('input'));

  }

  /**
   * @param {number} value
   */
  setValue(value) {
    this.#setValue(value);
    this.render();
  }

  /**
   * @param {number} value
   */
  #setValue(value) {
    if (!this.#input) return;
    this.#input.value = String(clamp(value, this.#min, this.#max));
  }
}

customElements.define('input-number-ticker', NumberTickerInput);
