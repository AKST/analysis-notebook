/**
 * @import { KnobElement, NumberKnobConfig } from '../type.ts';
 * @import { ConfigKnobLabel } from '../common/label.js';
 */

import { ChangeKnobEvent } from '../events.js';
import { NumberSliderInput } from '../../inputs/index.js';
import { updateOn } from '../../../base/dom_ui/index.js';

/**
 * @implements {KnobElement}
 */
export class NumberKnob extends HTMLElement {
  gridColumn = 8

  /** @type {NumberSliderInput | null} */
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
    this.attachShadow({ mode: 'open' });
    this.label = label;
    this.#value = value || 0;
    this.#config = cfg;
  }

  setup() {
    const [min, max] = this.#config.range ?? [0, 1];
    this.#input = new NumberSliderInput(this.#value, min, max);
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
    this.shadowRoot?.addEventListener('change', (e) => {
      if (e.target === this.#input) {
        this.handleChange(/** @type {any} */ (e).detail.value);
      }
    });
  }

  render() {
    updateOn(this.shadowRoot, [
      ['div', { class: 'container' }, [
        this.label,
        this.#input,
      ]]
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
