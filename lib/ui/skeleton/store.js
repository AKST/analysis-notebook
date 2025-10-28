/**
 * @import { ApplicationController } from '../application/type.ts';
 * @import { NavigationController } from '../navigation/type.ts';
 * @import { ConfigMenu } from '../config/element.js';
 * @import { Layout, AppState, Containers } from './type.ts';
 *
 */
import { ConfigChangeEvent } from '../config/events.js';
import { LoadAppEvent } from '../navigation/events.js';
import { StartAppEvent, UpdateAnchorEvent } from '../application/events.js';

const PADDING = 4;
const GRIDGAP = 2;
const HEADER_HEIGHT = 36;
const GUTTER_WIDTH = 300;

const BODY_CLS = {
  wide: 'layout-wide',
  medium: 'layout-wide',
  narrow: 'layout-narrow',
}

export class SkeletonStore {
  /** @type {AppState} */ state = { kind: 'idle' };

  /**
   * @param {Layout} layout
   * @param {Containers} containers
   */
  constructor(layout, containers) {
    this.layout = layout;
    this.containers = containers;
  }
}

export class SkeletonPresenter {
  /** @type {ApplicationController} */ #appCtrl
  /** @type {NavigationController} */ #navCtrl
  /** @type {ConfigMenu} */ #cfgCtrl

  /**
   * @param {ApplicationController} appCtrl
   * @param {NavigationController} navCtrl
   * @param {ConfigMenu} cfgCtrl
   */
  constructor(
    appCtrl,
    navCtrl,
    cfgCtrl,
  ) {
    this.#appCtrl = appCtrl;
    this.#navCtrl = navCtrl;
    this.#cfgCtrl = cfgCtrl;
  }

  /** @param {SkeletonStore} store */
  init(store) {
    this.#resetMenus(store);
    this.#updateLayout(store);
  }

  /** @param {SkeletonStore} store */
  resize(store) {
    const previousLayout = store.layout;
    store.layout = getLayout();
    if (previousLayout !== store.layout) {
      this.#resetMenus(store);
    }
    this.#onLayoutChange(store);
  }

  /** @param {SkeletonStore} store */
  onNavToggle(store) {
    if (this.#navCtrl.menuOpen && store.layout !== 'wide') {
      this.#cfgCtrl.showMenu(false);
    }
    this.#onLayoutChange(store)
  }

  /** @param {SkeletonStore} store */
  onCfgToggle(store) {
    if (this.#cfgCtrl.open && store.layout !== 'wide') {
      this.#navCtrl.showMenu(false);
    }
    this.#onLayoutChange(store);
  }

  /** @param {SkeletonStore} store @param {unknown} event */
  onRequestAppLoad(store, event) {
    if (!(event instanceof LoadAppEvent)) {
      return console.warn('expected LoadAppEvent, got', event);
    }
    const { id, name, path } = event.detail;
    console.info(`Loading app [${id}] ${name}`);
    this.#cfgCtrl.clearKnobs();
    this.#appCtrl.loadApp(path);
  }

  /** @param {SkeletonStore} store @param {unknown} event */
  onRequestStartApp(store, event) {
    if (event instanceof StartAppEvent) {
      const showMenu = event.detail.showConfig && getLayout() === 'wide';
      this.#cfgCtrl.showMenu(showMenu);
      this.#navCtrl.jumpToTitle();
    } else {
      console.warn('nonconforming event', event);
    }
  }

  /** @param {SkeletonStore} store @param {unknown} event */
  onRequestUpdateAnchors(store, event) {
    if (event instanceof UpdateAnchorEvent) {
      this.#navCtrl.setToc(event.detail.anchors);
    } else {
      console.warn('nonconforming event', event);
    }
  }

  /** @param {SkeletonStore} store @param {unknown} event */
  onRequestConfigChange(store, event) {
    if (event instanceof ConfigChangeEvent) {
      this.#appCtrl.onConfigUpdate(event);
    } else {
      console.warn('nonconforming event', event);
    }
  }

  /**
   * @param {SkeletonStore} store
   */
  #resetMenus(store) {
    if (store.layout === 'narrow') {
      this.#navCtrl.showMenu(false);
      this.#cfgCtrl.showMenu(false);
    } else if (store.layout === 'medium') {
      this.#navCtrl.showMenu(false);
      this.#cfgCtrl.showMenu(false);
    } else {
      this.#navCtrl.showMenu(true);
      this.#cfgCtrl.showMenu(true);
    }
  }

  /** @param {SkeletonStore} store */
  #onLayoutChange(store) {
    this.#updateLayout(store);
    this.#appCtrl.onResize()
  }

  /** @param {SkeletonStore} store */
  #updateLayout(store) {
    const {
      body: { gridTemplateColumns, gridTemplateRows },
      nav: { display: displayNav },
      cfg: { display: displayCfg },
    } = getGridStylesInternal({
      state: {
        layout: store.layout,
        showNav: this.#navCtrl.menuOpen,
        showCfg: this.#cfgCtrl.open,
      },
    });

    store.containers.navigation.style.display = displayNav;
    store.containers.config.style.display = displayCfg;
    store.containers.main.className = BODY_CLS[store.layout];
    store.containers.main.style.gridTemplateRows = gridTemplateRows;
    store.containers.main.style.gridTemplateColumns = gridTemplateColumns;
  }
}

export const getLayout = function () {
  const { innerWidth } = window;
  if (innerWidth < 600) return 'narrow';
  if (innerWidth < 900) return 'medium';
  return 'wide';
}

/**
 * @param {{
 *   state: {
 *     layout: Layout,
 *     showNav: boolean,
 *     showCfg: boolean,
 *   },
 * }} cfg
 * @returns {{
 *   body: {
 *     gridTemplateColumns: string;
 *     gridTemplateRows: string;
 *   },
 *   nav: {
 *     display: 'block' | 'none',
 *   },
 *   cfg: {
 *     display: 'block' | 'none',
 *   },
 * }}
 */
export function getGridStylesInternal({
  state: { layout, showNav, showCfg },
}) {
  const hh = HEADER_HEIGHT;
  let tCols, tRows;

  /** @type {'block' | 'none'} */
  let displayCfg;

  /** @type {'block' | 'none'} */
  let displayNav;

  if (layout === 'narrow') {
    tCols = '1fr'
    displayNav = showNav ? 'block' : 'none';
    displayCfg = showCfg && !showNav ? 'block' : 'none';

    const vws = PADDING * 2 + GRIDGAP * 1;
    const mh = (showNav || showCfg) ? 50 : 100;
    tRows = `${hh}px calc(${mh}dvh - ${hh}px - ${vws}px)`;
  } else {
    const vws = PADDING * 2 + GRIDGAP;
    tRows = `${hh}px calc(100dvh - ${hh}px - ${vws}px)`;

    if (showNav && showCfg) {
      tCols = `${GUTTER_WIDTH}px 1fr ${GUTTER_WIDTH}px`;
    } else if (showCfg) {
      tCols = `1fr ${GUTTER_WIDTH}px`;
    } else if (showNav) {
      tCols = `${GUTTER_WIDTH}px 1fr`;
    } else {
      tCols = '1fr';
    }
    displayNav = showNav ? 'block' : 'none';
    displayCfg = showCfg ? 'block' : 'none';
  }

  return {
    body: {
      gridTemplateColumns: tCols,
      gridTemplateRows: tRows,
    },
    nav: {
      display: displayNav,
    },
    cfg: {
      display: displayCfg,
    },
  }
}
