/**
 * @import { El } from '@base/dom_ui/type.js';
 */
import { render, updateOn } from '@base/dom_ui/index.js';
import { SharedStyleSheet } from '@base/dom_ui/shared_style_sheet.js';

/**
 * @typedef {Object} ButtonAppearance
 * @property {'destructive'} [action]
 * @property {'thin'} [padding]
 */

export class BasicButton extends HTMLElement {
  static sheet = new SharedStyleSheet('./lib/ui/inputs/button.css');

  /** @type {ButtonAppearance} */
  appearance;

  /** @type {HTMLButtonElement | null} */
  button = null;

  /** @type {ShadowRoot} */
  #root;

  /**
   * @param {El} content
   * @param {ButtonAppearance} [appearance={}]
   */
  constructor(content, appearance = {}) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.content = content;
    this.appearance = appearance
  }

  async connectedCallback() {
    BasicButton.sheet.install(this.#root);
    const button = this.button = document.createElement('button');
    this.button.className = 'button';
    this.render();

    const eventsToForward = [
      'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout',
      'mouseenter', 'mouseleave', 'focus', 'blur', 'keydown', 'keyup'
    ];

    eventsToForward.forEach(eventType => {
      button.addEventListener(eventType, (/** @type {any} */ e) => {
        const newEvent = new e.constructor(e.type, {
          bubbles: e.bubbles,
          cancelable: e.cancelable,
          detail: e.detail,
          ...e
        });
        e.stopPropagation();
        this.dispatchEvent(newEvent);
      });
    });

    this.style.opacity = '0';
    await BasicButton.sheet.sheetPromise;
    this.style.opacity = '1';
  }

  focus() {
    this.button?.focus()
  }

  render() {
    const styles = getStyle(this.appearance)
    this.button = /** @type {HTMLButtonElement} */
      (render(['button', {
        class: 'button',
        tabIndex: '0',
        style: getStyle(this.appearance),
      }, [
        this.content ?? ['slot', null, []]
      ]]));

    updateOn(this.shadowRoot, [this.button])
  }
}

customElements.define('basic-button', BasicButton);

/**
 * @param {ButtonAppearance} param0
 */
function getStyle({ action, padding }) {
  const bg = { destructive: 'red' };
  const fg = { destructive: 'white' };
  return `
    --button-color: ${(action && fg[action]) ?? 'black'};
    --button-bg: ${(action && bg[action]) ?? 'var(--bg-ms-button-idle)'};
    --button-padding: ${
      padding === 'thin'
        ? '2px 4px 2px'
        : '2px 8px 2px'
    };
  `;
}

