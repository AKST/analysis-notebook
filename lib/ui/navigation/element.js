/**
 * @import { SharedStyleSheet } from '../../base/dom_ui/shared_style_sheet.js';
 * @import { AppExplorerMenu } from './app_explorer/element.js';
 * @import { TableOfContentsMenu } from './table_of_contents/element.js';
 * @import { TabLayout } from '../layout/tabs/element.js';
 */
import { Toggleable } from '../mixins/toggleable.js';
import { generateCSS, render } from '../../base/dom_ui/index.js';

export class NavigationMenu extends Toggleable(HTMLElement) {
  /** @type {TabLayout} */ #tabLayout
  /** @type {SharedStyleSheet} */ #scrollSheet;
  /** @type {ShadowRoot} */ #root;
  /** @type {AppExplorerMenu} */ #appExplorer;
  /** @type {TableOfContentsMenu} */ #tocMenu;

  /**
   * @param {TabLayout} tabLayout
   * @param {SharedStyleSheet} scrollSheet
   * @param {AppExplorerMenu} appExplorer
   * @param {TableOfContentsMenu} tocMenu
   */
  constructor(tabLayout, scrollSheet, appExplorer, tocMenu) {
    super();
    this.#tabLayout = tabLayout;
    this.#scrollSheet = scrollSheet;
    this.#root = this.attachShadow({ mode: 'open' });
    this.#appExplorer = appExplorer
    this.#tocMenu = tocMenu;

    // unforunately needed for the Toggleable Mixin
    this.internals = this.attachInternals()
  }

  connectedCallback() {
    this.#scrollSheet.install(this.#root);
    this.render();
  }

  render() {
    const nav = render(['nav', { class: 'navigation ms-scroll' }, [
      [this.#tabLayout, { dataset: { active: 'apps' } }, [
        ['slot', { name: 'tab', dataset: { tabId: 'apps' }, title: 'Apps' }, [
          ['div', { class: 'tab-container' }, [this.#appExplorer]],
        ]],
        ['slot', { name: 'tab', dataset: { tabId: 'toc' }, title: 'Table Of Contents' }, [
          ['div', { class: 'tab-container' }, [this.#tocMenu]],
        ]],
      ]],
    ]]);

    const style = document.createElement('style');
    style.textContent = getStyles();

    this.#root.appendChild(style);
    this.#root.appendChild(nav);
  }
}

export function getStyles() {
  return generateCSS({
    '.navigation': {
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      background: 'var(--bg-black-0f)',
      borderRight: 'var(--border-solid-grey)',
      borderRightWidth: 1,
      padding: 11,
      overflow: 'auto',
    },
    '.tab-container': {
      padding: 4,
    },
  });
}

customElements.define('navigation-component', NavigationMenu);
