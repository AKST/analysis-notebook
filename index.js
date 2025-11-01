import { SharedStyleSheet } from './lib/base/dom_ui/shared_style_sheet.js';
import { installNavigation } from './lib/ui/navigation/create.js';
import { installApplication } from './lib/ui/application/create.js';
import { installConfig } from './lib/ui/config/create.js';
import { installResponsiveSkeleton } from './lib/ui/skeleton/create.js';

const scrollSheet = new SharedStyleSheet('./lib/ui/layout/scroll.css')
const urlQuery = new URLSearchParams(globalThis.location.search);

const navCtrl = installNavigation({
  scrollSheet,
  apps: {
    debug: urlQuery.has('debug'),
    papers: urlQuery.has('papers'),
    research: urlQuery.has('research'),
    onlyEcon: urlQuery.has('EE'),
  },
});

const cfgCtrl = installConfig();

const application = installApplication({
  replace: /** @type {HTMLElement} */ (
    document.querySelector('.main-content')
  ),
  initialApp: navCtrl.currentApp,
  /** @ts-ignore - if theres no path theres a runtime error */
  loadModule: path => import(path),
});

installResponsiveSkeleton({
  application,
  navigation: navCtrl,
  configMenu: cfgCtrl,
});
