import { clamp } from '@base/util/number.js';
import * as doc from '@base/dsl-dom/helper/html.js';
import { updateOn } from '@base/dsl-dom/render.js';
import { generateCSS } from '@base/platform/styles/css.js';
import { SharedStyleSheet } from '@base/platform/styles/shared-style-sheet.js';
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
  static sheet = new SharedStyleSheet(import.meta.resolve('./ticker.css'));

  /** @type {ShadowRoot} */
  #root;

  /** @type {HTMLInputElement | null} */
  #input = null;

  #initialValue = 0;
  /** @type {number | undefined} */
  #min = undefined;
  /** @type {number | undefined} */
  #max = undefined;
  /** @type {number | 'any'} */
  #step = 'any';

  /**
   * @param {number} value
   * @param {number | undefined} min
   * @param {number | undefined} max
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
    updateOn(this.#root, [
      doc.style.c(getStyles()),
      doc.div.c(
        doc.input({
          type: 'number',
          className: isChrome() ? undefined : 'webkit-input',
          value: this.#initialValue,
          min: this.#min,
          max: this.#max,
          step: this.#step,
        }),
        doc.span({ id: 'a' }).c('+'),
        doc.span({ id: 'b' }).c('-'),
      ),
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
    this.#input.value = String(clamp(value, this.#min ?? null, this.#max ?? null));
  }
}

customElements.define('input-number-ticker', NumberTickerInput);
