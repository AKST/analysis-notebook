/**
 * @typedef {import('./create.js').ConfigController} ConfigCtrl
 */
import { BasicButton } from '@ui/inputs/button.js';
import { ConfigMenu } from './element.js';

const icon = '☰ ';

/**
 * @returns {ConfigCtrl}
 */
export function installConfig() {
  const config = new ConfigMenu();
  config.className = 'config';

  const configButton = new BasicButton(icon + ' Config');
  configButton.className = 'cfg-button';
  configButton.addEventListener('click', () => config.toggleMenu());

  return { config, configButton };
}

