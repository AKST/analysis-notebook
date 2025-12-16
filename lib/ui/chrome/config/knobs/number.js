/**
 * @import { NumberKnobConfig } from '@base/runtime/config/type.ts';
 * @import { KnobElement } from '../type.ts';
 * @import { ConfigKnobLabel } from '../common/label.js';
 */

import * as doc from '@base/dsl_dom/helper/html.js';
import { updateOn } from '@base/dsl_dom/render.js';
import { ChangeKnobEvent } from '../events.js';
import { NumberSliderInput } from '@ui/inputs/number/slider.js';
import { NumberTextInput, NumberTextChangeEvent } from '@ui/inputs/number/text.js';
import { Unreachable } from '@base/util/type.js';

/** @type {{ kind: 'range', step?: number }} */
const DEFAULT_INPUT = { kind: 'range', step: undefined };

/**
 * @implements {KnobElement}
 */
export class NumberKnob extends HTMLElement {
  gridColumn = 8

  /** @type {ShadowRoot} */
  #root;

  /** @type {NumberTextInput | NumberSliderInput | null} */
  #input = null;

  /** @type {NumberKnobConfig} */
  #config

  #value

  /**
   * @param {NumberKnobConfig} cfg
   * @param {ConfigKnobLabel | undefined} label
   * @param {number} value
   */
  constructor(cfg, label, value) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.label = label;
    this.#value = value || 0;
    this.#config = cfg;
  }

  setup() {
    const [min, max] = this.#config.range ?? [0, 1];
    const inputType = this.#config.input ?? DEFAULT_INPUT;
    switch (inputType.kind) {
      case 'range':
        this.#input = new NumberSliderInput(
          this.#value,
          min, max,
          inputType.step ?? 'any',
        );
        break;

      case 'text':
        this.#input = new NumberTextInput(
          this.#value+'',
          min, max,
          inputType.inc ?? 1,
        );
        break;

      default:
        throw new Unreachable(inputType);
    }
  }

  /** @param {boolean} value */
  setEnable(value) {
    if (!value) {
      this.#input?.setAttribute('disabled', 'disabled');
    } else {
      this.#input?.setAttribute('disabled', '');
    }
  }

  connectedCallback() {
    this.render();
    this.#root.addEventListener('change', (e) => {
      if (e instanceof NumberTextChangeEvent) {
        if (!e.detail.valid) return;
        this.handleChange(e.detail.value);
      } else if (e.target === this.#input) {
        this.handleChange(/** @type {any} */ (e).detail.value);
      }
    });
  }

  render() {
    updateOn(this.#root, [
      doc.div({ className: 'container' }).of(
        this.label,
        this.#input,
      )
    ]);
  }

  /**
   * @param {number} value
   */
  handleChange(value) {
    const [min, max] = this.#config.range ?? [0, 1];
    this.#value = Math.max(min, Math.min(max, value));

    const detail = { value: this.#value, child: [] };
    const event = new ChangeKnobEvent(detail, { bubbles: true });
    this.dispatchEvent(event);
  }
}

customElements.define('config-number-knob', NumberKnob);
