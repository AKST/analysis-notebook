/**
 * @import { ApplicationController } from '../application/type.ts';
 * @import { NavigationController } from '../navigation/type.ts';
 * @import { ConfigController } from '../config/create.js';
 * @import { Containers } from './type.ts';
 */
import {
  getLayout,
  SkeletonPresenter,
  SkeletonStore,
} from './store.js';

/**
 * @returns {Containers}
 */
const getContainerElements = () => /** @type {any} */ ({
  buttons: document.getElementById('buttons'),
  navigation: document.getElementById('sidebar'),
  config: document.getElementById('config'),
  main: document.body,
});

/**
 * @param {{
 *   application: ApplicationController,
 *   navigation: NavigationController,
 *   configMenu: ConfigController,
 * }} cfg
 */
export function installResponsiveSkeleton({
  navigation,
  application,
  configMenu: configCtrl,
}) {
  const { menuElement: navMenu } = navigation;
  const containers = getContainerElements();
  const store = new SkeletonStore(getLayout(), containers);
  const presenter = new SkeletonPresenter(
    application,
    navigation,
    configCtrl.config,
  );
  const {
    config: configMenu,
    configButton,
  } = configCtrl;

  containers.navigation.appendChild(navMenu);
  containers.config.appendChild(configMenu);
  containers.buttons.appendChild(navigation.navigationButton);
  containers.buttons.appendChild(configButton);

  presenter.init(store);

  navigation.transition.addEventListener('loadApp', e => presenter.onRequestAppLoad(store, e));
  application.events.addEventListener('startApp', e => presenter.onRequestStartApp(store, e));
  application.events.addEventListener('update-anchors', e => presenter.onRequestUpdateAnchors(store, e));
  configMenu.addEventListener('configChange', e => presenter.onRequestConfigChange(store, e));
  navMenu.addEventListener('toggle', () => presenter.onNavToggle(store));
  configMenu.addEventListener('toggle', () => presenter.onCfgToggle(store));
  globalThis.addEventListener('resize', () => presenter.resize(store));
}

