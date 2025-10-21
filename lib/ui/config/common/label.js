/**
 * @typedef {'normal' | 'large'} Size
 */

import { generateCSS, updateOn } from '../../../base/dom_ui/index.js';
import { subGridGap } from './layout.js';

export class ConfigKnobLabel extends HTMLElement {
  /** @type {Node | null} */ #leadingButton = null;
  /** @type {Node | null} */ #trailingButton = null;
  /** @type {HTMLElement | null} */ #span = null;

  /**
   * @param {string} label
   * @param {Size} size
   */
  constructor(label, size) {
    super();
    this.attachShadow({ mode: 'open' });
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
    const labelAttr = {
      class: [
        this.#leadingButton ? 'hasLeadingButton' : undefined,
        this.#trailingButton ? 'hasTrailingButton' : undefined,
      ].filter(v => v).join(' '),
    };
    updateOn(this.shadowRoot, [
      ['style', null, [getStyles(this.size)]],
      ['label', labelAttr, [
        this.#leadingButton,
        this.#span,
        this.#trailingButton,
      ]],
    ]);
  }
}

customElements.define('config-knob-label', ConfigKnobLabel);

/** @param {Size} size */
function getStyles(size) {
  let color, background;
  if (size === 'large') {
    color = 'var(--fg-white-on-blue)';
    background = 'var(--bg-blue)';
  } else {
    color = 'inherit';
    background = undefined;
  }

  return generateCSS({
    'label': {
      cursor: 'inherit',
      display: 'block',
      margin: size === 'large' ? [8, 0] : 0,
      padding: (
        size === 'large'
          ? [8, 8, 8, 8]
          : [0, 0, subGridGap[0], 0]
      ),
      color,
      fontFamily: 'monospace',
      fontSize: `${size === 'normal' ? 0.75 : 1.15}rem`,
      fontWeight: `${size === 'normal' ? '500' : '700'}`,
      background,
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
        gridGap: subGridGap[1],
      },
    },
  });
}
