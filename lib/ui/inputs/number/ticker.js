import { clamp } from '../../../base/util/number.js';
import { generateCSS, updateOn } from '../../../base/dom_ui/index.js';
import { isChrome } from '../../../base/util/xplatform.js';

function getStyles() {
  const padding = 4;
  const height = 22;
  const borderWidth = 2;
  const spinWidth = 16;
  const spinGap = borderWidth + 2;

  let width;
  let spanOpacity;
  let spinnerStyle;
  if (isChrome()) {
    width = '100%';
    spanOpacity = '0';
    spinnerStyle = undefined;
  } else {
    width = `calc(100% - ${spinWidth+spinGap}px)`;
    spanOpacity = '1';
    spinnerStyle = {
      '-webkit-appearance': 'none',
      border: 'var(--border-outset-grey)',
      background: 'var(--bg-msgrey)',
      opacity: 1,
      height,
      top: 0,
      bottom: 0,
      borderWidth,
      boxSizing: 'border-box',
      position: 'absolute',
      width: spinWidth,
      right: 0,
    };
  }

  return generateCSS({
    'div': {
      position: 'relative',
      width: '100%',
      height,
    },
    'input': {
      display: 'block',
      boxSizing: 'border-box',
      minWidth: 0,
      width,
      height,
      margin: 0,
      padding,
      border: 'var(--border-inset-grey)',
      borderWidth,
      fontFamily: 'inherit',
      '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': spinnerStyle,
    },
    'span': {
      opacity: spanOpacity,
      margin: 0,
      padding: 0,
      background: 'var(--bg-msgrey)',
      boxSizing: 'border-box',
      display: 'block',
      position: 'absolute',
      right: 0,
      height: (height/2),
      width: spinWidth,
      border: 'var(--border-outset-grey)',
      borderWidth,
      pointerEvents: 'none',
      lineHeight: '0.7',
      color: 'black',
      fontSize: 9,
      fontFamily: 'inherit',
      textAlign: 'center',
    },
    '#a': {
      bottom: (height/2),
      borderTopColor: 'transparent',
    },
    '#b': {
      top: (height/2),
      borderBottomColor: 'transparent',
    },
  });
}

export class NumberTickerInput extends HTMLElement {
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
    this.attachShadow({ mode: 'open' });
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
