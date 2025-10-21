/**
 * @import { El } from '../../base/dom_ui/index.js';
 */
import { generateCSS } from '../../base/dom_ui/css.js';
import { render, updateOn } from '../../base/dom_ui/index.js';

/**
 * @typedef {Object} ButtonAppearance
 * @property {'destructive'} [action]
 * @property {'thin'} [padding]
 */

export class BasicButton extends HTMLElement {
  /** @type {ButtonAppearance} */
  appearance;

  /** @type {HTMLButtonElement | null} */
  button = null;

  /**
   * @param {El} content
   * @param {ButtonAppearance} [appearance={}]
   */
  constructor(content, appearance = {}) {
    super();
    this.attachShadow({ mode: 'open' });
    this.content = content;
    this.appearance = appearance
  }

  connectedCallback() {
    const button = this.button = document.createElement('button');
    this.button.className = 'button';
    this.render();
    // this.addEventListener('keydown', e => {
    //   if (e.key !== 'Enter') return;
    //   this.button.dispatchEvent(new CustomEvent('click'));
    // });

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

  }

  focus() {
    this.button?.focus()
  }

  render() {
    this.button = /** @type {HTMLButtonElement} */
      (render(['button', { class: 'button', tabIndex: '0' }, [
        this.content ?? ['slot', null, []]
      ]]));

    updateOn(this.shadowRoot, [
      ['style', null, [getStyle(this.appearance)]],
      this.button,
    ])
  }
}

customElements.define('basic-button', BasicButton);

/**
 * @param {ButtonAppearance} param0
 */
function getStyle({ action, padding }) {
  const bg = { destructive: 'red' };
  const fg = { destructive: 'white' };
  return generateCSS({
    '.button': {
      display: 'block',
      width: '100%',
      color: (action && fg[action]) ?? 'black',
      background: (action && bg[action]) ?? 'buttonface',
      border: 'var(--border-outset-grey)',
      borderWidth: 2,
      padding: padding === 'thin' ? [2, 4, 2] : [2, 8, 2],
      '&:active': {
        borderStyle: 'inset',
      },
    },
  });
}
