/**
 * @typedef {import('./create.js').NavigationController} NavigationController;
 * @import { MenuItem } from './config.js';
 */
import { DEFAULT_APP_ID, menuStructure } from './config.js';
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
  const navigation = new NavigationMenu(DEFAULT_APP_ID, cleaned);
  navigation.className = 'navigation';

  const menuButton = document.createElement('button');
  menuButton.className = 'navigation-button';
  menuButton.textContent = icon + 'Menu';
  menuButton.addEventListener('click', () => {
    navigation.toggleMenu();
  });

  globalThis.addEventListener('popstate', e => navigation.handlePopstate());

  return {
    navigation,
    navigationButton: menuButton,
  };
}

