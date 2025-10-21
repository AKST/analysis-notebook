/**
 * @import { ConfigKnobLabel } from '../common/label.js';
 * @import { KnobElement, BooleanKnobConfig } from '../type.ts';
 */

import { ChangeKnobEvent } from '../events.js';
import { generateCSS, updateOn } from '../../../base/dom_ui/index.js';
import { ToggleInput } from '../../inputs/index.js';
import { setDisable } from '../../../base/util/dom.js';
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
    this.attachShadow({ mode: 'open' });
    this.label = label;
    this.#value = value;
    this.#config = cfg;
    this.#toggle = undefined;
  }

  setup() {
    const toggle = this.#toggle = new ToggleInput(this.#value);
    this.shadowRoot?.addEventListener('change', (e) => {
      const event = /** @type {any} */ (e);
      if (event.target === toggle) {
        this.#value = toggle.checked;
        this.dispatchEvent(new ChangeKnobEvent({
          value: this.#value,
          child: [],
        }, { bubbles: true }));
      }
    });

    updateOn(this.shadowRoot, [
      ['style', {}, [getStyles()]],
      ['div', { class: 'container' }, [this.label, this.#toggle]],
    ]);
  }

  /** @param {boolean} value */
  setEnable(value) {
    setDisable(this.#toggle, !value);
  }
}

customElements.define('config-knob-boolean', BooleanKnob);
