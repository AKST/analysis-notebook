/**
 * @import { ComplexKnobConfig } from '@base/runtime/config/type.ts';
 * @import { KnobElement } from '../type.ts';
 * @import { ConfigKnobLabel } from '../common/label.js';
 */

import { ChangeKnobEvent } from '../events.js';
import { generateCSS, updateOn } from '../../../base/dom_ui/index.js';
import { NumberSliderInput, NumberSquareInput } from '../../inputs/index.js';
import '../common/label.js';

function getStyles() {
  return generateCSS({
    '.container': {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridGap: [8, 0]
    },
    'input-number-square': {
      gridColumn: 'span 4',
    },
    'input-number-slider': {
      gridColumn: 'span 4',
    }
  });
}

/**
 * @implements {KnobElement}
 */
export class ComplexKnob extends HTMLElement {
  gridColumn = 4;

  #x
  #y

  /** @type {ComplexKnobConfig} */
  #config

  /** @type {NumberSliderInput | null} */
  #yInput = null

  /** @type {NumberSliderInput | null} */
  #xInput = null

  /** @type {NumberSquareInput | null} */
  #squareInput = null

  /**
   * @param {ComplexKnobConfig} cfg
   * @param {ConfigKnobLabel | undefined} label
   * @param {[number, number] | undefined} value
   */
  constructor(cfg, label, value) {
    super();
    this.attachShadow({ mode: 'open' });
    this.label = label;
    this.#x = value ? value[0] : 0;
    this.#y = value ? value[1] : 0;
    this.#config = cfg;
  }

  setEnable() {
    throw new Error('setEnabled is not implemented on ComplexKnob');
  }

  /**
   * @returns {[[number, number], [number, number]]}
   */
  get #range () {
    const r = this.#config.range;
    if (r && typeof r[0] === 'number') {
      // @ts-ignore - its fine
      return [r, r]
    };
    return r ?? [[0, 1], [0, 1]];
  }

  setup() {
    const [xr, yr] = this.#range;

    this.#xInput = new NumberSliderInput(this.#x, ...xr);
    this.#yInput = new NumberSliderInput(this.#y, ...yr);
    this.#squareInput = new NumberSquareInput(this.#x, this.#y, ...xr, ...yr);
  }

  connectedCallback() {
    this.render();

    this.shadowRoot?.addEventListener('change', (e) => {
      const event = /** @type {any} */ (e);

      if (e.target === this.#squareInput) {
        const { x, y } = event.detail;
        this.#x = x;
        this.#y = y;

        this.#xInput?.setValue(x);
        this.#yInput?.setValue(y);
        this.dispatchChange();
      } else if (e.target === this.#xInput) {
        this.#x = event.detail.value;
        this.#squareInput?.setValues(this.#x, this.#y);
        this.dispatchChange();
      } else if (e.target === this.#yInput) {
        this.#y = event.detail.value;
        this.#squareInput?.setValues(this.#x, this.#y);
        this.dispatchChange();
      }
    });
  }

  render() {
    updateOn(this.shadowRoot, [
      ['style', {}, [getStyles()]],
      this.label,
      ['div', { class: 'container' }, [
        this.#squareInput,
        this.#xInput,
        this.#yInput,
      ]]
    ]);
  }

  dispatchChange() {
    this.dispatchEvent(new ChangeKnobEvent(
      { value: [this.#x, this.#y], child: [] },
      { bubbles: true },
    ));
  }

}

customElements.define('config-complex-knob', ComplexKnob);
