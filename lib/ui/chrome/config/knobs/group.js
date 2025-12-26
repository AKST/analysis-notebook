/**
 * @import { MakeGroupKnob } from '@base/runtime/config/type.ts';
 * @import { KnobElement } from '../type.ts';
 * @import { ConfigKnobLabel } from '../common/label.js';
 */

import * as doc from '@base/dsl-dom/helper/html.js';
import { updateOn } from '@base/dsl-dom/render.js';
import { generateCSS } from '@base/platform/styles/css.js';
import { ChangeKnobEvent } from '../events.js';
import { Unreachable } from '@base/util/type.js';
import { createKnob } from '../knob-factory.js';
import { configGridLayout, formatChildren } from '../common/layout.js';
import '../common/label.js';

/**
 * @implements {KnobElement}
 */
export class GroupKnob extends HTMLElement{
  /** @type {ShadowRoot} */
  #root;

  /** @type {MakeGroupKnob<any>} */
  #config;

  #currentValue;

  /** @type {Array<KnobElement>} */
  #children;

  /**
   * @param {MakeGroupKnob<any>} cfg
   * @param {ConfigKnobLabel | undefined} label
   * @param {any} value
   */
  constructor(cfg, label, value) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.label = label;
    this.#currentValue = value || {};
    this.#children = [];
    this.#config = cfg
  }

  setup() {
    for (const [key, dry] of Object.entries(this.#config.group)) {
      const value = this.#config.of?.[key];
      const child = createKnob({ of: value, ...dry }, key);
      child.setup();
      child.dataset.key = key;
      this.#children.push(child);
    }
  }

  setEnable() {
    throw new Error('setEnabled is not implemented on ComplexKnob');
  }

  connectedCallback() {
    this.render();
    this.#root.addEventListener('changeKnob', event => {
      if (!(event instanceof ChangeKnobEvent)) throw new Error();
      const { detail: { value, child } } = event;
      const { target: { dataset: { key } } } = /** @type {any} */ (event);
      this.handleChildChange(key, value, child);
    });
  }

  render() {
    updateOn(this.#root, [
      doc.style.c(getStyles(this.gridColumn)),
      this.label,
      doc.div({ className: 'config-group' }).c(
        ...formatChildren(this.#children)
      ),
    ])
  }

  /**
   * @param {string} childKey
   * @param {any} value
   * @param {string[]} desendent
   */
  handleChildChange(childKey, value, desendent) {
    this.#currentValue[childKey] = value;
    this.dispatchEvent(new ChangeKnobEvent({
      value: { ...this.#currentValue },
      child: [childKey, ...desendent],
    }, { bubbles: true }));
  }

  get gridColumn() {
    switch (this.#config.layout) {
      case undefined: break;
      case 'sparse': return 8;
      case 'dense': return 4;
      default: throw new Unreachable(this.#config.layout);
    }
    if (this.label?.size === 'large') return 8;
    return Math.max(...this.#children.map(c => c.gridColumn));
  }
}

customElements.define('config-group-knob', GroupKnob);

/**
 * @param {number} gridSize
 */
function getStyles(gridSize) {
  return generateCSS({
    '.config-group': {
      ...configGridLayout(gridSize),
    },
    'config-knob-label': {
      gridColumn: `span ${gridSize}`,
    }
  });
}
