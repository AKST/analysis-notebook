/**
 * @import { KnobConfig } from '@base/runtime/config/type.ts'
 * @import { KnobElement } from './type.ts'
 */
import * as doc from '@base/dsl_dom/helper/html.js';
import { updateOn } from '@base/dsl_dom/render.js';
import { generateCSS } from '@base/platform/styles/css.js';
import { Toggleable } from '@ui/mixins/toggleable.js';
import { evaluateConfig } from './knobs/index.js';
import { createKnob } from './knob-factory.js';
import { configGridLayout, formatChildren } from './common/layout.js';
import { ConfigChangeEvent } from './events.js';

function getStyles() {
  return generateCSS({
    '.config': {
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      background: 'var(--bg-black-0f)',
      padding: 15,
      overflowY: 'auto'
    },
    'h3': {
      margin: [0, 0, 16, 0],
      color: 'var(--fb-white)',
      fontFamily: 'monospace'
    },
    '.config-grid': configGridLayout(8),
    '.config-group': {
      display: 'grid',
      gridGap: 8,
      gridAutoRows: 'auto',
      margin: [8, 0, 0],
    },
    '.config-group-title': {
      fontSize: '0.75rem',
      fontWeight: 600,
      color: 'var(--fg-white-on-blue)',
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
  });
}

// No longer needed - using constructor-based approach

/**
 * Config sidebar component
 *
 * Creates collapsible config sidebar with knob controls
 * Based on RFC 000 - Application Config
 */
export class ConfigMenu extends Toggleable(HTMLElement) {
  /** @type {KnobConfig} */
  #config = {};

  /** @type {ShadowRoot} */
  #root;

  /** @type {Record<string, any>} */
  #currentValues = {};

  /** @type {Record<string, KnobElement>} */
  #knobInstances = {};

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.internals = this.attachInternals();
  }

  get currentValues() {
    return this.#currentValues;
  }

  /**
   * @param {KnobConfig} config
   */
  setKnobs(config) {
    this.#config = config || {};
    this.#currentValues = evaluateConfig(this.#config);
    this.#knobInstances = {};

    for (const [key, knobConfig] of Object.entries(this.#config)) {
      const child = createKnob(knobConfig, key, true);
      child.setup();
      child.dataset.key = key;
      this.#knobInstances[key] = child;
    }

    this.render();
  }

  clearKnobs() {
    this.#config = {};
    this.#currentValues = {};
    this.#knobInstances = {};
    this.render();
  }

  connectedCallback() {
    this.render();
    this.shadowRoot?.addEventListener('changeKnob', (e) => {
      const event = /** @type {any} */ (e);
      const {
        target: { dataset: { key } },
        detail: { value, child = [] },
      } = event;
      this.updateValue(key, value, [key, ...child]);
    });
  }

  /**
   * @param {string} key
   * @param {any} value
   * @param {string[]} source
   */
  updateValue(key, value, source) {
    this.#currentValues[key] = value;

    this.dispatchEvent(new ConfigChangeEvent({
      values: this.#currentValues,
      source,
    }));
  }

  render() {
    updateOn(this.#root, [
      doc.style.of(getStyles()),
      doc.div({ className: 'config' }).of(
        doc.div({ className: 'config-collapsible' }).of(
          doc.h3`Configuration`,
          doc.div({ className: 'config-grid' }).of(
            ...formatChildren(Object.values(this.#knobInstances))
          ),
        ),
      ),
    ]);
  }
}

customElements.define('config-component', ConfigMenu);
