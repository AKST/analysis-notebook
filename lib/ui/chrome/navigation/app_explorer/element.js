/**
 * @import { MenuItem } from './type.ts';
 */
import * as doc from '@base/dsl_dom/helper/html.js';
import { updateOn } from '@base/dsl_dom/render.js';
import { SharedStyleSheet } from '@base/platform/styles/shared_style_sheet.js';
import { LoadAppEvent } from '../events.js';
import {
  getAppFromURL,
  generateAppPath,
  createMenuLevel,
} from './util.js';

export class AppExplorerMenu extends HTMLElement {
  static sheet = new SharedStyleSheet(import.meta.resolve('./style.css'));
  /** @type {ShadowRoot} */ #root;
  /** @type {MenuItem[]} */ #menu;
  /** @type {string} */ #defaultAppId;

  /**
   * @param {string} defaultAppId
   * @param {MenuItem[]} menu
   */
  constructor(defaultAppId, menu) {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.internals = this.attachInternals();
    this.#defaultAppId = defaultAppId
    this.#menu = menu
  }

  /** @type {string} */
  get currentAppId() {
    return getAppFromURL() || this.#defaultAppId;
  }

  /** @type {string} */
  get currentApp() {
    return generateAppPath(this.currentAppId);
  }

  connectedCallback() {
    AppExplorerMenu.sheet.install(this.#root);
    this.#root.addEventListener('click', this.#clickHandler);
    this.render();
    this.#fadeIn();
  }

  async #fadeIn() {
    await AppExplorerMenu.sheet.sheetPromise;
    const menu = this.#root.getElementById('menu');
    if (menu) menu.style.opacity = '1';
  }

  disconnectedCallback() {
    this.#root.removeEventListener('click', this.#clickHandler);
  }

  /**
   * @param {Event} event
   */
  #clickHandler = event => {
    const { target } = event;

    /** @ts-ignore - its fine */
    const menuItem = target.closest('.menu-item');

    if (menuItem) {
      event.preventDefault();
      event.stopPropagation();
      const id = menuItem.dataset.id;
      const name = menuItem.dataset.name;

      this.#loadApp(id, name);
    }
  };

  /**
   * @param {string} id
   * @param {string} name
   */
  #loadApp(id, name) {
    const path = generateAppPath(id);
    this.dispatchEvent(new LoadAppEvent({ id, name, path }, { bubbles: true }));
  }

  /**
   * @param {PopStateEvent} event
   */
  handlePopstate(event) {
    this.#loadApp(this.currentAppId, '');
  }

  render() {
    updateOn(this.#root, [
      doc.div({ id: 'menu', className: 'navigation-collapsible' })
        .css({ opacity: '0' })
        .c(...createMenuLevel(this.#menu, this.currentAppId))
    ]);
  }
}

customElements.define('navigation-app-explorer-menu', AppExplorerMenu);
