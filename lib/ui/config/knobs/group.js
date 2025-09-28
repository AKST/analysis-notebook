/**
 * @import { KnobElement, MakeGroupKnob } from '../type.ts';
 * @import { ConfigKnobLabel } from '../common/label.js';
 */

import { ChangeKnobEvent } from '../events.js';
import { Unreachable } from '../../../util/type.js';
import { generateCSS, updateOn } from '../../../base/render_ui/index.js';
import { createKnob } from '../knob-factory.js';
import { configGridLayout, formatChildren } from '../common/layout.js';
import '../common/label.js';

/**
 * @implements {KnobElement}
 */
export class GroupKnob extends HTMLElement{
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
    this.attachShadow({ mode: 'open' });
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
    this.shadowRoot?.addEventListener('changeKnob', event => {
      if (!(event instanceof ChangeKnobEvent)) throw new Error();
      const { detail: { value, child } } = event;
      const { target: { dataset: { key } } } = /** @type {any} */ (event);
      this.handleChildChange(key, value, child);
    });
  }

  render() {
    updateOn(this.shadowRoot, [
      ['style', null, [getStyles(this.gridColumn)]],
      this.label,
      ['div', { class: 'config-group' }, [
        ...formatChildren(this.#children)
      ]],
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
