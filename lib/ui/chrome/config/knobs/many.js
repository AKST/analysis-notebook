/**
 * @import { MakeManyKnob } from '@base/runtime/config/type.ts';
 * @import { KnobElement } from '../type.ts';
 */

import { ConfigKnobLabel } from '../common/label.js';
import { configGridLayout, formatChildren } from '../common/layout.js';
import '../common/label.js';
import { ChangeKnobEvent } from '../events.js';
import { createKnob } from '../knob-factory.js';
import { deepClone } from '@base/util/object.js';
import { template } from '@base/util/strings.js';
import { BasicButton, TextInput } from '@ui/inputs/index.js';
import { generateCSS, updateOn } from '@base/dom_ui/index.js';

/**
 * @template {{ label?: string | undefined | null }} T
 * @param {string} id
 * @param {T} knobTemplate
 * @returns {T}
 */
function createTemplateKnob(id, knobTemplate) {
  const clone = deepClone(knobTemplate);
  if (typeof clone.label === 'string') {
    clone.label = template(clone.label, { id }, {
      onUnknown: { kind: 'throw' },
    });
  }
  return clone;
}

/**
 * @implements {KnobElement}
 */
export class ManyKnob extends HTMLElement {
  gridColumn = 8;

  /** @type {MakeManyKnob<any>} */
  #config;

  #currentValue;

  /** @type {Record<string, KnobElement>} */
  #children;

  /** @type {TextInput | null} */
  #itemName = null;

  /**
   * @param {MakeManyKnob<any>} cfg
   * @param {ConfigKnobLabel | undefined} label
   * @param {any} [value={}]
   */
  constructor(cfg, label, value = {}) {
    super();
    this.attachShadow({ mode: 'open' });
    this.label = label;
    this.#currentValue = value;
    this.#children = {};
    this.#config = cfg
  }

  setup() {
    this.#itemName = new TextInput('', 'Enter name');
    this.#itemName.id = 'name-input';

    for (const [k, v] of Object.entries(this.#currentValue)) {
      const dryCfg = createTemplateKnob(k, this.#config.create);
      this.#installChild(k, { ...dryCfg, of: v });
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
      this.#currentValue[key] = value;
      this.#emitChange([key, ...child]);
    });

    this.#itemName?.addEventListener('submit', (e) => {
      const event = /** @type {any} */ (e);
      const { detail: { value: name } } = event;
      const child = createTemplateKnob(name, this.#config.create);
      this.#currentValue[name] = child.of
      this.#installChild(name, child);
      this.#emitChange([]);
      this.#itemName?.setValue('');
      this.render();
    });
  }

  render() {
    updateOn(this.shadowRoot, [
      ['style', null, [getStyles(this.gridColumn)]],
      ['details', { open: true }, [
        this.label && ['summary', null, [this.label]],
        ['div', { class: 'config-group' }, [
          ['div', { class: 'name-row' }, [
            ['label', { for: 'name-input' }, ['Name']],
            this.#itemName,
          ]],
          ...formatChildren(Object.values(this.#children)),
        ]],
      ]],
    ]);
  }

  /**
   * @param {any} param0
   */
  #deleteChild({ target: { dataset } }) {
    delete this.#children[dataset.key];
    delete this.#currentValue[dataset.key];
    this.#emitChange([]);
    this.render();
  }

  /**
   * @param {string[]} source
   */
  #emitChange(source) {
    this.dispatchEvent(new ChangeKnobEvent(
      { value: this.#currentValue, child: source },
      { bubbles: true },
    ));
  }

  /**
   * @param {string} name
   * @param {any} config
   */
  #installChild(name, config) {
    const delBtn = new BasicButton('X', {
      action: 'destructive',
      padding: 'thin',
    });
    delBtn.dataset.key = name;
    delBtn.addEventListener('click', e => this.#deleteChild(e));

    const child = createKnob(config, name);
    if (child.label == null) {
      child.label = new ConfigKnobLabel('', 'normal');
    }
    child.label.installLeadingButton(delBtn);
    child.setup();
    child.dataset.key = name;
    this.#children[name] = child;
  }
}

customElements.define('config-many-knob', ManyKnob);

/**
 * @param {number} gridSize
 */
function getStyles(gridSize) {
  return generateCSS({
    'summary': {
      cursor: 'pointer',
    },
    '.config-group': {
      ...configGridLayout(gridSize),
      margin: [8, 0, 0],
    },
    '.config-item': {
      display: 'grid',
      gridGap: 8,
      gridTemplateRows: '1fr auto',
    },
    '.name-row': {
      display: 'grid',
      gridColumn: 'span 8',
      gridGap: 16,
      gridTemplateColumns: 'auto 1fr',
      alignItems: 'center',
    },
  });
}
