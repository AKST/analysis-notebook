/**
 * @import { ColorKnobConfig } from '@base/runtime/config/type.ts';
 * @import { ConfigKnobLabel } from '../common/label.js';
 * @import { KnobElement } from '../type.ts';
 */

import * as doc from '@base/dsl_dom/helper/html.js';
import { updateOn } from '@base/dsl_dom/render.js';
import { generateCSS } from '@base/platform/styles/css.js';
import { ChangeKnobEvent } from '../events.js';
import { ColorInput as ColorInputComponent } from '@ui/inputs/color.js';
import '../common/label.js';

function getStyles() {
  return generateCSS({
    ':host': {
      gridColumn: 'span 4'
    },
    '.container': {
      display: 'contents'
    },
    '.color-input-container': {
      gridColumn: 'span 9',
    },
  });
}

/**
 * @implements {KnobElement}
 */
export class ColorKnob extends HTMLElement {
  gridColumn = 4;

  /** @type {ShadowRoot} */
  #root;

  #value = 0xff0000; // Default red
  /** @type {ColorKnobConfig} */ #config;
  /** @type {ColorInputComponent | null} */ #colorInput = null;

  /**
   * @param {ColorKnobConfig} cfg
   * @param {ConfigKnobLabel | undefined} label
   */
  constructor(cfg, label, value = 0xff0000) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.label = label;
    this.#value = value;
    this.#config = cfg;
  }

  setup() {
    this.#colorInput = new ColorInputComponent(this.#value);
    this.#colorInput.className = 'color-input-container';
  }

  setEnable() {
    throw new Error('setEnabled is not implemented on ComplexKnob');
  }

  connectedCallback() {
    this.render();
    this.#root.addEventListener('change', (e) => {
      if (e.target === this.#colorInput) {
        this.#value = /** @type {any} */ (e).detail.value;
        this.dispatchEvent(new ChangeKnobEvent(
          { value: this.#value, child: [] },
          { bubbles: true }
        ));
      }
    });
  }

  render() {
    updateOn(this.#root, [
      doc.style.c(getStyles()),
      doc.div({ className: 'container' }).c(
        this.label,
        this.#colorInput
      )
    ]);
  }
}

customElements.define('config-color-knob', ColorKnob);
