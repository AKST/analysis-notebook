/**
 * @import { CurveKnobConfig } from '@base/runtime/config/type.ts';
 * @import { KnobElement } from '../type.ts';
 * @import { ConfigKnobLabel } from '../common/label.js';
 */

import * as doc from '@base/dsl_dom/helper/html.js';
import { render, updateOn } from '@base/dsl_dom/render.js';
import { generateCSS } from '@base/platform/styles/css.js';
import { ChangeKnobEvent } from '../events.js';
import {
  NumberTickerInput,
  NumberSliderInput,
  ToggleInput,
} from '@ui/inputs/index.js';
import '../common/label.js';

function getStyles() {
  return generateCSS({
    '.container': {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridGap: [8, 0]
    },
    ':is(input-number-slider,input-number-ticker)': {
      gridColumn: 'span 4',
    }
  });
}

/**
 * @implements {KnobElement}
 */
export class CurveKnob extends HTMLElement {
  gridColumn = 4;

  /** @type {ShadowRoot} */
  #root;

  #a
  #b

  /** @type {CurveKnobConfig} */
  #config

  /** @type {NumberSliderInput | NumberTickerInput | null} */
  #aInput = null

  /** @type {NumberSliderInput | NumberTickerInput | null} */
  #bInput = null

  /**
   * @type {ToggleInput | undefined}
   */
  #invertToggle;

  /**
   * @param {CurveKnobConfig} cfg
   * @param {ConfigKnobLabel | undefined} label
   * @param {[number, number] | undefined} value
   */
  constructor(cfg, label, value) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.label = label;
    this.#a = value ? value[0] : 0;
    this.#b = value ? value[1] : 0;
    this.#config = cfg;
    this.#invertToggle = undefined;
  }

  /**
   * @returns {[[number, number], [number, number]] | undefined}
   */
  get #range () {
    const r = this.#config.range;
    if (r && typeof r[0] === 'number') {
      // @ts-ignore - its fine
      return [r, r]
    };
    return r;
  }

  /**
   * @returns {'P' | 'Q'}
   */
  get #mode () {
    const checked = this.#invertToggle?.checked ?? true;
    return checked ? 'P' : 'Q';
  }

  setup() {
    const toggle = this.#invertToggle = this.#config.mode != null
      ? new ToggleInput(this.#config.mode === 'P')
      : undefined;

    if (this.#range) {
      const [xr, yr] = this.#range;
      this.#aInput = new NumberSliderInput(this.#a, ...xr);
      this.#bInput = new NumberSliderInput(this.#b, ...yr);
    } else {
      this.#aInput = new NumberTickerInput(this.#a, undefined, undefined, 'any');
      this.#bInput = new NumberTickerInput(this.#b, undefined, undefined, 'any');
    }

    if (toggle) {
      const toggleC = render(doc.span.of(
        doc.i.css({ fontSize: '10px', marginRight: '8px' }).t`P/Q`,
        toggle,
      ));
      this.label?.installTrailingButton(toggleC);
    }
  }

  setEnable() {
    throw new Error('setEnabled is not implemented on ComplexKnob');
  }

  connectedCallback() {
    this.render();

    this.#invertToggle?.addEventListener('change', () => {
      const a = (-this.#a) / this.#b;
      const b = 1 / this.#b;

      this.#aInput?.setValue(this.#a = a);
      this.#bInput?.setValue(this.#b = b);
    });

    this.#root.addEventListener('change', (e) => {
      const event = /** @type {any} */ (e);

      if (e.target === this.#aInput) {
        this.#a = event.detail.value;
        this.dispatchChange();
      } else if (e.target === this.#bInput) {
        this.#b = event.detail.value;
        this.dispatchChange();
      }
    });
  }

  render() {
    updateOn(this.#root, [
      doc.style.of(getStyles()),
      this.label,
      doc.div({ className: 'container' }).of(
        this.#aInput,
        this.#bInput,
      )
    ]);
  }

  dispatchChange() {
    let a = this.#a, b = this.#b;

    if (this.#mode === 'Q') {
      a = (-this.#a) / this.#b;
      b = 1 / this.#b;
    }
    this.dispatchEvent(new ChangeKnobEvent(
      { value: [a, b], child: [] },
      { bubbles: true }
    ));
  }

}

customElements.define('config-curve-knob', CurveKnob);
