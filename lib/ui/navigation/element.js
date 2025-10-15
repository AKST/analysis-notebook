/**
 * @import { AppExplorerMenu } from './app_explorer/element.js';
 * @import { TableOfContentsMenu } from './table_of_contents/element.js';
 */
import { Toggleable } from '../mixins/toggleable.js';
import { generateCSS, render } from '../../base/render_ui/index.js';
import '../layout/tabs/element.js';

export class NavigationMenu extends Toggleable(HTMLElement) {
  /** @type {AppExplorerMenu} */ #appExplorer;
  /** @type {TableOfContentsMenu} */ #tocMenu;

  /**
   * @param {AppExplorerMenu} appExplorer
   * @param {TableOfContentsMenu} tocMenu
   */
  constructor(appExplorer, tocMenu) {
    super();
    this.attachShadow({ mode: 'open' });
    this.internals = this.attachInternals();
    this.#appExplorer = appExplorer
    this.#tocMenu = tocMenu;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const nav = render(['nav', { class: 'navigation ms-scroll' }, [
      ['tabs-layout', { dataset: { active: 'apps' } }, [
        ['slot', { name: 'tab', dataset: { tabId: 'apps' }, title: 'Apps' }, [
          ['div', { class: 'tab-container' }, [this.#appExplorer]],
        ]],
        ['slot', { name: 'tab', dataset: { tabId: 'toc' }, title: 'Table Of Contents' }, [
          ['div', { class: 'tab-container' }, [this.#tocMenu]],
        ]],
      ]],
      ['link', { rel: 'stylesheet', href: './lib/ui/layout/scroll.css' }]
    ]]);

    const style = document.createElement('style');
    style.textContent = getStyles();

    this.shadowRoot?.appendChild(style);
    this.shadowRoot?.appendChild(nav);
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
