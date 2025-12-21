/**
 * @import { BooleanKnobConfig } from '@base/runtime/config/type.ts';
 * @import { KnobElement } from '../type.ts';
 * @import { ConfigKnobLabel } from '../common/label.js';
 */

import * as doc from '@base/dsl_dom/helper/html.js';
import { updateOn } from '@base/dsl_dom/render.js';
import { generateCSS } from '@base/platform/styles/css.js';
import { ChangeKnobEvent } from '../events.js';
import { ToggleInput } from '@ui/inputs/index.js';
import { setDisable } from '@base/util/dom.js';
import '../common/label.js';

function getStyles() {
  return generateCSS({
    ':host': {
      gridColumn: 'span 4'
    },
    '.container': {
      display: 'grid',
      gridGap: 8,
      gridTemplateColumns: '1fr auto',
    },
  });
}

/**
 * @implements {KnobElement}
 */
export class BooleanKnob extends HTMLElement {
  gridColumn = 4;

  /** @type {ShadowRoot} */
  #root;

  /** @type {BooleanKnobConfig} */
  #config;

  /**
   * @type {ToggleInput | undefined}
   */
  #toggle;

  /**
   * @type {boolean}
   */
  #value;

  /**
   * @param {BooleanKnobConfig} cfg
   * @param {ConfigKnobLabel | undefined} label
   * @param {boolean} value
   */
  constructor(cfg, label, value) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.label = label;
    this.#value = value;
    this.#config = cfg;
    this.#toggle = undefined;
  }

  setup() {
    const toggle = this.#toggle = new ToggleInput(this.#value);
    this.#root.addEventListener('change', (e) => {
      const event = /** @type {any} */ (e);
      if (event.target === toggle) {
        this.#value = toggle.checked;
        this.dispatchEvent(new ChangeKnobEvent({
          value: this.#value,
          child: [],
        }, { bubbles: true }));
      }
    });

    updateOn(this.#root, [
      doc.style.c(getStyles()),
      doc.div({ className: 'container' }).c(this.label, this.#toggle),
    ]);
  }

  /** @param {boolean} value */
  setEnable(value) {
    setDisable(this.#toggle, !value);
  }
}

customElements.define('config-knob-boolean', BooleanKnob);
