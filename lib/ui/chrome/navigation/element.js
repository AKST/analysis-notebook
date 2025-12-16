/**
 * @import { AppExplorerMenu } from './app_explorer/element.js';
 * @import { TableOfContentsMenu } from './table_of_contents/element.js';
 * @import { TabLayout } from '@ui/layout/tabs/element.js';
 */
import { Toggleable } from '@ui/mixins/toggleable.js';
import * as doc from '@base/dsl_dom/helper/html.js';
import { render, renderOnto, insert, attr } from '@base/dsl_dom/render.js';
import { SharedStyleSheet } from '@base/dom_ui/shared_style_sheet.js';

export class NavigationMenu extends Toggleable(HTMLElement) {
  static sheet = new SharedStyleSheet(import.meta.resolve('./style.css'));

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
    const navigation = this.render();
    if (navigation) this.#fadeIn(navigation);
  }

  /** @param {HTMLElement} nav */
  async #fadeIn(nav) {
    await Promise.all([
      NavigationMenu.sheet.sheetPromise,
      this.#scrollSheet.sheetPromise,
    ]);
    nav.style.opacity = '1';
  }

  /** @returns {HTMLElement | undefined} */
  render() {
    const nav = render(doc.nav({ className: 'navigation' }).css({ opacity: '0' }).of(
      insert(this.#tabLayout, attr().data('active', 'apps'), [
        doc.slot({ name: 'tab', title: 'Apps' }).data({ tabId: 'apps' }).of(
          doc.div({ className: 'tab-container' }).of(this.#appExplorer),
        ),
        doc.slot({ name: 'tab', title: 'Table Of Contents' }).data({ tabId: 'toc' }).of(
          doc.div({ className: 'tab-container' }).of(this.#tocMenu),
        ),
      ]),
    ));

    renderOnto(this.#root, [nav])
    return nav;
  }
}

customElements.define('navigation-component', NavigationMenu);
