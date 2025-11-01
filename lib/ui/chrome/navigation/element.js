/**
 * @import { AppExplorerMenu } from './app_explorer/element.js';
 * @import { TableOfContentsMenu } from './table_of_contents/element.js';
 * @import { TabLayout } from '@ui/layout/tabs/element.js';
 */
import { Toggleable } from '@ui/mixins/toggleable.js';
import { generateCSS, renderOnto } from '@base/dom_ui/index.js';
import { SharedStyleSheet } from '@base/dom_ui/shared_style_sheet.js';

export class NavigationMenu extends Toggleable(HTMLElement) {
  static sheet = new SharedStyleSheet('./lib/ui/navigation/style.css');

  /** @type {ShadowRoot} */ #root;
  /** @type {TabLayout} */ #tabLayout
  /** @type {SharedStyleSheet} */ #scrollSheet;
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
    this.#root = this.attachShadow({ mode: 'open' });
    this.#tabLayout = tabLayout;
    this.#scrollSheet = scrollSheet;
    this.#appExplorer = appExplorer
    this.#tocMenu = tocMenu;

    // unforunately needed for the Toggleable Mixin
    this.internals = this.attachInternals()
  }

  connectedCallback() {
    NavigationMenu.sheet.install(this.#root);
    this.#scrollSheet.install(this.#root);
    this.render();
  }

  render() {
    renderOnto(this.#root, [
      ['nav', { class: 'navigation ms-scroll' }, [
        [this.#tabLayout, { dataset: { active: 'apps' } }, [
          ['slot', { name: 'tab', dataset: { tabId: 'apps' }, title: 'Apps' }, [
            ['div', { class: 'tab-container' }, [this.#appExplorer]],
          ]],
          ['slot', { name: 'tab', dataset: { tabId: 'toc' }, title: 'Table Of Contents' }, [
            ['div', { class: 'tab-container' }, [this.#tocMenu]],
          ]],
        ]],
      ]],
    ]);
  }
}

customElements.define('navigation-component', NavigationMenu);
