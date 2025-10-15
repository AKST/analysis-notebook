/**
 * @import { MenuItem } from './app_explorer/type.ts';
 * @import { NavigationController } from './type.ts';
 */
import { DEFAULT_APP_ID, menuStructure } from './app_explorer/config.js';
import { AppExplorerMenu } from './app_explorer/element.js';
import { TableOfContentsMenu } from './table_of_contents/element.js';
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

function jumpToTitle() {
  if (!location.hash) return;
  const delay = 200, maxAttempt = 5;
  let attempt = 1;
  function task() {
    const title = document.querySelector(location.hash);
    title?.scrollIntoView();
    return title != null;
  }
  if (task()) return;

  console.warn('could not focus on title, will reattmpt');
  setTimeout(function f() {
    if (task()) return;
    attempt += 1;
    if (attempt > maxAttempt) {
      console.error('failed to focus on title');
    }
    console.warn('could not focus on title, will reattmpt');
    setTimeout(f, attempt * delay);
  }, delay);
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
  const tocMenu = new TableOfContentsMenu();
  const navigation = new NavigationMenu(appExplorer, tocMenu);
  navigation.className = 'navigation';

  const menuButton = document.createElement('button');
  menuButton.className = 'navigation-button';
  menuButton.textContent = icon + 'Menu';
  menuButton.addEventListener('click', () => {
    navigation.toggleMenu();
  });

  globalThis.addEventListener('popstate', event => {
    // appExplorer.handlePopstate(event)
  });

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
    jumpToTitle: () => {
      setTimeout(jumpToTitle, 0);
    },
    setToc: (items) => {
      tocMenu.items = items
    },
  };
}

