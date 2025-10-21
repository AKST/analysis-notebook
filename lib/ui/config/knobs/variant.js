/**
 * @import { ConfigKnobLabel } from '../common/label.js';
 * @import { KnobConfigVariant, KnobElement, MakeVariantKnob } from '../type.ts';
 *
 * @typedef {MakeVariantKnob<{ kind: string, value: unknown }>} Cfg
 */
import { ChangeKnobEvent } from '../events.js';
import { generateCSS, updateOn } from '../../../base/dom_ui/index.js';
import { setDisable } from '../../../base/util/dom.js';
import { TextSelect } from '../../inputs/select.js';
import { createKnob } from '../knob-factory.js';
import { evaluateKnob, setCfgLabel } from './types.js';
import { mapEntries } from '../../../base/util/object.js';

/**
 * @template {string} K
 * @param {KnobConfigVariant} cfg
 * @param {K} key
 */
function selectOption(cfg, key) {
  return { label: cfg.label ?? key, value: key };
}

/**
 * @template {string} K
 * @implements {KnobElement}
 */
export class VariantKnob extends HTMLElement {
  gridColumn = 8
  /** @type {K} */ #active;
  /** @type {Record<K, unknown>} */ #values;
  /** @type {Record<K, KnobElement>  | undefined} */ #knobs = undefined;
  /** @type {MakeVariantKnob<{ kind: K, value: unknown }>} */ #config
  /** @type {TextSelect<K, K> | undefined} */ #select = undefined;
  /** @type {HTMLElement | undefined} */ #contentNode = undefined;

  /**
   * @param {MakeVariantKnob<{ kind: K, value: unknown }>} cfg
   * @param {ConfigKnobLabel} label
   * @param {Record<K, unknown>} values
   * @param {K} active
   */
  constructor(cfg, label, values, active) {
    super();
    this.attachShadow({ mode: 'open' });
    this.#config = cfg;
    this.#values = values;
    this.#active = active;
    this.label = label;
  }

  /**
   * @template {string} K
   * @param {MakeVariantKnob<{ kind: K, value: unknown }>} config
   * @param {ConfigKnobLabel | undefined} label
   * @param {{ kind: K, value: unknown } | undefined} [value]
   */
  static create(config, label, value) {
    if (value) {
      // @ts-ignore - test
      config.variants[value.kind].of = value.value;
    }
    const values = mapEntries(config.variants, evaluateKnob);
    const active = /** @type {K} */ (Object.keys(config.variants)[0]);
    if (label == null) throw new TypeError();
    return new VariantKnob(config, label, values, active);
  }

  /** @param {boolean} value */
  setEnable(value) {
    this.#knobs?.[this.#active].setEnable(value);
    setDisable(this.#select, !value);
  }

  setup() {
    this.#knobs = mapEntries(this.#config.variants, cfg => {
      const knob = createKnob(setCfgLabel(cfg, undefined), undefined);
      knob.setup();
      return knob;
    });
  }

  connectedCallback() {
    updateOn(this.shadowRoot, [
      ['style', {}, [getStyles()]],
      this.#contentNode = document.createElement('div'),
    ]);

    this.shadowRoot?.addEventListener('changeKnob', event => {
      if (!(event instanceof ChangeKnobEvent)) throw new Error();
      const { detail: { value, child } } = event;
      const values = this.#values
      if (values) values[this.#active] = value;
      this.#dispatchKnobUpdate([this.#active, ...child]);
    });

    const options = mapEntries(this.#config.variants, selectOption);
    const select = this.#select = new TextSelect(this.#active, options);
    select.addEventListener('change', () => {
      this.#active = select.value;
      this.#dispatchKnobUpdate([]);
      this.render();
    });
    this.label?.installTrailingButton(select);
    this.render();
  }

  render() {
    if (this.#contentNode == null) return;
    updateOn(this.#contentNode, [
      ['div', { class: 'container' }, [
        this.label,
        this.#knobs?.[this.#active],
      ]],
    ])
  }

  /**
   * @param {string[]} child
   */
  #dispatchKnobUpdate(child) {
    const value = this.#values?.[this.#active];
    this.dispatchEvent(new ChangeKnobEvent(
      { value: { kind: this.#active, value }, child },
      { bubbles: true },
    ));
  }
}

function getStyles() {
  return generateCSS({
    ':host': {
      gridColumn: 'span 8'
    },
    '.container': {
    },
  });
}


customElements.define('config-variant-knob', VariantKnob);
