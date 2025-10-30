import { render, renderOnto } from '../../../base/dom_ui/index.js';
import { SharedStyleSheet } from '../../../base/dom_ui/shared_style_sheet.js';

export class TabLayout extends HTMLElement {
  static sheetScroll = new SharedStyleSheet('./lib/ui/layout/scroll.css');
  static sheetTabs = new SharedStyleSheet('./lib/ui/layout/tabs/style.css');
  /**
   * @type {Map<string, { content: HTMLElement, item: HTMLElement }>}
   */
  tabs = new Map();

  /** @type {HTMLDivElement} */
  list = /** @type {any} */ (render(['div', { class: 'tablist', role: 'tablist' }]));

  content = document.createElement('div');

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  /**
   * @param {string} id
   */
  setActive(id) {
    const active = this.shadow.querySelector('.active');

    const lookup = this.tabs.get(id);
    if (lookup == null) throw new Error('tab lookup error');

    const { content, item } = lookup;
    if (active === item) return;

    const activeId = (active instanceof HTMLButtonElement) ? active?.dataset.tabId : null;
    const aContent = activeId && this.tabs.get(activeId)?.content;

    if (active && aContent) {
      active.classList.remove('active');
      active.setAttribute('aria-selected', 'false')
      aContent.style.display = 'none';
    }

    item.setAttribute('aria-selected', 'true')
    item.classList.add('active');
    content.style.display = 'block';
  }

  connectedCallback() {
    TabLayout.sheetScroll.install(this.shadow);
    TabLayout.sheetTabs.install(this.shadow);
    this.wireCallback();
    this.render();
  }

  wireCallback() {
    this.shadow.addEventListener('click', event => {
      const { target } = event;
      if (!(target instanceof HTMLButtonElement)) return;
      const tabid = target.dataset.tabId;
      if (tabid) this.setActive(tabid);
    })
  }

  render() {
    renderOnto(this.shadow, [
      ['div', { class: 'layout' }, [
        ['nav', { class: 'ms-scroll' }, [this.list]],
        ['hr', {}, []],
        this.content,
      ]],
    ]);


    for (const slot of this.querySelectorAll("slot[name='tab']")) {
      if (!(slot instanceof HTMLSlotElement)) continue;

      const title = slot.getAttribute('title');
      if (!title) throw new Error('malformed tab title');

      const tabId = slot.dataset.tabId;
      if (!tabId) throw new Error('malformed tab title');

      this.installTab(tabId, title, slot);
    }

    const activeId = this.dataset.active
    if (activeId) this.setActive(activeId);
  }

  /**
   * @param {string} id
   * @param {string} title
   * @param {HTMLElement} slot
   */
  installTab(id, title, slot) {
    const contentId = `content-${title.replace(/ /g, '-')}`;
    const content = document.createElement('div');
    content.appendChild(slot);
    content.id = contentId;
    content.style.display = 'none';

    const item = document.createElement('button');
    item.appendChild(document.createTextNode(title));
    item.type = 'button';
    item.role = 'tab';
    item.dataset.tabId = id;
    item.setAttribute('aria-selected', 'false');
    item.setAttribute('aria-controls', contentId)
    item.id = `item-${title.replace(/ /g, '-')}`
    item.role = 'tab';
    item.title = title;

    this.tabs.set(id, { content, item });
    this.list.appendChild(item);
    this.content.appendChild(content);
  }
}

customElements.define('tabs-layout', TabLayout);
