/**
 * @import { ApplicationController } from '../application/type.ts';
 * @import { NavigationController } from '../navigation/type.ts';
 * @import { ConfigController } from '../config/create.js';
 * @import {
 *   SkeletonGridStyleCfg_Internal,
 *   SkeletonGridStyles_Internal,
 * } from './type.ts';
 */
import { ConfigChangeEvent } from '../config/events.js';
import { StartAppEvent, UpdateAnchorEvent } from '../application/events.js';

const PADDING = 4;
const GRIDGAP = 2;
const HEADER_HEIGHT = 36;
const GUTTER_WIDTH = 300;

/**
 * @param {SkeletonGridStyleCfg_Internal} cfg
 * @returns {SkeletonGridStyles_Internal}
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

export const getLayout = function () {
  const { innerWidth } = window;
  if (innerWidth < 600) return 'narrow';
  if (innerWidth < 900) return 'medium';
  return 'wide';
};

const BODY_CLS = {
  wide: 'layout-wide',
  medium: 'layout-wide',
  narrow: 'layout-narrow',
};

/**
 * @typedef {Object} Containers
 * @property {HTMLElement} buttons
 * @property {HTMLElement} navigation
 * @property {HTMLElement} config
 *
 * @returns {Containers}
 */
const getContainerElements = () => /** @type {any} */ ({
  buttons: document.getElementById('buttons'),
  navigation: document.getElementById('sidebar'),
  config: document.getElementById('config'),
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
  configMenu: {
    config: configMenu,
    configButton,
  },
}) {
  const { menuElement: navMenu } = navigation;
  const containers = getContainerElements();

  containers.navigation.appendChild(navMenu);
  containers.config.appendChild(configMenu);
  containers.buttons.appendChild(navigation.navigationButton);
  containers.buttons.appendChild(configButton);

  const updateLayout = function () {
    const layout = getLayout();

    const {
      body: { gridTemplateColumns, gridTemplateRows },
      nav: { display: displayNav },
      cfg: { display: displayCfg },
    } = getGridStylesInternal({
      state: {
        layout,
        showNav: navMenu.open,
        showCfg: configMenu.open,
      },
    });

    containers.navigation.style.display = displayNav;
    containers.config.style.display = displayCfg;
    document.body.className = BODY_CLS[layout];
    document.body.style.gridTemplateRows = gridTemplateRows;
    document.body.style.gridTemplateColumns = gridTemplateColumns;
    return layout;
  };

  const resetMenus = function () {
    const layout = getLayout();

    if (layout === 'narrow') {
      navMenu.showMenu(false);
      configMenu.showMenu(false);
    } else if (layout === 'medium') {
      navMenu.showMenu(true);
      configMenu.showMenu(false);
    } else {
      navMenu.showMenu(true);
      configMenu.showMenu(true);
    }
  };

  resetMenus()
  updateLayout();

  navigation.transition.addEventListener('loadApp', (
    /** @type {Event} */ event
  ) => {
    /** @ts-ignore - no clue how to type that */
    const { id, name, path } = event.detail;
    console.info(`Loading app [${id}] ${name}`);
    configMenu.clearKnobs();
    application.loadApp(path);
  })

  application.events.addEventListener('startApp', event => {
    if (event instanceof StartAppEvent) {
      const showMenu = event.detail.showConfig && getLayout() === 'wide';
      configMenu.showMenu(showMenu);
      navigation.jumpToTitle();
    } else {
      console.warn('nonconforming event', event);
    }
  });

  application.events.addEventListener('update-anchors', event => {
    if (event instanceof UpdateAnchorEvent) {
      navigation.setToc(event.detail.anchors);
    } else {
      console.warn('nonconforming event', event);
    }
  });

  configMenu.addEventListener('configChange', (event) => {
    if (event instanceof ConfigChangeEvent) {
      application.onConfigUpdate(event);
    } else {
      console.warn('nonconforming event', event);
    }
  });

  const onLayoutChange = () => {
    updateLayout();
    application.onResize()
  };

  navMenu.addEventListener('toggle', () => {
    if (navMenu.open && getLayout() !== 'wide') {
      configMenu.showMenu(false);
    }
    onLayoutChange()
  });

  configMenu.addEventListener('toggle', () => {
    if (configMenu.open && getLayout() !== 'wide') {
      navMenu.showMenu(false);
    }
    onLayoutChange();
  });

  globalThis.addEventListener('resize', () => {
    resetMenus();
    onLayoutChange()
  });
}

