/**
 * @import { KnobConfig, KnobElement } from './type.ts'
 */
import { generateCSS, updateOn } from '../../base/render_ui/index.js';
import { Toggleable } from '../mixins/toggleable.js';
import { evaluateConfig } from './knobs/index.js';
import { createKnob } from './knob-factory.js';
import { configGridLayout, formatChildren } from './common/layout.js';

function getStyles() {
  return generateCSS({
    '.config': {
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      background: '#0f0f0f',
      padding: 15,
      overflowY: 'auto'
    },
    'h3': {
      margin: [0, 0, 16, 0],
      color: 'white',
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
      color: '#ccc',
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

  /** @type {Record<string, any>} */
  #currentValues = {};

  /** @type {Record<string, KnobElement>} */
  #knobInstances = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
      const { target: { dataset: { key } }, detail: { value } } = event;
      this.updateValue(key, value);
    });
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  updateValue(key, value) {
    this.#currentValues[key] = value;

    this.dispatchEvent(new CustomEvent('configChange', {
      detail: { values: this.#currentValues },
      bubbles: true
    }));
  }

  render() {
    updateOn(this.shadowRoot, [
      ['style', {}, [getStyles()]],
      ['div', { class: 'config' }, [
        ['div', { class: 'config-collapsible' }, [
          ['h3', {}, ['Configuration']],
          ['div', { class: 'config-grid' }, (
            formatChildren(Object.values(this.#knobInstances))
          )],
        ]],
      ]],
    ]);
  }
}

customElements.define('config-component', ConfigMenu);
