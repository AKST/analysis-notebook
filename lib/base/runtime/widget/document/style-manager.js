import { generateCSS } from '../../../../base/render_ui/css.js';

/**
 * @param {string} containerId
 * @returns {StyleManager}
 */
export function createStyleManager(containerId) {
  // Create style element and add to head
  const styleElement = document.createElement('style');
  styleElement.id = `${containerId}-styles`;
  document.head.appendChild(styleElement);

  return new StyleManager(containerId, styleElement);
}

export class StyleManager {
  /**
   * @param {string} containerId
   * @param {HTMLStyleElement | null} styleElement
   */
  constructor(containerId, styleElement) {
    this.containerId = containerId;
    this.styleElement = styleElement;
  }

  /**
   * @param {Record<string, any>} styleObject
   */
  applyStyles(styleObject) {
    if (!this.styleElement) throw new Error('applied styles after cleaning up');
    const cssText = generateCSS(styleObject, `#${this.containerId}`);
    this.styleElement.textContent = cssText;
  }

  cleanup() {
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }
}

