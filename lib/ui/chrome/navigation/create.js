/**
 * @import { SharedStyleSheet } from '@base/dom_ui/shared_style_sheet.js';
 * @import { AppFeatureFlags, MenuItem } from './app_explorer/type.ts';
 * @import { NavigationController } from './type.ts';
 */
import { BasicButton } from '@ui/inputs/button.js';
import { DEFAULT_APP_ID, menuStructure } from './app_explorer/config.js';
import { AppExplorerMenu } from './app_explorer/element.js';
import { idFromHash, TableOfContentsMenu } from './table_of_contents/element.js';
import { NavigationMenu } from './element.js';
import { createTabLayoutElement } from '@ui/layout/tabs/create.js';
import { TableOfContentsSelectEvent } from './events.js';

const icon = '☰ ';

/**
 * @param {AppFeatureFlags} cfg
 * @return {(item: MenuItem) => boolean}
 */
const hideDebug = ({ research, papers, debug, onlyEcon }) => item => {
  if (debug) return true;
  if (onlyEcon) return item[0] === '1101';
  if (item[0] === 'debug') return false;
  if (item[0] === 'paper') return papers;
  if (item[0] === 'research') return research;
  return true;
}

/**
 * @param {{
 *   scrollSheet: SharedStyleSheet,
 *   apps: AppFeatureFlags,
 * }} cfg
 * @returns {NavigationController}
 */
export function installNavigation({
  scrollSheet,
  apps,
}) {
  const TabLayout = createTabLayoutElement({ scrollSheet });
  const cleaned = menuStructure.filter(hideDebug(apps));
  const appExplorer = new AppExplorerMenu(DEFAULT_APP_ID, cleaned);
  const tocMenu = new TableOfContentsMenu();
  const navigation = new NavigationMenu(
    new TabLayout(),
    scrollSheet,
    appExplorer,
    tocMenu
  );
  navigation.className = 'navigation';

  const menuButton = new BasicButton(icon + 'Menu');
  menuButton.className = 'navigation-button';
  menuButton.addEventListener('click', () => {
    navigation.toggleMenu();
  });

  return {
    menuElement: navigation,
    navigationButton: menuButton,
    transition: appExplorer,
    showMenu(open) {
      navigation.showMenu(open);
    },
    get menuOpen() {
      return navigation.open;
    },
    get currentApp() {
      return appExplorer.currentApp;
    },
    get currentAppId() {
      return appExplorer.currentAppId;
    },
    jumpToTitle: () => {
      if (!location.hash) return;
      const id = idFromHash(location.hash);
      navigation.dispatchEvent(new TableOfContentsSelectEvent({ id }));
    },
    setToc: (items) => {
      tocMenu.items = items
    },
  };
}

