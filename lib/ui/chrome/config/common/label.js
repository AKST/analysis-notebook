/**
 * @typedef {'normal' | 'large'} Size
 */

import * as doc from '@base/dsl_dom/helper/html.js';
import { updateOn } from '@base/dsl_dom/render.js';
import { generateCSS } from '@base/platform/styles/css.js';
import { subGridGap } from './layout.js';

export class ConfigKnobLabel extends HTMLElement {
  /** @type {ShadowRoot} */ #root;
  /** @type {Node | undefined} */ #leadingButton = undefined;
  /** @type {Node | undefined} */ #trailingButton = undefined;
  /** @type {HTMLElement | undefined} */ #span = undefined;

  /**
   * @param {string} label
   * @param {Size} size
   */
  constructor(label, size) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.label = label;
    this.size = size
  }

  /** @param {Node} button */
  installLeadingButton(button) {
    this.#leadingButton = button;
  }

  /** @param {Node} button */
  installTrailingButton(button) {
    this.#trailingButton = button;
  }

  connectedCallback() {
    this.#span = document.createElement('span');
    this.#span.appendChild(document.createTextNode(this.label));
    this.render();

    this.#span.addEventListener('click', (e) => {
      e.stopPropagation();
      const eventConfig = { ...e, target: this }
      const outerEvent = new CustomEvent('click', eventConfig);
      this.dispatchEvent(outerEvent);
    });
  }

  render() {
    /** @type {string[]} */
    const classList = [
      this.#leadingButton ? 'hasLeadingButton' : '',
      this.#trailingButton ? 'hasTrailingButton' : '',
    ].filter(v => v);

    updateOn(this.#root, [
      doc.style.c(getStyles(this.size)),
      doc.label({ classList }).c(
        this.#leadingButton,
        this.#span,
        this.#trailingButton,
      ),
    ]);
  }
}

customElements.define('config-knob-label', ConfigKnobLabel);

/** @param {Size} size */
function getStyles(size) {
  return generateCSS({
    ':host': {
      '--label-color': size === 'large' ? 'var(--fg-white-on-blue)' : 'inherit',
      '--label-background': size === 'large' ? 'var(--bg-blue)' : 'transparent',
      '--label-margin': size === 'large' ? '8px 0 12px' : '0',
      '--label-padding-inline': size === 'large' ? '8px' : `0`,
      '--label-padding-block': size === 'large' ? '8px' : `0 6px`,
      '--label-font-size': size === 'large' ? '1.15rem' : '10px',
      '--sub-grid-gap': `${subGridGap[1]}px`,
    },
    'label': {
      cursor: 'inherit',
      display: 'block',
      margin: 'var(--label-margin)',
      paddingInline: 'var(--label-padding-inline)',
      paddingBlock: 'var(--label-padding-block)',
      color: 'var(--label-color)',
      fontFamily: 'monospace',
      fontSize: 'var(--label-font-size)',
      fontWeight: '700',
      background: 'var(--label-background)',
      '&.hasLeadingButton': {
        gridTemplateColumns: 'auto 1fr',
      },
      '&.hasTrailingButton': {
        gridTemplateColumns: '1fr auto',
      },
      '&.hasLeadingButton.hasTrailingButton': {
        gridTemplateColumns: 'auto 1fr auto',
      },
      '&.hasLeadingButton, &.hasTrailingButton': {
        display: 'grid',
        alignItems: 'center',
        gridGap: 'var(--sub-grid-gap)',
      },
    },
  });
}
