/**
 * @import { SequenceKnobConfig } from '@base/runtime/config/type.ts';
 * @import { KnobElement } from '../type.ts';
 * @import { ConfigKnobLabel } from '../common/label.js';
 */

import * as doc from '@base/dsl-dom/helper/html.js';
import { render, updateOn } from '@base/dsl-dom/render.js';
import { generateCSS } from '@base/platform/styles/css.js';
import { ChangeKnobEvent } from '../events.js';
import {
  BasicButton,
  NumberTickerInput,
  ToggleInput,
} from '@ui/inputs/index.js';
import { Unreachable } from '@base/util/type.js';
import { cumulative, marginal } from '@base/util/number.js';

/**
 * @implements {KnobElement}
 */
export class SequenceKnob extends HTMLElement {
  gridColumn = 8

  /** @type {ShadowRoot} */
  #root;

  /** @type {SequenceKnobConfig} */
  #cfg

  #initialValues;

  /** @type {'cumulative' | 'marginal'} */
  #interpretation = 'cumulative';

  /** @type {BasicButton | null} */
  #addBtn = null;

  /** @type {BasicButton | null} */
  #subBtn = null;

  /** @type {NumberTickerInput[]} */
  #inputs = [];

  /**
   * When true the inputs should appear as marginal
   * values, but updates should still be passed as
   * a cumulative sequence.
   *
   * @type {ToggleInput | undefined}
   */
  #marginalToggle;

  /**
   * @param {SequenceKnobConfig} cfg
   * @param {ConfigKnobLabel | undefined} label
   * @param {number[]} values
   */
  constructor(cfg, label, values) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.label = label;
    this.#cfg = cfg;
    this.#initialValues = values;
  }

  setEnable() {
    throw new Error('setEnabled is not implemented on ComplexKnob');
  }

  get values () {
    const values = this.#inputs.map(i => i.value);
    switch (this.#interpretation) {
      case 'cumulative': return values;
      case 'marginal': return cumulative(values);
      default: throw new Unreachable(this.#interpretation);
    }
  }

  setup() {
    const toggle = this.#marginalToggle = this.#cfg.marginal != null
      ? new ToggleInput(this.#cfg.marginal)
      : undefined;

    if (this.#cfg.marginal) {
      this.#interpretation = 'marginal';
    }

    const initial = this.#interpretation === 'marginal'
      ? marginal(this.#initialValues)
      : this.#initialValues;

    initial.forEach(v => this.#pushValue(v));
    this.#addBtn = new BasicButton('+');
    this.#subBtn = new BasicButton('-')

    if (toggle) {
      const toggleC = render(doc.span.c(
        doc.i.css({ fontSize: '10px', marginRight: '8px' }).t`M`,
        toggle,
      ));
      this.label?.installTrailingButton(toggleC);
    }
  }

  connectedCallback() {
    this.render();
    this.#wireCallbacks();
  }

  render() {
    updateOn(this.#root, [
      doc.style.c(getStyles()),
      this.label,
      doc.div({ className: 'container' }).c(
        ...this.#inputs,
        doc.div({ className: 'buttons' }).c(
          this.#subBtn,
          this.#addBtn,
        ),
      ),
    ]);
  }

  #emitChange() {
    const detail = { value: this.values, child: [] };
    const change = new ChangeKnobEvent(detail, { bubbles: true });
    this.dispatchEvent(change);
  }

  #wireCallbacks() {
    this.#root.addEventListener('change', () => this.#emitChange());

    this.#addBtn?.addEventListener('click', () => {
      this.#pushValue(this.#inputs.at(-1)?.value ?? 0);
      this.render();
      this.#addBtn?.focus();
      this.#emitChange();
    });

    this.#subBtn?.addEventListener('click', () => {
      this.#popValue();
      this.render();
      this.#subBtn?.focus();
      this.#emitChange();
    });

    this.#marginalToggle?.addEventListener('change', (e) => {
      let values = this.#inputs.map(i => i.value);
      if (this.#marginalToggle?.checked) {
        values = marginal(values);
        this.#interpretation = 'marginal';
      } else {
        values = cumulative(values);
        this.#interpretation = 'cumulative';
      }

      this.#inputs.map((input, i) => {
        input.setValue(values[i]);
      });
    });
  }

  /**
   * @param {number} value
   */
  #pushValue(value) {
    this.#inputs.push(new NumberTickerInput(value, undefined, undefined));
  }

  #popValue() {
    this.#inputs.pop()
  }
}

customElements.define('config-knob-sequence', SequenceKnob);

function getStyles() {
  return generateCSS({
    '.container': {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridGap: 3,
    },
    'input-number-ticker': {
      gridColumn: 'span 1',
      minWidth: 0,
    },
    '.marginalLabel': {
      fontSize: 10,
    },
    '.buttons': {
      gridColumn: 'span 1',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: 0,
    },
  });
}
