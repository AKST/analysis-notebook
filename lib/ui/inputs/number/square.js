/**
 * @import { El } from '../../../base/render_ui/index.js';
 */

import { fromIndex } from '../../../util/array.js';
import { generateCSS, updateOn } from '../../../base/render_ui/index.js';

function getStyles() {
  return generateCSS({
    ':root': {
    },
    '.square-container': {
      position: 'relative',
      aspectRatio: '1',
      background: '#1a1a1a',
      border: 'var(--border-inset-grey)',
      cursor: 'crosshair'
    },
    '.square-handle': {
      position: 'absolute',
      width: 8,
      height: 8,
      background: '#007acc',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      cursor: 'grab',
      zIndex: 1
    },
    '.square-handle:active': {
      cursor: 'grabbing'
    },
    '.square-grid': {
      position: 'absolute',
      inset: 0,
      opacity: '0.3',
      pointerEvents: 'none'
    },
    '.square-grid-line': {
      position: 'absolute',
      background: '#555'
    },
    '.square-grid-line.horizontal': {
      width: '100%',
      height: '1px',
    },
    '.square-grid-line.vertical': {
      height: '100%',
      width: '1px',
    }
  });
}

export class NumberSquareInput extends HTMLElement {
  static get observedAttributes() {
    return ['x', 'y', 'x-min', 'x-max', 'y-min', 'y-max'];
  }

  /**
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [xMin=-1]
   * @param {number} [xMax=1]
   * @param {number} [yMin=-1]
   * @param {number} [yMax=1]
   */
  constructor(x = 0, y = 0, xMin = -1, xMax = 1, yMin = -1, yMax = 1) {
    super();
    this.attachShadow({ mode: 'open' });
    this._x = x;
    this._y = y;
    this._xMin = xMin;
    this._xMax = xMax;
    this._yMin = yMin;
    this._yMax = yMax;
    this._isDragging = false;
  }

  connectedCallback() {
    this.render();

    this.shadowRoot?.addEventListener('mousedown', (e) => {
      if (!(e instanceof MouseEvent)) return
      if (!(e.target instanceof HTMLElement)) return
      if (!(e.target.matches('.square-container, .square-handle'))) return;

      this._isDragging = true;
      this.updateFromMouse(e);
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
      e.preventDefault();

    });

    // Add touch events for better iOS support
    this.shadowRoot?.addEventListener('touchstart', (e) => {
      if (!(e instanceof TouchEvent)) return
      if (!(e.target instanceof HTMLElement)) return
      if (!(e.target.matches('.square-container, .square-handle'))) return;

      this._isDragging = true;
      const touch = e.touches[0];
      this.updateFromTouch(touch);
      document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
      document.addEventListener('touchend', this.handleTouchEnd);
      e.preventDefault();
    });

  }

  /**
   * @param {string} name
   * @param {any} _oldValue
   * @param {any} newValue
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    const value = parseFloat(newValue) || 0;
    switch (name) {
      case 'x':
        this._x = value;
        break;
      case 'y':
        this._y = value;
        break;
      case 'x-min':
        this._xMin = value;
        break;
      case 'x-max':
        this._xMax = value;
        break;
      case 'y-min':
        this._yMin = value;
        break;
      case 'y-max':
        this._yMax = value;
        break;
    }
    if (this.shadowRoot?.hasChildNodes()) {
      this.updateHandle();
    }
  }

  get x() { return this._x; }
  get y() { return this._y; }

  /**
   * @param {number} x
   * @param {number} y
   */
  setValues(x, y) {
    this._x = Math.max(this._xMin, Math.min(this._xMax, x));
    this._y = Math.max(this._yMin, Math.min(this._yMax, y));
    this.updateHandle();
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  #setValues(x, y) {
    this.setValues(x, y);
    this.dispatchEvent(new CustomEvent('change', {
      detail: { x: this._x, y: this._y },
      bubbles: true
    }));
  }

  render() {
    updateOn(this.shadowRoot, [
      ['style', {}, [getStyles()]],
      ['div', { class: 'square-container' }, [
        ['div', { class: 'square-grid' }, [

          ...fromIndex(9, /** @returns {El[]} */ i => {
            const d = `${(1+i)*10}%`;
            const left = d, top = d;
            return [
              ['div', { class: 'square-grid-line horizontal', styles: { top } }, []],
              ['div', { class: 'square-grid-line vertical', styles: { left } }, []],
            ];
          }).flat(),
          ['div', { class: 'square-grid-line horizontal' }, []],
          ['div', { class: 'square-grid-line vertical' }, []]
        ]],
        ['div', { class: 'square-handle' }, []]
      ]],
    ]);


    this.updateHandle();
  }

  /**
   * @param {MouseEvent} e
   */
  handleMouseMove = (e) => {
    if (this._isDragging) {
      this.updateFromMouse(e);
    }
  }

  handleMouseUp = () => {
    this._isDragging = false;
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * @param {TouchEvent} e
   */
  handleTouchMove = (e) => {
    if (this._isDragging) {
      const touch = e.touches[0];
      this.updateFromTouch(touch);
      e.preventDefault();
    }
  }

  handleTouchEnd = () => {
    this._isDragging = false;
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
  }

  /**
   * @param {MouseEvent} e
   */
  updateFromMouse(e) {
    const container = /** @type {HTMLElement | null} */ (this.shadowRoot?.querySelector('.square-container'));
    if (!container) return;

    const rect = container.getBoundingClientRect();

    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;

    const x = this._xMin + relativeX * (this._xMax - this._xMin);
    const y = this._yMax - relativeY * (this._yMax - this._yMin); // Flip Y coordinate

    this.#setValues(x, y);
  }

  /**
   * @param {Touch} touch
   */
  updateFromTouch(touch) {
    const container = /** @type {HTMLElement | null} */ (this.shadowRoot?.querySelector('.square-container'));
    if (!container) return;

    const rect = container.getBoundingClientRect();

    const relativeX = (touch.clientX - rect.left) / rect.width;
    const relativeY = (touch.clientY - rect.top) / rect.height;

    const x = this._xMin + relativeX * (this._xMax - this._xMin);
    const y = this._yMax - relativeY * (this._yMax - this._yMin); // Flip Y coordinate

    this.#setValues(x, y);
  }

  updateHandle() {
    const handle = /** @type {HTMLElement | null} */ (this.shadowRoot?.querySelector('.square-handle'));
    if (!handle) return;

    const xPercent = ((this._x - this._xMin) / (this._xMax - this._xMin)) * 100;
    const yPercent = ((this._yMax - this._y) / (this._yMax - this._yMin)) * 100; // Flip Y coordinate

    handle.style.left = `${Math.max(0, Math.min(100, xPercent))}%`;
    handle.style.top = `${Math.max(0, Math.min(100, yPercent))}%`;
  }
}

customElements.define('input-number-square', NumberSquareInput);
