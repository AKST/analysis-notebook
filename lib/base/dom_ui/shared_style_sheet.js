/**
 * @typedef {(
 *   | { kind: 'init' }
 *   | { kind: 'fetched', promise: Promise<CSSStyleSheet> }
 * )} State
 */
import { Unreachable } from '../util/type.js';

export class SharedStyleSheet {
  /** @type {State} */
  #state = { kind: 'init' };

  /** @type {string} */
  #source;

  /**
   * @param {string} source
   */
  constructor(source) {
    this.#source = source;
  }

  /**
   * @param {(sheet: CSSStyleSheet) => void} onLoad
   * @returns {void}
   */
  loadSheet(onLoad) {
    switch (this.#state.kind) {
      case 'init':
        this.#state = { kind: 'fetched', promise: this.#startLoading() };
        return this.loadSheet(onLoad);

      case 'fetched':
        this.#state.promise.then(onLoad);
        break

      default:
        throw new Unreachable(this.#state);
    }
  }

  /**
   * @returns {Promise<CSSStyleSheet>}
   */
  async #startLoading() {
    const sheet = new CSSStyleSheet();
    try {
      const request = await fetch(this.#source);
      const text = await request.text();
      sheet.replaceSync(text);
      return sheet;
    } catch (e) {
      console.error(e);
      throw e
    }
  }
}
