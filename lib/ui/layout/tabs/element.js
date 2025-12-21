import { BasicButton } from '@ui/inputs/button.js';
import * as doc from '@base/dsl_dom/helper/html.js';
import { render, renderOnto } from '@base/dsl_dom/render.js';
import { SharedStyleSheet } from '@base/platform/styles/shared_style_sheet.js';

export class TabLayout extends HTMLElement {
  static sheetTabs = new SharedStyleSheet('./lib/ui/layout/tabs/style.css');
  list = render(doc.div.void({ className: 'tablist', role: 'tablist' }));
  content = render(doc.div.void({ classList: ['content', 'ms-scroll'] }));

  /**
   * @type {Map<string, { content: HTMLElement, item: HTMLElement }>}
   */
  tabs = new Map();

  /** @type {SharedStyleSheet} */ #scrollSheet;

  /** @param {SharedStyleSheet} scrollSheet */
  constructor(scrollSheet) {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.#scrollSheet = scrollSheet;
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

    const activeId = (active instanceof BasicButton) ? active?.dataset.tabId : null;
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
    TabLayout.sheetTabs.install(this.shadow);
    this.#scrollSheet.install(this.shadow);
    this.wireCallback();
    this.render();
  }

  wireCallback() {
    this.shadow.addEventListener('click', event => {
      const { target } = event;
      if (!(target instanceof BasicButton)) return;
      const tabid = target.dataset.tabId;
      if (tabid) this.setActive(tabid);
    })
  }

  render() {
    renderOnto(this.shadow, [
      doc.div({ className: 'layout' }).c(
        doc.nav({ className: 'ms-scroll' }).c(this.list),
        doc.hr(),
        this.content,
      ),
    ]);


    for (const slot of this.querySelectorAll("slot[name='tab']")) {
      if (!(slot instanceof HTMLSlotElement)) continue;

      const title = slot.getAttribute('title');
      if (!title) throw new Error('malformed tab title');

      const tabId = slot.dataset.tabId;
      if (!tabId) throw new Error('malformed tab Id');

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
    const content = render(doc.div({ id: contentId, style: 'display: none' }).c(slot));

    const item = new BasicButton(title);
    item.setAttribute('aria-selected', 'false');
    item.setAttribute('aria-controls', contentId)
    item.id = `item-${title.replace(/ /g, '-')}`
    item.role = 'tab';
    item.dataset.tabId = id;
    item.title = title;

    this.tabs.set(id, { content, item });
    this.list.appendChild(item);
    this.content.appendChild(content);
  }
}
