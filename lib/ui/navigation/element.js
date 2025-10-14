/**
 * @import { AppExplorerMenu } from './app_explorer/element.js';
 */
import { Toggleable } from '../mixins/toggleable.js';
import { render } from '../../base/render_ui/index.js';
import { getStyles } from './style.js';

export class NavigationMenu extends Toggleable(HTMLElement) {
  /** @type {AppExplorerMenu} */ #appExplorer;

  /**
   * @param {AppExplorerMenu} appExplorer
   */
  constructor(appExplorer) {
    super();
    this.attachShadow({ mode: 'open' });
    this.internals = this.attachInternals();
    this.#appExplorer = appExplorer
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const nav = render(['nav', { class: 'navigation' }, [
      this.#appExplorer,
    ]]);

    const style = document.createElement('style');
    style.textContent = getStyles();

    this.shadowRoot?.appendChild(style);
    this.shadowRoot?.appendChild(nav);
  }
}

customElements.define('navigation-component', NavigationMenu);
