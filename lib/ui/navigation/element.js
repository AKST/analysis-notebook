/**
 * @import { MenuItem } from './config.js';
 */
import { Toggleable } from '../mixins/toggleable.js';
import { render } from '../../base/render_ui/index.js';
import { getStyles } from './style.js';
import {
  setAppInURL,
  getAppFromURL,
  generateAppPath,
  createMenuLevel,
} from './util.js';

export class NavigationMenu extends Toggleable(HTMLElement) {
  /** @type {MenuItem[]} */ #menu;
  /** @type {string} */ #defaultAppId;

  /**
   * @param {string} defaultAppId
   * @param {MenuItem[]} menu
   */
  constructor(defaultAppId, menu) {
    super();
    this.attachShadow({ mode: 'open' });
    this.internals = this.attachInternals();
    this.#defaultAppId = defaultAppId
    this.#menu = menu
  }

  get currentAppId() {
    return getAppFromURL() || this.#defaultAppId;
  }

  get currentApp() {
    return generateAppPath(this.currentAppId);
  }

  connectedCallback() {
    this.render();
    this.#setupEventDelegation();
  }

  #setupEventDelegation() {
    this.shadowRoot?.addEventListener('click', event => {
      const { target } = event;

      /** @ts-ignore - its fine */
      const menuItem = target.closest('.menu-item');

      if (menuItem) {
        event.preventDefault();
        const id = menuItem.dataset.id;
        const name = menuItem.dataset.name;

        setAppInURL(id);
        this.#loadApp(id, name);
      }
    });
  }

  /**
   * @param {string} id
   * @param {string} name
   */
  #loadApp(id, name) {
    const path = generateAppPath(id);
    this.dispatchEvent(new CustomEvent('loadApp', {
      detail: { id, name, path },
      bubbles: true
    }));
  }

  handlePopstate() {
    this.#loadApp(this.currentAppId, '');
  }

  render() {
    const nav = render(['nav', { class: 'navigation' }, [
      ['div', { class: 'navigation-collapsible' }, [
        ...createMenuLevel(this.#menu, this.currentAppId)
      ]],
    ]]);

    const style = document.createElement('style');
    style.textContent = getStyles();

    this.shadowRoot?.appendChild(style);
    this.shadowRoot?.appendChild(nav);
  }
}

customElements.define('navigation-component', NavigationMenu);
