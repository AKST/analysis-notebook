/**
 * @import { E } from '@base/dsl-dom/type.js';
 */
import * as doc from '@base/dsl-dom/helper/html.js';
import { render, updateOn } from '@base/dsl-dom/render.js';
import { SharedStyleSheet } from '@base/platform/styles/shared-style-sheet.js';

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
   * TODO, it might be worth passing content through a slot?
   *
   * @param {E.Item} content
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
    this.render();

    const eventsToForward = [
      'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout',
      'mouseenter', 'mouseleave', 'focus', 'blur', 'keydown', 'keyup'
    ];

    eventsToForward.forEach(eventType => {
      this.button?.addEventListener(eventType, (/** @type {any} */ e) => {
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
    updateOn(this.#root, [
      this.button = render(doc.button({
        className: 'button',
        tabIndex: 0,
      }).cssVar(getStyleVars(this.appearance)).c(this.content ?? doc.slot.c())),
    ]);
  }
}

customElements.define('basic-button', BasicButton);

/**
 * @param {ButtonAppearance} param0
 * @returns {Record<string, string>}
 */
function getStyleVars({ action, padding }) {
  const bg = { destructive: 'red' };
  const fg = { destructive: 'white' };
  return {
    '--button-color': (action && fg[action]) ?? 'black',
    '--button-bg': (action && bg[action]) ?? 'var(--bg-ms-button-idle)',
    '--button-padding': padding === 'thin' ? '2px 4px 2px' : '2px 8px 2px',
  };
}

