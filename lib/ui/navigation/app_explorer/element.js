/**
 * @import { MenuItem } from './type.ts';
 */
import { generateCSS, render } from '../../../base/dom_ui/index.js';
import { LoadAppEvent } from '../events.js';
import {
  setAppInURL,
  getAppFromURL,
  generateAppPath,
  createMenuLevel,
} from './util.js';

export class AppExplorerMenu extends HTMLElement {
  rendered = false;
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
    this.render();
    this.#root.addEventListener('click', this.#clickHandler);
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

      setAppInURL(id);
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
    if (this.rendered) return;
    const nav = render(['div', { class: 'navigation-collapsible' }, [
      ...createMenuLevel(this.#menu, this.currentAppId)
    ]]);

    const style = document.createElement('style');
    style.textContent = getStyles();

    this.#root.appendChild(style);
    this.#root.appendChild(nav);
    this.rendered = true;
  }
}

export function getStyles() {
  return generateCSS({
    'h3': {
      margin: [0, 0, 16, 0],
      color: 'var(--fb-white)',
      fontFamily: 'monospace'
    },
    'details': {
      marginBottom: 8
    },
    'summary': {
      cursor: 'pointer',
      padding: 6,
      background: 'var(--bg-black-2a)',
      userSelect: 'none',
      fontWeight: 'bold',
    },
    'summary:hover': {
      background: 'var(--bg-black-3a)'
    },
    'details > :is(.menu-item, details)': {
      margin: [8, 0, 8, 16]
    },
    '.menu-item': {
      padding: [4, 8],
      background: 'var(--bg-black)',
      cursor: 'pointer',
      fontSize: 12,
      color: 'var(--fg-white)',
      textDecoration: 'none',
      display: 'block',
      fontFamily: 'monospace'
    },
    '.menu-item:hover': {
      background: 'var(--bg-black-33)'
    },
    '.menu-item:target, .menu-item:active': {
      background: 'var(--bg-black-44)',
      color: 'var(--fg-white)',
    },
  });
}

customElements.define('navigation-app-explorer-menu', AppExplorerMenu);
