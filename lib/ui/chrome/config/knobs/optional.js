/**
 * @import { MakeOptionalKnob } from '@base/runtime/config/type.ts';
 * @import { KnobElement } from '../type.ts';
 */
import { updateOn } from '@base/dsl_dom/render.js';
import { ChangeKnobEvent } from '../events.js';
import { ToggleInput } from '@ui/inputs/index.js';
import { createKnob } from '../knob-factory.js';
import { evaluateKnob } from './types.js';

/**
 * @implements {KnobElement}
 */
export class OptionalKnob extends HTMLElement {
  /** @type {ShadowRoot} */
  #root;

  /** @type {KnobElement | undefined} */
  #child = undefined;
  /** @type {MakeOptionalKnob<unknown>} */
  #config
  /** @type {unknown} */
  #value;
  /** @type {boolean} */
  #enabled = false;

  /**
   * @param {MakeOptionalKnob<unknown>} cfg
   * @param {unknown} value
   */
  constructor(cfg, value) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.#value = value;
    this.#config = cfg;
  }

  setup() {
    this.#value = evaluateKnob(this.#config.some);
    this.#enabled = this.#config.enabled ?? true;
    const toggle = new ToggleInput(this.#enabled);
    const child = this.#child = createKnob(this.#config.some, undefined);
    child.setup();
    child.label?.installLeadingButton(toggle);
    child.setEnable(this.#enabled);

    toggle.addEventListener('change', e => {
      const event = /** @type {any} */ (e);
      const checked = this.#enabled = event.target.checked;
      const value = checked ? this.#value : undefined;
      child.setEnable(checked);
      this.dispatchEvent(new CustomEvent('changeKnob', {
        detail: { value },
        bubbles: true
      }));
    });
  }

  connectedCallback() {
    updateOn(this.#root, [this.#child]);

    this.#child?.addEventListener('changeKnob', event => {
      if (!(event instanceof ChangeKnobEvent)) throw new Error();
      const { detail: { value, child } } = event;
      const { target: { dataset: { key } } } = /** @type {any} */ (event);
      this.#value = value;

      if (!this.#enabled) return;
      this.dispatchEvent(new ChangeKnobEvent(
        { value: this.#value, child: [key, ...child] },
        { bubbles: true },
      ));
    });
  }

  /** @param {boolean} value */
  setEnable(value) {
    this.#child?.setEnable(value);
  }

  get label() {
    if (this.#child == null) throw new TypeError();
    return this.#child.label;
  }

  get gridColumn() {
    if (this.#child == null) throw new TypeError();
    return this.#child.gridColumn;
  }
}

customElements.define('config-optional-knob', OptionalKnob);
