import { installNavigation } from './lib/ui/navigation/create.js';
import { installApplication } from './lib/ui/application/create.js';
import { installConfig } from './lib/ui/config/create.js';
import { installResponsiveSkeleton } from './lib/ui/skeleton/create.js';

const urlQuery = new URLSearchParams(globalThis.location.search);

const navCtrl = installNavigation({
  debug: urlQuery.has('debug'),
  onlyEcon: urlQuery.has('EE'),
});

const cfgCtrl = installConfig();

const mainContent = /** @type {HTMLElement} */
  (document.querySelector('.main-content'));

const application = installApplication({
  config: cfgCtrl.config,
  container: mainContent,
  initialApp: navCtrl.currentApp,
  /** @ts-ignore - if theres no path theres a runtime error */
  loadModule: path => import(path),
});

installResponsiveSkeleton({
  application,
  navigation: navCtrl,
  configMenu: cfgCtrl,
});
