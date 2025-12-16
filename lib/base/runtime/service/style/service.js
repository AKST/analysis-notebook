/**
 * @import { StyleService, StyleRequest } from './type.ts';
 */
import { SharedStyleSheet } from '../../../platform/styles/shared_style_sheet.js';

/**
 * @implements {StyleService}
 */
export class EngineStyleService {
  /** @type {number} */
  #nextId = 1;

  /** @type {Map<string, Promise<CSSStyleSheet>>} */
  #styles = new Map();


  /** @type {ShadowRoot} */
  #container;

  /** @param {ShadowRoot} shadowRoot */
  constructor(shadowRoot) {
    this.#container = shadowRoot;
  }

  /**
   * @param {StyleRequest.Install} r
   * @returns {Promise<void>}
   */
  async installStyleSheet({ url }) {
    const promise = this.#styles.get(url);
    if (promise != null) {
      const sheet = await promise;
      this.#container.adoptedStyleSheets.push(sheet);
    } else {
      const loader = new SharedStyleSheet(url);
      const promise = loader.sheetPromise;
      this.#styles.set(url, promise);

      const sheet = await promise;
      this.#container.adoptedStyleSheets.push(sheet);
      this.#styles.set(url, Promise.resolve(sheet));
    }
  }

  /**
   * @param {StyleRequest.Uninstall} r
   */
  async uninstallStyleSheet({ url }) {
    const promise = this.#styles.get(url);
    if (promise == null) return;
    const sheet = await promise;
    const sheets =
      this.#container.adoptedStyleSheets.filter(s => s !== sheet);

    this.#container.adoptedStyleSheets = sheets;
  }
}
