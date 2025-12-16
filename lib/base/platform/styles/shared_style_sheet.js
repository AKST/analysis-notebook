/**
 * @typedef {(
 *   | { kind: 'init' }
 *   | { kind: 'fetched', promise: Promise<CSSStyleSheet> }
 * )} State
 */
import { Unreachable } from '../../util/type.js';

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
   * @param {{ adoptedStyleSheets: CSSStyleSheet[] }} shadowDom
   * @returns {void}
   */
  install(shadowDom) {
    this.sheetPromise.then(sheet => shadowDom.adoptedStyleSheets.push(sheet));
  }

  get sheetPromise() {
    switch (this.#state.kind) {
      case 'init':
        this.#state = { kind: 'fetched', promise: this.#startLoading() };
        return this.#state.promise;

      case 'fetched':
        return this.#state.promise;

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
      await sheet.replace(text);
      return sheet;
    } catch (e) {
      console.error(e);
      throw e
    }
  }
}
