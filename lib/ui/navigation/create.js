/**
 * @import { MenuItem } from './app_explorer/type.ts';
 * @import { NavigationController } from './type.ts';
 */
import { DEFAULT_APP_ID, menuStructure } from './app_explorer/config.js';
import { AppExplorerMenu } from './app_explorer/element.js';
import { NavigationMenu } from './element.js';

const icon = '☰ ';

/**
 * @param {boolean} showDebug
 * @param {boolean} onlyEcon
 * @return {(item: MenuItem) => boolean}
 */
const hideDebug = (showDebug, onlyEcon) => item => {
  if (onlyEcon) return item[0] === '1101';
  if (item[0] === 'd') return showDebug;
  return true;
}

/**
 * @param {{ debug: boolean, onlyEcon: boolean }} cfg
 * @returns {NavigationController}
 */
export function installNavigation({
  debug,
  onlyEcon,
}) {
  const cleaned = menuStructure.filter(hideDebug(debug, onlyEcon));
  const appExplorer = new AppExplorerMenu(DEFAULT_APP_ID, cleaned);
  const navigation = new NavigationMenu(appExplorer);
  navigation.className = 'navigation';

  const menuButton = document.createElement('button');
  menuButton.className = 'navigation-button';
  menuButton.textContent = icon + 'Menu';
  menuButton.addEventListener('click', () => {
    navigation.toggleMenu();
  });

  globalThis.addEventListener('popstate', () => appExplorer.handlePopstate());

  return {
    menuElement: navigation,
    navigationButton: menuButton,
    transition: appExplorer,
    get currentApp() {
      return appExplorer.currentApp;
    },
    get currentAppId() {
      return appExplorer.currentAppId;
    },
  };
}

