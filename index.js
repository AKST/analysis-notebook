import { SharedStyleSheet } from './lib/base/platform/styles/shared_style_sheet.js';
import { installHeader } from './lib/ui/chrome/header/create.js';
import { installNavigation } from './lib/ui/chrome/navigation/create.js';
import { installApplication } from './lib/ui/chrome/application/create.js';
import { installConfig } from './lib/ui/chrome/config/create.js';
import { installResponsiveChrome } from './lib/ui/chrome/create.js';

const scrollSheet = new SharedStyleSheet('./lib/ui/layout/scroll.css')
const urlQuery = new URLSearchParams(globalThis.location.search);

const header = installHeader();

const navCtrl = installNavigation({
  scrollSheet,
  apps: {
    debug: (urlQuery.has('debug') !== (location.hostname === 'localhost')),
    papers: urlQuery.has('papers'),
    research: urlQuery.has('research'),
    onlyEcon: urlQuery.has('EE'),
  },
});

const cfgCtrl = installConfig();

const application = installApplication({
  scrollSheet,
  replace: /** @type {HTMLElement} */ (
    document.querySelector('.main-content')
  ),
  initialApp: navCtrl.currentApp,
  loadModule: path => {
    /**
     * @akst::bundle::dyn-import:path-constraint {./lib/app/(sec-[^/]+/)+index.js}
     */
    return import(path);
  }
});

installResponsiveChrome({
  application,
  header,
  navigation: navCtrl,
  configMenu: cfgCtrl,
});
