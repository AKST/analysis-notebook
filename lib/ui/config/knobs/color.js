/**
 * @import { ColorKnobConfig } from '@base/runtime/config/type.ts';
 * @import { ConfigKnobLabel } from '../common/label.js';
 * @import { KnobElement } from '../type.ts';
 */

import { ChangeKnobEvent } from '../events.js';
import { generateCSS, updateOn } from '@base/dom_ui/index.js';
import { ColorInput as ColorInputComponent } from '../../inputs/color.js';
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

  #value = 0xff0000; // Default red
  /** @type {ColorKnobConfig} */ #config;
  /** @type {ColorInputComponent | null} */ #colorInput = null;

  /**
   * @param {ColorKnobConfig} cfg
   * @param {ConfigKnobLabel | undefined} label
   */
  constructor(cfg, label, value = 0xff0000) {
    super();
    this.attachShadow({ mode: 'open' });
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
    this.shadowRoot?.addEventListener('change', (e) => {
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
    updateOn(this.shadowRoot, [
      ['style', {}, [getStyles()]],
      ['div', { class: 'container' }, [
        this.label,
        this.#colorInput
      ]]
    ]);
  }
}

customElements.define('config-color-knob', ColorKnob);
