/**
 * @typedef {import('./create.js').ConfigController} ConfigCtrl
 */
import { ConfigMenu } from './element.js';

const icon = '☰ ';

/**
 * @returns {ConfigCtrl}
 */
export function installConfig() {
  const config = new ConfigMenu();
  config.className = 'config';

  const configButton = document.createElement('button');
  configButton.className = 'cfg-button';
  configButton.textContent = icon + ' Config';
  configButton.addEventListener('click', () => config.toggleMenu());

  return { config, configButton };
}

